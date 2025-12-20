---
layout: default
title: "TL;DR.HackerNews24"
permalink: "/"
---

## Latest Posts

<ul>
  {% for post in site.posts %}
    <li>
      <h2><a href="{{ post.url | relative_url }}">{{ post.date | date: "%Y-%m-%d" }}</a></h2>
    </li>
  {% endfor %}
</ul>
