type Position = { id: string; categoryId?: string | null; distributionKeyId?: string | null };
const pairOf = (position: Position) =>
	`${position.categoryId ?? position.id}/${position.distributionKeyId ?? position.id}`;

/**
 * A key for each position of a statement that outlasts a recalculation, which gives the positions new ids (#1366):
 * its category and key (the id for one deleted before #1160/#1255), and how many positions of that pair came before
 * it, as positions saved through the API may repeat a pair (fallback review of #1369)
 */
export const withPositionKeys = <P extends Position>(positions: P[]) =>
	positions.map((item, index) => ({
		item,
		key: `${pairOf(item)}/${positions.slice(0, index).filter((other) => pairOf(other) === pairOf(item)).length}`
	}));
