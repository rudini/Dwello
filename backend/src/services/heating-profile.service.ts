/**
 * Heating Profile Service
 * Business logic for heating distribution profiles
 *
 * The predefined profiles (Heizung + Warmwasser, Mittelland, Bergregion, Tessin) come from migrations/0002_stammdaten.sql
 */

import { eq, sql, asc, ilike, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { heatingProfiles, type HeatingProfile, type NewHeatingProfile } from '../db/schema';
import { CodedError, refusal, type ErrorCode, type Refusal } from './coded-error';
import { Conflict } from './conflict';
import { isDefaultSetting } from './default-setting';

export interface HeatingProfileFilters {
	search?: string;
	type?: 'predefined' | 'custom';
	limit?: number;
	offset?: number;
}

export interface MonthlyPercentages {
	january: number;
	february: number;
	march: number;
	april: number;
	may: number;
	june: number;
	july: number;
	august: number;
	september: number;
	october: number;
	november: number;
	december: number;
}

/** Columns holding a profile's monthly shares, January to December */
const percentageFields = [
	'januaryPct', 'februaryPct', 'marchPct', 'aprilPct', 'mayPct', 'junePct',
	'julyPct', 'augustPct', 'septemberPct', 'octoberPct', 'novemberPct', 'decemberPct'
] as const;

type MonthlyShares = Pick<HeatingProfile, (typeof percentageFields)[number]>;

/**
 * List all heating profiles with optional filters
 */
export async function listHeatingProfiles(filters: HeatingProfileFilters = {}): Promise<{
	heatingProfiles: HeatingProfile[];
	total: number;
}> {
	const { search, type, limit = 100, offset = 0 } = filters;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(ilike(heatingProfiles.name, `%${search}%`));
	}

	if (type) {
		conditions.push(eq(heatingProfiles.type, type));
	}

	// Get heating profiles
	const profilesQuery = db
		.select()
		.from(heatingProfiles)
		.orderBy(asc(heatingProfiles.type), asc(heatingProfiles.name))
		.limit(limit)
		.offset(offset);

	// Apply conditions if any
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const results = whereClause
		? await profilesQuery.where(whereClause)
		: await profilesQuery;

	// Get total count
	const countQuery = db.select({ count: sql<number>`count(*)` }).from(heatingProfiles);

	const [{ count: total }] = whereClause
		? await countQuery.where(whereClause)
		: await countQuery;

	return {
		heatingProfiles: results,
		total: Number(total)
	};
}

/**
 * Get a single heating profile by ID
 */
export async function getHeatingProfile(id: string): Promise<HeatingProfile | null> {
	const [profile] = await db
		.select()
		.from(heatingProfiles)
		.where(eq(heatingProfiles.id, id))
		.limit(1);

	return profile || null;
}

/**
 * Get heating profile by name (for lookups)
 */
export async function getHeatingProfileByName(name: string): Promise<HeatingProfile | null> {
	const [profile] = await db
		.select()
		.from(heatingProfiles)
		.where(ilike(heatingProfiles.name, name))
		.limit(1);

	return profile || null;
}


/**
 * Validate that monthly percentages sum to approximately 100%
 */
export function validatePercentages(percentages: MonthlyPercentages): {
	isValid: boolean;
	sum: number;
	error?: string;
	errorCode?: ErrorCode;
} {
	const sum =
		percentages.january +
		percentages.february +
		percentages.march +
		percentages.april +
		percentages.may +
		percentages.june +
		percentages.july +
		percentages.august +
		percentages.september +
		percentages.october +
		percentages.november +
		percentages.december;

	// Allow small tolerance for rounding errors
	const tolerance = 0.1;
	if (sum < 100 - tolerance || sum > 100 + tolerance) {
		return {
			isValid: false,
			sum,
			error: `Die Monatsanteile müssen zusammen 100 % ergeben (aktuell ${Number(sum.toFixed(2))} %).`,
			errorCode: { code: 'HEATING_PROFILE_SHARES_SUM', params: { sum: Number(sum.toFixed(2)) } }
		};
	}

	// Check for negative percentages
	for (const [month, value] of Object.entries(percentages)) {
		if (value < 0) {
			return {
				isValid: false,
				sum,
				error: `Der Anteil für ${month} darf nicht negativ sein.`,
				errorCode: { code: 'HEATING_PROFILE_SHARE_NEGATIVE', params: { month } }
			};
		}
	}

	return { isValid: true, sum };
}

const nameTaken = (name: string) =>
	new Conflict('HEATING_PROFILE_NAME_TAKEN', `Ein Heizprofil mit dem Namen "${name}" existiert bereits.`, { name });

const invalidShares = ({ error, errorCode }: ReturnType<typeof validatePercentages>) =>
	new CodedError(errorCode!.code, error!, errorCode!.params);

/**
 * Create a new heating profile
 */
export async function createHeatingProfile(data: NewHeatingProfile): Promise<HeatingProfile> {
	// Check for duplicate name
	const existing = await getHeatingProfileByName(data.name);
	if (existing) {
		throw nameTaken(data.name);
	}

	// Validate percentages
	const validation = validatePercentages(getMonthlyPercentages(data));
	if (!validation.isValid) {
		throw invalidShares(validation);
	}

	const [profile] = await db.insert(heatingProfiles).values(data).returning();
	return profile;
}

/**
 * Update an existing heating profile
 */
export async function updateHeatingProfile(
	id: string,
	data: Partial<NewHeatingProfile>
): Promise<HeatingProfile | null> {
	// Check if profile exists
	const existing = await getHeatingProfile(id);
	if (!existing) {
		return null;
	}

	// Don't allow changing type
	if (data.type && data.type !== existing.type) {
		throw new CodedError('HEATING_PROFILE_TYPE_FIXED', 'Cannot change heating profile type');
	}

	// Don't allow modifying predefined profiles' percentages
	if (existing.type === 'predefined' && percentageFields.some((field) => data[field] !== undefined)) {
		throw new CodedError('HEATING_PROFILE_SHARES_FIXED', 'Die Monatsanteile vordefinierter Heizprofile können nicht geändert werden.');
	}

	// Check for duplicate name if name is being changed
	if (data.name && data.name !== existing.name) {
		const duplicate = await getHeatingProfileByName(data.name);
		if (duplicate && duplicate.id !== id) {
			throw nameTaken(data.name);
		}
	}

	// Validate percentages if any are being changed
	if (existing.type === 'custom') {
		const shares = Object.fromEntries(
			percentageFields.map((field) => [field, data[field] ?? existing[field]])
		) as MonthlyShares;
		const validation = validatePercentages(getMonthlyPercentages(shares));
		if (!validation.isValid) {
			throw invalidShares(validation);
		}
	}

	const [profile] = await db
		.update(heatingProfiles)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(heatingProfiles.id, id))
		.returning();

	return profile || null;
}

/**
 * Delete a heating profile
 */
export async function deleteHeatingProfile(
	id: string
): Promise<{ success: boolean; conflict?: boolean } & Partial<Refusal>> {
	// Check if profile exists
	const existing = await getHeatingProfile(id);
	if (!existing) {
		return { success: false, ...refusal('HEATING_PROFILE_NOT_FOUND', 'Heating profile not found') };
	}

	// Don't allow deleting predefined profiles
	if (existing.type === 'predefined') {
		return { success: false, ...refusal('HEATING_PROFILE_PREDEFINED', 'Vordefinierte Heizprofile können nicht gelöscht werden.') };
	}

	// New statements propose the default profile of the settings
	if (await isDefaultSetting('default_heating_profile_id', id)) {
		return {
			success: false,
			conflict: true,
			...refusal('HEATING_PROFILE_IS_DEFAULT', 'Das Heizprofil ist in den Einstellungen als Standard hinterlegt.')
		};
	}

	await db.delete(heatingProfiles).where(eq(heatingProfiles.id, id));

	return { success: true };
}

/**
 * Check if a heating profile exists
 */
export async function heatingProfileExists(id: string): Promise<boolean> {
	const [result] = await db
		.select({ id: heatingProfiles.id })
		.from(heatingProfiles)
		.where(eq(heatingProfiles.id, id))
		.limit(1);

	return !!result;
}

/**
 * Get monthly percentage for a specific month
 */
export function getMonthlyPercentage(profile: HeatingProfile, month: number): number {
	const percentages = [
		parseFloat(profile.januaryPct),
		parseFloat(profile.februaryPct),
		parseFloat(profile.marchPct),
		parseFloat(profile.aprilPct),
		parseFloat(profile.mayPct),
		parseFloat(profile.junePct),
		parseFloat(profile.julyPct),
		parseFloat(profile.augustPct),
		parseFloat(profile.septemberPct),
		parseFloat(profile.octoberPct),
		parseFloat(profile.novemberPct),
		parseFloat(profile.decemberPct)
	];

	if (month < 1 || month > 12) {
		throw new Error(`Invalid month: ${month}`);
	}

	return percentages[month - 1];
}

/**
 * Get all monthly percentages as an object
 */
export function getMonthlyPercentages(profile: MonthlyShares): MonthlyPercentages {
	return {
		january: parseFloat(profile.januaryPct),
		february: parseFloat(profile.februaryPct),
		march: parseFloat(profile.marchPct),
		april: parseFloat(profile.aprilPct),
		may: parseFloat(profile.mayPct),
		june: parseFloat(profile.junePct),
		july: parseFloat(profile.julyPct),
		august: parseFloat(profile.augustPct),
		september: parseFloat(profile.septemberPct),
		october: parseFloat(profile.octoberPct),
		november: parseFloat(profile.novemberPct),
		december: parseFloat(profile.decemberPct)
	};
}

/**
 * Calculate heating cost share for a period based on profile
 */
export function calculateHeatingShare(
	profile: HeatingProfile,
	startDate: Date,
	endDate: Date,
	totalCost: number
): { share: number; percentage: number; monthBreakdown: { month: number; percentage: number }[] } {
	const monthBreakdown: { month: number; percentage: number }[] = [];
	let totalPercentage = 0;

	// Iterate through each month in the period
	const current = new Date(startDate);
	current.setDate(1); // Start from first of month

	while (current <= endDate) {
		const month = current.getMonth() + 1; // 1-12
		const monthPct = getMonthlyPercentage(profile, month);

		// Calculate how much of this month is in the period
		const monthStart = new Date(current);
		const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0); // Last day of month

		const periodStart = startDate > monthStart ? startDate : monthStart;
		const periodEnd = endDate < monthEnd ? endDate : monthEnd;

		const daysInMonth = monthEnd.getDate();
		const daysInPeriod = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

		// Prorate the monthly percentage based on days, rounded to two places as printed: the share follows from the printed
		// months (#232)
		const proratedPct = Math.round((monthPct * daysInPeriod * 100) / daysInMonth) / 100;
		totalPercentage = Math.round((totalPercentage + proratedPct) * 100) / 100;

		monthBreakdown.push({ month, percentage: proratedPct });

		// Move to next month
		current.setMonth(current.getMonth() + 1);
	}

	return {
		share: (totalCost * totalPercentage) / 100,
		percentage: totalPercentage,
		monthBreakdown
	};
}
