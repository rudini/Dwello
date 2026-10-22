import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { agreedCostsOfContract } from '../questions/contract-detail';
import { noAgreedCostsTone, noAgreedCostsWarning, reviewed } from '../questions/contract-form';
import { agreementQuestionsOf, agreementQuestionsShown, agreementsFailure, agreementsWaiting, notAgreedCostsOf } from '../questions/statement-generate';
import { openContract } from '../tasks/contract-detail';
import { agreeCategoryFrom, leaveOutCategory, reviewContract, untickAllCategories } from '../tasks/contract-form';
import { agreementsCannotBeChecked, agreementsCheckAgain, agreementsCannotBeSaved, answerAgreement, answerAgreementFrom, openContractWithNotAgreedCosts, openSettingsFor } from '../tasks/statement-generate';

const { Given, When, Then } = createBdd(test);

// #91: the Nebenkosten each Mietvertrag agrees, and what the statement wizard asks about them

type Seed = { idOf: (key: string) => string | undefined; predefinedCategoryId: (name: string) => Promise<string> };
// an own category by its title, else a predefined one by its German name
const categoryId = async (seed: Seed, category: string) => seed.idOf(category) ?? (await seed.predefinedCategoryId(category));
const contractOf = (seed: Seed, tenant: string) => seed.idOf(`Mietvertrag ${tenant}`)!;

Given('im Mietvertrag von {string} ist {string} nicht vereinbart', async ({ seed }, tenant: string, category: string) => {
	await seed.agreement(tenant, category, false);
});

Given('im Mietvertrag von {string} ist {string} vereinbart', async ({ seed }, tenant: string, category: string) => {
	await seed.agreement(tenant, category, true);
});

Given(
	'im Gebäude {string} gibt es eine Rechnung der eigenen Kategorie {string} über {string} Franken vom {string}',
	async ({ seed }, building: string, category: string, amount: string, date: string) => {
		await seed.invoiceInOwnCategory(building, category, amount, date);
	}
);

// the same activity, as a precondition and as an action
const openSettings: Parameters<typeof When>[1] = async ({ verwalter, seed }, year: number, building: string, fee: number) => {
	await verwalter.attemptsTo(openSettingsFor(year, seed.idOf(building)!, fee));
};
Given(
	'der Liegenschaftsverwalter hat die Einstellungen der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale geöffnet',
	openSettings
);
When(
	'der Liegenschaftsverwalter die Einstellungen der Abrechnungen {int} für das Gebäude {string} mit {float} % Verwaltungspauschale öffnet',
	openSettings
);

Given('das Prüfen der vereinbarten Nebenkosten ist gestört', async ({ verwalter }) => {
	await verwalter.attemptsTo(agreementsCannotBeChecked);
});

Then('meldet der Assistent bei den vereinbarten Nebenkosten {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(agreementsFailure).toContain(message);
});

Then('erklärt der Assistent {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(agreementsWaiting).toContain(message);
});

When('der Liegenschaftsverwalter die Prüfung erneut versucht, nachdem sie wieder geht', async ({ verwalter }) => {
	await verwalter.attemptsTo(agreementsCheckAgain);
});

Given('das Speichern der Antworten zum Mietvertrag von {string} ist gestört', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(agreementsCannotBeSaved(contractOf(seed, tenant)));
});

When(
	'der Liegenschaftsverwalter angibt, dass {string} im Mietvertrag von {string} vereinbart ist',
	async ({ verwalter, seed }, category: string, tenant: string) => {
		await verwalter.attemptsTo(answerAgreement(contractOf(seed, tenant), await categoryId(seed, category), true));
	}
);

When(
	'der Liegenschaftsverwalter angibt, dass {string} im Mietvertrag von {string} nicht vereinbart ist',
	async ({ verwalter, seed }, category: string, tenant: string) => {
		await verwalter.attemptsTo(answerAgreement(contractOf(seed, tenant), await categoryId(seed, category), false));
	}
);

When('der Liegenschaftsverwalter den Mietvertrag von {string} öffnet', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(openContract(contractOf(seed, tenant)));
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} mit nicht vereinbarten Nebenkosten öffnet',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openContractWithNotAgreedCosts(contractOf(seed, tenant)));
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken ohne die Nebenkosten {string} bis zur Prüfung erfasst',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string, category: string) => {
		await verwalter.attemptsTo(
			reviewContract({
				tenantId: seed.idOf(tenant)!,
				apartmentId: seed.idOf(apartment)!,
				startDate,
				baseRent,
				notAgreed: [await categoryId(seed, category)]
			})
		);
	}
);

When(
	'der Liegenschaftsverwalter einträgt, dass im Mietvertrag {string} nicht vereinbart ist',
	async ({ verwalter, seed }, category: string) => {
		await verwalter.attemptsTo(leaveOutCategory(await categoryId(seed, category)));
	}
);

Then(
	'fragt der Assistent, ob {string} im Mietvertrag von {string} vereinbart ist',
	async ({ verwalter, seed, names }, category: string, tenant: string) => {
		await verwalter.sees(agreementQuestionsOf(contractOf(seed, tenant))).toContain(names.get(category) ?? category);
	}
);

Then('meldet die Frage zum Mietvertrag von {string} {string}', async ({ verwalter, seed }, tenant: string, message: string) => {
	await verwalter.sees(agreementQuestionsOf(contractOf(seed, tenant))).toContain(message);
});

Then(
	'nennt der Assistent {string} im Mietvertrag von {string} als nicht vereinbart',
	async ({ verwalter, seed, names }, category: string, tenant: string) => {
		await verwalter.sees(notAgreedCostsOf(contractOf(seed, tenant))).toContain(names.get(category) ?? category);
	}
);

Then('fragt der Assistent nicht, ob Nebenkosten vereinbart sind', async ({ verwalter }) => {
	await verwalter.sees(agreementQuestionsShown).toBe(false);
});

Then('nennt der Mietvertrag die vereinbarten Nebenkosten {string}', async ({ verwalter, names }, category: string) => {
	await verwalter.sees(agreedCostsOfContract).toContain(names.get(category) ?? category);
});

Then('nicht die Nebenkosten {string}', async ({ verwalter, names }, category: string) => {
	await verwalter.sees(agreedCostsOfContract).not.toContain(names.get(category) ?? category);
});

Then('zeigt die Prüfung {string} ohne {string}', async ({ verwalter }, label: string, value: string) => {
	await verwalter.sees(reviewed(label)).not.toContain(value);
});

Given(
	'im Gebäude {string} gibt es eine (umlagefähige )Rechnung ohne Kategorie über {string} Franken vom {string}',
	async ({ seed }, building: string, amount: string, date: string) => {
		await seed.invoiceWithoutCategory(building, amount, date);
	}
);

When('der Liegenschaftsverwalter alle Nebenkosten abwählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(untickAllCategories);
});

Then('warnt das Formular {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(noAgreedCostsWarning).toContain(message);
});

Then('ist der Hinweis ohne vereinbarte Nebenkosten eine Warnung', async ({ verwalter }) => {
	await verwalter.sees(noAgreedCostsTone).toBe('caution');
});

Then('weist das Formular ohne Warnung darauf hin, dass keine Nebenkosten vereinbart sind', async ({ verwalter }) => {
	await verwalter.sees(noAgreedCostsWarning).toContain('Keine Nebenkosten vereinbart');
	await verwalter.sees(noAgreedCostsTone).toBe('info');
});

// #368 (#407 point 3): agreed only from a day (Art. 269d Abs. 3 OR)
Given(
	'im Mietvertrag von {string} ist {string} ab {string} vereinbart',
	async ({ seed }, tenant: string, category: string, from: string) => {
		await seed.agreement(tenant, category, true, from);
	}
);

When(
	'der Liegenschaftsverwalter angibt, dass {string} im Mietvertrag von {string} ab {string} vereinbart ist',
	async ({ verwalter, seed }, category: string, tenant: string, from: string) => {
		await verwalter.attemptsTo(answerAgreementFrom(contractOf(seed, tenant), await categoryId(seed, category), from));
	}
);

When(
	'der Liegenschaftsverwalter einträgt, dass im Mietvertrag {string} ab {string} vereinbart ist',
	async ({ verwalter, seed }, category: string, from: string) => {
		await verwalter.attemptsTo(agreeCategoryFrom(await categoryId(seed, category), from));
	}
);
