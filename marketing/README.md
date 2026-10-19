# Dwello marketing site and brand

A proposal for the public website of Dwello as an open-source project, plus the brand manual it is built on. The brand is the app: same tokens (`src/styles/tokens.css`), Inter only, the app's header logo, Lucide icons, panels and badges. Static HTML, no build step, no external requests: Inter is self-hosted.

| Path | What |
|---|---|
| `index.html` | Landing page (German): hero with the real dashboard, the landlord's year, features with real screenshots, feature index, privacy, MCP, install, accessibility, open source, roadmap, FAQ |
| `brand.html` | Brand manual: brand core, logo, colour, typography, elements, images, tone of voice, messaging, strategic sitemap with SEO and launch plan, applications |
| `shots/` | Screenshots of the app with the demo data, light and dark (WebP), and the statement PDF of Hans Müller |
| `assets/` | Logo (light, dark, inverse), app icon, wordmark; outlined SVG |
| `fonts/` | Inter, latin subset (SIL OFL 1.1) |

Retake the screenshots after UI changes: `docs/design/tools/persona-stack.sh` starts the app with the demo data on :3300; capture at 1440 × 900 (DPR 2) and 390 × 844 (DPR 3), light and dark.

Features the page marks as "Geplant" do not exist in the app yet: GWR import, MCP server, full CSV/JSON export, one-step installer with a local login, reports, an open-source licence (the main README still says "Proprietary").
