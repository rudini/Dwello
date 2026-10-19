import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { errorMessageShown } from '../questions/form';
import { pageTitle } from '../questions/navigation';
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
	hiddenDescription,
	kindOf,
	predefinedHintText,
	whyNotDeletable,
	reasonOf,
	reasonsOf,
	allowedChosen,
	listedCategoriesNamed,
	notAllowedChosen,
	proposalText
} from '../questions/categories';
import {
	askKi,
	cancelAllocability,
	confirmAllocability,
	saveAsAllowed,
	kiFails,
	createCategory,
	createFuelCategory,
	deleteCategory,
	saveWithoutFuel,
	openCategories,
	openCategoryEdit,
	openNewCategory,
	openPredefinedCategory,
	saveAsNotAllowed,
	saveFormAsNotAllowed,
	saveWithoutChoice,
	showAllowedCategories,
	usePhone
} from '../tasks/categories';

const { Given, When, Then } = createBdd(test);

Given('es gibt die umlagefähige Kategorie {string}', async ({ seed }, title: string) => {
	await seed.category(title, true);
});

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
