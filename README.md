# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/witty-puffin-55/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/witty-puffin-55/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5: every trophy with its official name, description and grade, a guide in our own words that cites its sources, a three-stage roadmap to the platinum, and a checklist that saves your progress in the browser. Built for the [make.fun gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- All 55 trophies (1 platinum, 2 gold, 6 silver, 46 bronze) with official names, descriptions and grades
- A guide for every trophy in our own words, each citing its source beside it — a source is cited, never copied
- Roadmap to the platinum in three stages (~200 hours, one playthrough, all offline), with the 100% completion checklist numbers
- The one possibly missable trophy flagged: Positive Mental Attitude (meditate at all 18 spots; the Chapter 1 balcony meditation can be missed)
- Tracker: tick trophies off, progress saves in localStorage, export to a file and import it back
- Filters by kind (story, missable, collectibles, activities, online, 100% completion, platinum), grade, earned state, and full-text search
- Spoiler setting that hides the names and guides of story trophies until they are earned
- Five trophies whose methods are still unconfirmed are marked as such, honestly, instead of guessing

## Run it

```bash
# serve the app locally (Node 22)
node serve.ts
# then open http://localhost:8080
```

The entry program is `main.ts` (Node 22, standard library only): it copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## Screenshots

- `screenshots/1-checklist.jpg` — the checklist with guides and sources open, 12 trophies earned
- `screenshots/2-roadmap.jpg` — the roadmap to the platinum
- `screenshots/3-spoiler.jpg` — spoiler mode on: story trophies hidden until earned
- `screenshots/4-guide.jpg` — the missable trophy's guide, open with its source

No Rockstar Games logo, artwork, or game screenshot is used anywhere in this app.
