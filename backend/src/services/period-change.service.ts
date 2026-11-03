import { same, shortPeriodOfChange } from './accounting-period';
import { periodSetting } from './config.service';
import { listContracts } from './contract.service';
import { consentOfContract } from './statement-run.service';
import { daysAfter, swissToday } from './today';

/**
 * #1036 (Option 1): after a stored change of the setting «Abrechnungsperiode», its short period, the first day of the
 * new one, whether that has begun already, and the contracts with a letter for the tenants' consent there; null without
 * a change
 */
export async function periodChange(today = swissToday()) {
	const [{ type, change }, { contracts }] = await Promise.all([periodSetting(), listContracts({ limit: 1000 })]);
	const short = shortPeriodOfChange(type, change);
	if (!short) return null;
	// each contract's letter as its own page offers it (statement-run.service), not a second reading of the rule; the
	// statements stay out of this module (fitness Ä1, Stable Dependencies)
	const letters = await Promise.all(contracts.map((c) => consentOfContract(c.id)));
	const consenting = contracts.filter((_, i) => {
		const consent = letters[i]?.consent;
		return !!consent && same(consent.short, short);
	});
	return {
		short,
		start: daysAfter(short.end, 1),
		started: short.end < today,
		contracts: consenting.map(({ id, tenantName, apartmentNumber }) => ({ id, tenantName, apartmentNumber }))
	};
}
