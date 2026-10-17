import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { agreedCostsOfContract } from '../questions/contract-detail';
import { reviewed } from '../questions/contract-form';
import { agreementQuestionsOf, agreementQuestionsShown, notAgreedCostsOf } from '../questions/statement-generate';
import { openContract } from '../tasks/contract-detail';
import { leaveOutCategory, reviewContract } from '../tasks/contract-form';
import { agreementsCannotBeSaved, answerAgreement, openContractWithNotAgreedCosts } from '../tasks/statement-generate';

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
