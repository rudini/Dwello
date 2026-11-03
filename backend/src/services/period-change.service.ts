import { consentPeriod, same, shortPeriodOfChange } from './accounting-period';
import { periodSetting } from './config.service';
import { listContracts } from './contract.service';
import { listStatements } from './statement.service';
import { daysAfter, swissToday } from './today';

/**
 * #1036 (Option 1): after a stored change of the setting «Abrechnungsperiode», its short period, the first day of the
 * new one, whether that has begun already, and the contracts with a letter for the tenants' consent there; null without
 * a change
 */
export async function periodChange(today = swissToday()) {
	const [{ type, change }, { contracts }, { statements }] = await Promise.all([
		periodSetting(),
		listContracts({ limit: 1000 }),
		listStatements({ limit: 1000 })
	]);
	const short = shortPeriodOfChange(type, change);
	if (!short) return null;
	const consenting = contracts.filter((c) => {
		const ofBuilding = statements.filter((s) => s.building?.id === c.buildingId);
		const found = consentPeriod(type, c, statements.filter((s) => s.contractId === c.id), ofBuilding, today, change);
		return !!found && same(found.short, short);
	});
	return {
		short,
		start: daysAfter(short.end, 1),
		started: short.end < today,
		contracts: consenting.map(({ id, tenantName, apartmentNumber }) => ({ id, tenantName, apartmentNumber }))
	};
}
