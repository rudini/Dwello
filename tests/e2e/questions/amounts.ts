// Amounts as the app shows them in Swiss format («CHF 1’031.03»), read as francs so the UI and the API driver answer alike
const AMOUNT = String.raw`CHF \d{1,3}(?:’\d{3})*\.\d{2}`;

/** «CHF 1’250.50» → 1250.5 */
export const francs = (amount: string) => Number(amount.replace(/[^\d.]/g, ''));

/** A Saldo in words: «Nachzahlung CHF 12.50» → 12.5, «Rückerstattung CHF 3.00» → -3 */
export const signedFrancs = (saldo: string) => (saldo.startsWith('Rückerstattung') ? -1 : 1) * francs(saldo) || 0; // no -0

/** The amount right after the label in the text (any amount without a label), in francs; the text itself when it shows no such amount, so a failing
 * check names what the page says */
export const amountAfter = (label: string, text: string | null, read: (shown: string) => number = francs) => {
	const shown = text?.match(new RegExp(label ? `${label} ${AMOUNT}` : AMOUNT))?.[0];
	return shown ? read(shown) : text;
};
