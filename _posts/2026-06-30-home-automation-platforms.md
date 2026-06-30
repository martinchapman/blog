---
layout: default
title: The best home automation platforms
tag: home-automation
---

_Laziness_ is the [first virtue of a programmer](https://thethreevirtues.com/), and a cornerstone of that is automating tasks. Automations that take place without a human trigger are particularly satisfying, such as a job that runs by itself overnight and posts the outputs somewhere to be discovered the next day (as exuberantly described [in this old blog post](https://web.archive.org/web/20190722081306/http://www.kwori.co.uk/blog/2014/10/21/automated-bitcoin-trading-a-platform-for-innovation)).

[An initial post](https://blog.martinchapman.co.uk/2025/08/26/home-assistant-1.html) gave a snapshot of a home assistant installation. Home Assistant provides the opportunity to be more efficient (i.e. lazy) via automations in a home context, but the scaffolding provided to do this by the platform, while important, limits what can be automated. For this reason, several additional platforms are used for automations and documented here in order of complexity and, accordingly, priority; when choosing how to deploy an automation, simple tools are always considered first, and only moved away from if there is rationale to do so.

It is worth noting that these platforms are not always used in isolation. Instead, they are often combined in use cases such as the [film diary](https://blog.martinchapman.co.uk/2025/08/27/film-diary.html), which is also used as a running example below.

All are hosted on a single, at-home [Raspberry Pi server](https://blog.martinchapman.co.uk/2025/08/26/home-assistant-1.html#links).

## 1. Cron

Cron, the OS-based automation tool, provides the simplest automation option (where simple ≠ less powerful), and is used in the current setup primarily for grabbing and backing up (to Dropbox via the impressive [rclone](https://rclone.org/)) data that is output from automated processes, such as logged films:

```shell
0 0 * * * /usr/bin/wget https://darekkay.com/service/trakt/trakt.php?username=martinchapman -O /tmp/trakt.zip; /usr/bin/rclone sync /tmp/trakt.zip dropbox:/Apps
```

**Signs to move to the next platform**: When deploying an automation would necessitate calling a self-authored program from within the job (bad for reproducibility).

## 2. Node-RED

Node-RED, a flow-based automation platform {% include ref.html ref="'Node-RED'" %}, allows for relatively simple individual actions to be wired together and executed automatically. Although an older solution, this doesn't make it any less valid today (particularly given such [active development](https://nodered.org/blog/2026/06/09/version-5-0-released)), and it is thus the next platform in use.

{%
  include figure.html
  src="/assets/images/posts/home-automation-platforms/nodered.png"
  alt="'Node-RED'"
%}

This platform houses 'Organisers', such as Dropbox file organisation automations (e.g. distributing documents into date-based folders) and cleanup jobs for stale data; 'Parsers' such as receipt parsing and budget notifications, and OCR flows for scanned documents; and 'Media', exposed endpoints for media platforms (less automation-focused). As we are (arguably incorrectly) expanding the notion of home automation here to include support for any task that would be undertaken at home, it is worth flagging that Node-RED can, of course, conduct more traditional home automation tasks.

**Signs to move to the next platform**: When, as with Cron, deploying an automation would require a small number of nodes to effectively be proxies for larger, external programs, _and/or_ require a significant number of nodes to be wired together, which would be unwieldy and difficult to maintain [^1].

## 3. Home Assistant

Home Assistant would likely sit here in the hierarchy.

**Signs to move to the next platform**: When deploying an automation would require a custom integration, _or_, as before, require calling external tooling as requirements go beyond Home Assistant's own automation syntax.

## 4. OpenFasS

It's trite to praise the simple yet powerful concept of a function, but worth emphasising especially in the context of automation where many use cases call for the input / process / output model. The [OpenFaaS](https://www.openfaas.com/) platform (self-hosted [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)) realises this model by enabling functions to be deployed as network-accessible entities that can, consequently, serve as endpoints as a part of larger automations, or be paired with a cron-like scheduler to perform self-contained actions.

Because the focus is on deployable functions rather than scalability in this context, OpenFaaS is deployed on top of [Kind](https://kind.sigs.k8s.io/), and currently supports the following automations: Film diary (referenced) with Plex scrobble; [QuasiTV](https://blog.martinchapman.co.uk/2025/08/25/self-hosted-cable.html) with collections creation, list creation, watched sync and channel creation; Plex cleanup; and [departure display](https://blog.martinchapman.co.uk/2025/08/23/building-departure-board.html).

Sadly, but understandably, OpenFaaS has mostly transformed into a commercial product, with usability now limited for hobbyists.

**Signs to move to the next platform**: When state is required.

## 5. FastAPI / Fastify

The last resort for deploying an automation is the development of a bespoke web server application to house logic. Platforms/frameworks like [FastAPI](https://fastapi.tiangolo.com/) (Python) and [Fastify](https://fastify.dev/) (Javascript/Typescript) are, at the time of writing, two such leading frameworks, and have been employed in the current setup to provide stateful utility services such as a credentials wallet.

[^1] This rule is broken slightly by leveraging relatively complex, home-grown wrapper libraries around technologies like RClone from within Node-RED, however these still support fairly simple tasks, and are used across different platforms.
