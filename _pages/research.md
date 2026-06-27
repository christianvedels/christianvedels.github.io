---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 2
description:
---

<!-- _pages/research.md — cards are driven by _data/research.yml -->

<div class="research-list">
{% assign stages = "Published,Working papers,Work in progress" | split: "," %}
{% for stage in stages %}
  {% assign items = site.data.research.research | where: "stage", stage %}
  {% if items.size > 0 %}
  <h2 id="{{ stage | slugify }}" class="mt-4">{{ stage }}</h2>
  {% for item in items %}
  <div class="card" style="margin: 1rem 0; overflow: hidden;">
    <div style="display: flex; flex-wrap: wrap;">
      <div style="flex: 0 0 220px; max-width: 220px;">
        <img
          src="{{ item.img | relative_url }}"
          alt="{{ item.title | escape }}"
          loading="lazy"
          style="width: 100%; height: 100%; min-height: 150px; object-fit: cover;"
        />
      </div>
      <div style="flex: 1 1 320px;">
        <div class="card-body">
          <h5 class="card-title" style="margin-bottom: 0.25rem;">
            <a href="{% if item.url contains '://' %}{{ item.url }}{% else %}{{ item.url | relative_url }}{% endif %}">{{ item.title }}</a>
          </h5>
          {% if item.meta %}
            <p class="card-text" style="opacity: 0.7; font-size: 0.85rem; margin-bottom: 0.5rem;">{{ item.meta }}</p>
          {% endif %}
          <p class="card-text" style="margin-bottom: 0;">{{ item.abstract }}</p>
        </div>
      </div>
    </div>
  </div>
  {% endfor %}
  {% endif %}
{% endfor %}
</div>
