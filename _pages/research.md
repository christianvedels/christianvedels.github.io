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

<h2 id="funded-projects" class="mt-4">Funded projects</h2>
<div class="publications">
  {% bibliography --query @*[stage=funded] --group_by none %}
</div>

<h2 id="work-in-progress" class="mt-4">Work in progress</h2>
<div class="publications">
  {% bibliography --query @*[stage=wip] --group_by none %}
</div>

<script>
  // (1) Relabel "Code" buttons as "GitHub".
  // (2) Make each entry title a link to its best target: DOI > PDF > Slides
  //     (published -> DOI, working papers -> PDF, work-in-progress -> Slides).
  (function () {
    function enhance() {
      document.querySelectorAll(".links a").forEach(function (a) {
        if (a.textContent.trim() === "Code") a.textContent = "GitHub";
      });
      document.querySelectorAll(".publications .row").forEach(function (row) {
        var title = row.querySelector(".title");
        if (!title || title.querySelector("a")) return;
        var hrefs = {};
        row.querySelectorAll(".links a[href]").forEach(function (a) {
          hrefs[a.textContent.trim()] = a.getAttribute("href");
        });
        var target = hrefs["DOI"] || hrefs["PDF"] || hrefs["Slides"];
        if (!target || target === "#") return;
        var link = document.createElement("a");
        link.href = target;
        link.style.color = "inherit";
        while (title.firstChild) link.appendChild(title.firstChild);
        title.appendChild(link);
        title.style.cursor = "pointer";
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", enhance);
    } else {
      enhance();
    }
  })();
</script>
