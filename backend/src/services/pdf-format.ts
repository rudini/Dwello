/** Swiss formats of the printed documents, independent of the server's locale */

/** 2024-01-01 → 01.01.2024 */
export function formatSwissDate(isoDate: string): string {
	const [year, month, day] = isoDate.slice(0, 10).split('-');
	return `${day}.${month}.${year}`;
}

/** 1234.5 → 1'234.50: apostrophe between thousands, two places for the Rappen */
export function formatCHF(amount: number): string {
	const [francs, rappen] = Math.abs(amount).toFixed(2).split('.');
	const grouped = francs.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
	return `${amount < 0 && Number(amount.toFixed(2)) !== 0 ? '-' : ''}${grouped}.${rappen}`;
}

/** Commercial rounding to the Rappen; precision 12 first, so 784.1249999… (float noise of 784.125) becomes 784.13 */
export const roundToRappen = (amount: number) => Math.round(Number((amount * 100).toPrecision(12))) / 100;
/** The Saldo the tenant pays or gets back, commercially to 5 Rappen; a refund the same way as a payment */
export const roundTo5Rappen = (amount: number) =>
	(Math.sign(amount) * Math.round(Number((Math.abs(amount) * 20).toPrecision(12)))) / 20 + 0; // + 0: no −0, NaN stays NaN
