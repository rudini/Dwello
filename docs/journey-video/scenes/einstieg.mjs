/* global INK, RED, GREEN, GREY, W, K, ME */
// fallow-ignore-file unused-file
import { sc } from './common.mjs';

export const EINSTIEG = [
	sc('Ende September öffne ich nach Monaten wieder meine eigene App und klicke mich durch. Sie sieht fertig aus.',
		'At the end of September I open my own app again after months and click through it. It looks finished.',
		(d) => {
			d.text(120, 60, '26. September 2026', 60, 0.2, GREY);
			d.S(470, 520, 1.15, 0.4, { ...ME, mouth: 'grin' });
			d.desk(560, 1000, 690, 0.8);
			d.laptop(840, 690, 1.2, -1);
			d.screen(1120, 170, 640, 420, 2, { title: 'Dwello' });
			d.rect(1160, 270, 260, 140, 2.6, 0.4, { stroke: GREY });
			d.rect(1460, 270, 260, 140, 2.8, 0.4, { stroke: GREY });
			[450, 500, 545].forEach((y, i) => d.line(1160, y, 1700 - i * 120, y, 3 + i * 0.15, 0.3, { stroke: GREY, strokeWidth: 3.5 }));
			d.check(1620, 520, 120, 4.2);
			d.say(1000, 260, 330, 150, 'Sieht gut aus.', 50, 5, [760, 420]);
		}),
	sc('Ich beende einen Mietvertrag. Der Knopf zeigt eine Erfolgsmeldung.',
		'I end a rental contract. The button shows a success message.',
		(d) => {
			d.screen(240, 110, 1060, 640, 0.2, { title: 'Mietvertrag Wohnung 1.01', noStand: true });
			[230, 290, 350].forEach((y, i) => d.line(280, y, 1100 - i * 160, y, 0.7 + i * 0.1, 0.3, { stroke: GREY, strokeWidth: 3.5 }));
			d.rect(300, 450, 560, 120, 1.2, 0.4, { strokeWidth: 7 });
			d.text(340, 468, 'Mietvertrag beenden', 64, 1.5);
			d.path('M820 520 L820 600 L842 580 L858 616 L872 610 L856 574 L886 574 Z', 2.4, 0.3, { ...W, strokeWidth: 4 });
			[[800, 500, 780, 470], [830, 494, 830, 462], [858, 500, 878, 472]].forEach(([a, b, c, e], i) => d.line(a, b, c, e, 2.8 + i * 0.05, 0.1, { strokeWidth: 4 }));
			d.rect(700, 620, 560, 100, 3.3, 0.3, { stroke: GREEN, strokeWidth: 6, fill: '#e9f5ee', fillStyle: 'solid' });
			d.text(740, 640, '✓ Erfolgreich beendet', 58, 3.6, GREEN);
			d.P(1560, 560, 1.05, 0.6, { ...ME, mouth: 'grin', look: -1.5, hip: true });
		}),
	sc('Im Code dahinter steht: 500 Millisekunden warten. Sonst nichts.',
		'In the code behind it: wait 500 milliseconds. Nothing else.',
		(d) => {
			d.line(160, 760, 1780, 760, 0.2, 0.6, { stroke: GREY });
			const me = d.P(430, 410, 1.15, 0.4, { ...ME, mouth: 'o', brows: 'up', look: 1, defer: true, noFloor: true });
			d.line(830, 360, 1010, 760, 1.2, 0.3, { stroke: GREY });
			d.line(830, 560, 930, 760, 1.3, 0.3, { stroke: GREY });
			d.rect(790, 200, 40, 560, 1.5, 0.6, W);
			d.text(700, 120, 'die App', 60, 1.8, GREY);
			d.rect(752, 480, 38, 60, 2, 0.3, { stroke: RED, fill: '#fff', fillStyle: 'solid' });
			me.arms(null, [742, 510], 2.4);
			d.line(850, 510, 1170, 510, 2.8, 0.5, { stroke: RED, strokeLineDash: [16, 16] });
			d.text(1200, 450, '?', 130, 3.2, RED);
			d.text(1010, 300, '500 ms warten …', 70, 3.5, RED);
			d.path('M1420 700 C1380 650 1470 620 1490 670 C1510 730 1410 740 1430 680 C1445 650 1480 660 1470 690', 3.9, 0.6, { stroke: GREY });
			d.text(1350, 550, 'sonst nichts', 64, 4.3, GREY);
			d.text(540, 220, '?!', 120, 4.8, RED);
		}),
	sc('In der Nebenkostenabrechnung bezahlt jeder Mieter die Kosten des ganzen Gebäudes.',
		'In the utility cost statement every tenant pays the costs of the whole building.',
		(d) => {
			d.house(220, 380, 600, 500, 0.2);
			d.line(520, 380, 520, 880, 0.8, 0.3);
			d.line(220, 630, 820, 630, 0.9, 0.3);
			[[370, 470], [670, 470], [370, 720], [670, 720]].forEach(([x, y], i) => {
				d.P(x - 60, y - 10, 0.42, 1.2 + i * 0.3, { pose: 'sit', mouth: 'o', brows: 'up', look: 1, noFloor: true });
				d.text(x - 10, y - 30, '4’000', 62, 3.6 + i * 0.35, RED);
			});
			d.paper(1020, 250, 420, 270, 1.4, { title: 'Heizöl 2024', texts: ['CHF 4’000'], tsize: 70, lines: 0 });
			d.text(1020, 600, '4 × 4’000 = 16’000 ?!', 88, 5.2, RED);
			d.text(1020, 720, '(Zahlen als Beispiel)', 44, 5.8, GREY);
		}),
	sc('Die Heizprofile ergeben 90 Prozent statt 100.',
		'The heating profiles add up to 90 percent instead of 100.',
		(d) => {
			d.text(170, 160, 'Heizprofil: zwölf Monate', 56, 0.2, GREY);
			d.rect(170, 260, 900, 130, 0.4, 0.7, { strokeWidth: 6 });
			d.rect(170, 260, 810, 130, 1, 0.9, { fill: INK, fillStyle: 'hachure', hachureGap: 14, stroke: 'none' });
			d.rect(980, 260, 90, 130, 2, 0.5, { fill: RED, fillStyle: 'cross-hatch', hachureGap: 10, stroke: RED });
			for (let i = 1; i < 12; i++) d.line(170 + i * 75, 390, 170 + i * 75, 412, 1.3 + i * 0.04, 0.05, { strokeWidth: 3 });
			d.text(470, 430, '90 %', 96, 2.4);
			d.text(890, 430, 'nie verrechnet', 62, 3, RED);
			d.P(1480, 520, 1.1, 0.6, { ...ME, mouth: 'flat', brows: 'worry', look: -1.5, armR: [1556, 456] });
		}),
	sc('Und die ganze Schnittstelle ist offen, ohne Anmeldung.',
		'And the whole API is open, without a login.',
		(d) => {
			d.apiDoor(0.2);
			d.path('M1000 300 L860 360 L860 900 L1000 880 Z', 0.9, 0.4, W);
			d.circle(890, 620, 18, 1.2, 0.1, K);
			d.paper(1380, 470, 230, 120, 1.7, { texts: ['Bitte klingeln'], tsize: 40, lines: 0 });
			d.P(640, 590, 1, 2.2, { cap: 'k', dark: true, mouth: 'grin', look: 1, armR: [730, 760] });
			d.path('M690 760 C640 780 650 880 730 880 C820 880 820 780 770 760 Z', 3.2, 0.4, W);
			d.text(690, 800, 'Daten', 38, 3.6);
			d.text(200, 260, 'offen, ohne Anmeldung', 70, 4, RED);
		}),
	sc('Dabei hatte mir der Assistent acht Monate vorher gemeldet: Phase abgeschlossen. Über sechzig Häkchen gesetzt.',
		'Yet eight months earlier the assistant had reported: phase complete. More than sixty boxes ticked.',
		(d) => {
			d.text(120, 60, '23. Januar 2026, 23:42', 60, 0.2, GREY);
			const me = d.S(330, 500, 1.05, 0.4, { ...ME, mouth: 'grin', defer: true });
			d.desk(410, 760, 650, 0.8);
			me.arms(null, 1.2);
			d.R(1170, 480, 1.15, 1.4, { legs: true, look: -1.5, tilt: -4, mouth: 'grin', armL: [1020, 620] });
			d.rect(870, 470, 160, 220, 2.2, 0.4, W);
			[515, 575, 635].forEach((y, i) => d.check(895, y, 70, 2.8 + i * 0.25));
			d.say(1420, 230, 360, 170, 'Fertig!', 92, 3.6, [1260, 340]);
			d.say(560, 260, 300, 150, 'Super!', 80, 5, [420, 380]);
			d.stamp(1390, 640, 'COMPLETE', 90, 6.2);
		}),
	sc('Ich bin Roger. Das ist die Geschichte, wie ich gelernt habe, Code zu vertrauen, den ich nicht selbst geschrieben habe.',
		'I am Roger. This is the story of how I learned to trust code I did not write myself.',
		(d) => {
			d.P(320, 520, 1.2, 0.2, { ...ME, mouth: 'grin', look: 1, armR: [440, 330] });
			d.text(620, 230, 'Wie vertraut man Code,', 120, 2.2);
			d.text(620, 390, 'den man nicht selbst', 120, 3.6);
			d.text(620, 550, 'geschrieben hat?', 120, 5);
			d.path('M960 370 C1050 385 1150 360 1260 378', 7, 0.4, { stroke: RED, strokeWidth: 8 });
		})
];
