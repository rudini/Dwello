// Films the scenes of html/scenes.html and renders the captions (#1445).
//   node docs/marketing-video/html-scenes.mjs            all scenes and captions
//   node docs/marketing-video/html-scenes.mjs pdf v-pdf  only these
// fallow-ignore-file unused-file
/* global URL, process -- Node globals; document, window -- in page.evaluate */
/* global document, window */
import { createRequire } from 'module';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { launch, record, BUILD, OUT } from './rec.mjs';

const require = createRequire(new URL('../../package.json', import.meta.url));
const { chromium } = require('@playwright/test');

const PAGE = 'file://' + new URL('./html/scenes.html', import.meta.url).pathname;
const pdfPages = (dir) => {
	const pages = existsSync(BUILD + dir) ? readdirSync(BUILD + dir).filter((f) => f.endsWith('.png')).sort() : [];
	return `pdf=${encodeURIComponent('file://' + BUILD + dir)}&pages=${pages.join(',')}`;
};
const chapter = (number, title, text) =>
	`scene=chapter&ms=3600&number=${encodeURIComponent(number)}&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`;
const LANDSCAPE = { signedIn: false };
const VERTICAL = { signedIn: false, width: 540, height: 960, out: [1080, 1920] };

const SCENES = {
	intro: ['scene=intro&ms=4200', LANDSCAPE],
	'short-intro': ['scene=intro&ms=2600', LANDSCAPE],
	ch1: [chapter('1 · Installation', 'Installiert mit einem Befehl.', 'Eine Zeile ins Terminal kopieren – Dwello läuft auf Ihrem eigenen Computer. Für Windows, macOS und Linux.'), LANDSCAPE],
	ch2: [chapter('2 · Gebäude', 'Gebäude erfassen in Sekunden.', 'Adresse eingeben: Dwello übernimmt Baujahr und alle Wohnungen aus dem eidgenössischen Gebäuderegister (GWR).'), LANDSCAPE],
	ch3: [chapter('3 · Rechnungen', 'Rechnungen hochladen. Die KI liest mit.', 'Rechnungssteller, Betrag, Datum, Zeitraum und Kategorie – Sie prüfen nur noch und bestätigen.'), LANDSCAPE],
	ch4: [chapter('4 · Nebenkostenabrechnung', 'Abrechnungen in fünf Schritten.', 'Periode, Gebäude, Heizprofil, Vorschau mit Kostenabstimmung – fertig sind die Entwürfe für alle Mieter.'), LANDSCAPE],
	ch5: [chapter('5 · Berichte', 'Den Überblick behalten.', 'Kostenabstimmung pro Periode und Jahresbericht für Steuererklärung und Treuhand.'), LANDSCAPE],
	terminal: ['scene=terminal', LANDSCAPE],
	pdf: [`scene=pdf&${pdfPages('pdf')}`, LANDSCAPE],
	outro: ['scene=outro&ms=5500', LANDSCAPE],
	'v-intro': ['scene=v-intro&ms=2800', VERTICAL],
	'v-pdf': [`scene=v-pdf&${pdfPages('pdf-mobile')}`, VERTICAL],
	'v-outro': ['scene=v-outro&ms=4200', VERTICAL]
};

// captions over the app clips; cut.py places them by name
const CAPTIONS = {
	setup: 'Einrichtungscode eingeben, Konto anlegen – fertig.',
	gwr1: 'Adresse eingeben – das Gebäuderegister schlägt Treffer vor',
	gwr2: 'Baujahr, Gebäudetyp und alle 8 Wohnungen: automatisch übernommen',
	gwr3: 'Gebäude und Wohnungen mit einem Klick erstellt',
	upa: 'Gebäude wählen, PDFs auswählen – die KI liest sie sofort aus',
	upb1: 'Betrag, Datum, Zeitraum, Kategorie: von der KI erkannt, von Ihnen geprüft',
	upb2: '3 Rechnungen erstellt – die PDF bleibt als Beleg',
	st1: 'Abrechnungsperiode und Gebäude wählen',
	st2: 'Vorschau mit Kostenabstimmung: was die Mieter tragen und was Sie',
	st3: 'Entwürfe für alle Mieter erstellt',
	st4: 'Jede Position nachvollziehbar – bis zur einzelnen Rechnung',
	rep: 'Kostenabstimmung für jede Abrechnungsperiode',
	ana: 'Jahresbericht für Steuererklärung und Treuhand',
	// the short cut: one line per highlight
	s1: 'Installiert mit einem Befehl – auf Ihrem eigenen Computer',
	s2: 'Adresse eingeben: Gebäude und Wohnungen kommen aus dem Gebäuderegister',
	s3: 'Rechnungen hochladen – die KI liest Betrag, Datum und Kategorie',
	s4: 'Nebenkostenabrechnung in fünf Schritten, mit Kostenabstimmung',
	s5: 'Berichte für Steuererklärung und Treuhand',
	// the vertical cut
	v1: 'Rechnung als PDF hochladen',
	v2: 'Die KI liest Betrag, Datum und Kategorie',
	v3: 'Abrechnung in fünf Schritten',
	v4: 'Entwürfe für alle Mieter – fertig'
};

const FONT = new URL('../../marketing/fonts/inter-latin.woff2', import.meta.url).href;
const LOGO = new URL('../../marketing/assets/dwello-logo-inverse.svg', import.meta.url).href;

/** An image of `body` styled with `css` at `size`, the page loaded from a file so it may load file:// fonts and images */
async function snapshot(browser, size, css, body, path) {
	const page = await browser.newPage({ viewport: { width: size[0], height: size[1] } });
	writeFileSync(BUILD + 'page.html', `<html><head><style>@font-face{font-family:Inter;src:url("${FONT}")}
		*{margin:0;box-sizing:border-box}html,body{background:transparent;font-family:Inter}${css}</style></head><body>${body}</body></html>`);
	await page.goto('file://' + BUILD + 'page.html');
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(200);
	await page.screenshot({ path, omitBackground: true });
	await page.close();
}

// landscape: bottom left, clear of the app's toasts at the bottom right; vertical (v…): centred, above the content
const CAPTION_LAYOUT = {
	landscape: [[1920, 1080], 'left:48px;bottom:56px;white-space:nowrap;font-size:40px'],
	vertical: [[1080, 1920], 'left:60px;right:60px;bottom:220px;text-align:center;font-size:50px']
};
const CAPTION_CSS = `span{display:inline-block;color:#fff;background:#161c21e8;padding:20px 36px;border-radius:12px;box-shadow:0 12px 32px rgb(0 0 0/.24)}
	span::before{content:"";display:inline-block;width:12px;height:12px;border-radius:50%;background:#86bfda;margin-right:18px;vertical-align:0.25em}`;

async function captions() {
	mkdirSync(BUILD + 'captions', { recursive: true });
	const browser = await chromium.launch();
	for (const [name, text] of Object.entries(CAPTIONS)) {
		const [size, place] = CAPTION_LAYOUT[name.startsWith('v') ? 'vertical' : 'landscape'];
		const css = `div{position:absolute;${place};font-weight:600;line-height:1.25}${CAPTION_CSS}`;
		await snapshot(browser, size, css, `<div><span>${text}</span></div>`, `${BUILD}captions/${name}.png`);
	}
	await browser.close();
}

// YouTube thumbnails: a frame of an app clip beside the title, in build/marketing-video/thumbnail-<cut>.png
const THUMBNAIL_LANDSCAPE = [
	[1280, 720],
	`body{display:flex;align-items:center;gap:40px;padding-left:64px}.text{flex:1}img.logo{height:44px;align-self:flex-start}
	h1{font-size:58px}p{font-size:26px}img.shot{width:760px;border-radius:12px 0 0 12px}`
];
const THUMBNAIL_VERTICAL = [
	[1080, 1920],
	`body{display:flex;flex-direction:column;align-items:center;gap:48px;padding:96px 72px 0;text-align:center}
	.text{align-items:center}img.logo{height:72px}h1{font-size:88px}p{font-size:40px}
	img.shot{width:820px;border-radius:24px 24px 0 0;margin-top:auto}`
];
const THUMBNAIL_CSS = `body{width:100vw;height:100vh;overflow:hidden;background:#1b5873;color:#fff}
	.text{display:flex;flex-direction:column;gap:24px}h1{line-height:1.05;letter-spacing:-0.02em;font-weight:800}
	p{font-weight:600;color:#cfe3ec}img.shot{box-shadow:0 12px 32px rgb(0 0 0/.35)}`;
const THUMBNAILS = {
	long: ['statements', 16, 'So einfach geht Ihre Nebenkosten&shy;abrechnung', 'Die ganze Demo · Gratis · Open Source', THUMBNAIL_LANDSCAPE],
	short: ['upload-b', 5, 'Nebenkosten&shy;abrechnung, einfacher gemacht.', 'Dwello in einer Minute', THUMBNAIL_LANDSCAPE],
	vertical: ['m-upload-b', 4, 'Von der Rechnung zur QR-Rechnung', 'Dwello · gratis · dwello.ch', THUMBNAIL_VERTICAL]
};

async function thumbnails() {
	const browser = await chromium.launch();
	for (const [cut, [clip, second, title, line, [size, css]]] of Object.entries(THUMBNAILS)) {
		const frame = `${BUILD}thumbnail-${cut}-frame.png`;
		execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(second), '-i', `${OUT}${clip}.mp4`, '-frames:v', '1', frame]);
		const body = `<div class="text"><img class="logo" src="${LOGO}"><h1>${title}</h1><p>${line}</p></div><img class="shot" src="file://${frame}">`;
		await snapshot(browser, size, THUMBNAIL_CSS + css, body, `${BUILD}thumbnail-${cut}.png`);
	}
	await browser.close();
}

const only = process.argv.slice(2);
for (const [name, [query, options]] of Object.entries(SCENES)) {
	if (only.length && !only.includes(name)) continue;
	const h = await launch(options);
	await h.page.goto('about:blank');
	await record(h, name, async () => {
		await h.page.goto(`${PAGE}?${query}`);
		await h.page.waitForFunction(() => window.done === true, null, { timeout: 60000 });
	});
	await h.browser.close();
}
if (!only.length || only.includes('captions')) await captions();
if (!only.length || only.includes('thumbnails')) await thumbnails();
