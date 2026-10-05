import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { changedAreas } from '../ui-screenshots/changed-areas';

// White image of the given size, with black pixels at the given points
function image(width: number, height: number, ...black: [number, number][]) {
	const png = new PNG({ width, height });
	png.data.fill(255);
	for (const [x, y] of black) png.data.fill(0, (y * width + x) * 4, (y * width + x) * 4 + 3);
	return PNG.sync.write(png);
}

describe('changedAreas', () => {
	it('finds nothing in identical screenshots', () => {
		expect(changedAreas(image(64, 64, [5, 5]), image(64, 64, [5, 5]))).toEqual([]);
	});

	it('frames the cell of a changed pixel', () => {
		expect(changedAreas(image(64, 64), image(64, 64, [20, 40]))).toEqual([
			{ x: 16, y: 32, width: 16, height: 16 }
		]);
	});

	it('joins touching cells into one area and keeps distant ones apart', () => {
		expect(changedAreas(image(64, 64), image(64, 64, [1, 1], [17, 17], [60, 60]))).toEqual([
			{ x: 0, y: 0, width: 32, height: 32 },
			{ x: 48, y: 48, width: 16, height: 16 }
		]);
	});

	it('marks what a longer page adds below the end of the old one', () => {
		expect(changedAreas(image(32, 16), image(32, 40))).toEqual([
			{ x: 0, y: 16, width: 32, height: 24 }
		]);
	});
});
