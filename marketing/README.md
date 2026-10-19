# Dwello marketing site and brand

A proposal for the public website of Dwello as an open-source project, plus the brand manual it is built on. Static HTML, no build step, no external requests: fonts are self-hosted, so the site keeps the privacy promise it makes.

| File | What |
|---|---|
| `index.html` | Landing page (German): hero, the landlord's year in four steps, features in depth, feature index, privacy, MCP, install, accessibility, open source, roadmap, FAQ |
| `brand.html` | Brand manual: brand core, logo, colour, typography, illustration, tone of voice, messaging, strategic sitemap with SEO and launch plan, applications |
| `assets/` | Logo files (mark, lockup, inverse lockup, wordmark), outlined SVG |
| `fonts/` | Schibsted Grotesk, Inter, IBM Plex Mono (latin subsets, SIL OFL 1.1) |

Open `index.html` in a browser. Colours are the app's tokens (`src/styles/tokens.css`) plus one brand colour, "Licht" (`#F0C27A`).

Features the page marks as "Geplant" do not exist in the app yet: GWR import, MCP server, full CSV/JSON export, one-step installer with a local login, reports, an open-source licence (the main README still says "Proprietary").
