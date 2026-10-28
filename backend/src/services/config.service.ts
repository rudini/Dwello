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

import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { validateIBAN } from './qr-bill.service';
import { configuration, type Configuration } from '../db/schema';
import { heatingProfileExists } from './heating-profile.service';
import { distributionKeyExists } from './distribution-key.service';
import { recordAudit } from './audit-log.service';
import { CodedError, type ErrorCode } from './coded-error';
import { swissToday } from './today';
import type { PeriodChange } from './accounting-period';

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
		// #124: at most 10 %, with at most two places after the point
		validator: (v: number) => v >= 0 && v <= 10 && Number(v.toFixed(2)) === v,
		default: 3,
		code: 'MANAGEMENT_FEE_INVALID'
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
		default: '',
		code: 'POSTAL_CODE_DIGITS'
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
		default: '',
		code: 'COMPANY_EMAIL_INVALID'
	},
	iban: {
		type: 'string',
		// Checksum too: the QR-bill cannot be created with a wrong IBAN
		// as the QR-bill takes it (#191): CH or LI, the institution's number in digits (code review h28g C-5)
		validator: (v: string) => /^(CH|LI)\d{7}[A-Z0-9]{12}$/.test(v) && validateIBAN(v).valid,
		default: '',
		code: 'IBAN_ENTERED_INVALID'
	},
	payment_deadline_days: {
		type: 'number',
		validator: (v: number) => Number.isInteger(v) && v >= 7 && v <= 90,
		default: 30,
		code: 'PAYMENT_DEADLINE_DAYS'
	},
	reminder_after_days: {
		type: 'number',
		validator: (v: number) => Number.isInteger(v) && v >= 7 && v <= 60,
		default: 14,
		code: 'REMINDER_AFTER_DAYS'
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
 * The value's error, null when it is valid; a field of the settings form names its own (H-28, #717)
 */
async function configError(key: ConfigKey, value: string): Promise<ErrorCode | null> {
	const configDef = CONFIG_KEYS[key];
	if (!configDef) return { code: 'CONFIG_VALUE_INVALID', params: {} };

	// a number as digits with a point, not what parseFloat reads into «1e1» or «30,5»
	const parsedValue = configDef.type === 'number' ? (/^\d+(\.\d+)?$/.test(value) ? Number(value) : NaN) : value;
	const valid = !Number.isNaN(parsedValue) && (await configDef.validator(parsedValue as never));
	if (valid) return null;
	return 'code' in configDef ? { code: configDef.code, params: { field: key } } : { code: 'CONFIG_VALUE_INVALID', params: {} };
}

/** Throws when the key is unknown or the value invalid */
async function validateConfig(key: ConfigKey, value: string) {
	if (await configError(key, value)) throw new Error(`Invalid value for ${key}: ${value}`);
}

/**
 * A saved IBAN only with name, postal code and town of the Firmenadresse, as saved or now changed: the QR-bill names the
 * landlord (#450). The form sends the IBAN it shows with every save; a save without it (the IBAN emptied, reset after)
 * stays possible (code review C-1)
 */
async function creditorMissing(changes: Partial<Record<ConfigKey, string>>): Promise<ErrorCode[]> {
	if (!changes.iban?.trim()) return [];
	const stored = await getAllConfig();
	const value = (key: ConfigKey) => (changes[key] ?? stored[key] ?? '').trim();
	const missing = (['company_name', 'company_postal_code', 'company_city'] as const).filter((key) => !value(key));
	return missing.length ? [{ code: 'IBAN_COMPANY_ADDRESS_MISSING', params: { field: 'iban', missing: missing.join(',') } }] : [];
}

// As stored: a rate typed with a comma or «%» as a number with a point, an IBAN without its spaces (H-28, #717)
function asStored(key: string, value: string) {
	if (key === 'iban') return value.replace(/\s/g, '').toUpperCase();
	if (key !== 'management_fee_pct') return value;
	const rate = value.trim().replace(/\s*%$/, '').replace(',', '.');
	return /^\d+(\.\d+)?$/.test(rate) ? String(Number(rate)) : value;
}

/**
 * Set a configuration value
 */
export async function setConfig(key: ConfigKey, typed: string): Promise<Configuration> {
	const value = asStored(key, typed);
	await validateConfig(key, value);
	const [missing] = await creditorMissing({ [key]: value });
	if (missing) throw new CodedError(missing.code, 'An IBAN needs the company name, postal code and town', missing.params);
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

	// #512: the day the Abrechnungsperiode changes and the type before; a second change that day keeps the first's
	if (key === 'accounting_period') {
		const stored = await tx.select().from(configuration).where(inArray(configuration.key, [key, PERIOD_CHANGE]));
		const before = stored.find((row) => row.key === key)?.value ?? CONFIG_KEYS.accounting_period.default;
		const [on, from] = (stored.find((row) => row.key === PERIOD_CHANGE)?.value ?? '').split(':');
		const change = `${swissToday()}:${on === swissToday() ? from : before}`;
		if (before !== value) await upsert(tx, PERIOD_CHANGE, change);
	}
	return upsert(tx, key, value);
}

// Not a setting of the form: getAllConfig leaves it out
const PERIOD_CHANGE = 'accounting_period_changed';

/** #512: the stored change of the setting «Abrechnungsperiode», null before the first */
export async function periodChange(): Promise<PeriodChange> {
	const [row] = await db.select().from(configuration).where(eq(configuration.key, PERIOD_CHANGE)).limit(1);
	if (!row) return null;
	const [on, from] = row.value.split(':');
	return { on, from: from as NonNullable<PeriodChange>['from'] };
}

async function upsert(tx: Pick<typeof db, 'insert'>, key: string, value: string) {
	// An upsert: two first writes of one key at once would both insert (O-36)
	const [saved] = await tx
		.insert(configuration)
		.values({ key, value })
		.onConflictDoUpdate({ target: configuration.key, set: { value, updatedAt: new Date() } })
		.returning();
	return saved;
}

/**
 * Set multiple configuration values at once, as the settings form sends them; the errors of those it refuses
 */
export async function setMultipleConfig(
	typed: Partial<Record<ConfigKey, string>>
): Promise<ErrorCode[]> {
	const configs = Object.fromEntries(
		Object.entries(typed).map(([key, value]) => [key, value === undefined ? value : asStored(key, value)])
	) as Partial<Record<ConfigKey, string>>;
	const errors: ErrorCode[] = [];
	for (const [key, value] of Object.entries(configs)) {
		// an emptied value is reset to its default
		const error = value?.trim() ? await configError(key as ConfigKey, value) : null;
		if (error) errors.push(error);
	}
	// the Firmenadresse a valid IBAN needs, named with the form's other errors (code review h28g C-1)
	if (!errors.some((error) => error.params.field === 'iban')) errors.push(...(await creditorMissing(configs)));

	// All or nothing: one invalid value, or a write that fails, keeps the others unsaved
	if (errors.length === 0) {
		await db.transaction(async (tx) => {
			for (const [key, value] of Object.entries(configs)) {
				if (value === undefined) continue;
				await (value.trim() ? saveConfig(tx, key as ConfigKey, value) : removeConfig(tx, key as ConfigKey));
			}
		});
	}
	return errors;
}

/**
 * Delete a configuration value (reset to default)
 */
export async function deleteConfig(key: ConfigKey): Promise<boolean> {
	return db.transaction((tx) => removeConfig(tx, key));
}

async function removeConfig(tx: Parameters<Parameters<typeof db.transaction>[0]>[0], key: ConfigKey) {
	const [deleted] = await tx.delete(configuration).where(eq(configuration.key, key)).returning();
	const to = String(CONFIG_KEYS.management_fee_pct.default);
	if (key === 'management_fee_pct' && deleted && Number(deleted.value) !== Number(to)) {
		await recordAudit('management_fee_changed', { from: deleted.value, to }, tx);
	}
	return !!deleted;
}
