import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	apartmentChoice,
	chosenApartment,
	chosenTenant,
	chosenTenantName,
	confirmation,
	restoredDraft,
	reviewed
} from '../questions/contract-form';
import { listedContract } from '../questions/contracts';
import {
	changeBaseRent,
	saveEndDate,
	chooseTenant,
	chooseTenantAndApartment,
	chooseTenantWhileLoading,
	createTenantForContract,
	discardDraft,
	goBackToStep,
	goToNextStep,
	registerContract,
	rentApartment,
	reopenNewContract,
	reviewContract
} from '../tasks/contract-form';
import { searchContracts } from '../tasks/contracts';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"', async ({ verwalter }) => {
	await visit(verwalter.page, '/contracts/new');
});

When(
	'der Liegenschaftsverwalter den Mieter {string} wählt, bevor die Seite fertig geladen ist',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.perform(chooseTenantWhileLoading(seed.idOf(tenant)!));
	}
);

When(
	'der Liegenschaftsverwalter die Wohnung {string} ab {string} für {string} Franken vermietet',
	async ({ verwalter, seed }, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.perform(rentApartment({ apartmentId: seed.idOf(apartment)!, startDate, baseRent }));
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken vermietet',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.perform(
			registerContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken mit {string} Franken Akonto bis zur Prüfung erfasst',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string, advancePayment: string) => {
		await verwalter.perform(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, advancePayment })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken vermietet und den Vertragsbeginn bestätigt',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.perform(
			registerContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, confirmPastStart: true })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} ohne Nettomiete vermieten will',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string) => {
		await verwalter.perform(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent: '' })
		);
	}
);

When('der Liegenschaftsverwalter ohne Angaben weitergeht', async ({ verwalter }) => {
	await verwalter.perform(goToNextStep);
});

When('der Liegenschaftsverwalter weitergeht', async ({ verwalter }) => {
	await verwalter.perform(goToNextStep);
});

When('der Liegenschaftsverwalter den Mieter {string} wählt', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.perform(chooseTenant(seed.idOf(tenant)!));
});

When(
	'der Liegenschaftsverwalter den Mieter {string} und die Wohnung {string} wählt',
	async ({ verwalter, seed }, tenant: string, apartment: string) => {
		await verwalter.perform(chooseTenantAndApartment(seed.idOf(tenant)!, seed.idOf(apartment)!));
	}
);

When('der Liegenschaftsverwalter zum Schritt {string} zurückgeht', async ({ verwalter }, step: string) => {
	await verwalter.perform(goBackToStep(step));
});

When('der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet', async ({ verwalter }) => {
	await verwalter.perform(reopenNewContract);
});

When('der Liegenschaftsverwalter den Entwurf verwirft', async ({ verwalter }) => {
	await verwalter.perform(discardDraft);
});

When(
	'der Liegenschaftsverwalter im Mietvertrag den neuen Mieter {string} erfasst',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.perform(createTenantForContract(seed.unique(tenant)));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von {string} gespeichert ist',
	async ({ verwalter, names }, tenant: string) => {
		await expect(confirmation(verwalter)).toContainText(`Mietvertrag von ${names.get(tenant) ?? tenant} gespeichert`);
	}
);

Then('zeigt die Prüfung {string} mit {string}', async ({ verwalter, names }, label: string, value: string) => {
	await expect(reviewed(verwalter, label)).toContainText(names.get(value) ?? value);
});

Then('ist im Mietvertrag der Mieter {string} gewählt', async ({ verwalter, names }, tenant: string) => {
	await expect.poll(() => chosenTenantName(verwalter)).toBe(names.get(tenant) ?? tenant);
});

Then('ist im Mietvertrag die Wohnung {string} gewählt', async ({ verwalter, seed }, apartment: string) => {
	await expect(chosenApartment(verwalter)).toHaveValue(seed.idOf(apartment)!);
});

Then('ist im Mietvertrag kein Mieter gewählt', async ({ verwalter }) => {
	await expect(chosenTenant(verwalter)).toHaveValue('');
});

Then('sieht der Liegenschaftsverwalter, dass sein Entwurf wiederhergestellt ist', async ({ verwalter }) => {
	await expect(restoredDraft(verwalter)).toBeVisible();
});

Then('der Mietvertrag von {string} ist in der Liste auffindbar', async ({ verwalter, names }, tenant: string) => {
	const name = names.get(tenant) ?? tenant;
	await verwalter.perform(searchContracts(name));
	await expect(listedContract(verwalter, name)).toBeVisible();
});

Then(
	'kann der Liegenschaftsverwalter die Wohnung {string} nicht auswählen',
	async ({ verwalter, seed }, apartment: string) => {
		await expect(apartmentChoice(verwalter, seed.idOf(apartment)!)).toBeDisabled();
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await visit(verwalter.page, `/contracts/${seed.idOf(`Mietvertrag ${tenant}`)}/edit`);
	}
);

When('der Liegenschaftsverwalter den Mietzins auf {string} Franken ändert', async ({ verwalter }, baseRent: string) => {
	await verwalter.perform(changeBaseRent(baseRent));
});

When('der Liegenschaftsverwalter das Vertragsende {string} speichern will', async ({ verwalter }, date: string) => {
	await verwalter.perform(saveEndDate(date));
});

When(
	'der Liegenschaftsverwalter das Vertragsende {string} speichert und die Folge bestätigt',
	async ({ verwalter }, date: string) => {
		await verwalter.perform(saveEndDate(date, { confirmPast: true }));
	}
);

When('der Liegenschaftsverwalter den Mietzins leert', async ({ verwalter }) => {
	await verwalter.perform(changeBaseRent(''));
});
