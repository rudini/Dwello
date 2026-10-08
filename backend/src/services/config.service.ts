/**
 * Configuration Service
 * Business logic for application configuration management
 *
 * Supported configuration keys:
 * - accounting_period: 'calendar' | 'july-june' | 'november-october'
 * - management_fee_pct: percentage, 3 is the usual guideline (not a limit)
 * - default_heating_profile_id: UUID of default heating profile
 * - default_distribution_key_id: UUID of default distribution key
 * - company_name: Property management company name
 * - company_address: Company address
 * - iban: Swiss IBAN for QR-bill generation
 * - payment_deadline_days: Days until payment is due (default 30)
 * - reminder_after_days: Days after deadline to send reminder (default 14)
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { validateIBAN } from './qr-bill.service';
import { configuration, type Configuration } from '../db/schema';
import { heatingProfileExists } from './heating-profile.service';
import { distributionKeyExists } from './distribution-key.service';

/**
 * Configuration keys with their types and validators
 */
export const CONFIG_KEYS = {
	accounting_period: {
		type: 'string',
		validator: (v: string) => ['calendar', 'july-june', 'november-october'].includes(v),
		default: 'calendar'
	},
	management_fee_pct: {
		type: 'number',
		validator: (v: number) => v >= 0,
		default: 3
	},
	default_heating_profile_id: {
		type: 'uuid',
		validator: async (v: string) => await heatingProfileExists(v),
		default: null
	},
	default_distribution_key_id: {
		type: 'uuid',
		validator: async (v: string) => await distributionKeyExists(v),
		default: null
	},
	company_name: {
		type: 'string',
		validator: (v: string) => v.length <= 255,
		default: ''
	},
	company_address: {
		type: 'string',
		validator: (v: string) => v.length <= 500,
		default: ''
	},
	company_postal_code: {
		type: 'string',
		validator: (v: string) => /^\d{4}$/.test(v),
		default: ''
	},
	company_city: {
		type: 'string',
		validator: (v: string) => v.length <= 100,
		default: ''
	},
	iban: {
		type: 'string',
		// Checksum too: the QR-bill cannot be created with a wrong IBAN
		validator: (v: string) => validateIBAN(v).valid,
		default: ''
	},
	payment_deadline_days: {
		type: 'number',
		validator: (v: number) => v >= 7 && v <= 90,
		default: 30
	},
	reminder_after_days: {
		type: 'number',
		validator: (v: number) => v >= 7 && v <= 60,
		default: 14
	},
	default_language: {
		type: 'string',
		validator: (v: string) => ['de', 'fr', 'it', 'rm', 'en'].includes(v),
		default: 'de'
	}
} as const;

export type ConfigKey = keyof typeof CONFIG_KEYS;

/**
 * Get a single configuration value
 */
export async function getConfig(key: ConfigKey): Promise<string | null> {
	const [config] = await db
		.select()
		.from(configuration)
		.where(eq(configuration.key, key))
		.limit(1);

	if (!config) {
		const defaultValue = CONFIG_KEYS[key].default;
		return defaultValue !== null ? String(defaultValue) : null;
	}

	return config.value;
}

/**
 * Get a typed configuration value
 */
export async function getTypedConfig<K extends ConfigKey>(
	key: K
): Promise<typeof CONFIG_KEYS[K]['default']> {
	const value = await getConfig(key);

	if (value === null) {
		return CONFIG_KEYS[key].default as typeof CONFIG_KEYS[K]['default'];
	}

	const configDef = CONFIG_KEYS[key];

	if (configDef.type === 'number') {
		return parseFloat(value) as typeof CONFIG_KEYS[K]['default'];
	}

	return value as typeof CONFIG_KEYS[K]['default'];
}

/**
 * Get all configuration values as an object
 */
export async function getAllConfig(): Promise<Record<ConfigKey, string | null>> {
	const configs = await db.select().from(configuration);

	const result: Record<string, string | null> = {};

	// First set defaults for all keys
	for (const key of Object.keys(CONFIG_KEYS) as ConfigKey[]) {
		const defaultValue = CONFIG_KEYS[key].default;
		result[key] = defaultValue !== null ? String(defaultValue) : null;
	}

	// Then override with actual values
	for (const config of configs) {
		if (config.key in CONFIG_KEYS) {
			result[config.key] = config.value;
		}
	}

	return result as Record<ConfigKey, string | null>;
}

/**
 * Set a configuration value
 */
export async function setConfig(key: ConfigKey, value: string): Promise<Configuration> {
	// Validate the key exists
	if (!(key in CONFIG_KEYS)) {
		throw new Error(`Unknown configuration key: ${key}`);
	}

	const configDef = CONFIG_KEYS[key];

	// Validate the value
	let parsedValue: unknown = value;

	if (configDef.type === 'number') {
		parsedValue = parseFloat(value);
		if (isNaN(parsedValue as number)) {
			throw new Error(`Invalid number value for ${key}`);
		}
	}

	const validator = configDef.validator;
	const isValidResult = validator(parsedValue as never);
	const isValid = isValidResult instanceof Promise ? await isValidResult : isValidResult;

	if (!isValid) {
		throw new Error(`Invalid value for ${key}: ${value}`);
	}

	// Check if config exists
	const [existing] = await db
		.select()
		.from(configuration)
		.where(eq(configuration.key, key))
		.limit(1);

	if (existing) {
		// Update existing
		const [updated] = await db
			.update(configuration)
			.set({ value, updatedAt: new Date() })
			.where(eq(configuration.key, key))
			.returning();
		return updated;
	} else {
		// Insert new
		const [created] = await db
			.insert(configuration)
			.values({ key, value })
			.returning();
		return created;
	}
}

/**
 * Set multiple configuration values at once
 */
export async function setMultipleConfig(
	configs: Partial<Record<ConfigKey, string>>
): Promise<{ success: boolean; errors: Record<string, string> }> {
	const errors: Record<string, string> = {};

	for (const [key, value] of Object.entries(configs)) {
		if (value === undefined) continue;

		try {
			await setConfig(key as ConfigKey, value);
		} catch (error) {
			errors[key] = error instanceof Error ? error.message : 'Unknown error';
		}
	}

	return {
		success: Object.keys(errors).length === 0,
		errors
	};
}

/**
 * Delete a configuration value (reset to default)
 */
export async function deleteConfig(key: ConfigKey): Promise<boolean> {
	const result = await db
		.delete(configuration)
		.where(eq(configuration.key, key))
		.returning();

	return result.length > 0;
}
