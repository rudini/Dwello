/**
 * Configuration Service
 * Business logic for application configuration management
 *
 * Supported configuration keys:
 * - accounting_period: 'calendar' | 'july-june' | 'november-october'
 * - management_fee_pct: percentage up to 10 (#124: catches typos); 3 is the usual guideline, not a limit
 * - default_heating_profile_id: UUID of default heating profile
 * - default_distribution_key_id: UUID of default distribution key
 * - company_name: Property management company name
 * - company_address: Company address
 * - iban: IBAN from Switzerland or Liechtenstein for QR-bill generation
 * - payment_deadline_days: Days until payment is due (default 30)
 * - reminder_after_days: Days after deadline to send reminder (default 14)
 */

import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { validateIBAN } from './qr-bill.service';
import { configuration, type Configuration } from '../db/schema';
import { heatingProfileExists } from './heating-profile.service';
import { distributionKeyExists } from './distribution-key.service';
import { recordAudit } from './audit-log.service';
import { CodedError } from './coded-error';

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
		validator: (v: number) => v >= 0 && v <= 10,
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
	// #465 (#103, DMR-09): the Verwaltung's phone and e-mail in the statement's letterhead, both optional
	company_phone: {
		type: 'string',
		validator: (v: string) => v.length <= 50,
		default: ''
	},
	company_email: {
		type: 'string',
		validator: (v: string) => v === '' || (v.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)),
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
		validator: (v: string) => ['de', 'fr', 'it', 'en'].includes(v),
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
 * Throws when the key is unknown or the value invalid
 */
async function validateConfig(key: ConfigKey, value: string) {
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
}

/**
 * A saved IBAN only with name, postal code and town of the Firmenadresse, as saved or now changed: the QR-bill names the
 * landlord (#450). The form sends the IBAN it shows with every save; a save without it (the IBAN emptied, reset after)
 * stays possible (code review C-1)
 */
async function checkCreditor(changes: Partial<Record<ConfigKey, string>>) {
	if (!changes.iban?.trim()) return;
	const stored = await getAllConfig();
	const value = (key: ConfigKey) => (changes[key] ?? stored[key] ?? '').trim();
	if (!(['company_name', 'company_postal_code', 'company_city'] as const).every(value))
		throw new CodedError('IBAN_COMPANY_ADDRESS_MISSING', 'An IBAN needs the company name, postal code and town');
}

/**
 * Set a configuration value
 */
export async function setConfig(key: ConfigKey, value: string): Promise<Configuration> {
	await validateConfig(key, value);
	await checkCreditor({ [key]: value });
	return saveConfig(db, key, value);
}

/** Writes a validated value, inside a transaction when one is given */
async function saveConfig(
	tx: Pick<typeof db, 'select' | 'update' | 'insert'>,
	key: ConfigKey,
	value: string
): Promise<Configuration> {
	// #357: a changed rate goes into the Protokoll; «4.250» is the same rate as «4.25»
	if (key === 'management_fee_pct') {
		const [existing] = await tx.select().from(configuration).where(eq(configuration.key, key)).limit(1);
		const before = existing?.value ?? String(CONFIG_KEYS.management_fee_pct.default);
		if (Number(before) !== Number(value)) await recordAudit('management_fee_changed', { from: before, to: value }, tx);
	}

	// An upsert: two first writes of one key at once would both insert (O-36)
	const [saved] = await tx
		.insert(configuration)
		.values({ key, value })
		.onConflictDoUpdate({ target: configuration.key, set: { value, updatedAt: new Date() } })
		.returning();
	return saved;
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
			await validateConfig(key as ConfigKey, value);
		} catch (error) {
			errors[key] = error instanceof Error ? error.message : 'Unknown error';
		}
	}

	// All or nothing: one invalid value, or a write that fails, keeps the others unsaved
	if (Object.keys(errors).length === 0) {
		await checkCreditor(configs);
		await db.transaction(async (tx) => {
			for (const [key, value] of Object.entries(configs)) {
				if (value !== undefined) await saveConfig(tx, key as ConfigKey, value);
			}
		});
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
	return db.transaction(async (tx) => {
		const [deleted] = await tx.delete(configuration).where(eq(configuration.key, key)).returning();
		const to = String(CONFIG_KEYS.management_fee_pct.default);
		if (key === 'management_fee_pct' && deleted && Number(deleted.value) !== Number(to)) {
			await recordAudit('management_fee_changed', { from: deleted.value, to }, tx);
		}
		return !!deleted;
	});
}
