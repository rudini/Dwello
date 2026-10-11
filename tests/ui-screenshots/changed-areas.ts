import { PNG } from 'pngjs';

export type Area = { x: number; y: number; width: number; height: number };

// Index (row * columns + column) of every cell with a pixel that differs, or that lies beyond the end of `a`
function changedCells(a: PNG, b: PNG, cell: number, columns: number) {
	const cells = new Set<number>();
	for (let y = 0; y < b.height; y++) {
		for (let x = 0; x < b.width; x++) {
			const i = (y * b.width + x) * 4;
			const j = (y * a.width + x) * 4;
			const outside = x >= a.width || y >= a.height;
			if (outside || a.data.readUInt32BE(j) !== b.data.readUInt32BE(i)) {
				cells.add(Math.floor(y / cell) * columns + Math.floor(x / cell));
			}
		}
	}
	return cells;
}

// Removes the cells touching `start` (also diagonally, transitively) from `cells` and returns their bounds in cells
function takeGroup(cells: Set<number>, start: number, columns: number) {
	const stack = [start];
	cells.delete(start);
	const bounds = { left: Infinity, top: Infinity, right: 0, bottom: 0 };
	while (stack.length) {
		const index = stack.pop()!;
		const column = index % columns;
		const row = Math.floor(index / columns);
		bounds.left = Math.min(bounds.left, column);
		bounds.top = Math.min(bounds.top, row);
		bounds.right = Math.max(bounds.right, column);
		bounds.bottom = Math.max(bounds.bottom, row);
		const neighbours = [-1, 0, 1].flatMap((dy) =>
			[-1, 0, 1]
				.filter((dx) => column + dx >= 0 && column + dx < columns)
				.map((dx) => (row + dy) * columns + column + dx)
		);
		stack.push(...neighbours.filter((next) => cells.delete(next)));
	}
	return bounds;
}

/**
 * Areas where two screenshots differ, in pixels of `after`: the page is split into square cells,
 * every cell with a differing pixel (or beyond the end of `before`) is changed, and touching cells form one area.
 */
export function changedAreas(before: Buffer, after: Buffer, cell = 16): Area[] {
	const a = PNG.sync.read(before);
	const b = PNG.sync.read(after);
	const columns = Math.ceil(b.width / cell);
	const cells = changedCells(a, b, cell, columns);
	const areas: Area[] = [];
	for (const start of cells) {
		const { left, top, right, bottom } = takeGroup(cells, start, columns);
		const x = left * cell;
		const y = top * cell;
		areas.push({
			x,
			y,
			width: Math.min((right + 1) * cell, b.width) - x,
			height: Math.min((bottom + 1) * cell, b.height) - y
		});
	}
	return areas;
}

/** Same size and the same pixels, however the PNG files are encoded: a page without any visible change */
export function looksTheSame(a: Buffer, b: Buffer): boolean {
	const before = PNG.sync.read(a);
	const after = PNG.sync.read(b);
	return before.width === after.width && before.height === after.height && before.data.equals(after.data);
}

/**
 * The image with every area framed as the pages are: a red line 3 px wide, 2 px outside the area (#dc2626)
 */
export function markAreas(image: Buffer, areas: Area[]): Buffer {
	const png = PNG.sync.read(image);
	const paint = (x: number, y: number) => {
		if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
		png.data.set([220, 38, 38, 255], (y * png.width + x) * 4);
	};
	for (const { x, y, width, height } of areas) {
		for (let d = 3; d <= 5; d++) {
			for (let i = x - d; i < x + width + d; i++) {
				paint(i, y - d);
				paint(i, y + height - 1 + d);
			}
			for (let j = y - d; j < y + height + d; j++) {
				paint(x - d, j);
				paint(x + width - 1 + d, j);
			}
		}
	}
	return PNG.sync.write(png);
}
