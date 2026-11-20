/* global RED, GREEN, GREY, W, K, R0, ME */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const ARCHITEKTUR = [
	card(5, 'Architektur erst, als sie gebraucht wurde', '23. Oktober 2026'),
	sc('Ich habe keine Architektur im Voraus entworfen.',
		'I did not design any architecture up front.',
		(d) => {
			d.rect(500, 220, 760, 520, 0.2, 0.5, { fill: '#dbe7f3', fillStyle: 'solid', stroke: '#2c5d8a' });
			for (let i = 1; i < 6; i++) d.line(500 + i * 127, 220, 500 + i * 127, 740, 0.5 + i * 0.05, 0.2, { stroke: '#9bb7d4', strokeWidth: 2 });
			d.text(560, 260, 'Masterplan', 90, 0.9, '#2c5d8a');
			d.rect(620, 420, 220, 160, 1.2, 0.3, { stroke: '#2c5d8a' });
			d.rect(920, 420, 220, 160, 1.3, 0.3, { stroke: '#2c5d8a' });
			d.cross(880, 480, 520, 2);
			d.P(1500, 560, 1.05, 1.5, { ...ME, look: -1.5, mouth: 'flat' });
		}),
	sc('Sie kam am 23. Oktober, einen Monat nach dem Neustart, und sie kam über Messungen.',
		'It came on 23 October, a month after the restart, and it came through measurements.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(140, 80, '23. Oktober 2026', 64, 0.2, GREY);
			d.rect(700, 360, 460, 400, 0.4, 0.5, W);
			d.text(820, 510, 'Code', 100, 0.9);
			d.rect(640, 300, 600, 44, q(0.3), 0.5, { fill: '#e8c547', fillStyle: 'solid', tf: 'rotate(-4 940 322)' });
			for (let i = 0; i < 12; i++) d.line(660 + i * 48, 302 - i * 3.3, 660 + i * 48, 322 - i * 3.3, q(0.4) + i * 0.04, 0.05, { strokeWidth: 3 });
			d.P(1440, 560, 1.05, q(0.35), { ...ME, look: -1.5, mouth: 'grin', armL: [1240, 330] });
		}),
	sc('Mein Gefühl war: Jede kleine Änderung fasst zu viele Dateien an.',
		'My feeling was: every small change touches too many files.',
		(d) => {
			d.P(330, 560, 1.05, 0.2, { ...ME, look: 1.5, mouth: 'flat', brows: 'worry' });
			d.circle(1050, 520, 30, 0.8, 0.2, K);
			[160, 340, 520, 700].forEach((r, i) => d.ellipse(1050, 520, r * 1.5, r * 0.75, 1.2 + i * 0.35, 0.5, { stroke: GREY, strokeWidth: 4 }));
			[[700, 380], [1380, 400], [760, 700], [1340, 680], [1050, 300], [1050, 760]].forEach(([x, y], i) => d.rect(x - 30, y - 40, 60, 80, 2.4 + i * 0.12, 0.2, W));
		}),
	sc('Statt zu raten, habe ich ein Werkzeug gebaut, das die Git-Historie auswertet.',
		'Instead of guessing, I built a tool that analyses the git history.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(120, 300, 620, 300, 0.2, 0.5, { strokeWidth: 5 });
			[160, 260, 360, 460, 560].forEach((x, i) => d.circle(x, 300, 46, 0.3 + i * 0.1, 0.1, { ...W, strokeWidth: 5 }));
			d.path('M360 300 Q420 200 520 200 L620 200', 0.9, 0.3, { strokeWidth: 5 });
			d.circle(560, 200, 46, 1.1, 0.1, { ...W, strokeWidth: 5 });
			d.arrow(660, 300, 130, 1.3);
			d.path('M820 180 L1180 180 L1060 420 L1060 520 L940 520 L940 420 Z', 1.5, 0.5, W);
			d.text(870, 220, 'arch-baseline', 50, 1.9);
			d.arrow(1100, 470, 140, 2.2);
			d.rect(1270, 300, 420, 320, 2.4, 0.4, W);
			[[1310, 560, 120], [1400, 560, 200], [1490, 560, 80], [1580, 560, 240]].forEach(([x, y, h], i) => d.rect(x, y - h, 60, h, 2.7 + i * 0.12, 0.2, { fill: GREY, fillStyle: 'hachure', hachureGap: 8 }));
			const me = d.S(620, 640, 0.85, q(0.45), { ...ME, look: 2.6, mouth: 'grin', defer: true });
			me.arms([760, 700], q(0.5));
			d.text(150, 860, 'selbst gebaut', 64, q(0.7), RED);
		}),
	sc('Das Ergebnis: Ein Feature ändert im Median zwölf Dateien in drei Schichten.',
		'The result: a feature changes a median of twelve files in three layers.',
		(d, T) => {
			const q = (f) => f * T;
			['Frontend', 'BFF', 'Backend'].forEach((n, i) => {
				d.path(`M300 ${300 + i * 200} L1100 ${300 + i * 200} L1300 ${220 + i * 200} L500 ${220 + i * 200} Z`, 0.2 + i * 0.3, 0.4, W);
				d.text(1340, 220 + i * 200, n, 60, 0.5 + i * 0.3, GREY);
			});
			for (let i = 0; i < 12; i++) {
				const lay = i % 3;
				const x = 480 + ((i * 137) % 600);
				const y = 230 + lay * 200;
				d.rect(x, y, 44, 56, q(0.35) + i * 0.12, 0.1, { ...W, stroke: RED, strokeWidth: 4 });
			}
			d.text(500, 820, '12 Dateien, 3 Schichten', 80, q(0.7), RED);
		}),
	sc('Ein einzelnes Datenbankfeld ist in sechs weiteren Dateien noch einmal von Hand beschrieben.',
		'A single database field is described by hand once more in six other files.',
		(d, T) => {
			const q = (f) => f * T;
			d.db(820, 330, 280, 300, 0.2);
			d.text(880, 450, 'iban', 70, 0.7);
			[[360, 220], [360, 520], [520, 760], [1400, 220], [1400, 520], [1240, 760]].forEach(([x, y], i) => {
				d.paper(x, y, 200, 150, q(0.25) + i * q(0.08), { lines: 0 });
				d.text(x + 30, y + 40, 'iban', 52, q(0.3) + i * q(0.08), RED);
				d.line(x + 100, y + 75, 960, 480, q(0.3) + i * q(0.08), 0.3, { stroke: GREY, strokeWidth: 3, strokeLineDash: [10, 10] });
			});
		}),
	sc('Kopierter Code war es nicht. Es war kopiertes Wissen.',
		'It was not copied code. It was copied knowledge.',
		(d) => {
			d.text(300, 260, 'kopierter Code', 110, 0.2, GREY);
			d.line(290, 340, 1010, 320, 1.2, 0.3, { stroke: RED, strokeWidth: 10 });
			d.text(300, 480, 'kopiertes Wissen', 130, 1.8);
			d.path('M300 650 C 600 630 900 670 1120 640', 2.8, 0.4, { stroke: RED, strokeWidth: 8 });
			d.P(1500, 560, 1.05, 0.6, { ...ME, look: -1.5, mouth: 'flat', armL: [1360, 540] });
		}),
	sc('Dann die Frage: Welche Qualität zählt überhaupt? Das kommt aus Continuous Architecture.',
		'Then the question: which quality matters at all? That comes from Continuous Architecture.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(420, 560, 1.1, 0.2, { ...ME, look: 1.5, mouth: 'flat', armR: [500, 470] });
			d.text(560, 180, '?', 160, 0.9);
			d.rect(900, 240, 480, 600, q(0.5), 0.5, { fill: '#2c5d8a', fillStyle: 'solid', stroke: '#16181d' });
			d.rect(900, 240, 40, 600, q(0.55), 0.2, K);
			d.text(980, 330, 'Continuous', 64, q(0.6), '#fff');
			d.text(980, 410, 'Architecture', 64, q(0.66), '#fff');
		}),
	sc('Ich habe einen Utility Tree gebaut: Qualitätsszenarien mit Zielwerten.',
		'I built a utility tree: quality scenarios with target values.',
		(d, T) => {
			const q = (f) => f * T;
			d.path('M940 900 L940 520 M940 640 L640 420 M940 600 L1240 400 M940 520 L800 280 M940 520 L1080 260', 0.2, 1.2, { strokeWidth: 12 });
			[[440, 380, 'Kein Datenverlust'], [1180, 360, 'Sicheres Update'], [560, 220, 'CI ≤ 15 min'], [1020, 200, 'Seite < 500 ms']].forEach(([x, y, t], i) => {
				d.tag(x, y, t, q(0.35) + i * q(0.12), i % 2 ? '#1f8a4c' : '#e0301e');
			});
			d.text(180, 800, 'Utility Tree', 80, q(0.2));
		}),
	sc('Der teuerste Fehler für einen Vermieter ist Datenverlust.',
		'The most expensive error for a landlord is data loss.',
		(d) => {
			d.P(560, 560, 1.15, 0.2, { glasses: true, curls: true, mouth: 'sad', brows: 'worry', look: 1.5 });
			d.rect(800, 640, 260, 180, 1, 0.3, W);
			d.path('M800 640 L760 560 M1060 640 L1100 560', 1.3, 0.2);
			[[1150, 300, 15], [1300, 200, -20], [1450, 360, 30], [1580, 230, -10]].forEach(([x, y, r], i) => d.rect(x, y, 100, 130, 1.6 + i * 0.3, 0.3, { ...W, tf: `rotate(${r} ${x + 50} ${y + 65})` }));
			d.text(1100, 600, 'Datenverlust', 90, 3, RED);
		}),
	sc('Also: ein verschlüsseltes Backup, das sich wirklich einspielen lässt. Ein Update, das keine Zeile verliert. Die CI antwortet in 15 Minuten.',
		'So: an encrypted backup that can really be restored. An update that loses no row. CI answers within 15 minutes.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(200, 320, 340, 340, q(0.05), 0.4, { fill: '#9aa3ab', fillStyle: 'solid' });
			d.circle(370, 490, 140, q(0.1), 0.3, { ...W, strokeWidth: 6 });
			d.line(370, 490, 420, 450, q(0.15), 0.1, { strokeWidth: 7 });
			d.text(230, 720, 'Backup', 64, q(0.18));
			d.check(470, 300, 90, q(0.28));
			d.db(760, 360, 160, 220, q(0.38), 'alt');
			d.text(950, 420, '=', 110, q(0.45));
			d.db(1040, 360, 160, 220, q(0.48), 'neu');
			d.text(800, 720, 'Update', 64, q(0.52));
			d.circle(1560, 500, 300, q(0.65), 0.5, { ...W, strokeWidth: 7 });
			d.rect(1540, 320, 40, 30, q(0.7), 0.1, K);
			d.line(1560, 500, 1560, 390, q(0.72), 0.2, { strokeWidth: 6 });
			d.line(1560, 500, 1640, 500, q(0.74), 0.2, { strokeWidth: 6 });
			d.text(1440, 720, 'CI ≤ 15 min', 64, q(0.78));
		}),
	sc('Architektur ist für mich seither genau das: ein Werkzeug, um solche nicht-funktionalen Anforderungen zu erreichen. Nicht mehr.',
		'Since then, architecture is exactly that for me: a tool for reaching such non-functional requirements. Nothing more.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(320, 560, 1.05, 0.2, { ...ME, look: 1.5, mouth: 'grin', armR: [450, 690] });
			d.rect(450, 640, 380, 200, 0.8, 0.4, { fill: '#e0301e', fillStyle: 'solid' });
			d.path('M560 640 L560 590 L720 590 L720 640', 1.1, 0.2, { strokeWidth: 8 });
			d.text(470, 700, 'Architektur', 60, 1.3, '#fff');
			d.arrow(900, 600, 300, q(0.4));
			[260, 180, 100].forEach((r, i) => d.circle(1450, 560, r * 2, q(0.45) + i * 0.15, 0.3, { strokeWidth: 6, stroke: i === 2 ? '#e0301e' : '#16181d' }));
			d.text(1380, 520, 'NFR', 70, q(0.6));
			d.text(900, 220, 'ein Werkzeug, nicht mehr', 70, q(0.75), GREY);
		}),
	sc('Jedes wichtige Szenario bekommt eine Fitness Function: einen automatischen Test für eine Architektureigenschaft.',
		'Every important scenario gets a fitness function: an automatic test of an architectural property.',
		(d, T) => {
			const q = (f) => f * T;
			d.R(760, 520, 1.15, 0.2, { legs: true, mouth: 'o', look: 0, armL: [600, 280], armR: [920, 280] });
			d.line(520, 280, 1000, 280, 1, 0.3, { strokeWidth: 12 });
			d.rect(480, 210, 60, 140, 1.2, 0.2, K);
			d.rect(980, 210, 60, 140, 1.2, 0.2, K);
			d.P(1400, 560, 1.05, q(0.3), { ...ME, look: -1.5, mouth: 'grin', armL: [1290, 520] });
			d.circle(1270, 500, 80, q(0.4), 0.2, { ...W, strokeWidth: 5 });
			d.line(1270, 500, 1270, 470, q(0.45), 0.1, { strokeWidth: 4 });
			d.text(200, 820, 'Fitness Function', 90, q(0.55));
		}),
	sc('Einer lädt die Daten des letzten Release, spielt das Update ein und vergleicht jede Zeile und jede Summe.',
		'One loads the data of the last release, applies the update and compares every row and every total.',
		(d, T) => {
			const q = (f) => f * T;
			d.db(300, 340, 260, 340, 0.2, 'Release');
			d.arrow(620, 520, 380, q(0.3));
			d.text(670, 400, 'Update', 60, q(0.35));
			d.db(1080, 340, 260, 340, q(0.45), 'neu');
			d.text(1440, 360, '= Zeilen', 70, q(0.62));
			d.text(1440, 480, '= Summen', 70, q(0.7));
			d.check(1500, 680, 110, q(0.8));
		}),
	sc('Einer zählt die Datenbankabfragen pro Seite.',
		'One counts the database queries per page.',
		(d) => {
			d.screen(260, 220, 560, 400, 0.2, { title: 'Abrechnungen' });
			[340, 420, 500].forEach((y, i) => d.line(300, y, 760 - i * 90, y, 0.6 + i * 0.1, 0.2, { stroke: GREY, strokeWidth: 4 }));
			d.arrow(880, 420, 200, 1.2);
			d.db(1140, 300, 200, 260, 1.4);
			['I', 'I', 'I'].forEach((s, i) => d.text(1440 + i * 50, 340, s, 120, 1.9 + i * 0.3));
			d.text(1400, 560, 'Abfragen: 3', 64, 2.9);
		}),
	sc('Und einer ruft jede Route ohne Anmeldung auf und erwartet eine Absage. 130 Routen.',
		'And one calls every route without login and expects a refusal. 130 routes.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(120, 820, 1800, 820, 0.2, 0.5, { stroke: GREY });
			for (let i = 0; i < 6; i++) {
				const x = 520 + i * 210;
				d.rect(x, 420, 150, 400, 0.4 + i * 0.12, 0.3, W);
				d.circle(x + 120, 620, 16, 0.6 + i * 0.12, 0.1, K);
				d.text(x + 26, 450, '401', 56, q(0.3) + i * q(0.08), RED);
			}
			d.R(280, 570, 1, 0.3, { legs: true, look: 1.5, armR: [470, 560] });
			d.text(520, 200, '130 Routen', 100, q(0.75));
		}),
	sc('Die offene Schnittstelle vom Anfang kann nicht mehr passieren.',
		'The open API from the beginning can no longer happen.',
		(d) => {
			d.apiDoor(0.2);
			d.circle(1050, 600, 18, 0.9, 0.1, K);
			d.lock(1160, 560, 1, 1.4);
			d.P(560, 590, 1, 2, { cap: 'k', dark: true, mouth: 'sad', look: -1.5 });
			d.text(320, 260, 'geschlossen', 80, 2.8, GREEN);
		}),
	sc('Die Schwellen starten beim Messwert von heute und dürfen nur besser werden. Das ist der Ratchet, die Sperrklinke.',
		'The thresholds start at today’s measurement and may only get better. That is the ratchet.',
		(d, T) => {
			const q = (f) => f * T;
			d.gear(760, 480, 210, 0.2);
			d.path('M1060 220 L1000 330 L1080 330 Z', 1.2, 0.3, R0);
			d.line(1080, 330, 1200, 200, 1.4, 0.3, { strokeWidth: 8 });
			d.path('M520 820 A320 320 0 0 1 400 520', q(0.4), 0.4, { strokeWidth: 9, stroke: GREEN });
			d.path('M380 560 L400 500 L440 560', q(0.5), 0.2, { strokeWidth: 9, stroke: GREEN });
			d.text(1250, 420, 'nur besser', 80, q(0.55), GREEN);
			d.text(1250, 560, 'nie schlechter', 80, q(0.65), RED);
			d.text(1250, 720, 'Ratchet', 90, q(0.8));
		}),
	sc('Am ersten Tag ist nichts rot, und trotzdem wird es mit jedem Pull Request besser.',
		'On the first day nothing is red, and yet it gets better with every pull request.',
		(d, T) => {
			const q = (f) => f * T;
			for (let i = 0; i < 6; i++) d.rect(300 + i * 220, 300 + i * 90, 220, 600 - i * 90, 0.2 + i * 0.12, 0.3, W);
			['PR', 'PR', 'PR', 'PR', 'PR'].forEach((s, i) => d.text(380 + (i + 1) * 220, 320 + (i + 1) * 90, s, 50, q(0.3) + i * q(0.08), GREY));
			d.P(390, 120, 0.8, q(0.25), { ...ME, look: 1.5, mouth: 'grin', noFloor: true });
		}),
	sc('Die Dateien, die das Datenmodell von Hand spiegeln, sind von 57 auf 43 gesunken.',
		'The files that mirror the data model by hand dropped from 57 to 43.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(220, 200, 'Dateien, die das Datenmodell spiegeln', 66, 0.2, GREY);
			d.text(300, 400, '57', 260, q(0.35), GREY);
			d.arrow(720, 540, 260, q(0.5));
			d.text(1080, 400, '43', 260, q(0.6), GREEN);
			d.P(1640, 560, 1, q(0.4), { ...ME, look: -1.5, mouth: 'grin' });
		}),
	sc('Die Messwerkzeuge habe ich selbst gebaut, nach meinem Bedarf.',
		'I built the measuring tools myself, for what I needed.',
		(d) => {
			d.rect(820, 140, 900, 420, 0.2, 0.5, { fill: '#e9dcc4', fillStyle: 'solid' });
			[['deepcheck', 900], ['testcheck', 1180], ['fitness', 1460]].forEach(([t, x], i) => {
				d.circle(x + 90, 210, 20, 0.6 + i * 0.3, 0.1, K);
				d.rect(x + 40, 240, 100, 180, 0.8 + i * 0.3, 0.3, W);
				d.text(x, 440, t, 52, 1 + i * 0.3);
			});
			const me = d.S(420, 520, 1.1, 1.4, { ...ME, look: 2.6, mouth: 'grin', defer: true });
			d.desk(500, 900, 690, 1.8);
			me.arms(null, 2);
			d.text(480, 900, 'selbst gebaut, nach Bedarf', 64, 2.8, RED);
		}),
	sc('«deepcheck» sucht flache Module, nach John Ousterhout: Ein gutes Modul hat eine kleine Schnittstelle und viel dahinter.',
		'"deepcheck" looks for shallow modules, after John Ousterhout: a good module has a small interface and a lot behind it.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(140, 80, 'deepcheck', 90, 0.2);
			d.rect(240, 300, 420, 520, q(0.15), 0.5, W);
			d.rect(410, 300, 80, 40, q(0.25), 0.2, K);
			d.gear(380, 540, 60, q(0.3));
			d.gear(530, 680, 50, q(0.35));
			d.gear(540, 450, 40, q(0.4));
			d.text(300, 860, 'tief', 70, q(0.45), GREEN);
			d.check(470, 900, 70, q(0.5));
			d.rect(1100, 560, 620, 120, q(0.55), 0.4, W);
			d.rect(1100, 560, 620, 40, q(0.6), 0.2, K);
			d.text(1220, 740, 'flach', 70, q(0.68), RED);
			d.cross(1500, 780, 60, q(0.72));
			d.text(1000, 240, 'kleine Schnittstelle, viel dahinter', 54, q(0.8), GREY);
		}),
	sc('«testcheck» findet Tests, die bestehen können, ohne zu prüfen, was sie behaupten.',
		'"testcheck" finds tests that can pass without checking what they claim.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(140, 80, 'testcheck', 90, 0.2);
			d.paper(420, 260, 620, 460, 0.6, { title: 'it(«zahlt korrekt»)', size: 50, lines: 0 });
			d.text(460, 400, 'expect(betrag)', 56, 1.2);
			d.check(880, 520, 100, 1.8);
			d.R(1380, 520, 1.1, q(0.35), { legs: true, glasses: true, look: -1.5, mouth: 'o', armL: [1150, 470] });
			d.circle(1060, 430, 200, q(0.5), 0.3, { strokeWidth: 8 });
			d.text(460, 760, 'prüft nichts', 80, q(0.7), RED);
		}),
	sc('Das ist die Antwort auf die Häkchen vom Januar.',
		'That is the answer to the ticks of January.',
		(d) => {
			d.text(140, 80, '23. Januar 2026', 60, 0.2, GREY);
			for (let i = 0; i < 5; i++) {
				const y = 220 + i * 120;
				d.rect(500, y, 64, 64, 0.4 + i * 0.1, 0.2);
				d.check(506, y + 32, 74, 0.8 + i * 0.1);
				d.line(600, y + 36, 1100 - ((i * 97) % 200), y + 36, 0.6 + i * 0.1, 0.2, { stroke: GREY, strokeWidth: 4 });
			}
			[1, 3].forEach((i, k) => d.text(1160, 200 + i * 120, '?', 90, 2 + k * 0.4, RED));
			d.circle(900, 520, 360, 1.7, 0.4, { strokeWidth: 8 });
			d.line(1020, 650, 1160, 790, 1.9, 0.2, { strokeWidth: 14 });
		}),
	sc('Und jeder Architekturentscheid steht in einem ADR, mit der Kennzahl vorher und nachher.',
		'And every architecture decision is recorded in an ADR, with the metric before and after.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(560, 180, 800, 640, 0.2, 0.5, { fill: '#7a5230', fillStyle: 'solid' });
			d.rect(600, 210, 720, 580, 0.5, 0.4, W);
			d.text(640, 240, 'ADR 0001', 70, 0.9);
			d.text(640, 340, 'Ein Mapper für den Mieter', 54, 1.3);
			d.text(640, 500, 'vorher:  57', 70, q(0.55), GREY);
			d.text(640, 620, 'nachher: 56', 70, q(0.68), GREEN);
		})
];
