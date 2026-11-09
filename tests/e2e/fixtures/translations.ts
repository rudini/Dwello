// #689: names of an own record in the languages a step lists («Französisch und Englisch», «Italienisch»)
const fields = { Französisch: 'nameFR', Italienisch: 'nameIT', Englisch: 'nameEN' } as const;

export const translationsIn = (languages: string, name: string) =>
	Object.fromEntries(
		languages.split(/, | und /).map((language) => {
			const field = fields[language as keyof typeof fields];
			if (!field) throw new Error(`Unbekannte Sprache: ${language}`);
			return [field, `${name} (${field.slice(4).toLowerCase()})`];
		})
	);
