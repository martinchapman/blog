---
layout: default
title: creating self-hosted cable TV
tag: home-automation
---

**What was automated?** Selecting what to watch.

**How?** Traditional television removes [streaming choice paralysis](https://medium.com/@vijetakarani6/how-choice-paralysis-is-costing-netflix-2-8b-annually-and-the-simple-ux-changes-that-could-fix-it-262c3f28bf15).
However, traditional channels do not offer the range of content that, for example, streaming providers do.
[QuasiTV](https://www.quasitv.app/) solves this problem by presenting a media library in a TV schedule format {% include ref.html ref="quasitv main ui" %}.
Although the media is not constantly playing---instead (as a guess) the content is started at a time from a pre-determined schedule when a channel is selected---this creates an effective illusion of live television.

{%
  include figure.html
  src="/assets/images/posts/self-hosted-cable/ui.gif"
  alt="quasitv main ui"
%}

## API

QuasiTV also offers an API that can be used to automatically create channels and specify the content.
A scheduled [OpenFaaS](https://www.openfaas.com/) function was created to periodically create/update the following channels:

1. [Premiere](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L15) (Film): a channel showing unwatched films. 
While starting an unwatched film anywhere but at the start might seem counterintuitive, this is a homage to [Sky's Premiere Film Channel](https://www.skymedia.co.uk/channels/sky-cinema-premiere/).
New films are added on each update.

{:start="2"}
2. [Franchises](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L29) (Film and TV): channels showing films from the same franchise, or related TV shows.
As with the remaining channels described, these are all watched items.
Franchise channels are based on [Trakt liked lists](https://trakt.tv/users/martinchapman/lists/liked) to allow for automatic update (e.g. with the release of new media) and for backup. 
A [separate function](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/lists/handler.py) first creates collections from these lists in Plex (to also organise there), which are then, in turn, picked up for QuasitTV {% include ref.html ref="functions supporting collections channels" %}.

{%
  include figure.html
  src="/assets/images/posts/self-hosted-cable/architecture.png"
  alt="functions supporting collections channels"
%}

{:start="3"}
3. [Seasonal](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L122) (Film): channels showing films appropriate to the current season (Valentines, Halloween and Christmas), if the current date falls within a certain window. 
The content for these channels is again grabbed from Trakt.

4. [Actors/Directors](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L175) (Film): channels showing films from the same actor or director.
Using Plex metadata, directors (actors) who have made (starred in) a number of films above a certain threshold are given 'showcase' channels, e.g. 'Films by David Fincher' or 'Starring Colin Farrell'.
This is randomised on each update.

5. [Genre](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L247) (Film): channels showing films from the same genre.
Although this is provided by default by QuasiTV, again using Plex metadata for these purposes provides finer-grained control.
Each film's lowest-ranked genre classification is used for grouping to ensure channels for popular genres (e.g. action) don't have too much content (and thus certain media items are rarely played).
In addition, if the number of films in a particular channel exceeds a certain cut-off value, additional versions of that channel are created (e.g. 'Action One' and 'Action Two') and media items are split equally between them.

6. [Long-running TV shows](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/quasitv/handler.py#L348) (TV): channels showing TV series in the current collection with more than one season, in an attempt to identify [_comfort shows_](https://www.wondermind.com/article/comfort-tv).
