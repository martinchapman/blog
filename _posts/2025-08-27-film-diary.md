---
layout: default
title: keeping a film diary
tag: home-automation
---

**What was automated?** Tracking watched films.

**How?** I have been keeping [track of films I have watched](https://trakt.tv/users/martinchapman/history) since 2021 {% include ref.html ref="trakt watched list" %}.
I originally did this via [Letterboxd](https://letterboxd.com/martinchapman/), but later switched to [Trakt](https://trakt.tv/users/martinchapman) due to the presence of an API.
Having an API is useful as it enables _scrobble_ functionality to be replicated (via an [OpenFaaS function](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/scrobble/handler.ts)), and thus watched films to be tracked automatically.

{%
  include figure.html
  src="/assets/images/posts/film-diary/watched.png"
  alt="trakt watched list"
%}

This function is also able to enforce criteria for adding an item to the watch history:

* Must not have been watched previously. 
This turns Trakt's watch history into a record of first watches, rather than all watches.

* Must be >90% watched.

* Must be categorised as a film (as opposed to an episode of a TV show). 
While Trakt is also designed to record TV shows watched, for the [reasons discussed below](#rationale) only films are entered into the watch history.
This does, however, result in some empty profile sections.

* Must be over 90 minutes (an arbitrary definition of a feature film).

The watched items present on Trakt prior to 2021 are set to each film's release date.

A cron job calling [this backup script](https://darekkay.com/blog/trakt-tv-backup/) is present on a server linked to Dropbox, to preserve the watched list.

Trakt has several other useful features:

* Storing lists, including, in my case, [favourite films each year since 1975](https://trakt.tv/users/martinchapman/lists/years?sort=rank,asc).

* Presenting [general film recommendations](https://trakt.tv/users/martinchapman/favorites?sort=rank,asc).

* Listing [current films in one's library](https://trakt.tv/users/martinchapman/library) as a backup, also managed by [OpenFaaS](https://git.sr.ht/~martinchapman/plex-functions/tree/main/item/collection/handler.py).

* The ability to [like other user's lists](https://trakt.tv/users/martinchapman/lists/liked), supporting the functionality described in [this post](/2025/08/25/self-hosted-cable.html#api).

# Rationale

[steppingthroughfilm](https://www.instagram.com/steppingthroughfilm) captures well the rationale for doing this (albeit in physical form):
<br />
<br />
"For the past 16 years I've written down every film I watch in [journals]... Each film is like a memory so it's lovely flipping through the pages."
<br />
"I guess they're also my diaries... each one representing a period of my life and the films I watched at that time..."
<br />
"if you also journal then you'll know how therapeutic and lovely it is to write everything down from inside our wondering heads..."
<br />
"**I think film is so special in that way. Each movie can mark a period in our lives**... the one you watched at uni... the one you watched round your mates house... your mums favourite one... the one you watched in hospital... the first one you watched in your new home… the list goes on. Little markers through our lives."

{%
  include instagram.html
  src="https://www.instagram.com/p/DF3Q4Ibivdt/?utm_source=ig_embed&amp;utm_campaign=loading"
%}