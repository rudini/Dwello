/**
 * #521: the PDF of the letter with which the tenants of a contract agree to a new Abrechnungsperiode, from the
 * Firmenadresse to the tenant's Korrespondenzadresse in the tenant's Sprache, like the reminder (Fachreview 521-1)
 */

import { CodedError } from './coded-error';
import { consentLetter } from './consent-letter';
import type { Language } from './pdf.service';
import { formatSwissDate } from './pdf-format';
import { renderReminderPdf } from './reminder-pdf';
import { sender } from './reminder.service';
import { consentOfContract } from './statement-run.service';
import { getTenant } from './tenant.service';
import { swissToday } from './today';

/** The letter as a file (name, kind, PDF); null for an unknown contract; refused without a short period after a change */
export async function consentLetterPdf(contractId: string) {
	const found = await consentOfContract(contractId);
	if (!found) return null;
	const { contract, type, consent } = found;
	// Fachreview 521-1 V-1: without an earlier Abrechnungsperiode the letter would have none to name
	if (!consent) throw new CodedError('CONSENT_LETTER_NONE', 'The contract has no short Abrechnungsperiode after a change of the Abrechnungsperiode');
	const tenant = (await getTenant(contract.tenantId))!;
	const from = await sender();
	const today = swissToday();
	const { building } = contract;
	const letter = consentLetter({
		...consent,
		type,
		contractEnd: contract.endDate,
		date: today,
		apartment: contract.apartment.number,
		address: `${building.address}, ${building.postalCode} ${building.city}`,
		tenant,
		sender: from.name,
		language: tenant.language as Language
	});
	const pdf = await renderReminderPdf(letter, from, { ...tenant, name: `${tenant.firstName} ${tenant.lastName}` }, formatSwissDate(today));
	// one name per tenant in the letter's language, like the reminder (Fachreview 521-2 V-9)
	const fileName = `${letter.title} ${contract.apartment.number} ${tenant.lastName}.pdf`.replace(/[\\/:*?"<>|]/g, '_');
	return { fileName, mimeType: 'application/pdf', content: pdf };
}
