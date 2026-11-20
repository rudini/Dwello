/* global RED, GREEN, GREY, W, ME, HELGA */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

// the five sentences of the end: when each one starts, as a share of the scene
const FUENF = 'Erstens: Mach «fertig» prüfbar. Mit ausführbaren Spezifikationen und Zielen statt Anweisungen. Zweitens: Erzwinge, statt zu bitten. Mit Hooks, die blockieren, und Schranken, die der Agent nicht verstellen kann. Drittens: Wer baut, prüft nicht. Reviewer mit frischem Kontext, Personas statt Testpersonen, ein Prüfer, der nachrechnet. Viertens: Architektur ist ein Werkzeug für nicht-funktionale Anforderungen. Bau dir die Metriken, die du brauchst, und lass Fitness Functions sie bewachen. Fünftens: Lass den Prozess mitlernen.';
const marks = ['Erstens', 'Zweitens', 'Drittens', 'Viertens', 'Fünftens'].map((w) => FUENF.indexOf(w) / FUENF.length);

export const SCHLUSS = [
	card('', 'Was bleibt', ''),
	sc('Zurück zum Knopf vom Anfang. Heute hat er ein Szenario, einen Reviewer, eine Persona, die ihn bedient hat, und eine Schranke, die ihn schützt.',
		'Back to the button from the beginning. Today it has a scenario, a reviewer, a persona who used it, and a barrier that protects it.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(700, 420, 520, 120, 0.2, 0.4, { strokeWidth: 7 });
			d.text(740, 438, 'Mietvertrag beenden', 60, 0.5);
			d.paper(200, 160, 340, 300, q(0.3), { title: 'Szenario', size: 50, lines: 4 });
			d.check(450, 200, 60, q(0.34));
			d.R(1560, 280, 0.9, q(0.42), { glasses: true, look: -1.5, mouth: 'grin' });
			d.P(380, 620, 0.85, q(0.55), { ...HELGA, look: 1.5, mouth: 'grin' });
			d.gate(1340, 760, 380, q(0.75), false);
		}),
	sc('In zehn Monaten sind 5’620 Commits entstanden. 4’774 davon stammen von Agenten.',
		'In ten months 5,620 commits were made. 4,774 of them come from agents.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(200, 760, 1700, 760, 0.2, 0.5);
			[['Jan', 54], ['Feb', 39], ['Mär', 0], ['Apr', 4], ['Mai', 0], ['Jun', 0], ['Jul', 0], ['Aug', 0], ['Sep', 23], ['Okt', 3520], ['Nov', 1980]].forEach(([m, n], i) => {
				const x = 240 + i * 130;
				const h = Math.max(4, (n / 3520) * 460);
				if (n) d.rect(x, 760 - h, 80, h, 0.6 + i * 0.12, 0.3, { fill: i >= 9 ? '#e0301e' : '#16181d', fillStyle: 'hachure', hachureGap: 9 });
				d.text(x + 4, 780, m, 40, 0.5 + i * 0.05, GREY);
			});
			d.R(1580, 230, 0.6, q(0.45), { look: -1.5, mouth: 'grin' });
			d.text(220, 120, '5’620 Commits', 90, q(0.3));
			d.text(900, 120, '4’774 von Agenten', 90, q(0.6), RED);
		}),
	sc('Was ich mitnehme, sind fünf Sätze.',
		'What I take away are five sentences.',
		(d) => {
			d.flipchart(980, 140, 700, 600, 0.2);
			d.P(700, 520, 1.15, 0.8, { ...ME, mouth: 'grin', look: 1.5, armR: [820, 440], stick: [990, 350] });
		}),
	sc(FUENF,
		'First: make "done" checkable. With executable specifications and goals instead of instructions. Second: enforce instead of asking. With hooks that block, and barriers the agent cannot adjust. Third: who builds does not check. Reviewers with fresh context, personas instead of test users, a checker who recalculates. Fourth: architecture is a tool for non-functional requirements. Build the metrics you need and let fitness functions guard them. Fifth: let the process learn along.',
		(d, T, a) => {
			d.flipchart(980, 140, 760, 600, 0.1);
			d.P(700, 520, 1.15, 0.1, { ...ME, mouth: 'grin', look: 1.5, armR: [820, 440], stick: [990, 350] });
			['1  «Fertig» prüfbar machen', '2  Erzwingen statt bitten', '3  Wer baut, prüft nicht', '4  Architektur für NFR', '5  Der Prozess lernt mit'].forEach((s, i) => d.text(1020, 180 + i * 108, s, 62, a.marks[i] * T + 0.3));
		},
		{ marks }),
	sc('Was würde ich heute anders machen? Zwei Dinge. Die Szenarien kämen am ersten Tag, nicht nach acht Monaten. Und die Hooks auch: Was ich im Januar als Regel aufgeschrieben habe, würde ich heute sofort erzwingen.',
		'What would I do differently today? Two things. The scenarios would come on the first day, not after eight months. And so would the hooks: what I wrote down as a rule in January I would enforce right away today.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(240, 200, 520, 600, 0.2, 0.5, W);
			d.rect(240, 200, 520, 120, 0.4, 0.3, { fill: '#e0301e', fillStyle: 'solid' });
			d.text(330, 220, 'Januar', 80, 0.7, '#fff');
			d.text(420, 400, '23', 220, 0.9);
			d.paper(900, 220, 340, 300, q(0.35), { title: 'Szenario', size: 50, lines: 4 });
			d.arrow(880, 380, 100, q(0.42), 180);
			d.gate(1000, 720, 560, q(0.65), false, 'Hook');
			d.arrow(880, 700, 100, q(0.72), 180);
		}),
	sc('Das alles hat Grenzen. Personas sind keine Kunden, und ein grüner Check ist kein Beweis.',
		'All this has limits. Personas are not customers, and a green check is no proof.',
		(d, T) => {
			const q = (f) => f * T;
			d.R(470, 470, 1.1, 0.2, { legs: true, look: 1.5 });
			d.P(400, 600, 0.9, 0.6, { ...HELGA, look: 1.5, noFloor: true });
			d.text(720, 300, '≠ Kunde', 90, q(0.3), RED);
			d.check(1150, 560, 200, q(0.55));
			d.text(1420, 470, '≠ Beweis', 90, q(0.7), RED);
		}),
	sc('Aber ich muss nicht mehr glauben, dass etwas fertig ist.',
		'But I no longer have to believe that something is done.',
		(d) => {
			d.P(420, 560, 1.15, 0.2, { ...ME, mouth: 'grin', look: 1.5 });
			d.light(900, 260, 2, 0.8, 1, 1.6);
			d.text(1180, 400, 'ich sehe es', 100, 2.2, GREEN);
		}),
	sc('Ich tippe kaum noch Code. Ich entscheide.',
		'I hardly type code any more. I decide.',
		(d, T) => {
			const q = (f) => f * T;
			[0, 1, 2].forEach((i) => {
				d.R(1100 + i * 260, 330 + (i % 2) * 80, 0.6, 0.2 + i * 0.2, { look: -1, mouth: 'grin', tilt: [4, -3, 6][i] });
				d.rect(1010 + i * 260, 440 + (i % 2) * 80, 200, 14, 0.4 + i * 0.2, 0.2, W);
			});
			const me = d.S(420, 520, 1.15, 0.6, { ...ME, mouth: 'grin', defer: true });
			d.desk(500, 860, 690, 1);
			me.arms([620, 640], 1.3);
			d.stamp(560, 560, 'ok', 50, 1.6, GREEN, -6);
			d.text(980, 700, 'Ich entscheide.', 120, q(0.55));
		}),
	card('', 'Dwello', 'Danke fürs Zuschauen')
];
