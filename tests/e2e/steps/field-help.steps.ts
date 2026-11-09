import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { pagePurposeText } from '../questions/app-frame';
import { advancePaymentHelpText } from '../questions/contract-form';
import { settingHelp } from '../questions/settings';
import { channelHelp } from '../questions/tenant-form';
import { GLOSSARY, readInGlossary } from '../tasks/app-frame';

const { Given, Then } = createBdd(test);

// #698: a term explained in the help and at a field is explained there with the same text
const HELPS = {
	'der Seite «Heizprofile»': pagePurposeText,
	'der Seite «Verteilschlüssel»': pagePurposeText,
	'der Einstellung «Verwaltungspauschale»': settingHelp('managementFeePercent'),
	'dem Akonto': advancePaymentHelpText,
	'dem Korrespondenzkanal': channelHelp
};

Given('der Liegenschaftsverwalter hat in der Hilfe gelesen, was {string} heisst', async ({ verwalter }, term: string) => {
	await verwalter.attemptsTo(readInGlossary(term));
});

Then('beginnt die Hilfe zu {string} mit der Erklärung aus der Hilfe', async ({ verwalter }, place: string) => {
	const explanation = verwalter.recall<string>(GLOSSARY);
	await verwalter.sees(HELPS[place as keyof typeof HELPS]).toMatch(new RegExp(`^${explanation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
});
