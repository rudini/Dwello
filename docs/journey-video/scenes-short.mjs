// The short cut (about one minute): eight drawings of the long cut with a shorter text, ending in a pointer to it.
// fallow-ignore-file unused-file
import { SCENES as LONG } from './scenes-long.mjs';

// the drawing of the long cut's scene whose German line starts so
const from = (start) => {
	const scene = LONG.find((s) => s.de && s.de.startsWith(start));
	if (!scene) throw new Error(`no scene starts with «${start}»`);
	return scene;
};
const sc = (start, de, en, extra = 0) => ({ ...from(start), de, en, extra });

export const SCENES = [
	sc('In zehn Monaten', '5’620 Commits in zehn Monaten. 4’774 davon stammen von KI-Agenten.', '5,620 commits in ten months. 4,774 of them come from AI agents.', 1),
	sc('Im Code dahinter', 'Im Januar meldet mir der Assistent: alles fertig. Im September klicke ich mich durch. Hinter dem Knopf ist nichts.', 'In January the assistant reports: all done. In September I click through. Behind the button there is nothing.'),
	sc('Dann baut er testgetrieben', 'Heute steht zuerst das Szenario, auf Deutsch. Dann baut der Agent testgetrieben: rot, grün.', 'Today the scenario comes first, in German. Then the agent builds test-driven: red, green.'),
	sc('Darum prüft bei mir nie', 'Wer baut, prüft nicht: Reviewer mit frischem Kontext prüfen jede Scheibe.', 'Who builds does not check: reviewers with fresh context check every slice.', 1),
	sc('Also habe ich fünf Personas', 'Fünf Personas bedienen die laufende App, von Helga, 68, bis Sven, blind, nur mit der Tastatur.', 'Five personas operate the running app, from Helga, 68, to Sven, blind, keyboard only.'),
	sc('Die Schwellen starten', 'Die Architektur wird gemessen. Fitness Functions bewachen sie, und die Werte dürfen nur besser werden.', 'The architecture is measured. Fitness functions guard it, and the values may only get better.'),
	sc('Darum arbeite ich mit Hooks von Claude Code', 'Und Hooks von Claude Code blockieren jeden Commit des Agenten, der die Regeln bricht. Eine Regel im Text ist nur eine Bitte.', 'And Claude Code hooks block every commit of the agent that breaks the rules. A rule in a text is only a request.'),
	sc('Ich tippe kaum noch Code', 'Ich tippe kaum noch Code. Ich entscheide. Die ganze Geschichte gibt es im langen Video.', 'I hardly type code any more. I decide. The whole story is in the long video.', 1)
];
