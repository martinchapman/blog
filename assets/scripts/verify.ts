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
  post: string;
  components: Component[];

  constructor(post: string) {
    this.post = post;
    this.components = [
      {title: 'signature', url: `/signatures/${post}.asc`, name: `${post}.asc`},
      {
        title: 'source',
        url: `https://raw.githubusercontent.com/martinchapman/blog/main/_posts/${post}`,
        link: {
          href: `https://raw.githubusercontent.com/martinchapman/blog/main/_posts/${post}`,
          textContent: 'live copy'
        },
        name: post
      },
      {title: 'timestamp', url: `/signatures/${post}.tsr`, name: `${post}.tsr`, binary: true},
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
    const post: string = new URLSearchParams(location.search).get('post') ?? '';
    if (/^\d{4}-\d{2}-\d{2}-[\w-]+\.md$/.test(post)) new Verification(post).run();
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

  static load({url, name}: Component): Promise<ArrayBuffer> {
    return fetch(url).then((response: Response) =>
      response.ok ? response.arrayBuffer() : Promise.reject(new Error(`failed to load ${name} (${response.status})`))
    );
  }

  static render({title, link, name, binary}: Component, buffer: Promise<ArrayBuffer>): void {
    const template: HTMLTemplateElement = Verification.find(document, '#file', HTMLTemplateElement);
    const fragment: DocumentFragment = document.importNode(template.content, true);
    const code: HTMLElement = Verification.find(fragment, 'code', HTMLElement);
    const download: HTMLAnchorElement = Verification.find(fragment, '.download', HTMLAnchorElement);
    Verification.find(fragment, 'h2', HTMLHeadingElement).textContent = title;
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

  run(): void {
    const title: string = `verify '${Verification.titles()[this.post] ?? this.post}'`;
    const usage: HTMLElement = Verification.find(document, '#usage', HTMLElement);
    const buffers: Promise<ArrayBuffer>[] = this.components.map(Verification.load);
    document.title = document.title.replace('verify', title);
    Verification.find(document, 'h1', HTMLHeadingElement).textContent = title;
    usage.textContent = (usage.textContent ?? '').replaceAll('post.md', this.post);
    this.components.forEach((component: Component, index: number) => {
      Verification.render(component, buffers[index]);
    });
  }
}

Verification.start();
