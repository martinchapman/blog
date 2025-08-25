---
layout: default
title: building a minimal at-home train departure board
tag: home-automation
---

**What was automated?** Looking up next train times.

**How?** Inspired by this [train departure display](https://github.com/chrisys/train-departure-display), a display showing the times of the next two departing trains, along with the current time, was created and placed next to the front door for easy viewing.
<br />
In contrast to the original display, a more minimal approach was taken: only three values are displayed {% include ref.html ref="minimal departures display" %}, and the relative size of each panel differentiates the current time (left) from the two departure times (right).
Late running and cancelled trains are indicated by a change in colour to the back panels (orange late; red cancelled).
Font strikethrough emphasises cancellations.
<br />
The display itself is a [Raspberry Pi Touch Display](https://thepihut.com/products/raspberry-pi-touch-display-2), with an attached Pi 4, showing an HTML page that uses [server-sent events](https://www.w3schools.com/html/html5_serversentevents.asp) to receive updates from an [OpenFaaS](https://www.openfaas.com/) function that polls the impressive [Live Departure Board](https://raildata.org.uk/dashboard/dataProduct/P-d81d6eaf-8060-4467-a339-1c833e50cbbe/overview) API via the Rail Data Marketplace from UK National Rail.
<br />
The front-end source is available [here](https://git.sr.ht/~martinchapman/departures/tree/main/item/index.jinja) and the backend source [here](https://git.sr.ht/~martinchapman/pi-display/tree/main/item/departures/handler.py). 

{%
  include figure.html
  src="/assets/images/posts/departures/screen.jpg"
  alt="minimal departures display"
%}

## Architecture

### Function

OpenFaaS ('open source/self-hosted AWS Lambda'), provides an excellent platform for deploying pieces of automated home functionality that are too complex from a cron job, too niche for a [home assistant](https://www.home-assistant.io/) automation or [Node-RED](https://nodered.org/) flow, but not complex enough for a dedicated service.
The departure board was such a piece of functionality, and thus an OpenFaaS function was created to support it.
The function was built on an [updated FastAPI template](https://github.com/martinchapman/openfaas-python3-fastapi-template) to ensure suitable performance in the face of its main function: an [infinite loop polling for departure data](https://git.sr.ht/~martinchapman/pi-display/tree/main/item/departures/handler.py#L149) within each SSE connection.
OpenFaaS provides [good support for SSE](https://www.openfaas.com/blog/openai-streaming-responses/).
[Kind](https://kind.sigs.k8s.io/) provides an alternative to full Kubernetes.
Everything is hosted on a (second) Raspberry Pi {% include ref.html ref="departure display architecture" %}.

{%
  include figure.html
  src="/assets/images/posts/departures/architecture.png"
  alt="departure display architecture"
%}

Destinations that can be reached via a connecting train were determined by identifying departures from an intermediate station that occur within `duration of first leg + n` minutes of the initial departure, where `n` is an acceptable transfer time.

Environment variables control when the API is polled (e.g. during commuting hours), to save endpoint load.

[flake8](https://flake8.pycqa.org/en/latest/) is used as a linter, [mypy](https://github.com/python/mypy) is used for type checking and [pytest](https://docs.pytest.org/en/stable/) for testing, all wrapped in a [tox](https://tox.wiki/en/4.28.4/) pipeline. [black](https://github.com/psf/black) is used as a formatter. 

### Front-end

The front-end is served as a static site from an existing [NGINX](https://nginx.org/) instance on the server.
Its primary function is to initiate the SSE connection on load, and update the UI depending on the response.

A light green background indicates normal running.

A delayed train is indicated by an orange background, with the new departure time shown.

{%
  include figure.html
  src="/assets/images/posts/departures/delayed.png"
  alt="a delayed train"
%}

A delayed train is indicated by a red background and strikethrough.

{%
  include figure.html
  src="/assets/images/posts/departures/cancelled.png"
  alt="a cancelled train"
%}

Returning the clock as a part of the SSE payload ensures any connection issues are evident, although the fact that updates are only sent periodically (every 60 seconds) can result in the clock becoming out of sync.

Linting is provided by [html-validate](https://www.npmjs.com/package/html-validate) and [stylelint](https://stylelint.io/), formatting by [prettier](https://prettier.io/), and testing by [jest](https://jestjs.io/) (linted by [es-lint](https://eslint.org/)).
[Jinja](https://jinja.palletsprojects.com/en/stable/) templating is preferring to direct HTML to avoid hardcoding variables.

### Hardware

Setup on the Pi itself is minimal; it is flashed with the standard Raspberry Pi OS, plus an [autoload script](https://git.sr.ht/~martinchapman/departures/tree/main/item/README.md#setup-client) that calls the static page from the server.
A cron job disables the display in tandem with the disabled server polling.

A [polaroid holder](https://www.etsy.com/uk/listing/772123739/polaroid-holder-photo-holder-photo-stand) acts as a mount for the display.