---
layout: default
title: blog
---
Views are my own.
<br>
<br>
Work-based content is available on the [root domain](https://martinchapman.co.uk) and on social media sites:
[Bluesky](https://bsky.app/profile/martinchapman.bsky.social), [Mastodon](https://mastodon.social/@martinchapman) and
[Twitter (X)](https://x.com/martin_chap_man).
<br>
<br>
_Posts are designed to be public, and thus somewhat long-lived, [postcards to the
future](https://vukutu.com/blog/2010/07/postcards-to-the-future/') (self-addressed), documenting activities within a
number of different [areas](/tags)._
<br>
<br>
<img class='thumbnail' src='/assets/images/about.png' alt='martin chapman'>

<div class='image'>
  <ul class='list-group list-group-light'>
    {% for post in site.posts %}
      <li class='list-group-item d-flex justify-content-between align-items-center'>
        <a href='{{ post.url }}'>{{ post.title | downcase }}</a>
        <span class='badge badge-secondary rounded-pill'>{{ post.date | date: '%-d %B %Y' }}</span>
      </li>
    {% endfor %}
  </ul>
</div>
