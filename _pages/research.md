---
layout: page
title: Research
permalink: /research/
nav: true
nav_order: 2
description: >-
  Everything here is a publication — or on its way to becoming one: peer-reviewed
  work that is out, working papers under review, and projects still in progress.
---

<!-- _pages/research.md -->

Everything I work on is, in the end, a publication — or on its way to becoming one. What follows is peer-reviewed work that is out, working papers that are circulating and under review, and projects still taking shape.

## Peer-reviewed publications

- **[Holy cows and spilled milk: The impact of religious missions on firm-level productivity](https://doi.org/10.1016/j.jdeveco.2025.103651)** (2026). Bentzen, J. S., Boberg-Fazlić, N., Sharp, P., Skovsgaard, C. V., & Vedel, C. *Journal of Development Economics*, 179, 103651.
- **[Ireland in a Danish mirror: A microlevel comparison of the productivity of Danish and Irish creameries before the First World War](https://doi.org/10.1080/00076791.2025.2486643)** (2026). McLaughlin, E., Sharp, P., Tsoukli, X., & Vedel, C. *Business History*, 68(3), 596–612.
- **[Adaptability, diversification, and energy shocks: A firm level productivity analysis](https://doi.org/10.1016/j.eneco.2024.107887)** (2024). Henriques, S. T., Sharp, P., Tsoukli, X., & Vedel, C. *Energy Economics*, 139, 107887.
- **[A Microlevel Analysis of Danish Dairy Cooperatives: Opportunities for Large Data in Business History](https://doi.org/10.1017/eso.2023.5)** (2023). Sharp, P., Henriques, S., McLaughlin, E., Tsoukli, X., & Vedel, C. *Enterprise & Society*, 1–29.
- **[A Firm Level Database of Irish Creameries, 1897–1921](https://doi.org/10.1177/03324893231161927)** (2023). McLaughlin, E., Sharp, P., Tsoukli, X., & Vedel, C. *Irish Economic and Social History*.

## Working papers

<div class="projects">
  <div class="row row-cols-1 row-cols-md-3">
    {% assign working_papers = site.projects | where: "stage", "Working papers" | sort: "importance" %}
    {% for project in working_papers %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

## Work in progress

<div class="projects">
  <div class="row row-cols-1 row-cols-md-3">
    {% assign work_in_progress = site.projects | where: "stage", "Work in progress" | sort: "importance" %}
    {% for project in work_in_progress %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>
