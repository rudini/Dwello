// Three invoice PDFs from made-up suppliers for the upload scene (#1445): the Kaminfeger and the Kaltwasser of the
// 2nd half-year are the ones the demo building Alpenblick lacks for 2025, so the statement preview stops warning.
//   node docs/marketing-video/invoices.mjs   → build/marketing-video/invoices/ (PDF), photos/ (the same as phone photos)
// fallow-ignore-file unused-file
/* global console -- Node global */
import { mkdirSync } from 'fs';
import { BUILD, chromium } from './rec.mjs';

const invoices = [
	{
		file: 'Kaminfeger Rauchfrei GmbH - Rechnung 25-0841.pdf',
		photo: 'IMG_4821.jpg',
		vat: 0.081,
		from: ['Kaminfeger Rauchfrei GmbH', 'Industriestrasse 21', '3800 Interlaken', 'MWST CHE-123.456.789'],
		number: '25-0841',
		date: '14.11.2025',
		title: 'Kaminfegerarbeiten Heizanlage 2025',
		period: '01.01.2025 – 31.12.2025',
		items: [
			['Feuerungskontrolle Ölheizung', 145.0],
			['Reinigung Heizkessel und Kamin', 128.0],
			['Wegpauschale', 22.0]
		]
	},
	{
		file: 'Wasserversorgung Bergtal AG - Rechnung 2025-2-3917.pdf',
		photo: 'IMG_4822.jpg',
		vat: 0.026,
		from: ['Wasserversorgung Bergtal AG', 'Brunnenweg 4', '3800 Matten', 'MWST CHE-987.654.321'],
		number: '2025-2-3917',
		date: '20.01.2026',
		title: 'Wasser 2. Halbjahr 2025',
		period: '01.07.2025 – 31.12.2025',
		items: [
			['Wasserverbrauch 118 m³ à 1.65', 194.7],
			['Grundgebühr Wasserzähler 2. Halbjahr', 42.0]
		]
	},
	{
		file: 'Gartenbau Grün GmbH - Rechnung 4471.pdf',
		photo: 'IMG_4823.jpg',
		vat: 0.081,
		from: ['Gartenbau Grün GmbH', 'Seestrasse 7', '3800 Unterseen', 'MWST CHE-111.222.333'],
		number: '4471',
		date: '08.12.2025',
		title: 'Gartenpflege Liegenschaft Alpenblick 2025',
		period: '01.03.2025 – 30.11.2025',
		items: [
			['Rasenmähen, 8 Einsätze', 360.0],
			['Heckenschnitt Herbst', 180.0],
			['Laubräumung', 90.0]
		]
	}
];

const chf = (n) => n.toLocaleString('de-CH', { minimumFractionDigits: 2 });
const cell = 'style="padding:6px 0;border-bottom:1px solid #ddd"';
const right = 'style="text-align:right;border-bottom:1px solid #ddd"';
const PHOTO = `html{background:#a67c52}
	body{background:#fdfcf8;width:700px;min-height:990px;margin:70px auto !important;padding:50px;transform:rotate(-1.6deg);box-shadow:0 10px 40px rgb(0 0 0/.35)}`;
for (const dir of ['invoices', 'photos']) mkdirSync(BUILD + dir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 1280 } });
for (const invoice of invoices) {
	const net = invoice.items.reduce((sum, [, amount]) => sum + amount, 0);
	const vat = Math.round(net * invoice.vat * 20) / 20;
	await page.setContent(`<html><body style="font-family:Helvetica,Arial;font-size:12px;color:#222;margin:50px">
	<div style="display:flex;justify-content:space-between">
		<div><b style="font-size:20px">${invoice.from[0]}</b><br>${invoice.from.slice(1).join('<br>')}</div>
		<div style="text-align:right;margin-top:60px">Frau Vera Verwalter<br>Bergstrasse 8<br>3800 Interlaken</div>
	</div>
	<h1 style="font-size:22px;margin-top:60px">Rechnung Nr. ${invoice.number}</h1>
	<p>Rechnungsdatum: ${invoice.date}<br>Leistungszeitraum: ${invoice.period}<br>Objekt: Alpenblick, Bergstrasse 8, 3800 Interlaken</p>
	<p><b>${invoice.title}</b></p>
	<table style="width:100%;border-collapse:collapse">
		${invoice.items.map(([what, amount]) => `<tr><td ${cell}>${what}</td><td ${right}>CHF ${chf(amount)}</td></tr>`).join('')}
		<tr><td style="padding:6px 0">Total exkl. MWST</td><td style="text-align:right">CHF ${chf(net)}</td></tr>
		<tr><td>MWST ${(invoice.vat * 100).toFixed(1)} %</td><td style="text-align:right">CHF ${chf(vat)}</td></tr>
		<tr><td style="padding-top:8px"><b>Total</b></td><td style="text-align:right;padding-top:8px"><b>CHF ${chf(net + vat)}</b></td></tr>
	</table>
	<p style="margin-top:40px">Zahlbar innert 30 Tagen. Besten Dank für Ihren Auftrag.</p></body></html>`);
	await page.pdf({ path: `${BUILD}invoices/${invoice.file}`, format: 'A4' });
	// the same invoice as a phone would photograph it: the sheet a little askew on a wooden table
	await page.addStyleTag({ content: PHOTO });
	await page.screenshot({ path: `${BUILD}photos/${invoice.photo}`, type: 'jpeg', quality: 88 });
	console.log(invoice.file, chf(net + vat));
}
await browser.close();
