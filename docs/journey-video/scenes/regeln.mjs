/* global RED, GREEN, GREY, W, K, ME */
// fallow-ignore-file unused-file
import { sc, card } from './common.mjs';

export const REGELN = [
	card(6, 'Regeln, die sich wehren', 'Hooks und Prozess-Reviews'),
	sc('Jetzt zurück zur Lektion aus dem Januar: Eine Regel im Text ist eine Bitte.',
		'Now back to the lesson from January: a rule in a text is a request.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(760, 360, 760, 860, 0.2, 0.3, { strokeWidth: 9 });
			d.rect(560, 220, 400, 160, 0.4, 0.4, W);
			d.text(590, 240, 'Bitte Tests', 60, 0.8);
			d.text(590, 306, 'schreiben', 60, 1);
			d.text(1100, 400, 'Regel = Bitte', 100, q(0.6), RED);
		}),
	sc('Agenten halten sich meistens daran. Meistens reicht nicht.',
		'Agents mostly stick to it. Mostly is not enough.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(140, 860, 1780, 860, 0.1, 0.5, { stroke: GREY });
			d.line(300, 360, 300, 860, 0.2, 0.3, { strokeWidth: 9 });
			d.rect(150, 240, 300, 130, 0.3, 0.3, W);
			d.text(175, 260, 'Bitte …', 60, 0.6);
			[0, 1, 2, 3].forEach((i) => d.R(620 + i * 230, 630, 0.85, 0.6 + i * 0.25, { legs: true, look: -1.5, mouth: 'flat', noFloor: true }));
			d.R(1640, 630, 0.85, q(0.5), { legs: true, look: 1.5, mouth: 'grin', tilt: 10, noFloor: true });
			d.text(1680, 420, '♪', 80, q(0.6));
			d.text(1300, 160, 'meistens', 80, q(0.7), RED);
		}),
	sc('Darum arbeite ich mit Hooks von Claude Code, nicht mit Git-Hooks. Ein Hook ist ein Skript, das vor jedem Befehl des Agenten läuft und ihn blockieren kann.',
		'That is why I work with Claude Code hooks, not git hooks. A hook is a script that runs before every command of the agent and can block it.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(140, 860, 1780, 860, 0.1, 0.5, { stroke: GREY });
			d.R(500, 600, 1.05, 0.2, { legs: true, look: 1.5, mouth: 'o', noFloor: true, armR: [640, 700] });
			d.rect(600, 640, 200, 150, 0.9, 0.3, { fill: '#c9a26b', fillStyle: 'solid' });
			d.text(615, 680, 'git commit', 40, 1.2);
			d.gate(980, 700, 600, q(0.3), false, 'Hook');
			d.text(1000, 300, 'Hook = Schranke', 90, q(0.6));
		}),
	sc('Will der Agent committen, laufen fünf Prüfungen: toter und doppelter Code, flache Module, schwache Tests, die Architektur-Fitness, die Form der Commit-Nachricht.',
		'When the agent wants to commit, five checks run: dead and duplicate code, shallow modules, weak tests, architecture fitness, the form of the commit message.',
		(d, T) => {
			const q = (f) => f * T;
			['toter Code', 'flache Module', 'schwache Tests', 'Fitness', 'Nachricht'].forEach((t, i) => {
				const x = 220 + i * 330;
				d.rect(x - 15, 420, 30, 300, q(0.12) + i * q(0.13), 0.2, W);
				d.rect(x, 420, 200, 28, q(0.14) + i * q(0.13), 0.2, { fill: '#e0301e', fillStyle: 'solid' });
				d.text(x - 60, 740, t, 48, q(0.16) + i * q(0.13));
				d.text(x - 10, 320, String(i + 1), 80, q(0.13) + i * q(0.13), RED);
			});
		}),
	sc('Findet eine etwas, findet der Commit nicht statt.',
		'If one finds something, the commit does not happen.',
		(d) => {
			d.line(140, 860, 1780, 860, 0.1, 0.5, { stroke: GREY });
			d.gate(1000, 600, 500, 0.2, false);
			d.R(700, 600, 1.05, 0.6, { legs: true, look: 1.5, mouth: 'o', brows: 'up', noFloor: true, armR: [840, 700] });
			d.rect(820, 640, 160, 130, 1, 0.3, { fill: '#c9a26b', fillStyle: 'solid' });
			d.cross(900, 420, 120, 1.6);
			d.text(1100, 300, 'kein Commit', 90, 2, RED);
		}),
	sc('Geprüft wird nur, was die Änderung neu bringt. Alte Befunde blockieren niemanden, neue kommen nicht dazu.',
		'Only what the change brings in is checked. Old findings block nobody, new ones do not get added.',
		(d, T) => {
			const q = (f) => f * T;
			for (let i = 0; i < 9; i++) d.rect(200 + (i % 3) * 120, 560 - Math.floor(i / 3) * 100, 110, 90, 0.2 + i * 0.08, 0.15, { fill: '#d6d6d6', fillStyle: 'solid', stroke: GREY });
			d.text(250, 760, 'alt', 70, 1.2, GREY);
			d.line(760, 160, 760, 860, 1.4, 0.4, { strokeLineDash: [18, 16], stroke: GREY });
			d.rect(1200, 480, 200, 160, q(0.4), 0.3, { fill: '#c9a26b', fillStyle: 'solid' });
			d.text(1235, 520, 'neu', 64, q(0.45));
			d.circle(1300, 560, 380, q(0.55), 0.4, { strokeWidth: 9 });
			d.line(1430, 700, 1560, 830, q(0.6), 0.2, { strokeWidth: 16 });
		}),
	sc('Und der Agent darf die Schranken nicht selbst verstellen. Hooks, Schwellen und Regeldateien sind geschützt.',
		'And the agent may not adjust the barriers itself. Hooks, thresholds and rule files are protected.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(140, 860, 1780, 860, 0.1, 0.5, { stroke: GREY });
			d.gate(900, 600, 600, 0.2, false);
			d.R(600, 600, 1.05, 0.7, { legs: true, look: 1.5, mouth: 'grin', noFloor: true, armR: [860, 560] });
			d.line(860, 560, 900, 520, 1.4, 0.2, { strokeWidth: 8 });
			d.lock(900, 680, 0.8, q(0.35));
			d.cross(780, 380, 90, q(0.45));
			d.P(1640, 560, 1, q(0.55), { ...ME, look: -1.5, mouth: 'grin', armL: [1520, 600] });
			d.path('M1480 600 L1520 600 M1480 600 a20 20 0 1 1 0 0.1 M1500 600 L1500 620', q(0.65), 0.3, { stroke: '#b8902a', strokeWidth: 7 });
		}),
	sc('Sonst repariert er irgendwann die Prüfung statt den Fehler.',
		'Otherwise at some point it repairs the check instead of the error.',
		(d) => {
			d.light(1000, 220, 2.4, 0.2, 0.4);
			d.R(640, 560, 1.1, 0.6, { legs: true, look: 1.5, mouth: 'grin', armR: [880, 380] });
			d.line(880, 380, 1010, 300, 1.2, 0.3, { strokeWidth: 8, stroke: '#7a5230' });
			d.path('M1000 280 L1040 270 L1050 310 Z', 1.4, 0.1, { fill: '#1f8a4c', fillStyle: 'solid', stroke: '#1f8a4c' });
			d.circle(1084, 320, 96, 1.6, 0.3, { fill: '#1f8a4c', fillStyle: 'solid', stroke: '#1f8a4c' });
			d.cross(1420, 420, 260, 2.4);
		}),
	sc('Vor dem Merge läuft alles noch einmal in der CI: Unit-Tests, die Szenarien in drei Browsern, Barrierefreiheit hell und dunkel auf drei Bildschirmgrössen, vier Sprachen, die Fitness Functions.',
		'Before the merge everything runs once more in CI: unit tests, the scenarios in three browsers, accessibility light and dark on three screen sizes, four languages, the fitness functions.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(120, 700, 1680, 60, 0.2, 0.5, W);
			for (let i = 0; i < 12; i++) d.circle(170 + i * 145, 790, 60, 0.4 + i * 0.03, 0.1, K);
			[['Unit-Tests', 0.12], ['3 Browser', 0.25], ['hell / dunkel', 0.4], ['DE FR IT EN', 0.62], ['Fitness', 0.8]].forEach(([t, f], i) => {
				const x = 180 + i * 330;
				d.rect(x, 420, 260, 260, q(f), 0.3, W);
				d.text(x + 20, 450, t, 44, q(f) + 0.2);
				d.check(x + 90, 600, 90, q(f) + 0.6);
			});
			d.text(180, 200, 'CI vor dem Merge', 90, 0.4);
		}),
	sc('Der Pull Request zeigt mir Bilder jeder geänderten Seite und den Bericht der Reviewer.',
		'The pull request shows me pictures of every changed page and the reviewers’ report.',
		(d, T, a, ROOT) => {
			const q = (f) => f * T;
			d.S(320, 540, 1.1, 0.2, { ...ME, mouth: 'grin', arm: [460, 650] });
			d.desk(400, 760, 690, 0.5);
			d.photo(ROOT + 'marketing/shots/statement-dark.webp', 820, 140, 560, q(0.25), -2);
			d.photo(ROOT + 'marketing/shots/statement-light.webp', 920, 380, 560, q(0.35), 2);
			d.paper(1460, 300, 360, 420, q(0.55), { title: 'Reviewer', size: 50, lines: 0 });
			d.text(1490, 400, 'Blocker: 0', 48, q(0.62), GREEN);
			d.text(1490, 470, 'Major: 0', 48, q(0.68), GREEN);
			d.text(1490, 540, 'Minor: 2', 48, q(0.74), GREY);
		}),
	sc('Der letzte Baustein: Der Prozess prüft sich selbst. Nach jeder Aufgabe notiert der Agent, wo eine Regel unklar war, einer anderen widersprach oder nur Aufwand kostete.',
		'The last building block: the process checks itself. After every task the agent notes where a rule was unclear, contradicted another or only cost effort.',
		(d, T) => {
			const q = (f) => f * T;
			d.line(1300, 560, 1300, 880, 0.2, 0.3, { strokeWidth: 12 });
			d.path('M1150 420 L1450 420 L1450 560 L1150 560 Z M1150 420 Q1300 300 1450 420', 0.4, 0.5, { fill: '#e0301e', fillStyle: 'solid' });
			d.rect(1200, 470, 200, 20, 0.8, 0.1, K);
			d.text(1120, 230, 'Workflow-Notizen', 60, 1);
			d.R(760, 560, 1.1, 0.6, { legs: true, look: 1.5, mouth: 'flat', armR: [1000, 520] });
			['unklar', 'Widerspruch', 'nur Aufwand'].forEach((t, i) => {
				d.rect(220, 220 + i * 170, 340, 120, q(0.4) + i * q(0.12), 0.2, { fill: '#fff6b3', fillStyle: 'solid' });
				d.text(250, 250 + i * 170, t, 54, q(0.42) + i * q(0.12));
			});
		}),
	sc('Diese Notizen werden gesammelt, und ich entscheide, was sich ändert.',
		'These notes are collected, and I decide what changes.',
		(d, T) => {
			const q = (f) => f * T;
			d.P(320, 560, 1.05, 0.2, { ...ME, look: 1.5, mouth: 'flat', armR: [470, 620] });
			[0, 1, 2, 3].forEach((i) => {
				d.rect(560 + i * 280, 420, 240, 160, 0.8 + i * 0.2, 0.2, { fill: '#fff6b3', fillStyle: 'solid' });
				d.stamp(570 + i * 280, 620, i === 2 ? 'nein' : 'ja', 50, q(0.4) + i * q(0.12), i === 2 ? RED : GREEN, -6);
			});
		}),
	sc('Der Hook für die Architektur-Fitness ist genau so entstanden: aus einer solchen Notiz.',
		'The hook for architecture fitness came about exactly like this: from such a note.',
		(d, T) => {
			const q = (f) => f * T;
			d.rect(240, 360, 380, 220, 0.2, 0.3, { fill: '#fff6b3', fillStyle: 'solid' });
			d.text(270, 390, 'Fitness erst', 50, 0.5);
			d.text(270, 450, 'nach dem Review?', 50, 0.8);
			d.arrow(680, 470, 300, q(0.35));
			d.gate(1160, 520, 520, q(0.45), false, 'fitness');
			d.text(1100, 220, 'neuer Hook', 80, q(0.7), GREEN);
		}),
	sc('Die Regeldatei wurde 123-mal geändert. Mit jeder Runde arbeiten die Agenten strikter nach Prozess.',
		'The rule file was changed 123 times. With every round the agents work more strictly by the process.',
		(d, T) => {
			const q = (f) => f * T;
			for (let i = 0; i < 10; i++) d.rect(220 + ((i * 23) % 30), 760 - i * 46, 420, 42, 0.2 + i * 0.08, 0.12, W);
			d.text(240, 200, 'CLAUDE.md', 64, 1);
			d.text(700, 360, '123 ×', 130, 1.4);
			[0, 1, 2, 3, 4].forEach((i) => d.R(820 + i * 200, 640, 0.75, q(0.45) + i * 0.15, { legs: true, look: 1.5, mouth: 'flat' }));
		})
];
