/* global RED, GREEN, GREY, W, K, ME */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const FERTIG = [
	card(2, '«Fertig» prüfbar machen', 'September 2026'),
	sc('Nach dem Durchklicken im September ist klar: Ich kann nicht jede Zeile lesen, die ein Agent schreibt.',
		'After clicking through in September it is clear: I cannot read every line an agent writes.',
		(d, T) => {
			const q = (f) => f * T;
			for (let i = 0; i < 16; i++) d.rect(760 + ((i * 37) % 30) - 15, 840 - i * 40, 340, 36, 0.2 + i * q(0.03), 0.15, W);
			d.P(500, 560, 1.05, 0.3, { ...ME, mouth: 'o', brows: 'worry', look: 1.5 });
			d.R(1340, 380, 1, q(0.4), { legs: true, look: -1.5, mouth: 'grin', armL: [1150, 230] });
			d.rect(1060, 170, 260, 36, q(0.55), 0.2, W);
		}),
	sc('Also brauche ich etwas anderes, dem ich vertrauen kann.',
		'So I need something else I can trust.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(620, 560, 1.15, 0.2, { ...ME, mouth: 'flat', look: 1.5, armR: [700, 470] });
			d.thought(1240, 330, 620, 400, q(0.2), [780, 440]);
			d.text(1200, 200, '?', 200, q(0.3));
			d.check(1340, 330, 200, q(0.65));
		}),
	sc('Das Erste ist ATDD, Acceptance Test-Driven Development. Bevor Code entsteht, steht ein Szenario da. Auf Deutsch, in der Sprache des Fachs: Angenommen, wenn, dann.',
		'The first is ATDD, acceptance test-driven development. Before code exists, there is a scenario. In German, in the language of the domain: given, when, then.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(120, 70, 'ATDD', 140, 0.2);
			d.text(125, 230, 'Acceptance Test-Driven Development', 54, 0.8, GREY);
			d.S(300, 560, 1, q(0.25), { ...ME, look: 2.6, stick: [480, 680] });
			d.desk(370, 640, 720, q(0.3));
			d.paper(760, 320, 1040, 500, q(0.4), { title: 'Szenario: Eine Nachzahlung unter 5 Rappen …', size: 44, lines: 0 });
			d.text(800, 430, 'Angenommen eine Heizkostenrechnung über 4 Franken', 42, q(0.55), GREEN);
			d.text(800, 530, 'Wenn der Verwalter die Vorschau öffnet', 42, q(0.63), GREEN);
			d.text(800, 630, 'Dann ist der Saldo «Ausgeglichen CHF 0.00»', 42, q(0.71), GREEN);
		}),
	sc('Dieses Szenario ist ausführbar. Es bedient die echte App mit echter Datenbank.',
		'This scenario is executable. It operates the real app with a real database.',
		(d, T, a, ROOT) => {
			const q = (f) => f * T;
			d.paper(120, 320, 380, 440, 0.2, { title: 'Szenario', size: 54 });
			d.path('M240 560 L240 700 L360 630 Z', 0.9, 0.3, { fill: '#1f8a4c', fillStyle: 'solid', stroke: '#1f8a4c' });
			d.arrow(560, 540, 170, q(0.3));
			d.photo(ROOT + 'marketing/shots/statement-light.webp', 800, 300, 620, q(0.4), -2);
			d.arrow(1460, 540, 140, q(0.6));
			d.db(1630, 430, 200, 230, q(0.65), 'DB');
			d.text(800, 760, 'die echte App', 56, q(0.5), GREY);
		}),
	sc('Damit wird eine Anforderung testbar. Ich muss nicht mehr glauben, dass etwas funktioniert. Ich sehe es laufen.',
		'That makes a requirement testable. I no longer have to believe that something works. I see it run.',
		(d, T) => {
			const q = (f) => f * T;
			d.S(500, 540, 1.15, 0.2, { ...ME, mouth: 'grin', arm: [640, 640] });
			d.screen(900, 150, 760, 520, 0.6, { title: 'Szenarien' });
			for (let i = 0; i < 5; i++) {
				d.line(960, 270 + i * 80, 1450 - (i % 3) * 90, 270 + i * 80, q(0.2) + i * q(0.1), 0.2, { stroke: GREY, strokeWidth: 4 });
				d.check(1520, 270 + i * 80, 60, q(0.25) + i * q(0.1));
			}
		}),
	sc('Ein neues Szenario trägt die Markierung «wip», in Arbeit.',
		'A new scenario carries the tag "wip", work in progress.',
		(d) => {
			d.paper(560, 200, 520, 640, 0.2, { title: 'Szenario', size: 56, lines: 6 });
			d.line(1080, 330, 1180, 330, 1.2, 0.2, { strokeWidth: 3 });
			d.tag(1180, 330, '@wip', 1.4);
			d.path('M1300 860 L1400 560 L1500 860 Z', 2, 0.4, { fill: '#f08a24', fillStyle: 'solid' });
			d.rect(1338, 700, 124, 36, 2.3, 0.2, W);
			d.R(330, 520, 1, 0.8, { legs: true, look: 1.5, hat: true });
		}),
	sc('Der Agent muss es zuerst scheitern sehen, und zwar am fehlenden Verhalten.',
		'The agent must first see it fail, at the missing behaviour.',
		(d) => {
			d.R(420, 520, 1.1, 0.2, { legs: true, look: 1.5, mouth: 'o', hat: true });
			d.paper(720, 280, 640, 460, 0.6, { title: 'Szenario', size: 56, lines: 0 });
			['Angenommen …', 'Wenn …', 'Dann …'].forEach((s, i) => d.text(760, 380 + i * 100, s, 52, 1 + i * 0.3));
			d.cross(1120, 620, 70, 2.2);
			d.light(1500, 300, 1.4, 1.2, 2.4);
			d.text(1440, 560, 'rot: es fehlt', 56, 3, RED);
		}),
	sc('Dann baut er testgetrieben, rot, grün, ein Verhalten nach dem anderen.',
		'Then it builds test-driven, red, green, one behaviour at a time.',
		(d, T) => {
			const q = (f) => f * T;
			d.text(140, 80, 'TDD', 120, 0.2);
			d.R(260, 520, 1, 0.4, { legs: true, look: 1.5, mouth: 'grin', hat: true });
			for (let i = 0; i < 4; i++) {
				const t0 = q(0.25) + i * q(0.16);
				d.light(560 + i * 300, 300, 1.4, t0, t0 + 0.1, t0 + q(0.1));
			}
		}),
	sc('Und jetzt der wichtige Teil: Sobald ein Szenario umgesetzt ist, darf der Agent es nicht mehr selbständig ändern.',
		'And now the important part: once a scenario is implemented, the agent may no longer change it on its own.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(1020, 160, 600, 640, 0.2, 0.5, { strokeWidth: 9 });
			d.paper(1080, 220, 480, 520, 0.6, { title: 'Szenario', size: 54, lines: 5 });
			d.check(1420, 300, 80, 1.2);
			d.lock(1320, 790, 0.9, q(0.35));
			d.R(560, 520, 1.1, q(0.25), { legs: true, look: 1.5, mouth: 'o', armR: [760, 560] });
			d.rect(760, 520, 90, 60, q(0.3), 0.2, { fill: '#f4b6c2', fillStyle: 'solid' });
			d.cross(900, 400, 110, q(0.6));
			d.text(760, 200, 'Halt!', 90, q(0.62), RED);
		}),
	sc('Wird es rot, wird der Code geflickt, nicht das Szenario.',
		'If it turns red, the code gets fixed, not the scenario.',
		(d) => {
			d.paper(160, 220, 420, 520, 0.2, { title: 'Szenario', size: 54, lines: 5 });
			d.lock(370, 780, 0.8, 0.8);
			d.gear(1200, 450, 170, 1);
			d.text(1135, 420, 'Code', 64, 1.6);
			d.R(820, 520, 1.1, 1.4, { legs: true, look: 1.5, mouth: 'grin', hat: true, armR: [960, 470], stick: [1040, 380] });
			d.check(1450, 300, 120, 3.2);
		}),
	sc('Eine Änderung braucht meinen Entscheid in einem Issue, und die CI prüft, ob er im Pull Request steht.',
		'A change needs my decision in an issue, and CI checks that it is in the pull request.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(240, 560, 1.05, 0.2, { ...ME, look: 1.5, armR: [380, 560] });
			d.paper(400, 360, 360, 420, 0.6, { title: 'Issue #n', size: 50, lines: 4 });
			d.stamp(420, 620, 'entschieden', 52, q(0.3), GREEN, -6);
			d.arrow(820, 560, 180, q(0.45));
			d.gate(1120, 560, 420, q(0.5), true, 'CI');
			d.paper(1260, 260, 520, 170, q(0.65), { texts: ['Spec change approved: #n'], tsize: 44, lines: 0 });
			d.check(1600, 520, 110, q(0.85));
		}),
	sc('Heute sind das rund 1’380 Szenarien. Sie sind die Spezifikation.',
		'Today there are about 1,380 scenarios. They are the specification.',
		(d) => {
			d.rect(700, 260, 420, 600, 0.2, 0.5, W);
			[0, 1, 2].forEach((i) => {
				d.rect(730, 290 + i * 190, 360, 160, 0.6 + i * 0.2, 0.3, W);
				d.rect(860, 350 + i * 190, 100, 30, 0.8 + i * 0.2, 0.2, K);
			});
			d.text(700, 120, '1’380 Szenarien', 100, 1.6);
			d.P(1360, 560, 1.1, 1.8, { ...ME, mouth: 'grin', look: -1.5, armL: [1130, 520] });
			d.text(1260, 220, 'die Spezifikation', 60, 3, RED);
		}),
	sc('Dazu kommt ein Glossar. Mieter, Mietvertrag, Akonto, Nebenkostenabrechnung: Jeder Begriff ist einmal festgelegt, und Code, Tests und Bildschirm benutzen dasselbe Wort.',
		'Then there is a glossary. Tenant, rental contract, advance payment, utility cost statement: each term is defined once, and code, tests and screen use the same word.',
		(d, T) => {
			const q = (f) => f * T;
			d.path('M220 300 Q420 250 620 300 L620 760 Q420 710 220 760 Z', 0.2, 0.5, W);
			d.path('M620 300 Q820 250 1020 300 L1020 760 Q820 710 620 760 Z', 0.3, 0.5, W);
			d.text(320, 180, 'Glossar', 90, 0.6);
			['Mieter', 'Mietvertrag', 'Akonto', 'Nebenkosten-'].forEach((s, i) => d.text(270, 340 + i * 90, s, 52, q(0.1) + i * q(0.08)));
			d.text(270, 700, 'abrechnung', 52, q(0.42));
			['Code', 'Tests', 'Bildschirm'].forEach((s, i) => {
				const y = 260 + i * 200;
				d.arrow(1060, y + 60, 150, q(0.62) + i * q(0.08));
				d.rect(1260, y, 420, 130, q(0.64) + i * q(0.08), 0.3, W);
				d.text(1290, y + 30, s, 60, q(0.66) + i * q(0.08));
				d.check(1590, y + 70, 60, q(0.7) + i * q(0.08));
			});
		}),
	sc('Bleibt die Frage, woher der Agent weiss, was ich will.',
		'That leaves the question of how the agent knows what I want.',
		(d) => {
			d.R(820, 470, 1.3, 0.2, { legs: true, mouth: 'o', tilt: -8, armR: [930, 380] });
			[[1020, 160, 140], [1160, 220, 110], [880, 120, 100]].forEach(([x, y, s], i) => d.text(x, y, '?', s, 1.2 + i * 0.3));
		}),
	sc('Meine Aufgaben beschreiben das Ziel: was der Vermieter am Ende sieht, nicht wo ein Knopf hinkommt.',
		'My tasks describe the goal: what the landlord sees in the end, not where a button goes.',
		(d, T) => {
			const q = (f) => f * T;
			d.paper(160, 220, 640, 560, 0.2, { title: 'Issue: Done means', size: 50, lines: 0 });
			d.text(200, 340, 'Der Vermieter sieht vor', 48, q(0.3));
			d.text(200, 410, 'dem Speichern, dass …', 48, q(0.36));
			[300, 210, 120].forEach((r, i) => d.circle(1250, 470, r * 2, q(0.15) + i * 0.2, 0.4, { strokeWidth: 6, stroke: i === 2 ? RED : '#16181d' }));
			d.arrow(1600, 300, 330, q(0.5), 140);
			d.rect(1500, 700, 200, 70, q(0.7), 0.2, { stroke: GREY });
			d.text(1520, 712, 'Knopf', 44, q(0.72), GREY);
			d.cross(1600, 735, 110, q(0.8));
		}),
	sc('Und bevor die Arbeit beginnt, lasse ich mich ausfragen. Der Skill heisst «grill me».',
		'And before the work begins, I let myself be questioned. The skill is called "grill me".',
		(d, T) => {
			const q = (f) => f * T;
			const me = d.S(480, 520, 1.1, 0.2, { ...ME, look: 2.6, defer: true });
			d.desk(560, 1080, 680, 0.6);
			me.arms(null, 0.9);
			d.R(1220, 470, 1.15, 0.8, { legs: true, look: -1.5, armL: [1090, 660] });
			[[1060, 200, 110], [1180, 140, 140], [1320, 210, 110]].forEach(([x, y, s], i) => d.text(x, y, '?', s, q(0.3) + i * 0.3));
			d.text(1460, 470, '«grill me»', 80, q(0.62));
			d.rect(1520, 640, 220, 30, q(0.66), 0.2, K);
			[1550, 1600, 1650, 1700].forEach((x, i) => d.line(x, 630, x, 670, q(0.68) + i * 0.05, 0.05, { stroke: '#fff', strokeWidth: 4 }));
			d.line(1560, 670, 1540, 780, q(0.7), 0.1);
			d.line(1700, 670, 1720, 780, q(0.7), 0.1);
			d.path('M1580 620 C1560 580 1600 560 1580 520 M1640 620 C1620 580 1660 560 1640 520', q(0.74), 0.5, { stroke: GREY, strokeWidth: 3.5 });
		}),
	sc('Der Agent liest das Issue und den Code und stellt mir Fragen, höchstens vier pro Runde, bis jede Entscheidung getroffen ist.',
		'The agent reads the issue and the code and asks me questions, at most four per round, until every decision is made.',
		(d, T) => {
			const q = (f) => f * T;
			d.R(240, 520, 1, 0.2, { legs: true, look: 1.5, mouth: 'grin' });
			[0, 1, 2, 3].forEach((i) => {
				const x = 520 + i * 290;
				d.rect(x, 260, 250, 320, q(0.15) + i * q(0.08), 0.3, { ...W, tf: `rotate(${i * 3 - 4} ${x + 125} 420)` });
				d.text(x + 30, 280, `Frage ${i + 1}`, 50, q(0.18) + i * q(0.08));
				d.text(x + 90, 360, '?', 110, q(0.2) + i * q(0.08));
				d.check(x + 70, 640, 90, q(0.55) + i * q(0.08));
			});
			d.P(1720, 560, 1, q(0.45), { ...ME, look: -1.5, mouth: 'grin' });
		}),
	sc('Die Antworten stehen danach im Issue.',
		'Afterwards the answers are in the issue.',
		(d) => {
			d.paper(560, 160, 800, 680, 0.2, { title: 'Issue #n', size: 56, lines: 0 });
			d.text(600, 290, 'Decided (product owner)', 54, 0.8, GREEN);
			for (let i = 0; i < 5; i++) {
				d.text(600, 390 + i * 80, '–', 50, 1.3 + i * 0.3);
				d.line(650, 420 + i * 80, 1260 - ((i * 70) % 200), 420 + i * 80, 1.35 + i * 0.3, 0.25, { strokeWidth: 4 });
			}
		}),
	sc('Das mache ich oft für einen ganzen Stapel offener Issues auf einmal. Jedes, dem noch ein Entscheid fehlt, trägt ein Etikett.',
		'I often do this for a whole stack of open issues at once. Each one still missing a decision carries a label.',
		(d, T) => {
			const q = (f) => f * T;
			for (let i = 0; i < 6; i++) {
				const x = 300 + i * 30;
				const y = 700 - i * 100;
				d.rect(x, y, 600, 80, q(0.08) + i * q(0.05), 0.2, W);
				d.text(x + 24, y + 12, `Issue ${i + 1}`, 44, q(0.1) + i * q(0.05));
				if (i % 2 === 0 || i === 5) d.tag(x + 620, y + 40, 'needs-decision', q(0.6) + i * q(0.04));
			}
		}),
	sc('In einer Sitzung kläre ich die fachlichen Fragen. Danach arbeiten mehrere Agenten diese Issues parallel ab, fast ohne Rückfragen.',
		'In one session I settle the domain questions. Then several agents work through these issues in parallel, almost without questions.',
		(d, T) => {
			const q = (f) => f * T;
			const me = d.P(300, 430, 1.05, 0.2, { ...ME, pose: 'sit', chair: true, tilt: 6, look: 1, defer: true });
			const bot = d.R(740, 440, 1.05, 0.5, { defer: true, look: -1, tilt: -5 });
			d.line(360, 710, 340, 860, 0.8, 0.2);
			d.line(680, 710, 700, 860, 0.85, 0.2);
			d.ellipse(520, 650, 660, 170, 0.9, 0.6, W);
			[[430, 630], [530, 650], [620, 625]].forEach(([x, y], i) => d.path(`M${x} ${y} l70 -12 l22 40 l-72 14 Z`, 1.2 + i * 0.1, 0.2, W));
			me.arms([260, 620], [415, 628], 1.4);
			bot.arms([650, 622], [800, 625], 1.5);
			d.say(260, 200, 240, 130, '✓', 100, q(0.3), [290, 300], GREEN);
			d.arrow(950, 570, 150, q(0.5));
			[190, 440, 690].forEach((y, i) => {
				d.R(1290, y, 0.7, q(0.55) + i * 0.4, { look: 1, tilt: [4, -3, 6][i] });
				d.rect(1190, y + 118, 380, 16, q(0.58) + i * 0.4, 0.3, W);
				d.path(`M1400 ${y + 118} l12 -62 l106 0 l12 62 Z`, q(0.6) + i * 0.4, 0.2, W);
				d.text(1600, y + 30, '✓ PR', 70, q(0.75) + i * 0.3, GREEN);
			});
		}),
	sc('Meine Zeit ist der Engpass, also bündle ich sie am Anfang. An einem einzelnen Tag sind so 55 Pull Requests gemergt worden.',
		'My time is the bottleneck, so I bundle it at the start. On a single day 55 pull requests were merged this way.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(300, 560, 1.05, 0.2, { ...ME, look: 1.5, mouth: 'flat' });
			d.path('M520 300 L720 300 L640 470 L720 640 L520 640 L600 470 Z', 0.6, 0.6, W);
			d.path('M560 340 L680 340 L620 450 Z', 1, 0.3, { fill: '#e8c547', fillStyle: 'solid' });
			d.path('M560 630 L680 630 L620 560 Z', 1.2, 0.3, { fill: '#e8c547', fillStyle: 'solid' });
			d.text(900, 240, '55', 260, q(0.55));
			d.text(900, 560, 'Pull Requests', 80, q(0.62));
			d.text(900, 670, 'an einem Tag', 80, q(0.68), GREY);
		})
];
