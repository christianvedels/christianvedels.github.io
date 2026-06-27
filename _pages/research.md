---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 2
description:
---

<!-- _pages/research.md — entries live in _bibliography/papers.bib, grouped by the `stage` field -->

{% include bib_search.liquid %}

<h2 id="published">Published</h2>
<div class="publications">
  {% bibliography --query @*[stage=published] --group_by none %}
</div>

<h2 id="working-papers" class="mt-4">Working papers</h2>
<div class="publications">
  {% bibliography --query @*[stage=wp] --group_by none %}
</div>

<h2 id="work-in-progress" class="mt-4">Work in progress</h2>
<div class="publications">
  {% bibliography --query @*[stage=wip] --group_by none %}
</div>
