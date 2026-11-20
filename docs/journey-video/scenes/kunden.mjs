/* global RED, GREEN, GREY, W, K, ME, HELGA, MARCO, WEBER, SVEN, ANNA */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const KUNDEN = [
	card(4, 'Kunden, die es noch nicht gibt', 'Personas'),
	sc('Tests sagen mir, ob die App tut, was im Szenario steht. Sie sagen mir nicht, ob ein Mensch damit zurechtkommt.',
		'Tests tell me whether the app does what the scenario says. They do not tell me whether a person can cope with it.',
		(d, T) => {
			const q = (f) => f * T;
			d.screen(200, 180, 620, 420, 0.2, { title: 'Tests' });
			for (let i = 0; i < 4; i++) d.check(300 + i * 120, 420, 80, 0.8 + i * 0.2);
			d.screen(1100, 180, 620, 420, q(0.5));
			d.rect(1160, 280, 500, 70, q(0.55), 0.3, { stroke: GREY });
			d.rect(1160, 380, 240, 70, q(0.58), 0.3, { stroke: GREY });
			d.P(1560, 580, 0.95, q(0.6), { mouth: 'o', brows: 'worry', look: -1.5, glasses: true });
			d.text(1640, 230, '?', 140, q(0.75), RED);
		}),
	sc('Und echte Kunden habe ich noch keine.',
		'And I do not have any real customers yet.',
		(d) => {
			[0, 1, 2, 3].forEach((i) => d.chair(520 + i * 300, 640, 1.1, 0.2 + i * 0.25, 1));
			d.line(300, 760, 1600, 760, 0.1, 0.4, { stroke: GREY, strokeWidth: 3 });
			d.rect(760, 200, 400, 120, 1.4, 0.3, W);
			d.text(800, 220, 'Kunden', 80, 1.6);
			d.path('M1360 500 L1420 560 M1380 560 L1420 520 M1400 500 L1400 580', 2.2, 0.4, { stroke: GREY, strokeWidth: 3 });
		}),
	sc('Also habe ich fünf Personas.',
		'So I have five personas.',
		(d) => {
			d.screen(120, 260, 340, 240, 0.2, { title: 'Dwello', size: 56 });
			[['Helga', HELGA, -5], ['Marco', MARCO, 9], ['Dr. Weber', WEBER, -3], ['Sven', SVEN, 4], ['Anna', ANNA, 6]].forEach(([name, o, tilt], i) => {
				const x = 660 + i * 260;
				const at = 0.5 + i * 0.3;
				d.P(x, 360, 0.85, at, { ...o, tilt, phone: name === 'Marco', cane: name === 'Sven' });
				d.text(x - name.length * 13, 660, name, 56, at + 0.5);
			});
		}),
	sc('Helga ist 68, hat eine Wohnung geerbt und wenig Erfahrung am Computer.',
		'Helga is 68, inherited an apartment and has little experience with computers.',
		(d) => {
			d.S(560, 520, 1.15, 0.2, { ...HELGA, brows: 'worry', mouth: 'flat' });
			d.desk(640, 1100, 690, 0.6);
			d.screen(1080, 170, 640, 420, 0.9);
			d.text(1130, 220, 'Mietvertrag', 110, 1.6);
			d.text(1130, 380, '150 %', 120, 2.2, RED);
			d.text(240, 120, 'Helga, 68', 80, 0.4);
		}),
	sc('Marco macht alles am Handy.',
		'Marco does everything on his phone.',
		(d) => {
			d.P(620, 560, 1.15, 0.2, { ...MARCO, mouth: 'grin', look: 1.5, tilt: 9, phone: true });
			d.rect(1040, 160, 360, 700, 0.8, 0.5, { ...W, strokeWidth: 9 });
			d.rect(1180, 190, 80, 16, 1.1, 0.1, K);
			[260, 360, 460].forEach((y, i) => d.rect(1080, y, 280, 70, 1.3 + i * 0.2, 0.2, { stroke: GREY }));
			d.rect(1080, 720, 280, 90, 2, 0.2, { fill: '#1f8a4c', fillStyle: 'solid', stroke: '#1f8a4c' });
			d.text(1460, 400, '390 px', 70, 2.4, GREY);
			d.text(240, 120, 'Marco, 38', 80, 0.4);
		}),
	sc('Doktor Weber liest jedes Wort und rechnet nach.',
		'Dr. Weber reads every word and recalculates.',
		(d, T, a, ROOT) => {
			d.P(470, 560, 1.15, 0.2, { ...WEBER, look: 1.5 });
			d.photo(ROOT + 'marketing/shots/pdf-page-1.webp', 760, 120, 460, 1, -2);
			d.rect(1380, 420, 200, 280, 1.8, 0.3, K);
			for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) d.rect(1405 + c * 56, 530 + r * 52, 40, 38, 2 + (r * 3 + c) * 0.04, 0.05, W);
			d.rect(1405, 445, 150, 60, 2, 0.1, { fill: '#cfe9d6', fillStyle: 'solid' });
			d.text(1640, 400, '?', 130, 3);
			d.text(140, 120, 'Dr. Weber, 52', 80, 0.4);
		}),
	sc('Sven ist blind und arbeitet nur mit Tastatur und Screenreader.',
		'Sven is blind and works with keyboard and screen reader only.',
		(d) => {
			d.S(520, 520, 1.15, 0.2, { ...SVEN, mouth: 'flat', look: 0 });
			d.desk(600, 1100, 690, 0.6);
			d.rect(700, 660, 260, 30, 1, 0.2, K);
			d.screen(1080, 200, 560, 380, 1.2);
			d.path('M1560 300 L1600 300 L1650 260 L1650 380 L1600 340 L1560 340 Z', 1.8, 0.3, K);
			d.say(1000, 160, 620, 150, 'Schaltfläche «Löschen»', 50, 2.4, [1500, 300]);
			d.text(240, 120, 'Sven, 45', 80, 0.4);
		}),
	sc('Und Anna kommt nach Monaten zurück und weiss nichts mehr.',
		'And Anna comes back after months and remembers nothing.',
		(d) => {
			d.line(160, 880, 1780, 880, 0.2, 0.5, { stroke: GREY });
			d.rect(380, 280, 300, 600, 0.3, 0.5, W);
			d.path('M680 280 L780 330 L780 900 L680 880 Z', 0.7, 0.4, W);
			d.P(980, 590, 1.05, 1, { ...ANNA, mouth: 'o', brows: 'up', look: 1.5 });
			['Mär', 'Jun', 'Sep'].forEach((m, i) => {
				d.rect(1250 + i * 150, 220 + i * 40, 120, 120, 1.8 + i * 0.3, 0.2, { ...W, tf: `rotate(${i * 7 - 6} ${1310 + i * 150} ${280 + i * 40})` });
				d.text(1270 + i * 150, 250 + i * 40, m, 48, 1.9 + i * 0.3, GREY);
			});
			d.text(1040, 300, '?', 140, 3, RED);
			d.text(240, 120, 'Anna, 29', 80, 0.4);
		}),
	sc('Das sind KI-Agenten. Sie bekommen eine Aufgabe, bedienen die laufende App und schreiben einen Bericht.',
		'These are AI agents. They get a task, operate the running app and write a report.',
		(d, T) => {
			const q = (f) => f * T;
			d.R(470, 470, 1.1, 0.2, { legs: true, look: 1.5, mouth: 'grin' });
			d.P(400, 600, 0.9, 0.9, { ...HELGA, look: 1.5, noFloor: true, tilt: -4 });
			d.paper(780, 240, 300, 200, q(0.3), { title: 'Aufgabe', size: 50 });
			d.arrow(1110, 340, 120, q(0.42));
			d.screen(1260, 200, 260, 180, q(0.45), { noStand: true });
			d.arrow(1300, 430, 120, q(0.6), 90);
			d.paper(1200, 580, 360, 300, q(0.68), { title: 'Bericht', size: 54, lines: 5 });
		}),
	sc('Sven hat gemerkt, dass ein wichtiger Hinweis im Löschdialog nicht vorgelesen wird.',
		'Sven noticed that an important notice in the delete dialog is not read aloud.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(260, 180, 900, 560, 0.2, 0.5, { ...W, strokeWidth: 7 });
			d.text(300, 210, 'Rechnung löschen?', 66, 0.6);
			[320, 370].forEach((y, i) => d.line(300, y, 1060 - i * 200, y, 0.9 + i * 0.1, 0.2, { strokeWidth: 4 }));
			[470, 520, 570].forEach((y, i) => d.line(300, y, 1000 - i * 160, y, q(0.35) + i * 0.1, 0.2, { strokeWidth: 4, stroke: '#c7c7c7' }));
			d.path('M1080 480 L1110 480 L1150 450 L1150 560 L1110 530 L1080 530 Z', q(0.45), 0.3, K);
			d.cross(1190, 505, 50, q(0.5));
			d.text(300, 610, 'Bewahren Sie die Originalrechnung auf …', 40, q(0.55), GREY);
			d.P(1500, 560, 1.05, q(0.3), { ...SVEN, mouth: 'flat', look: -1.5, cane: true });
			d.say(1460, 210, 400, 150, '… wird gelöscht.', 46, q(0.7), [1470, 330]);
		}),
	sc('Das sieht kein Test und kein Code-Review.',
		'No test and no code review sees that.',
		(d) => {
			d.text(260, 260, 'Test', 80, 0.2);
			d.check(520, 320, 90, 0.7);
			d.text(260, 420, 'Code-Review', 80, 0.9);
			d.check(760, 480, 90, 1.4);
			d.paper(1100, 220, 520, 560, 1.6, { title: 'Bericht von Sven', size: 52, lines: 0 });
			d.text(1140, 330, 'P-1  Major', 64, 2.2, RED);
			d.text(1140, 420, 'Hinweis wird', 54, 2.5);
			d.text(1140, 490, 'nicht vorgelesen', 54, 2.7);
		}),
	sc('So sind 684 Persona-Berichte entstanden.',
		'That is how 684 persona reports came about.',
		(d) => {
			for (let i = 0; i < 12; i++) d.rect(700 + ((i * 29) % 40) - 20, 840 - i * 44, 420, 40, 0.2 + i * 0.1, 0.12, W);
			d.text(1240, 380, '684', 200, 1.6);
			d.text(1240, 620, 'Persona-Berichte', 70, 2.2, GREY);
		}),
	sc('Das ersetzt echte Kunden nicht ganz. Aber es findet viel von dem, was man sonst erst im ersten Kundengespräch erfährt.',
		'That does not fully replace real customers. But it finds much of what you would otherwise only learn in the first customer conversation.',
		(d, T) => {
			const q = (f) => f * T;
			d.S(500, 520, 1.15, 0.2, { ...ME, mouth: 'flat', look: 2.6 });
			d.paper(640, 480, 220, 260, 0.8, { title: 'Bericht', size: 40, lines: 4, tf: '' });
			d.chair(1400, 640, 1.1, q(0.2), -1);
			d.text(1250, 300, 'Kunde (noch nicht)', 60, q(0.25), GREY);
			d.text(560, 160, 'findet viel davon vorher', 70, q(0.6), GREEN);
		})
];
