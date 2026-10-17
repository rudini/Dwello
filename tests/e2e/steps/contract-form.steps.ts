import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	apartmentChoiceLabel,
	apartmentChoices,
	apartmentHint,
	apartmentSelectable,
	chosenApartmentId,
	chosenTenantId,
	chosenTenantName,
	confirmation,
	draftRestoredText,
	durationChosen,
	enteredAdvancePayment,
	enteredBaseRent,
	failure,
	fixedApartmentName,
	fixedTenantName,
	billedUntilHelpText,
	partiesHelpText,
	reviewHint,
	rentTakenOverText,
	reviewed,
	runningContractHintText,
	saveStatusText,
	startHint,
	tenantChoices,
	withdrawNoticeHelp
} from '../questions/contract-form';
import { contractListed } from '../questions/contracts';
import { pageAddress } from '../questions/navigation';
import {
	agreeManagementFee,
	enterBilledUntil,
	changeBaseRent,
	deleteDraftAndSave,
	openContractEdit,
	openNewContract,
	saveEndDate,
	saveStartDate,
	withdrawNotice,
	chooseTenant,
	chooseTenantAndApartment,
	chooseTenantWhileLoading,
	contractsCannotBeLoaded,
	contractsLoadAgain,
	enterBaseRent,
	retryContracts,
	retryContractsInVain,
	createTenantForContract,
	discardDraft,
	goBackToStep,
	goToNextStep,
	goToRentWith,
	openNewContractFor,
	newContractAfterEnd,
	openRunningContract,
	registerContract,
	rentApartment,
	reopenNewContract,
	reviewContract
} from '../tasks/contract-form';
import { searchContracts } from '../tasks/contracts';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewContract);
});

When(
	'der Liegenschaftsverwalter den Mieter {string} wählt, bevor die Seite fertig geladen ist',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(chooseTenantWhileLoading(seed.idOf(tenant)!));
	}
);

When(
	'der Liegenschaftsverwalter die Wohnung {string} ab {string} für {string} Franken vermietet',
	async ({ verwalter, seed }, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.attemptsTo(rentApartment({ apartmentId: seed.idOf(apartment)!, startDate, baseRent }));
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken vermietet',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.attemptsTo(
			registerContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken mit {string} Franken Akonto bis zur Prüfung erfasst',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string, advancePayment: string) => {
		await verwalter.attemptsTo(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, advancePayment })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken vermietet und den Vertragsbeginn bestätigt',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.attemptsTo(
			registerContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, confirmPastStart: true })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} ohne Nettomiete vermieten will',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string) => {
		await verwalter.attemptsTo(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent: '' })
		);
	}
);

When('der Liegenschaftsverwalter ohne Angaben weitergeht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToNextStep);
});

When('der Liegenschaftsverwalter weitergeht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToNextStep);
});

When('der Liegenschaftsverwalter den Mieter {string} wählt', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(chooseTenant(seed.idOf(tenant)!));
});

When(
	'der Liegenschaftsverwalter den Mieter {string} und die Wohnung {string} wählt',
	async ({ verwalter, seed }, tenant: string, apartment: string) => {
		await verwalter.attemptsTo(chooseTenantAndApartment(seed.idOf(tenant)!, seed.idOf(apartment)!));
	}
);

When('der Liegenschaftsverwalter zum Schritt {string} zurückgeht', async ({ verwalter }, step: string) => {
	await verwalter.attemptsTo(goBackToStep(step));
});

When('der Liegenschaftsverwalter die Seite "Neuer Mietvertrag" später wieder öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(reopenNewContract);
});

When('der Liegenschaftsverwalter seine Angaben verwirft', async ({ verwalter }) => {
	await verwalter.attemptsTo(discardDraft);
});

When(
	'der Liegenschaftsverwalter im Mietvertrag den neuen Mieter {string} erfasst',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(createTenantForContract(seed.unique(tenant)));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Bestätigung, dass der Mietvertrag von {string} gespeichert ist',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(confirmation).toContain(`Mietvertrag von ${names.get(tenant) ?? tenant} gespeichert`);
	}
);

Then('zeigt die Prüfung {string} mit {string}', async ({ verwalter, names }, label: string, value: string) => {
	await verwalter.sees(reviewed(label)).toContain(names.get(value) ?? value);
});

Then('ist im Mietvertrag der Mieter {string} gewählt', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(chosenTenantName).toBe(names.get(tenant) ?? tenant);
});

Then('ist im Mietvertrag die Wohnung {string} gewählt', async ({ verwalter, seed }, apartment: string) => {
	await verwalter.sees(chosenApartmentId).toBe(seed.idOf(apartment)!);
});

Then('ist im Mietvertrag kein Mieter gewählt', async ({ verwalter }) => {
	await verwalter.sees(chosenTenantId).toBe('');
});

// Both wizards (#57): the input is «Ihre Angaben», «Entwurf» is only the statement status
Then('sieht der Liegenschaftsverwalter, dass seine Angaben wiederhergestellt sind', async ({ verwalter }) => {
	await verwalter.sees(draftRestoredText).toContain('Angaben wiederhergestellt');
});

Then(
	'erfährt der Liegenschaftsverwalter, dass seine Angaben nur in diesem Browser aufbewahrt und noch nicht gespeichert sind',
	async ({ verwalter }) => {
		await verwalter.sees(saveStatusText).toContain('Ihre Angaben sind nur in diesem Browser aufbewahrt, noch nicht gespeichert.');
	}
);

Then('der Mietvertrag von {string} ist in der Liste auffindbar', async ({ verwalter, names }, tenant: string) => {
	const name = names.get(tenant) ?? tenant;
	await verwalter.attemptsTo(searchContracts(name));
	await verwalter.sees(contractListed(name)).toBe(true);
});

Then(
	'kann der Liegenschaftsverwalter die Wohnung {string} nicht auswählen',
	async ({ verwalter, seed }, apartment: string) => {
		await verwalter.sees(apartmentSelectable(seed.idOf(apartment)!)).toBe(false);
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mietvertrags von {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openContractEdit(seed.idOf(`Mietvertrag ${tenant}`)!));
	}
);

When('der Liegenschaftsverwalter den Mietzins auf {string} Franken ändert', async ({ verwalter }, baseRent: string) => {
	await verwalter.attemptsTo(changeBaseRent(baseRent));
});

When('der Liegenschaftsverwalter das Vertragsende {string} speichern will', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(saveEndDate(date));
});

When(
	'der Liegenschaftsverwalter das Vertragsende {string} speichert und die Folge bestätigt',
	async ({ verwalter }, date: string) => {
		await verwalter.attemptsTo(saveEndDate(date, { confirmPast: true }));
	}
);

Given(
	'der Mietvertrag von {string} ist auf den {string} gekündigt',
	async ({ seed }, tenant: string, date: string) => {
		await seed.notice(tenant, date);
	}
);

When('der Liegenschaftsverwalter die Kündigung aufhebt', async ({ verwalter }) => {
	await verwalter.attemptsTo(withdrawNotice);
});

// the chosen option, not just one of the offered ones
Then('zeigt die Vertragsdauer {string}', async ({ verwalter }, duration: string) => {
	await verwalter.sees(durationChosen(duration)).toBe(true);
});

When('der Liegenschaftsverwalter den Vertragsbeginn {string} speichert', async ({ verwalter }, date: string) => {
	await verwalter.attemptsTo(saveStartDate(date));
});

When('der Liegenschaftsverwalter den Mietzins leert', async ({ verwalter }) => {
	await verwalter.attemptsTo(changeBaseRent(''));
});

When('der Liegenschaftsverwalter den Entwurf löscht und den Mietvertrag speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteDraftAndSave);
});

Given('die Mietverträge der Wohnung {string} lassen sich nicht laden', async ({ verwalter, seed }, apartment: string) => {
	await verwalter.attemptsTo(contractsCannotBeLoaded(seed.idOf(apartment)!));
});

Then('sieht der Liegenschaftsverwalter bei der Wohnung den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(apartmentHint).toContain(text);
});

Then('sieht der Liegenschaftsverwalter beim Vertragsbeginn den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(startHint).toContain(text);
});

Then('sieht der Liegenschaftsverwalter in der Prüfung den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(reviewHint).toContain(text);
});

When('der Liegenschaftsverwalter die Nettomiete {string} einträgt', async ({ verwalter }, baseRent: string) => {
	await verwalter.attemptsTo(enterBaseRent(baseRent));
});

When('die Mietverträge der Wohnung {string} sich wieder laden lassen', async ({ verwalter }, _apartment: string) => {
	await verwalter.attemptsTo(contractsLoadAgain);
});

When('der Liegenschaftsverwalter die Mietverträge der Wohnung erneut lädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(retryContracts);
});

Then('ist die Nettomiete {string} noch eingetragen', async ({ verwalter }, baseRent: string) => {
	await verwalter.sees(enteredBaseRent).toBe(baseRent);
});

Then('sieht der Liegenschaftsverwalter bei der Wohnung keinen Hinweis mehr', async ({ verwalter }) => {
	await verwalter.sees(apartmentHint).toBeNull();
});

Then('sieht der Liegenschaftsverwalter beim Vertragsbeginn keinen Hinweis mehr', async ({ verwalter }) => {
	await verwalter.sees(startHint).toBeNull();
});

When('der Liegenschaftsverwalter die Mietverträge der Wohnung erneut zu laden versucht', async ({ verwalter }) => {
	await verwalter.attemptsTo(retryContractsInVain);
});

Then(
	'steht bei der Wohnung {string} in der Auswahl {string}',
	async ({ verwalter, seed }, apartment: string, text: string) => {
		await verwalter.sees(apartmentChoiceLabel(seed.idOf(apartment)!)).toContain(text);
	}
);

Then('meldet Dwello den Fehler {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(failure).toContain(message);
});
Then(
	'nennt der Mietvertrag den Mieter {string} und die Wohnung {string}',
	async ({ verwalter, names }, tenant: string, number: string) => {
		await verwalter.sees(fixedTenantName).toBe(names.get(tenant) ?? tenant);
		await verwalter.sees(fixedApartmentName).toContain(`Wohnung ${number}`);
	}
);

// after the names above, so an error page does not pass
Then('kann der Liegenschaftsverwalter Mieter und Wohnung nicht ändern', async ({ verwalter }) => {
	await verwalter.sees(tenantChoices).toBe(0);
	await verwalter.sees(apartmentChoices).toBe(0);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass er bei einem Mieterwechsel einen neuen Mietvertrag erfasst',
	async ({ verwalter }) => {
		await verwalter.sees(partiesHelpText).toContain('Bei einem Mieterwechsel');
		// the place where it goes on, not only the rule (code review m-5)
		await verwalter.sees(partiesHelpText).toContain('mit «Beenden»');
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken ohne Angabe zur Verwaltungspauschale vermieten will',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.attemptsTo(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, managementFee: null })
		);
	}
);

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken mit einer Verwaltungspauschale von {string} % bis zur Prüfung erfasst',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string, fee: string) => {
		await verwalter.attemptsTo(
			reviewContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent, managementFee: fee })
		);
	}
);

When(
	'der Liegenschaftsverwalter einträgt, dass die Nebenkosten bis {string} ausserhalb von Dwello abgerechnet sind',
	async ({ verwalter }, date: string) => {
		await verwalter.attemptsTo(enterBilledUntil(date));
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass Dwello die Nebenkosten erst ab dem Tag nach «Abgerechnet bis» abrechnet',
	async ({ verwalter }) => {
		await verwalter.sees(billedUntilHelpText).toContain('erst ab dem Tag danach');
	}
);

When('der Liegenschaftsverwalter einträgt, dass im Mietvertrag die Verwaltungspauschale zum Satz des Abrechnungslaufs vereinbart ist', async ({ verwalter }) => {
	await verwalter.attemptsTo(agreeManagementFee);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass {string} einen Mietvertrag ohne Vertragsende für die Wohnung {string} hat',
	async ({ verwalter, names }, tenant: string, apartment: string) => {
		await verwalter.sees(runningContractHintText).toContain(names.get(tenant) ?? tenant);
		await verwalter.sees(runningContractHintText).toContain(`Wohnung ${apartment}`);
	}
);

When('der Liegenschaftsverwalter den laufenden Mietvertrag im Hinweis öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openRunningContract);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass der Mietvertrag beim Tod des Mieters weiterläuft',
	async ({ verwalter }) => {
		await verwalter.sees(partiesHelpText).toContain('Stirbt der Mieter, endet der Mietvertrag nicht');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass er die Adresse der Erben als Korrespondenzadresse einträgt',
	async ({ verwalter }) => {
		await verwalter.sees(partiesHelpText).toContain('unter «Korrespondenzadresse» die Adresse ein, an die die Post für die Erben geht');
	}
);

When('der Liegenschaftsverwalter aus dem Mietvertrag einen neuen Mietvertrag erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(newContractAfterEnd);
});

// the link carries the start; that the wizard takes it from `?start=` is tested in contract-wizard.test.ts
Then('schlägt der neue Mietvertrag den Vertragsbeginn {string} vor', async ({ verwalter }, date: string) => {
	await verwalter.sees(pageAddress).toMatch(new RegExp(`start=${date}`));
});

Given(
	'der Liegenschaftsverwalter erfasst einen Mietvertrag für die Wohnung {string}',
	async ({ verwalter, seed }, apartment: string) => {
		await verwalter.attemptsTo(openNewContractFor(seed.idOf(apartment)!));
	}
);

When(
	'der Liegenschaftsverwalter für {string} ab {string} bis zur Miete weitergeht',
	async ({ verwalter, seed }, tenant: string, startDate: string) => {
		await verwalter.attemptsTo(goToRentWith(seed.idOf(tenant)!, startDate));
	}
);

Then(
	'schlägt der Schritt "Miete" die Nettomiete {string} und das Akonto {string} aus dem letzten Mietvertrag der Wohnung vor',
	async ({ verwalter }, baseRent: string, advancePayment: string) => {
		await verwalter.sees(enteredBaseRent).toBe(baseRent);
		await verwalter.sees(enteredAdvancePayment).toBe(advancePayment);
		await verwalter.sees(rentTakenOverText).toContain('aus dem letzten Mietvertrag dieser Wohnung');
	}
);

// the help names who can withdraw a notice, after the glossary «Kündigung aufheben»
Then(
	'erfährt der Liegenschaftsverwalter bei «Kündigung aufheben», wann sich eine Kündigung aufheben lässt',
	async ({ verwalter }) => {
		await verwalter.sees(withdrawNoticeHelp).toContain('gemeinsam zurücknehmen');
		await verwalter.sees(withdrawNoticeHelp).toContain('die Schlichtungsbehörde oder ein Gericht');
		await verwalter.sees(withdrawNoticeHelp).toContain('weder der Mieter noch der Vermieter allein');
		await verwalter.sees(withdrawNoticeHelp).toContain('Der Mietvertrag läuft dann ohne Ende weiter.');
	}
);
