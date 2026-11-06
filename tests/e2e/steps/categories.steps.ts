import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { errorMessageShown } from '../questions/form';
import { pageTitle } from '../questions/navigation';
import { focusedText, shownConfirmations } from '../questions/app-frame';
import {
	allocabilityConsequence,
	allocabilityQuestionText,
	allowance,
	heatingChangeable,
	heatingChecked,
	heatingHelpText,
	categoryDeletable,
	categoryListed,
	invoicesOf,
	descriptionOf,
	contractHint,
	formReasonText,
	formReasonLabelText,
	allowanceQuestionDescription,
	hiddenDescription,
	kindOf,
	predefinedHintText,
	whyNotDeletable,
	reasonOf,
	reasonsOf,
	allowedChosen,
	listedCategoriesNamed,
	notAllowedChosen,
	proposalText,
	kiCheckText,
	roomBesideFocusedCategory,
	deleteQuestionText,
	fieldHelp,
	listedBefore
} from '../questions/categories';
import {
	askKi,
	cancelAllocability,
	confirmAllocability,
	saveAsAllowed,
	chooseAllowed,
	kiFails,
	createCategory,
	createFuelCategory,
	deleteCategory,
	startDeletingCategory,
	saveWithoutFuel,
	openCategories,
	openCategoryEdit,
	openNewCategory,
	openPredefinedCategory,
	saveAsNotAllowed,
	saveFormAsNotAllowed,
	saveWithoutChoice,
	saveWithEnter,
	askKiWithoutName,
	chooseNotAllowed,
	rename,
	showAllowedCategories,
	usePhone,
	stayAtCategory,
	bringCategoryToBottomEdge,
	saveWithoutSortOrder
} from '../tasks/categories';

const { Given, When, Then } = createBdd(test);

Given('es gibt die umlagefähige Kategorie {string}', async ({ seed }, title: string) => {
	await seed.category(title, true);
});

Given(
	'es gibt die umlagefähige Kategorie {string}, die in der Liste gleich auf {string} folgt',
	async ({ seed }, title: string, before: string) => {
		await seed.categoryRightAfter(title, before);
	}
);

Given(
	'es gibt die eigene Kategorie {string} mit gleichem englischem Namen und der Beschreibung {string}',
	async ({ seed }, title: string, text: string) => {
		await seed.categoryNamedAlikeInEnglish(title, text);
	}
);

Given('es gibt die umlagefähige Heizkosten-Kategorie {string}', async ({ seed }, title: string) => {
	await seed.heatingCategory(title);
});

When(
	'der Liegenschaftsverwalter die umlagefähige Heizkosten-Kategorie {string} als Brennstoff erfasst',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(createFuelCategory(seed.unique(title)));
	}
);

Given(
	'das Gebäude {string} hat einen Tankbestand in der Kategorie für Brennstoff {string}',
	async ({ seed }, building: string, category: string) => {
		await seed.fuelCategoryWithStock(building, category);
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} nicht mehr als Brennstoff speichert',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(saveWithoutFuel(seed.idOf(title)!));
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die Kategorie wegen ihrer Tankbestände Brennstoff bleibt',
	async ({ verwalter }) => {
		const message =
			'Die Kategorie hat Tankbestände. Deshalb bleiben die Häkchen «Heizkosten nach dem Heizprofil verteilen» und «Brennstoff» gesetzt. Wenn Sie sie entfernen möchten, löschen Sie zuerst die Tankbestände auf der Seite des Gebäudes.';
		await verwalter.sees(errorMessageShown(message)).toBe(true);
	}
);

Given('es gibt die nicht umlagefähige Kategorie {string}', async ({ seed }, title: string) => {
	await seed.category(title, false);
});

Given(
	'eine (umlagefähige )Rechnung des Gebäudes {string} ist der Kategorie {string} zugeordnet',
	async ({ seed }, building: string, category: string) => {
		await seed.invoiceInCategory(building, category);
	}
);

Given('der Liegenschaftsverwalter ist auf der Seite "Kategorien"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openCategories);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Kategorie"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewCategory);
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Kategorie {string}',
	async ({ verwalter, seed }, category: string) => {
		await verwalter.attemptsTo(openCategoryEdit(seed.idOf(category)!));
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der vordefinierten Kategorie {string}',
	async ({ verwalter }, name: string) => {
		await verwalter.attemptsTo(openPredefinedCategory(name));
	}
);

Given('der Liegenschaftsverwalter benutzt ein Telefon', async ({ verwalter }) => {
	await verwalter.attemptsTo(usePhone);
});

Then('zeigt das Feld «Beschreibung» seinen ganzen Text', async ({ verwalter }) => {
	await verwalter.sees(hiddenDescription).toBe(0);
});

When('der Liegenschaftsverwalter nur die umlagefähigen Kategorien anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showAllowedCategories);
});

When(
	'der Liegenschaftsverwalter die umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.attemptsTo(createCategory(names.get(title) ?? seed.unique(title), true));
	}
);

When(
	'der Liegenschaftsverwalter die nicht umlagefähige Kategorie {string} erfasst',
	async ({ verwalter, seed, names }, title: string) => {
		await verwalter.attemptsTo(createCategory(names.get(title) ?? seed.unique(title), false));
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} als nicht umlagefähig speichert',
	async ({ verwalter, names }, title: string) => {
		await verwalter.attemptsTo(saveAsNotAllowed(names.get(title)!));
	}
);

When('der Liegenschaftsverwalter die Kategorie {string} löscht', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(deleteCategory(names.get(title)!));
});

When('der Liegenschaftsverwalter beginnt, die Kategorie {string} zu löschen', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(startDeletingCategory(names.get(title)!));
});

Then('sieht der Liegenschaftsverwalter die Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(categoryListed(names.get(title)!)).toBe(true);
});

Then('nicht die Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(listedCategoriesNamed(names.get(title)!)).toBe(0);
});

Then('sieht der Liegenschaftsverwalter die Kategorie {string} nicht mehr', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(pageTitle).toBe('Kategorien - Dwello');
	await verwalter.sees(listedCategoriesNamed(names.get(title)!)).toBe(0);
});

Then('ist im Formular der Kategorie {string} gewählt', async ({ verwalter }, choice: string) => {
	await verwalter.sees(choice === 'Umlagefähig' ? allowedChosen : notAllowedChosen).toBe(true);
});

Then('ist die vordefinierte Kategorie {string} nicht umlagefähig', async ({ verwalter }, name: string) => {
	await verwalter.sees(allowance(name)).toBe('Nicht umlagefähig');
});

Then('ist die Kategorie {string} nicht umlagefähig', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(allowance(names.get(title)!)).toBe('Nicht umlagefähig');
});

Then(
	'erfährt der Liegenschaftsverwalter, dass es die Kategorie {string} schon gibt',
	async ({ verwalter, names }, title: string) => {
		const message = `Eine Kategorie mit dem Namen «${names.get(title)}» existiert bereits.`;
		await verwalter.sees(errorMessageShown(message)).toBe(true);
	}
);

Then(
	'wird die Kategorie {string} von {int} Rechnung(en) verwendet',
	async ({ verwalter, names }, title: string, count: number) => {
		await verwalter.sees(invoicesOf(names.get(title)!)).toBe(`${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'}`);
	}
);

Then(
	'kann der Liegenschaftsverwalter die Kategorie {string} nicht löschen',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(categoryDeletable(names.get(title)!)).toBe(false);
	}
);

Then(
	'sieht der Liegenschaftsverwalter bei der Kategorie {string} die Beschreibung {string}',
	async ({ verwalter, names }, title: string, text: string) => {
		await verwalter.sees(descriptionOf(names.get(title)!)).toBe(text);
	}
);

When(
	'der Liegenschaftsverwalter die KI prüfen lässt, ob die Kategorie {string} umlagefähig ist',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(askKi(seed.unique(title)));
	}
);

Given('die KI hat geprüft, ob die Kategorie {string} umlagefähig ist', async ({ verwalter, seed }, title: string) => {
	await verwalter.attemptsTo(askKi(seed.unique(title)));
	await verwalter.sees(proposalText).toContain('Vorschlag der KI');
});

When('der Liegenschaftsverwalter die Kategorie trotzdem als nicht umlagefähig speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveFormAsNotAllowed);
});

When(
	'der Liegenschaftsverwalter die Kategorie {string} speichert, ohne zu wählen, ob sie umlagefähig ist',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(saveWithoutChoice(seed.unique(title)));
	}
);

Then('schlägt die KI vor, die Kategorie als umlagefähig zu erfassen', async ({ verwalter }) => {
	await verwalter.sees(allowedChosen).toBe(true);
});

Then('schlägt die KI vor, die Kategorie als nicht umlagefähig zu erfassen', async ({ verwalter }) => {
	await verwalter.sees(notAllowedChosen).toBe(true);
});

Then('begründet die KI ihren Vorschlag mit {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(proposalText).toContain(text);
});

Then('erfährt der Liegenschaftsverwalter, dass er wählen muss, ob die Kosten umlagefähig sind', async ({ verwalter }) => {
	await verwalter.sees(errorMessageShown('Wählen Sie, ob die Kosten umlagefähig sind.')).toBe(true);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass er selbst wählen muss, ob die Kosten umlagefähig sind',
	async ({ verwalter }) => {
		await verwalter.sees(proposalText).toContain('Wählen Sie selbst, ob die Kosten umlagefähig sind');
	}
);

Then('ist weder umlagefähig noch nicht umlagefähig gewählt', async ({ verwalter }) => {
	await verwalter.sees(allowedChosen).toBe(false);
	await verwalter.sees(notAllowedChosen).toBe(false);
});

Then(
	'nennt die vordefinierte Kategorie {string} als Grund {string}',
	async ({ verwalter }, name: string, text: string) => {
		await verwalter.sees(reasonOf(name)).toContain(text);
	}
);

Then('nennt die Kategorie als Grund {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(formReasonText).toContain(text);
});

Then('steht der Grund der Kategorie unter der Bezeichnung {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(formReasonLabelText).toBe(label);
});

Then('nennt die Frage der Umlagefähigkeit den Grund {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(allowanceQuestionDescription).toContain(text);
});

Then(
	'nennt die vordefinierte Kategorie {string} keinen Grund ihrer Umlagefähigkeit',
	async ({ verwalter }, name: string) => {
		await verwalter.sees(reasonsOf(name)).toBe(0);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass der Mieter umlagefähige Kosten nur bezahlt, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt',
	async ({ verwalter }) => {
		await verwalter.sees(contractHint).toContain('nur, wenn der Mietvertrag jede dieser Kostenarten einzeln nennt');
	}
);

Given(
	'die vordefinierte Kategorie {string} ist als nicht umlagefähig gespeichert',
	async ({ seed }, name: string) => {
		await seed.predefinedCategoryAllowance(name, false);
	}
);

Given('die KI ist nicht erreichbar', async ({ verwalter }) => {
	await verwalter.attemptsTo(kiFails);
});

Then('erfährt der Liegenschaftsverwalter, dass die KI sich nicht sicher ist', async ({ verwalter }) => {
	await verwalter.sees(proposalText).toContain('Die KI ist sich nicht sicher.');
});

Then('erfährt der Liegenschaftsverwalter, dass Kosten im Zweifel nicht umlagefähig sind', async ({ verwalter }) => {
	await verwalter.sees(proposalText).toContain('Im Zweifel: nicht umlagefähig.');
});

Then(
	'erfährt der Liegenschaftsverwalter, dass die KI nicht erreichbar ist und er es später nochmals versuchen kann',
	async ({ verwalter }) => {
		await verwalter.sees(proposalText).toContain('Die KI ist nicht erreichbar. Versuchen Sie es später nochmals');
	}
);

Then(
	'ist die vordefinierte Kategorie {string} als {string} gekennzeichnet',
	async ({ verwalter }, name: string, kind: string) => {
		await verwalter.sees(kindOf(name)).toBe(kind);
	}
);

Then('ist die eigene Kategorie {string} als {string} gekennzeichnet', async ({ verwalter, names }, title: string, kind: string) => {
	await verwalter.sees(kindOf(names.get(title)!)).toBe(kind);
});

Then(
	'kann der Liegenschaftsverwalter die vordefinierte Kategorie {string} nicht löschen',
	async ({ verwalter }, name: string) => {
		await verwalter.sees(categoryDeletable(name)).toBe(false);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass sich die vordefinierte Kategorie {string} nicht löschen lässt, weil Dwello sie mitliefert',
	async ({ verwalter }, name: string) => {
		await verwalter
			.sees(whyNotDeletable(name))
			.toContain('Kategorien «Von Dwello» lassen sich nicht löschen, weil Dwello sie mitliefert.');
	}
);

Then('erfährt der Liegenschaftsverwalter, dass Dwello die Kategorie mitliefert', async ({ verwalter }) => {
	await verwalter.sees(predefinedHintText).toContain('Dwello liefert diese Kategorie mit');
	await verwalter.sees(predefinedHintText).toContain('Sie lässt sich nicht löschen.');
});

Then(
	'erfährt der Liegenschaftsverwalter, dass der Mieter Kosten des Vermieters nicht schuldet, auch wenn er die Kategorie auf umlagefähig stellt',
	async ({ verwalter }) => {
		await verwalter
			.sees(predefinedHintText)
			.toContain('Wählen Sie «Umlagefähig», schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht.');
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die KI womöglich eine andere Kategorie vorschlägt, wenn er den Namen oder die Beschreibung ändert',
	async ({ verwalter }) => {
		await verwalter
			.sees(predefinedHintText)
			.toContain('Ändern Sie den Namen oder die Beschreibung, schlägt die KI für neue Rechnungen womöglich eine andere Kategorie vor.');
	}
);

// #452 Punkt 1 (#302)
Then('lässt sich nicht ändern, ob die Kategorie zu den Heizkosten zählt', async ({ verwalter }) => {
	await verwalter.sees(heatingChangeable).toBe(false);
});

Then('ist die Kategorie als Heizkosten markiert', async ({ verwalter }) => {
	await verwalter.sees(heatingChecked).toBe(true);
});

Then('erklärt das Kategorieformular {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(heatingHelpText).toContain(text);
});

// #452 Punkt 2 (#309)
When('der Liegenschaftsverwalter die vordefinierte Kategorie {string} als umlagefähig speichert', async ({ verwalter }, name: string) => {
	await verwalter.attemptsTo(saveAsAllowed(name));
});

Then('fragt Dwello {string}', async ({ verwalter, names }, question: string) => {
	const named = [...names.entries()].reduce((text, [title, name]) => text.replace(`«${title}»`, `«${name}»`), question);
	await verwalter.sees(allocabilityQuestionText).toBe(named);
});

Then('erklärt die Rückfrage {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(allocabilityConsequence).toContain(text);
});

When('der Liegenschaftsverwalter das Umstellen bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmAllocability);
});

When('der Liegenschaftsverwalter das Umstellen abbricht', async ({ verwalter }) => {
	await verwalter.attemptsTo(cancelAllocability);
});

Then('ist die Kategorie {string} umlagefähig', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(allowance(names.get(title)!)).toBe('Umlagefähig');
});

// #1029: the consequences of the info box describe the question, also once the reason is gone
When('der Liegenschaftsverwalter die Kategorie als umlagefähig wählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseAllowed);
});

Then('nennt die Frage der Umlagefähigkeit die Folge {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(allowanceQuestionDescription).toContain(text);
});

// #1096: a new confirmation replaces the older one
Then('bestätigt Dwello nur das Löschen der Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(shownConfirmations).toEqual([`Kategorie «${names.get(title)}» gelöscht`]);
});

Given('der Liegenschaftsverwalter ist in der Liste bei der Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(stayAtCategory(names.get(title)!));
});

// #1096: the focus goes to the next row of the list, not to the page title
Then('steht der Fokus auf der Kategorie {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(focusedText).toBe(names.get(title));
});

Given('die Kategorie {string} steht am unteren Rand des Fensters', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(bringCategoryToBottomEdge(names.get(title)!));
});

// #1113: the confirmation keeps clear of the whole row, so none of its buttons lies under it
Then('verdeckt die Erfolgsmeldung die Kategorie nicht, die den Fokus hat', async ({ verwalter }) => {
	await verwalter.sees(roomBesideFocusedCategory).toBeGreaterThanOrEqual(8);
});

// #672 (Helga P-3, P-5, P-6, P-9)
Then('erklärt das Feld «Beschreibung» {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(fieldHelp.Beschreibung).toContain(text);
});

Then('erklärt das Feld «Reihenfolge» {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(fieldHelp.Reihenfolge).toContain(text);
});

Then('erklärt die Rückfrage zum Löschen {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(deleteQuestionText).toContain(text);
});

Given('es gibt die umlagefähige Kategorie {string} mit der Reihenfolge {int}', async ({ seed }, title: string, sortOrder: number) => {
	await seed.categoryWithSortOrder(title, sortOrder);
});

When('der Liegenschaftsverwalter die Kategorie ohne Reihenfolge speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveWithoutSortOrder);
});

Then(
	'steht die Kategorie {string} in der Liste vor der vordefinierten Kategorie {string}',
	async ({ verwalter, names }, title: string, predefined: string) => {
		await verwalter.sees(listedBefore(names.get(title)!, predefined)).toBe(true);
	}
);

// #678 (Sven P-5, decided): the Enter key saves; the KI checks only by its button
When(
	'der Liegenschaftsverwalter die nicht umlagefähige Kategorie {string} mit der Eingabetaste speichert',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(saveWithEnter(seed.unique(title), false));
	}
);

When(
	'der Liegenschaftsverwalter die Kategorie {string} mit der Eingabetaste speichert, ohne zu wählen, ob sie umlagefähig ist',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(saveWithEnter(seed.unique(title)));
	}
);

// #678 (Marco P-3, Helga P-4): the help as a screen reader reads it with the question
Then('erklärt die Frage der Umlagefähigkeit {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(allowanceQuestionDescription).toContain(text);
});

// a negative check: the step before it names what the question explains instead
Then('die Frage der Umlagefähigkeit nennt nicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(allowanceQuestionDescription).not.toContain(text);
});

// #678 (Helga P-5)
When('der Liegenschaftsverwalter die KI prüfen lässt, ohne einen Namen einzugeben', async ({ verwalter }) => {
	await verwalter.attemptsTo(askKiWithoutName);
});

Given('der Liegenschaftsverwalter hat die Kategorie als nicht umlagefähig gewählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseNotAllowed);
});

Given('der Liegenschaftsverwalter hat die Kategorie als umlagefähig gewählt', async ({ verwalter }) => {
	await verwalter.attemptsTo(chooseAllowed);
});

// #678 (Helga P-7, P-9, P-10; Sven P-11): what Dwello says about the KI's check, next to «Von der KI prüfen lassen»
Then('sagt Dwello zur Prüfung durch die KI {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(kiCheckText).toContain(text);
});

// a negative check: the step before it names what Dwello says instead
Then('sagt Dwello zur Prüfung durch die KI nicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(kiCheckText).not.toContain(text);
});

When('der Liegenschaftsverwalter die Kategorie in {string} umbenennt', async ({ verwalter, seed }, title: string) => {
	await verwalter.attemptsTo(rename(seed.unique(title)));
});
