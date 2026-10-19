import { describe, expect, it } from 'bun:test';
import { advanceLines } from '../services/advance-payment.service';
import { roundToRappen } from '../services/pdf-format';

// the Akonto total of a span with one amount: the sum of its lines, as a statement stores it
const totalOf = (amount: number) => (start: string, end: string) =>
	roundToRappen(
		advanceLines([{ validFrom: start, amount }], new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`)).reduce(
			(sum, line) => sum + line.total,
			0
		)
	);
const total95 = totalOf(95);
const total = totalOf(150);

describe('Akontobeiträge einer Abrechnungsperiode', () => {
	it('zählt ein volles Jahr als zwölf Monatsbeiträge', () => {
		expect(total('2023-01-01', '2023-12-31')).toBe(1800);
	});

	it('zählt auch ein Schaltjahr als zwölf Monatsbeiträge', () => {
		expect(total('2024-01-01', '2024-12-31')).toBe(1800);
	});

	it('zählt ein Halbjahr als sechs Monatsbeiträge', () => {
		expect(total('2024-01-01', '2024-06-30')).toBe(900);
	});

	it('rechnet einen angebrochenen Monat tagesgenau an', () => {
		expect(total('2024-01-16', '2024-01-31')).toBe(77.42);
	});

	it('rechnet Ein- und Auszug unter dem Jahr pro Kalendermonat ab', () => {
		expect(total('2024-03-16', '2024-09-15')).toBe(902.42);
	});
});

// #464: each Akonto amount for the months it applied, one line per amount and per split month (domain review F-2, F-9)
describe('Akonto mit Gültig ab', () => {
	const day = (iso: string) => new Date(`${iso}T00:00:00Z`);
	const lines = (amounts: { validFrom: string; amount: number }[], start: string, end: string) =>
		advanceLines(amounts, day(start), day(end));

	it('zählt jeden Betrag für die Monate, in denen er galt', () => {
		expect(lines([{ validFrom: '2024-01-01', amount: 50 }, { validFrom: '2024-07-01', amount: 80 }], '2024-05-01', '2024-12-31')).toEqual([
			{ from: '2024-05-01', to: '2024-06-30', months: 2, amount: 50, total: 100 },
			{ from: '2024-07-01', to: '2024-12-31', months: 6, amount: 80, total: 480 }
		]);
	});

	it('zeigt einen angebrochenen Monat mit seinen Tagen', () => {
		expect(lines([{ validFrom: '2024-03-16', amount: 120 }], '2024-03-16', '2024-04-30')).toEqual([
			{ from: '2024-03-16', to: '2024-03-31', days: 16, daysInMonth: 31, amount: 120, total: 61.94 },
			{ from: '2024-04-01', to: '2024-04-30', months: 1, amount: 120, total: 120 }
		]);
	});

	it('rundet jede Zeile, damit die Zeilen das Total ergeben (Fachreview F-2)', () => {
		expect(total95('2024-01-02', '2024-03-02')).toBe(193.07);
	});

	it('lässt den ersten Betrag ab dem Vertragsbeginn gelten', () => {
		expect(lines([{ validFrom: '2024-07-01', amount: 80 }], '2024-05-01', '2024-06-30')).toEqual([
			{ from: '2024-05-01', to: '2024-06-30', months: 2, amount: 80, total: 160 }
		]);
	});
});

