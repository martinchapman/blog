---
layout: default
title: home
---
<ul class='list-group list-group-light'>
  {% for post in site.posts %}
    <li class='list-group-item d-flex justify-content-between align-items-center'>
      <a href='{{ post.url }}'>{{ post.title | downcase }}</a>
      <span class='badge badge-secondary rounded-pill'>{{ post.date | date: '%-d %B %Y' }}</span>
    </li>
  {% endfor %}
</ul>
