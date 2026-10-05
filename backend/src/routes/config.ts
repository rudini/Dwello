/**
 * Configuration Routes
 * API endpoints for application configuration management
 */

import { Elysia, t } from 'elysia';
import {
	getAllConfig,
	getConfig,
	setConfig,
	setMultipleConfig,
	deleteConfig,
	getCurrentAccountingPeriod,
	getAccountingPeriodDates,
	initializeDefaultConfig,
	CONFIG_KEYS,
	type ConfigKey
} from '../services/config.service';

export const configRoutes = new Elysia({ prefix: '/api/v1/config' })
	// Get all configuration values
	.get('/', async () => {
		const config = await getAllConfig();
		return {
			data: config,
			keys: Object.keys(CONFIG_KEYS)
		};
	})

	// Initialize default configuration
	.post('/initialize', async () => {
		const result = await initializeDefaultConfig();
		return {
			message: 'Default configuration initialized',
			created: result.created,
			existing: result.existing
		};
	})

	// Get current accounting period
	.get('/accounting-period/current', async () => {
		const period = await getCurrentAccountingPeriod();
		return {
			start: period.start.toISOString().split('T')[0],
			end: period.end.toISOString().split('T')[0],
			year: period.year
		};
	})

	// Calculate accounting period for a specific year
	.get(
		'/accounting-period/:year',
		async ({ params, query, set }) => {
			const year = parseInt(params.year);
			if (isNaN(year) || year < 2000 || year > 2100) {
				set.status = 400;
				return { error: 'Invalid year' };
			}

			const periodType = query.type || 'calendar';
			if (!['calendar', 'july-june', 'november-october'].includes(periodType)) {
				set.status = 400;
				return { error: 'Invalid period type' };
			}

			try {
				const period = getAccountingPeriodDates(
					periodType as 'calendar' | 'july-june' | 'november-october',
					year
				);
				return {
					start: period.start.toISOString().split('T')[0],
					end: period.end.toISOString().split('T')[0],
					year,
					type: periodType
				};
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Unknown error' };
			}
		},
		{
			params: t.Object({
				year: t.String()
			}),
			query: t.Object({
				type: t.Optional(t.String())
			})
		}
	)

	// Get a single configuration value
	.get(
		'/:key',
		async ({ params, set }) => {
			if (!(params.key in CONFIG_KEYS)) {
				set.status = 404;
				return { error: `Unknown configuration key: ${params.key}` };
			}

			const value = await getConfig(params.key as ConfigKey);
			const configDef = CONFIG_KEYS[params.key as ConfigKey];

			return {
				key: params.key,
				value,
				type: configDef.type,
				default: configDef.default
			};
		},
		{
			params: t.Object({
				key: t.String()
			})
		}
	)

	// Update all configuration values at once
	.put(
		'/',
		async ({ body, set }) => {
			const result = await setMultipleConfig(body as Partial<Record<ConfigKey, string>>);

			if (!result.success) {
				set.status = 400;
				return {
					error: 'Some configuration values failed to update',
					errors: result.errors
				};
			}

			const updatedConfig = await getAllConfig();
			return {
				message: 'Configuration updated',
				data: updatedConfig
			};
		},
		{
			body: t.Object({
				accounting_period: t.Optional(t.String()),
				management_fee_pct: t.Optional(t.String()),
				default_heating_profile_id: t.Optional(t.String()),
				default_distribution_key_id: t.Optional(t.String()),
				company_name: t.Optional(t.String()),
				company_address: t.Optional(t.String()),
				company_postal_code: t.Optional(t.String()),
				company_city: t.Optional(t.String()),
				iban: t.Optional(t.String()),
				payment_deadline_days: t.Optional(t.String()),
				reminder_after_days: t.Optional(t.String()),
				default_language: t.Optional(t.String())
			})
		}
	)

	// Set a single configuration value
	.put(
		'/:key',
		async ({ params, body, set }) => {
			if (!(params.key in CONFIG_KEYS)) {
				set.status = 404;
				return { error: `Unknown configuration key: ${params.key}` };
			}

			try {
				const config = await setConfig(params.key as ConfigKey, body.value);
				return {
					message: 'Configuration updated',
					key: config.key,
					value: config.value
				};
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update configuration' };
			}
		},
		{
			params: t.Object({
				key: t.String()
			}),
			body: t.Object({
				value: t.String()
			})
		}
	)

	// Delete (reset) a configuration value
	.delete(
		'/:key',
		async ({ params, set }) => {
			if (!(params.key in CONFIG_KEYS)) {
				set.status = 404;
				return { error: `Unknown configuration key: ${params.key}` };
			}

			await deleteConfig(params.key as ConfigKey);

			const defaultValue = CONFIG_KEYS[params.key as ConfigKey].default;

			return {
				message: 'Configuration reset to default',
				key: params.key,
				value: defaultValue !== null ? String(defaultValue) : null
			};
		},
		{
			params: t.Object({
				key: t.String()
			})
		}
	);
