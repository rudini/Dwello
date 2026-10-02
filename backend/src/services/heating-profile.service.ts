/**
 * Heating Profile Service
 * Business logic for heating distribution profiles
 *
 * Predefined profiles for Swiss regional heating patterns:
 * - Standard (Mittelland / Plateau)
 * - Mountain Region (Bergregion)
 * - Tessin (Southern Switzerland)
 * - Hot Water Only (Warmwasser)
 */

import { eq, sql, asc, ilike, and } from 'drizzle-orm';
import { db } from '../db/connection';
import { configuration, heatingProfiles, type HeatingProfile, type NewHeatingProfile } from '../db/schema';

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

/**
 * Predefined heating profiles for Swiss regions
 * All percentages sum to 100%
 */
export const PREDEFINED_HEATING_PROFILES: Omit<NewHeatingProfile, 'id' | 'createdAt' | 'updatedAt'>[] = [
	{
		name: 'Standard (Mittelland)',
		nameDE: 'Standard (Mittelland)',
		nameFR: 'Standard (Plateau)',
		nameIT: 'Standard (Altopiano)',
		nameEN: 'Standard (Swiss Plateau)',
		type: 'predefined',
		description: 'Standard-Heizprofil für das Schweizer Mittelland (Flachland)',
		januaryPct: '17.00',
		februaryPct: '14.00',
		marchPct: '12.00',
		aprilPct: '7.00',
		mayPct: '2.00',
		junePct: '0.00',
		julyPct: '0.00',
		augustPct: '0.00',
		septemberPct: '2.00',
		octoberPct: '8.00',
		novemberPct: '14.00',
		decemberPct: '24.00'
	},
	{
		name: 'Bergregion',
		nameDE: 'Bergregion',
		nameFR: 'Région de montagne',
		nameIT: 'Regione montana',
		nameEN: 'Mountain Region',
		type: 'predefined',
		description: 'Heizprofil für Bergregionen mit längerer Heizperiode',
		januaryPct: '15.00',
		februaryPct: '13.00',
		marchPct: '12.00',
		aprilPct: '9.00',
		mayPct: '4.00',
		junePct: '1.00',
		julyPct: '0.00',
		augustPct: '1.00',
		septemberPct: '4.00',
		octoberPct: '10.00',
		novemberPct: '13.00',
		decemberPct: '18.00'
	},
	{
		name: 'Tessin',
		nameDE: 'Tessin',
		nameFR: 'Tessin',
		nameIT: 'Ticino',
		nameEN: 'Ticino (Southern Switzerland)',
		type: 'predefined',
		description: 'Heizprofil für das Tessin mit kürzerer Heizperiode',
		januaryPct: '20.00',
		februaryPct: '16.00',
		marchPct: '13.00',
		aprilPct: '5.00',
		mayPct: '0.00',
		junePct: '0.00',
		julyPct: '0.00',
		augustPct: '0.00',
		septemberPct: '0.00',
		octoberPct: '6.00',
		novemberPct: '14.00',
		decemberPct: '26.00'
	},
	{
		name: 'Warmwasser (gleichmässig)',
		nameDE: 'Warmwasser (gleichmässig)',
		nameFR: 'Eau chaude (répartition égale)',
		nameIT: 'Acqua calda (distribuzione uniforme)',
		nameEN: 'Hot Water (Equal Distribution)',
		type: 'predefined',
		description: 'Gleichmässige Verteilung für Warmwasserkosten über das ganze Jahr',
		januaryPct: '8.33',
		februaryPct: '8.33',
		marchPct: '8.33',
		aprilPct: '8.33',
		mayPct: '8.33',
		junePct: '8.33',
		julyPct: '8.33',
		augustPct: '8.33',
		septemberPct: '8.33',
		octoberPct: '8.33',
		novemberPct: '8.33',
		decemberPct: '8.37' // Slightly higher to sum to 100%
	}
];

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

/** The request conflicts with existing data (HTTP 409) */
export class HeatingProfileConflict extends Error {}

/**
 * Validate that monthly percentages sum to approximately 100%
 */
export function validatePercentages(percentages: MonthlyPercentages): {
	isValid: boolean;
	sum: number;
	error?: string;
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
			error: `Die Monatsanteile müssen zusammen 100 % ergeben (aktuell ${Number(sum.toFixed(2))} %).`
		};
	}

	// Check for negative percentages
	for (const [month, value] of Object.entries(percentages)) {
		if (value < 0) {
			return {
				isValid: false,
				sum,
				error: `Der Anteil für ${month} darf nicht negativ sein.`
			};
		}
	}

	return { isValid: true, sum };
}

/**
 * Create a new heating profile
 */
export async function createHeatingProfile(data: NewHeatingProfile): Promise<HeatingProfile> {
	// Check for duplicate name
	const existing = await getHeatingProfileByName(data.name);
	if (existing) {
		throw new HeatingProfileConflict(`Ein Heizprofil mit dem Namen "${data.name}" existiert bereits.`);
	}

	// Validate percentages
	const percentages: MonthlyPercentages = {
		january: parseFloat(data.januaryPct),
		february: parseFloat(data.februaryPct),
		march: parseFloat(data.marchPct),
		april: parseFloat(data.aprilPct),
		may: parseFloat(data.mayPct),
		june: parseFloat(data.junePct),
		july: parseFloat(data.julyPct),
		august: parseFloat(data.augustPct),
		september: parseFloat(data.septemberPct),
		october: parseFloat(data.octoberPct),
		november: parseFloat(data.novemberPct),
		december: parseFloat(data.decemberPct)
	};

	const validation = validatePercentages(percentages);
	if (!validation.isValid) {
		throw new Error(validation.error);
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
		throw new Error('Cannot change heating profile type');
	}

	// Don't allow modifying predefined profiles' percentages
	if (existing.type === 'predefined') {
		const percentageFields = [
			'januaryPct', 'februaryPct', 'marchPct', 'aprilPct', 'mayPct', 'junePct',
			'julyPct', 'augustPct', 'septemberPct', 'octoberPct', 'novemberPct', 'decemberPct'
		];
		for (const field of percentageFields) {
			if (data[field as keyof typeof data] !== undefined) {
				throw new Error('Cannot modify percentages of predefined heating profile');
			}
		}
	}

	// Check for duplicate name if name is being changed
	if (data.name && data.name !== existing.name) {
		const duplicate = await getHeatingProfileByName(data.name);
		if (duplicate && duplicate.id !== id) {
			throw new HeatingProfileConflict(`Ein Heizprofil mit dem Namen "${data.name}" existiert bereits.`);
		}
	}

	// Validate percentages if any are being changed
	if (existing.type === 'custom') {
		const percentages: MonthlyPercentages = {
			january: parseFloat(data.januaryPct ?? existing.januaryPct),
			february: parseFloat(data.februaryPct ?? existing.februaryPct),
			march: parseFloat(data.marchPct ?? existing.marchPct),
			april: parseFloat(data.aprilPct ?? existing.aprilPct),
			may: parseFloat(data.mayPct ?? existing.mayPct),
			june: parseFloat(data.junePct ?? existing.junePct),
			july: parseFloat(data.julyPct ?? existing.julyPct),
			august: parseFloat(data.augustPct ?? existing.augustPct),
			september: parseFloat(data.septemberPct ?? existing.septemberPct),
			october: parseFloat(data.octoberPct ?? existing.octoberPct),
			november: parseFloat(data.novemberPct ?? existing.novemberPct),
			december: parseFloat(data.decemberPct ?? existing.decemberPct)
		};

		const validation = validatePercentages(percentages);
		if (!validation.isValid) {
			throw new Error(validation.error);
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
): Promise<{ success: boolean; conflict?: boolean; error?: string }> {
	// Check if profile exists
	const existing = await getHeatingProfile(id);
	if (!existing) {
		return { success: false, error: 'Heating profile not found' };
	}

	// Don't allow deleting predefined profiles
	if (existing.type === 'predefined') {
		return { success: false, error: 'Vordefinierte Heizprofile können nicht gelöscht werden.' };
	}

	// New statements propose the default profile of the settings
	const [defaultProfile] = await db
		.select({ value: configuration.value })
		.from(configuration)
		.where(eq(configuration.key, 'default_heating_profile_id'));
	if (defaultProfile?.value === id) {
		return { success: false, conflict: true, error: 'Das Heizprofil ist in den Einstellungen als Standard hinterlegt.' };
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
export function getMonthlyPercentages(profile: HeatingProfile): MonthlyPercentages {
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

		// Prorate the monthly percentage based on days
		const proratedPct = (monthPct * daysInPeriod) / daysInMonth;
		totalPercentage += proratedPct;

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

/**
 * Initialize predefined heating profiles if they don't exist
 */
export async function initializePredefinedHeatingProfiles(): Promise<{ created: number; existing: number }> {
	let created = 0;
	let existing = 0;

	for (const profileData of PREDEFINED_HEATING_PROFILES) {
		const exists = await getHeatingProfileByName(profileData.name);
		if (!exists) {
			await db.insert(heatingProfiles).values(profileData);
			created++;
		} else {
			existing++;
		}
	}

	return { created, existing };
}
