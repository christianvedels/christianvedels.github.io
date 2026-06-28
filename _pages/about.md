---
layout: about
title: About
permalink: /
subtitle: Assistant Professor, <a href='https://www.sdu.dk/en/forskning/hedg'>HEDG</a>, Department of Economics, University of Southern Denmark.

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Department of Economics</p>
    <p>University of Southern Denmark</p>
    <p>Odense, Denmark</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true
  limit: 3
---

I am an Assistant Professor in economic history at the University of Southern Denmark, on a fixed-term, non-tenure-track contract. I am **currently on the job market** and open to positions across Europe and North America.

I am interested in expanding our knowledge of how geography and institutions shape living conditions. I build machine learning tools and large-scale historical datasets to recover lost economic measurements from the past, using causal inference and machine learning on large amounts of historical georeferenced data.

In 2023, I received the **New Researcher Prize** from the Economic History Society for my paper *A Perfect Storm*. History is the only place where the world looks different enough to shed light on potential disruptions ahead.

→ [Research statement](/research/)

<script>
  // Relabel "Code" buttons as "GitHub" in the selected-publications list.
  (function () {
    function relabel() {
      document.querySelectorAll(".links a").forEach(function (a) {
        if (a.textContent.trim() === "Code") a.textContent = "GitHub";
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", relabel);
    } else {
      relabel();
    }
  })();
</script>
