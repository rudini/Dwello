/**
 * #528: a Kategorie billed with several Verteilschlüssel has a line per key (`calculation.service.ts`). Its key is the
 * one with the largest costs, on equal costs that of the latest invoice, as the invoice form proposes it (Fachreview
 * 528-1 V-4); an invoice without key counts as one (#379, V-8). The Veränderung Tankbestand is no invoice (V-5).
 */

type Billed = { id: string; description: string; fuelStock?: unknown };
type Part = {
	categoryId: string | null;
	distributionKeyId: string | null;
	amount: number;
	invoices: Billed[];
};

export type SplitKey = {
	categoryId: string | null;
	keyId: string | null;
	mainKeyId: string | null;
	invoices: { id: string; description: string }[];
};

/** The items by key, in the order of each key's first item (Map.groupBy, ES2024) */
export function groupBy<T, K>(items: Iterable<T>, keyOf: (item: T) => K) {
	const groups = new Map<K, T[]>();
	for (const item of items) groups.set(keyOf(item), [...(groups.get(keyOf(item)) ?? []), item]);
	return groups;
}

/** Per Kategorie with several keys, the invoices of each key but its own; in the order of the parts */
export function splitKeysOf(parts: Part[]): SplitKey[] {
	const byCategory = groupBy(parts, (part) => part.categoryId);
	return [...byCategory].flatMap(([categoryId, ofCategory]) => {
		const byKey = groupBy(ofCategory, (part) => part.distributionKeyId);
		if (byKey.size < 2) return [];
		const total = (key: string | null) =>
			byKey.get(key)!.reduce((sum, part) => sum + part.amount, 0);
		const mainKeyId = ofCategory.reduceRight(
			(main, part) => (total(part.distributionKeyId) > total(main) ? part.distributionKeyId : main),
			ofCategory.at(-1)!.distributionKeyId
		);
		return [...byKey]
			.filter(([keyId]) => keyId !== mainKeyId)
			.map(([keyId, ofKey]) => ({
				categoryId,
				keyId,
				mainKeyId,
				invoices: ofKey.flatMap((part) =>
					part.invoices
						.filter((invoice) => !invoice.fuelStock)
						.map(({ id, description }) => ({ id, description }))
				)
			}))
			.filter((split) => split.invoices.length > 0);
	});
}
