/* global RED, GREEN, GREY, W, K, ME */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const PRUEFEN = [
	card(3, 'Wer baut, prüft nicht', 'Reviewer mit frischem Kontext'),
	sc('Ein Agent, der gerade etwas gebaut hat, findet es gut. Das ist bei Menschen nicht anders.',
		'An agent that has just built something thinks it is good. People are no different.',
		(d, T) => {
			const q = (f) => f * T;
			[0, 1, 2, 3, 4].forEach((i) => d.rect(560 + i * 9 * (i % 2 ? -1 : 1), 760 - i * 90, 200, 90, 0.4 + i * 0.15, 0.2, { ...W, tf: `rotate(${(i - 2) * 4} ${660} ${805 - i * 90})` }));
			d.R(330, 520, 1.1, 0.2, { legs: true, mouth: 'grin', look: 1.5, armR: [520, 560] });
			d.say(380, 220, 300, 140, 'Perfekt!', 64, 1.4, [380, 340]);
			[0, 1, 2].forEach((i) => d.rect(1300 + i * 12 * (i % 2 ? -1 : 1), 760 - i * 90, 180, 90, q(0.55) + i * 0.15, 0.2, { ...W, tf: `rotate(${(i - 1) * 6} 1390 ${805 - i * 90})` }));
			d.P(1640, 560, 1.05, q(0.55), { ...ME, mouth: 'grin', look: -1.5, armL: [1490, 610] });
			d.say(1640, 230, 300, 140, 'Super!', 64, q(0.7), [1640, 360]);
		}),
	sc('Darum prüft bei mir nie der, der gebaut hat.',
		'That is why the one who built it never checks it.',
		(d) => {
			d.R(500, 520, 1.15, 0.2, { legs: true, hat: true, look: 1.5, mouth: 'grin' });
			d.text(420, 860, 'baut', 64, 1);
			d.line(960, 140, 960, 900, 1.2, 0.5, { strokeLineDash: [20, 18], stroke: GREY });
			d.R(1420, 520, 1.15, 1.6, { legs: true, glasses: true, look: -1.5, mouth: 'flat', armL: [1280, 560] });
			d.circle(1240, 520, 120, 2.4, 0.3, { strokeWidth: 7 });
			d.text(1340, 860, 'prüft', 64, 2.8);
		}),
	sc('Nach jeder Scheibe Arbeit startet ein Code-Reviewer mit frischem Kontext. Er kennt nur die Anforderung und den Diff.',
		'After every slice of work a code reviewer starts with fresh context. It knows only the requirement and the diff.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(160, 880, 1780, 880, 0.2, 0.5, { stroke: GREY });
			d.rect(500, 280, 320, 600, 0.3, 0.5, W);
			d.path('M500 280 L380 330 L380 900 L500 880 Z', 0.7, 0.4, W);
			d.R(700, 610, 1.05, q(0.2), { legs: true, glasses: true, look: 1.5, mouth: 'grin', noFloor: true, armR: [860, 700] });
			d.text(430, 140, 'frischer Kontext', 64, q(0.3), GREEN);
			d.paper(1000, 300, 340, 220, q(0.55), { title: 'Anforderung', size: 50 });
			d.paper(1400, 300, 340, 220, q(0.65), { title: 'Diff', size: 50 });
			d.text(1000, 580, '+ neue Zeilen', 48, q(0.72), GREEN);
			d.text(1000, 650, '− alte Zeilen', 48, q(0.76), RED);
		}),
	sc('Was der bauende Agent sich dabei gedacht hat, weiss er nicht.',
		'What the building agent was thinking, it does not know.',
		(d) => {
			d.R(420, 520, 1.1, 0.2, { legs: true, hat: true, look: 1.5 });
			d.thought(700, 280, 520, 300, 0.9, [500, 390]);
			[[560, 230], [600, 290], [560, 340]].forEach(([x, y], i) => d.path(`M${x} ${y} q40 -30 80 0 t80 0 t80 0`, 1.4 + i * 0.15, 0.3, { strokeWidth: 4, stroke: GREY }));
			d.line(1020, 140, 1020, 900, 2.2, 0.4, { strokeWidth: 12 });
			d.R(1440, 520, 1.1, 2.6, { legs: true, glasses: true, look: -1.5, mouth: 'flat' });
			d.text(1300, 220, '?', 120, 3.4);
		}),
	sc('Für alles Fachliche gibt es den Fach-Reviewer. Er liest ein Szenario gegen das Glossar, gegen die Anforderungen und gegen das Schweizer Mietrecht, und zwar bevor es umgesetzt wird.',
		'For everything in the domain there is the domain reviewer. It reads a scenario against the glossary, the requirements and Swiss tenancy law, before it is implemented.',
		(d, T) => {
			const q = (f) => f * T;
			d.R(330, 520, 1.1, 0.2, { legs: true, glasses: true, look: 1.5, mouth: 'flat', armR: [520, 600] });
			d.paper(560, 330, 400, 460, 0.8, { title: 'Szenario', size: 54, lines: 6 });
			[['Glossar', '#2c5d8a'], ['Anforderungen', '#7a3b8f'], ['Mietrecht (OR)', '#a33c2f']].forEach(([t, c], i) => {
				const y = 260 + i * 190;
				d.rect(1100, y, 560, 140, q(0.3) + i * q(0.12), 0.3, { fill: c, fillStyle: 'solid', stroke: '#16181d' });
				d.text(1140, y + 32, t, 60, q(0.33) + i * q(0.12), '#fff');
			});
			d.check(890, 840, 90, q(0.85));
		}),
	sc('Und für Beträge gibt es den Datenprüfer. Er rechnet jede Abrechnung mit einem eigenen Skript aus der Datenbank nach, auf den Rappen.',
		'And for amounts there is the data checker. It recalculates every statement from the database with its own script, to the centime.',
		(d, T) => {
			const q = (f) => f * T;
			d.db(220, 380, 240, 300, 0.2, 'DB');
			d.arrow(520, 530, 150, 0.8);
			d.R(860, 520, 1.1, 1, { legs: true, look: 1.5, mouth: 'flat', armR: [1000, 600] });
			d.rect(1000, 520, 150, 210, 1.6, 0.3, K);
			for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) d.rect(1020 + c * 42, 600 + r * 40, 30, 28, 1.9 + (r * 3 + c) * 0.04, 0.05, W);
			d.rect(1020, 540, 110, 40, 1.9, 0.1, { fill: '#cfe9d6', fillStyle: 'solid' });
			d.text(1240, 300, 'PDF:      CHF 1’035.15', 58, q(0.45));
			d.text(1240, 400, 'Skript:   CHF 1’035.15', 58, q(0.55));
			d.check(1700, 470, 90, q(0.7));
			d.text(1240, 540, 'auf den Rappen', 60, q(0.75), GREEN);
		}),
	sc('Er hat zum Beispiel gefunden, dass nach dem Zurücksetzen einer Teilzahlung das PDF 115 Franken 80 verlangte, obwohl 215 Franken 80 offen waren.',
		'For example, it found that after a partial payment was reset, the PDF asked for 115.80 francs although 215.80 francs were open.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(240, 220, 900, 520, 0.2, 0.5, W);
			d.text(280, 240, 'Zahlteil', 60, 0.6);
			d.rect(290, 360, 260, 260, 0.8, 0.3, { strokeWidth: 4 });
			for (let i = 0; i < 36; i++) if ((i * 7) % 3) d.rect(305 + (i % 6) * 38, 375 + Math.floor(i / 6) * 38, 32, 32, 1 + i * 0.02, 0.05, K);
			d.text(620, 380, 'Betrag', 52, 1.4, GREY);
			d.text(620, 450, 'CHF 115.80', 90, q(0.4));
			d.line(610, 510, 1080, 470, q(0.62), 0.3, { stroke: RED, strokeWidth: 9 });
			d.text(1240, 360, 'offen:', 60, q(0.7), GREY);
			d.text(1240, 440, 'CHF 215.80', 100, q(0.75), RED);
			d.R(1560, 690, 0.8, q(0.5), { glasses: true, look: -1.5, mouth: 'o', legs: true });
		}),
	sc('Jeder Reviewer bekommt höchstens drei Runden. Was dann noch offen ist, landet bei mir.',
		'Each reviewer gets at most three rounds. Whatever is still open then lands with me.',
		(d, T) => {
			const q = (f) => f * T;
			['1', '2', '3'].forEach((n, i) => {
				d.circle(300 + i * 230, 360, 180, q(0.08) + i * q(0.1), 0.3, { strokeWidth: 6 });
				d.text(278 + i * 230, 290, n, 120, q(0.1) + i * q(0.1));
			});
			d.paper(720, 560, 300, 200, q(0.5), { title: 'offen', size: 50 });
			d.arrow(1060, 660, 260, q(0.58));
			const me = d.S(1460, 520, 1.05, q(0.45), { ...ME, face: -1, mouth: 'flat', defer: true });
			d.desk(1150, 1380, 680, q(0.5));
			me.arms(null, q(0.55));
			d.text(1280, 260, 'Blocked on me', 70, q(0.7), RED);
		})
];
