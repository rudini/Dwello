import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { changedAreas, looksTheSame, markAreas } from '../ui-screenshots/changed-areas';

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

// Without a browser (PDF pages): the changed areas are framed in the image itself
describe('markAreas', () => {
	it('frames an area in red, just outside it, and leaves the inside as it is', () => {
		const marked = PNG.sync.read(markAreas(image(64, 64), [{ x: 16, y: 16, width: 16, height: 16 }]));
		const pixel = (x: number, y: number) => [...marked.data.subarray((y * 64 + x) * 4, (y * 64 + x) * 4 + 3)];

		expect(pixel(12, 20)).toEqual([220, 38, 38]); // left edge of the frame, 2 px off the area like the pages' outline
		expect(pixel(20, 20)).toEqual([255, 255, 255]); // inside
		expect(pixel(2, 2)).toEqual([255, 255, 255]); // far outside
	});
});

describe('looksTheSame', () => {
	it('erkennt gleich aussehende Screenshots, auch wenn die PNG-Datei anders kodiert ist', () => {
		const png = PNG.sync.read(image(32, 32, [3, 3]));
		const recoded = PNG.sync.write(png, { deflateLevel: 0 });

		expect(recoded.equals(image(32, 32, [3, 3]))).toBe(false);
		expect(looksTheSame(image(32, 32, [3, 3]), recoded)).toBe(true);
	});

	it('sieht einen geänderten Pixel als Änderung', () => {
		expect(looksTheSame(image(32, 32), image(32, 32, [10, 20]))).toBe(false);
	});

	it('sieht eine kürzer gewordene Seite als Änderung', () => {
		expect(looksTheSame(image(32, 48), image(32, 32))).toBe(false);
	});
});
