import { m } from '$lib/paraglide/messages';
import { getLocale } from '$lib/paraglide/runtime';

type Rows = { invoices: { categoryName?: string }[] }[];

// The categories of a preview hint's invoices: one by its own text, several listed in the plural
function categoriesText(
	rows: Rows,
	one: (category: string) => string,
	many: (categories: string) => string,
	name = (n: string) => n
) {
	const names = [
		...new Set(rows.flatMap((row) => row.invoices.map((invoice) => invoice.categoryName ?? '')))
	];
	return names.length === 1
		? one(names[0])
		: many(new Intl.ListFormat(`${getLocale()}-CH`).format(names.map(name)));
}

/** The hint on heating invoices without Leistungszeitraum beside ones with (#339): its categories, each quoted (V-15) */
export const heatingWholeText = (rows: Rows) =>
	categoriesText(
		rows,
		(category) => m.statements_heating_whole_text({ category }),
		(categories) => m.statements_heating_whole_text_many({ categories }),
		(name) => m.statements_heating_category({ name })
	);

/** #1469 (Fachreview 1469-2): the tank's category of each building, several in the plural, without quotation marks */
export const tankNotDeliveryText = (rows: Rows) =>
	categoriesText(
		rows,
		(category) => m.statements_finding_tank_not_delivery({ category }),
		(categories) => m.statements_finding_tank_not_delivery_many({ categories })
	);
