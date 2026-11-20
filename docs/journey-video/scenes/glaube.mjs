/* global RED, GREEN, GREY, W, K, ME */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const GLAUBE = [
	card(1, 'Der Glaube', 'Januar 2026'),
	sc('Dwello ist eine Web-App für private Vermieter in der Schweiz.',
		'Dwello is a web app for private landlords in Switzerland.',
		(d, T, a, ROOT) => {
			d.house(220, 470, 420, 400, 0.2);
			d.rect(560, 250, 60, 60, 0.8, 0.2, { fill: RED, fillStyle: 'solid', stroke: RED });
			d.line(590, 262, 590, 298, 1, 0.1, { stroke: '#fff', strokeWidth: 9 });
			d.line(572, 280, 608, 280, 1.05, 0.1, { stroke: '#fff', strokeWidth: 9 });
			d.line(590, 310, 590, 370, 0.9, 0.1, { strokeWidth: 4 });
			d.P(820, 580, 1, 1.2, { ...ME, mouth: 'grin', look: 1 });
			d.photo(ROOT + 'marketing/shots/statement-light.webp', 1040, 200, 760, 2.4, 2);
			d.text(1060, 640, 'Dwello', 70, 3.4);
		}),
	sc('Wer zwei, drei Wohnungen selbst verwaltet, soll damit einmal im Jahr die Nebenkostenabrechnung machen können: Rechnungen erfassen, verteilen, ein PDF mit QR-Rechnung verschicken.',
		'Anyone who manages two or three apartments themselves should be able to do the utility cost statement once a year: enter invoices, allocate them, send a PDF with a QR-bill.',
		(d, T, a, ROOT) => {
			const q = (f) => f * T;
			d.photo(ROOT + 'docs/beispiele/rechnungen/scan-02-kehricht-reusstal-container.png', 140, 170, 300, q(0.35), -4);
			d.text(190, 640, 'erfassen', 64, q(0.42));
			d.arrow(500, 400, 170, q(0.5));
			d.house(760, 340, 300, 280, q(0.55));
			d.line(860, 340, 860, 620, q(0.6), 0.2);
			d.line(960, 340, 960, 620, q(0.62), 0.2);
			d.text(780, 640, 'verteilen', 64, q(0.66));
			d.arrow(1110, 400, 170, q(0.72));
			d.photo(ROOT + 'marketing/shots/pdf-qr-part.webp', 1320, 250, 480, q(0.76), 3);
			d.text(1380, 640, 'verschicken', 64, q(0.84));
		}),
	sc('Ich baue sie aus zwei Gründen. Ich vermiete selbst und will meine eigene Abrechnung damit machen. Und ich will an einem echten Fachgebiet lernen, wie weit man mit Agenten kommt.',
		'I build it for two reasons. I rent out apartments myself and want to do my own statement with it. And I want to learn, in a real domain, how far you get with agents.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(960, 560, 1.1, 0.2, { ...ME, mouth: 'grin' });
			d.thought(470, 330, 560, 380, q(0.2), [860, 470]);
			d.text(300, 190, '1', 80, q(0.24), RED);
			d.house(390, 340, 160, 140, q(0.27));
			d.text(330, 420, 'meine Wohnungen', 52, q(0.33));
			d.thought(1450, 330, 560, 380, q(0.55), [1060, 470]);
			d.text(1600, 190, '2', 80, q(0.58), RED);
			d.R(1400, 300, 0.55, q(0.6), { mouth: 'grin' });
			d.text(1500, 260, '?', 120, q(0.68), RED);
			d.text(1300, 420, 'Wie weit mit Agenten?', 50, q(0.7));
		}),
	sc('Im Januar starte ich so, wie man es gelernt hat: ein Anforderungsdokument, ein Datenmodell, ein Plan mit über zwanzig Phasen.',
		'In January I start the way one was taught: a requirements document, a data model, a plan with more than twenty phases.',
		(d, T) => {
			const q = (f) => f * T;
			d.paper(120, 420, 280, 330, q(0.25), { title: 'Anforderungen', size: 40 });
			d.paper(250, 480, 280, 330, q(0.38), { title: 'Datenmodell', size: 40 });
			d.flipchart(1000, 130, 600, 560, q(0.48));
			['Phase 1  Projekt aufsetzen', 'Phase 2  Anmeldung', 'Phase 3  Datenbank', '…', 'Phase 22  Abrechnung'].forEach((s, i) => d.text(1040, 170 + i * 98, s, 54, q(0.55) + i * 0.4));
			d.P(800, 540, 1.1, 0.4, { ...ME, mouth: 'grin', look: 1, armR: [890, 450], stick: [1010, 330] });
		}),
	sc('Der Assistent arbeitet Phase um Phase ab, und es geht schnell.',
		'The assistant works through phase after phase, and it goes fast.',
		(d) => {
			d.R(900, 470, 1.2, 0.2, { legs: true, tilt: 9, look: 1.5, mouth: 'grin', armL: [800, 520], armR: [1010, 560] });
			[[620, 450], [560, 540], [640, 630]].forEach(([x, y], i) => d.line(x, y, x + 150, y, 1 + i * 0.1, 0.2, { stroke: GREY }));
			[[1140, 300, 12], [1260, 420, -18], [1180, 560, 25]].forEach(([x, y, r], i) => d.rect(x, y, 90, 120, 1.5 + i * 0.3, 0.3, { ...W, tf: `rotate(${r} ${x + 45} ${y + 60})` }));
			['Phase 3 ✓', 'Phase 9 ✓', 'Phase 16 ✓'].forEach((s, i) => d.text(1420, 200 + i * 120, s, 70, 2.2 + i * 0.7, GREEN));
		}),
	sc('Schon am ersten Abend schreibe ich Regeln in die Datei, die der Assistent bei jeder Aufgabe liest: Jedes Häkchen muss gesetzt sein. Jede Phase braucht Tests.',
		'On the very first evening I write rules into the file the assistant reads for every task: every box must be ticked. Every phase needs tests.',
		(d, T) => {
			const q = (f) => f * T;
			d.path('M220 140 A70 70 0 1 0 300 250 A55 55 0 1 1 220 140 Z', 0.2, 0.4, { fill: '#e8c547', fillStyle: 'solid' });
			d.S(430, 520, 1.1, 0.4, { ...ME, look: 2.6, stick: [640, 640] });
			d.desk(500, 860, 680, 0.9);
			d.paper(960, 120, 760, 600, q(0.2), { title: 'CLAUDE.md', size: 60, lines: 0 });
			d.text(1000, 300, 'Jedes Häkchen setzen!', 60, q(0.6));
			d.text(1000, 420, 'Jede Phase braucht Tests!', 60, q(0.8));
		}),
	sc('Der Assistent setzt die Häkchen.',
		'The assistant ticks the boxes.',
		(d) => {
			d.R(560, 500, 1.2, 0.2, { legs: true, mouth: 'grin', look: 1.5, tilt: 4, armR: [780, 520], stick: [880, 420] });
			for (let i = 0; i < 5; i++) {
				const y = 220 + i * 110;
				d.rect(960, y, 60, 60, 0.5 + i * 0.1, 0.2);
				d.line(1060, y + 34, 1500 - ((i * 97) % 220), y + 34, 0.6 + i * 0.1, 0.2, { stroke: GREY, strokeWidth: 4 });
				d.check(966, y + 30, 70, 1.5 + i * 0.35);
			}
		}),
	sc('Was ich damals nicht sehe: Eine Regel im Text ist eine Bitte. Und ein Häkchen ist eine Behauptung.',
		'What I do not see back then: a rule in a text is a request. And a tick is a claim.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(330, 330, 330, 820, q(0.25), 0.3, { strokeWidth: 9 });
			d.rect(170, 220, 340, 140, q(0.27), 0.4, W);
			d.text(195, 240, 'Bitte Tests', 52, q(0.3));
			d.text(195, 296, 'schreiben', 52, q(0.32));
			d.R(640, 560, 0.95, q(0.35), { legs: true, look: 1.5, mouth: 'o', tilt: 6 });
			d.text(700, 400, '♪', 80, q(0.45));
			d.text(170, 880, 'Regel = Bitte', 70, q(0.48), RED);
			d.rect(1250, 360, 220, 220, q(0.6), 0.4, { strokeWidth: 8 });
			d.check(1270, 470, 200, q(0.65));
			d.stamp(1180, 640, 'Behauptung', 70, q(0.75));
			d.text(1150, 880, 'Häkchen = Behauptung', 70, q(0.8), RED);
		}),
	sc('Nach 93 Commits fehlt mir die Zeit, und das Projekt bleibt liegen. Bis September.',
		'After 93 commits I run out of time, and the project lies idle. Until September.',
		(d, T) => {
			const q = (f) => f * T;
			d.desk(200, 700, 640, 0.2);
			d.laptop(560, 640, 0.5, -1);
			d.path('M530 540 L600 600 M540 580 L590 550 M560 540 L560 610', 0.9, 0.4, { stroke: GREY, strokeWidth: 3 });
			['Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug'].forEach((m, i) => {
				const x = 820 + i * 120;
				const y = 200 + (i % 2) * 50;
				d.rect(x, y, 110, 120, q(0.2) + i * 0.3, 0.2, { ...W, tf: `rotate(${(i % 3) * 8 - 8} ${x + 55} ${y + 60})` });
				d.text(x + 18, y + 30, m, 48, q(0.22) + i * 0.3, GREY);
			});
			d.rect(1180, 470, 200, 220, q(0.75), 0.3, { ...W, strokeWidth: 7 });
			d.text(1210, 520, 'Sep', 90, q(0.78), RED);
			d.P(1640, 560, 1, 0.6, { ...ME, mouth: 'flat', look: 1.5, armR: [1700, 740] });
			d.rect(1670, 740, 90, 70, 1.4, 0.2, K);
		})
];
