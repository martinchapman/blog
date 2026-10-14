import * as openpgp from 'openpgp';
import * as pkijs from 'pkijs';

interface Link {
  href: string;
  textContent: string;
}

interface Component {
  title: string;
  url: string;
  name: string;
  link?: Link;
  binary?: boolean;
}

class Verification {
  static fingerprint: string = 'DC96A97C0283AF8BA4BB51C1DAD7902C1932C290';
  post: string;
  commit: string | undefined;
  components: Component[];

  constructor(post: string, commit?: string) {
    this.post = post;
    this.commit = commit;
    this.components = [
      {title: 'signature', url: `${this.signatures()}.asc`, name: `${post}.asc`},
      {
        title: 'source',
        url: `https://raw.githubusercontent.com/martinchapman/blog/${commit ?? 'main'}/_posts/${post}`,
        link: {
          href: `https://raw.githubusercontent.com/martinchapman/blog/${commit ?? 'main'}/_posts/${post}`,
          textContent: commit ? `copy at ${commit.slice(0, 7)}` : 'live copy'
        },
        name: post
      },
      {title: 'timestamp', url: `${this.signatures()}.tsr`, name: `${post}.tsr`, binary: true},
      {
        title: 'FreeTSA CA certificate',
        url: '/signatures/cacert.pem',
        link: {href: 'https://freetsa.org/files/cacert.pem', textContent: 'FreeTSA copy'},
        name: 'cacert.pem'
      },
      {
        title: 'FreeTSA TSA certificate',
        url: '/signatures/tsa.crt',
        link: {href: 'https://freetsa.org/files/tsa.crt', textContent: 'FreeTSA copy'},
        name: 'tsa.crt'
      }
    ];
  }

  static start(): void {
    const parameters: URLSearchParams = new URLSearchParams(location.search);
    const post: string = parameters.get('post') ?? '';
    const commit: string | undefined = parameters.get('commit') ?? undefined;
    if (/^\d{4}-\d{2}-\d{2}-[\w-]+\.md$/.test(post) && (commit === undefined || Verification.isCommit(commit)))
      new Verification(post, commit).run();
  }

  static isCommit(commit: string): boolean {
    return /^[0-9a-f]{40}$/.test(commit);
  }

  static find<T extends Element>(parent: ParentNode, selector: string, type: new () => T): T {
    const element: Element | null = parent.querySelector(selector);
    if (!(element instanceof type)) throw new Error(`missing ${selector}`);
    return element;
  }

  static titles(): Record<string, string> {
    return JSON.parse(Verification.find(document, '#titles', HTMLScriptElement).text);
  }

  static base64(buffer: ArrayBuffer): string {
    return (btoa(String.fromCharCode(...new Uint8Array(buffer))).match(/.{1,64}/g) ?? []).join('\n');
  }

  static der(pem: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(pem.replace(/-----[^-]+-----|\s/g, '')), (character: string) =>
      character.charCodeAt(0)
    );
  }

  static load({url, name}: Component): Promise<ArrayBuffer> {
    return fetch(url).then((response: Response) =>
      response.ok ? response.arrayBuffer() : Promise.reject(new Error(`failed to load ${name} (${response.status})`))
    );
  }

  static report(id: string, check: () => Promise<string>): Promise<void> {
    const result: HTMLElement = Verification.find(document, `#${id}`, HTMLElement);
    return check().then(
      (detail: string) => {
        result.textContent = `valid, ${detail}`;
      },
      (error: Error) => {
        result.textContent = `invalid: ${error.message}`;
      }
    );
  }

  static render({title, link, name, binary}: Component, buffer: Promise<ArrayBuffer>): void {
    const template: HTMLTemplateElement = Verification.find(document, '#file', HTMLTemplateElement);
    const fragment: DocumentFragment = document.importNode(template.content, true);
    const code: HTMLElement = Verification.find(fragment, 'code', HTMLElement);
    const download: HTMLAnchorElement = Verification.find(fragment, '.download', HTMLAnchorElement);
    Verification.find(fragment, 'h3', HTMLHeadingElement).textContent = title;
    if (link) download.before(Object.assign(document.createElement('a'), link), ' / ');
    download.download = name;
    template.before(fragment);
    buffer.then(
      (contents: ArrayBuffer) => {
        download.href = URL.createObjectURL(new Blob([contents]));
        code.textContent = binary ? Verification.base64(contents) : new TextDecoder().decode(contents);
      },
      (error: Error) => {
        code.textContent = error.message;
      }
    );
  }

  static async predecessor(url: string): Promise<string | undefined> {
    const response: Response = await fetch(url);
    if (response.status === 404) return undefined;
    if (!response.ok) throw new Error(`failed to load ${url} (${response.status})`);
    const commit: string = (await response.text()).trim();
    if (!Verification.isCommit(commit)) throw new Error(`unexpected previous version ${commit}`);
    return commit;
  }

  static async checkSignature(signature: Promise<ArrayBuffer>, source: Promise<ArrayBuffer>): Promise<string> {
    const key: openpgp.Key = await openpgp.readKey({
      armoredKey: await (
        await fetch(`https://keys.openpgp.org/vks/v1/by-fingerprint/${Verification.fingerprint}`)
      ).text()
    });
    if (key.getFingerprint().toUpperCase() !== Verification.fingerprint) throw new Error('unexpected key');
    const {
      signatures: [{verified}]
    }: openpgp.VerifyMessageResult<Uint8Array> = await openpgp.verify({
      message: await openpgp.createMessage({binary: new Uint8Array(await source)}),
      signature: await openpgp.readSignature({armoredSignature: new TextDecoder().decode(await signature)}),
      verificationKeys: key
    });
    await verified;
    return `signed by ${(await key.getPrimaryUser()).user.userID?.userID}`;
  }

  static async checkTimestamp(
    timestamp: Promise<ArrayBuffer>,
    signature: Promise<ArrayBuffer>,
    authority: Promise<ArrayBuffer>
  ): Promise<string> {
    const token: pkijs.ContentInfo | undefined = pkijs.TimeStampResp.fromBER(await timestamp).timeStampToken;
    if (!token) throw new Error('no timestamp token found');
    const signed: pkijs.SignedData = new pkijs.SignedData({schema: token.content});
    const information: pkijs.EncapsulatedContentInfo['eContent'] = signed.encapContentInfo.eContent;
    if (!information) throw new Error('no timestamp information found');
    if (
      !(await signed.verify({
        signer: 0,
        data: await signature,
        trustedCerts: [pkijs.Certificate.fromBER(Verification.der(new TextDecoder().decode(await authority)))],
        checkChain: true
      }))
    )
      throw new Error('FreeTSA signature does not match');
    return `signature existed by ${pkijs.TSTInfo.fromBER(information.getValue())
      .genTime.toISOString()
      .replace('T', ' ')
      .slice(0, 19)} UTC`;
  }

  signatures(): string {
    return `${this.commit ? `https://raw.githubusercontent.com/martinchapman/blog/${this.commit}/signatures` : '/signatures'}/${this.post}`;
  }

  renderPrevious(): void {
    const previous: HTMLElement = Verification.find(document, '#previous', HTMLElement);
    Verification.predecessor(`${this.signatures()}.prev`).then(
      (commit: string | undefined) => {
        previous.replaceChildren(
          commit
            ? Object.assign(document.createElement('a'), {
                href: `?post=${this.post}&commit=${commit}`,
                textContent: commit.slice(0, 7)
              })
            : 'none'
        );
      },
      (error: Error) => {
        previous.textContent = error.message;
      }
    );
  }

  run(): void {
    const title: string = `verify '${Verification.titles()[this.post] ?? this.post}'`;
    const usage: HTMLElement = Verification.find(document, '#usage', HTMLElement);
    const buffers: Promise<ArrayBuffer>[] = this.components.map(Verification.load);
    const [signature, source, timestamp, authority] = buffers;
    document.title = document.title.replace('verify', title);
    Verification.find(document, 'h1', HTMLHeadingElement).textContent = title;
    usage.textContent = (usage.textContent ?? '').replaceAll('post.md', this.post);
    this.renderPrevious();
    this.components.forEach((component: Component, index: number) => {
      Verification.render(component, buffers[index]);
    });
    Verification.report('signature-result', () => Verification.checkSignature(signature, source));
    Verification.report('timestamp-result', () => Verification.checkTimestamp(timestamp, signature, authority));
  }
}

Verification.start();
