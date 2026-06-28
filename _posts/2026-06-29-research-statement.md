---
layout: post
title: Research statement
date: 2026-06-29
description: I am on the 2026 job market — a few reflections on what I work on, why, and where it is going.
---

I am on the 2026 job market, open to positions across Europe and North America. What follows is less a formal research statement than a few honest reflections on what I work on, why it grips me, and where it is going.

My research starts from a simple premise: as economists, our real job is a kind of map-making. Explorers long ago charted every inch of the physical globe, but the social world is still obscured in empirical mist. Much of what we would like to know about how poor places become rich is limited not by theory but by what we can *measure* — and a surprising amount of that missing knowledge is sitting in the historical record, waiting to be read.

So I work on two things at once. I build machine learning tools and large-scale historical datasets to recover lost economic measurements from the past, and I combine them with causal inference to ask how geography and institutions shape prosperity. Building the tools is, to me, as much a part of the work as the questions they answer.

The clearest example is *A Perfect Storm*[^1], which asks what happens to prosperity when geography itself suddenly changes — a question with uncomfortable resonance in the age of climate change. In 1825 a storm breached a narrow isthmus in northwestern Denmark and opened a navigable channel to the North Sea; trade and fishing followed, and prosperity relocated with them inside a single generation. A mirror experiment — a waterway that closed sometime between 1086 and 1208 — lets me run the same logic in reverse.

To see what that did to the structure of work, I had to read millions of messy occupational descriptions, so I built something to do it: OccCANINE[^2], a language model that turns historical job titles into standardized codes, trained on 14 million records across 13 languages. It has quietly become something of a field standard. CHAOS[^3] takes the next step — turning occupations into continuous income estimates, formalizing and scaling what economic historians have long done by hand.

Geography is only half the story; I am just as interested in institutions. *Tracks to Modernity*[^4] follows Denmark's railways parish by parish and finds that market access carried not just goods but ideas, organization, and new civic institutions. A cluster of papers on the Danish and Irish dairy industries[^5] uses firm-level data to show how religion, energy shocks, and geography shaped industrial productivity — and, now and then, to retire a comfortable national myth.

Where this is going is toward bigger data and longer horizons. The Copenhagen Tax Book project[^6] digitizes 2.1 million individual records to reconstruct income and wealth inequality in a single city across the late nineteenth and early twentieth centuries — as I write this, I am fairly sure I am the first person ever to look at a Gini coefficient for Copenhagen in 1878. A new project funded by the Independent Research Fund Denmark will extend that kind of measurement to all of Denmark across 250 years.

What drives all of it is a simple conviction: we are born into a world we have barely measured, and much of what we are missing is hidden in the historical record. Recovering even a little of it — being the first to see something that was always there but never seen — is one of the real privileges of this work. And it reaches beyond the past: history is the only place where the world looks different enough to shed light on the changes still ahead.

[^1]: [A Perfect Storm: First-Nature Geography and Economic Development](https://arxiv.org/abs/2408.00885) — my job market paper; winner of the Economic History Society's New Researcher Prize (2023).
[^2]: [Breaking the HISCO Barrier: Automatic Occupational Standardization with OccCANINE](https://arxiv.org/abs/2402.13604) — with Christian Møller Dahl and Torben Johansen.
[^3]: [CHAOS: Converting Historical Accounts into Occupational Scores](https://christianvedels.github.io/Presentations/CHAOS/Slides_CC.html) (slides) — with Matthew Curtis, Torben Johansen, and Julius Koschnick.
[^4]: [Tracks to Modernity: Railroads, Growth, and Social Movements in Denmark](https://arxiv.org/abs/2502.21141) — with Tom Görges, Magnus Ørberg Rove, and Paul Sharp.
[^5]: For example [Holy cows and spilled milk](https://doi.org/10.1016/j.jdeveco.2025.103651) (*Journal of Development Economics*, 2026) — one of several papers on the Danish and Irish creameries.
[^6]: [The Copenhagen Tax Book project](https://christianvedels.github.io/Presentations/Incomes_Copenhagen/Slides.html) (slides), extending into *Denmark's Path to Economic Development* (funded by the Independent Research Fund Denmark, 2027–2030; with Casper Worm Hansen and Asger Mose Wingender).
