---
layout: default
title: blog
---
[Postcards to the
future](https://vukutu.com/blog/2010/07/postcards-to-the-future/'). Views are my own.
<br>
<br>
_Work-based content is available on the [root domain](https://martinchapman.co.uk), [Medium](https://medium.com/@MartinChapman) and on social media sites:
[Bluesky](https://bsky.app/profile/martinchapman.bsky.social), [Mastodon](https://mastodon.social/@martinchapman) and
[Twitter (X)](https://x.com/martin_chap_man)._
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
