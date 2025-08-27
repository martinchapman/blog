---
layout: landing
title: tags
---
<ul class='list-group list-group-light'>
  {% for tag in site.tags %}
    <li class='list-group-item d-flex justify-content-between align-items-center'>
      <a href='{{ '/tags/' | append: tag[0] | relative_url }}'>{{ tag[0] }}</a>
      <span class='badge badge-info rounded-pill'>{{ tag[1].size }}</span>
    </li>
  {% endfor %}
</ul>
