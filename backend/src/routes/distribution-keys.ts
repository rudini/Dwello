/**
 * Distribution Key Routes
 * API endpoints for distribution key management
 */

import { Elysia, t } from 'elysia';
import {
	listDistributionKeys,
	getDistributionKey,
	createDistributionKey,
	updateDistributionKey,
	deleteDistributionKey,
	testFormulaWithSamples,
	initializePredefinedKeys
} from '../services/distribution-key.service';
import { parseFormula, validateFormulaForDistribution } from '../services/formula.service';

export const distributionKeyRoutes = new Elysia({ prefix: '/api/v1/distribution-keys' })
	// List all distribution keys
	.get(
		'/',
		async ({ query }) => {
			const { distributionKeys, total } = await listDistributionKeys({
				search: query.search,
				type: query.type as 'predefined' | 'custom' | undefined,
				limit: query.limit ? parseInt(query.limit) : undefined,
				offset: query.offset ? parseInt(query.offset) : undefined
			});

			return {
				data: distributionKeys,
				total,
				limit: query.limit ? parseInt(query.limit) : 100,
				offset: query.offset ? parseInt(query.offset) : 0
			};
		},
		{
			query: t.Object({
				search: t.Optional(t.String()),
				type: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				offset: t.Optional(t.String())
			})
		}
	)

	// Initialize predefined distribution keys
	.post('/initialize', async () => {
		const result = await initializePredefinedKeys();
		return {
			message: 'Predefined distribution keys initialized',
			created: result.created,
			existing: result.existing
		};
	})

	// Test a formula
	.post(
		'/test-formula',
		async ({ body }) => {
			const result = testFormulaWithSamples(body.formula);
			return result;
		},
		{
			body: t.Object({
				formula: t.String()
			})
		}
	)

	// Parse a formula (check syntax without full validation)
	.post(
		'/parse-formula',
		async ({ body }) => {
			const result = parseFormula(body.formula);
			return result;
		},
		{
			body: t.Object({
				formula: t.String()
			})
		}
	)

	// Validate a formula for distribution use
	.post(
		'/validate-formula',
		async ({ body }) => {
			const result = validateFormulaForDistribution(body.formula);
			return result;
		},
		{
			body: t.Object({
				formula: t.String()
			})
		}
	)

	// Get a single distribution key
	.get(
		'/:id',
		async ({ params, set }) => {
			const key = await getDistributionKey(params.id);

			if (!key) {
				set.status = 404;
				return { error: 'Distribution key not found' };
			}

			return key;
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// Create a new distribution key
	.post(
		'/',
		async ({ body, set }) => {
			try {
				const key = await createDistributionKey({
					name: body.name,
					nameDE: body.nameDE,
					nameFR: body.nameFR,
					nameIT: body.nameIT,
					nameEN: body.nameEN,
					type: body.type || 'custom',
					formula: body.formula,
					description: body.description,
					sortOrder: body.sortOrder
				});

				set.status = 201;
				return key;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create distribution key' };
			}
		},
		{
			body: t.Object({
				name: t.String({ minLength: 1 }),
				nameDE: t.Optional(t.String()),
				nameFR: t.Optional(t.String()),
				nameIT: t.Optional(t.String()),
				nameEN: t.Optional(t.String()),
				type: t.Optional(t.String()),
				formula: t.Optional(t.String()),
				description: t.Optional(t.String()),
				sortOrder: t.Optional(t.Number())
			})
		}
	)

	// Update a distribution key
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const key = await updateDistributionKey(params.id, {
					name: body.name,
					nameDE: body.nameDE,
					nameFR: body.nameFR,
					nameIT: body.nameIT,
					nameEN: body.nameEN,
					formula: body.formula,
					description: body.description,
					sortOrder: body.sortOrder
				});

				if (!key) {
					set.status = 404;
					return { error: 'Distribution key not found' };
				}

				return key;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update distribution key' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				name: t.Optional(t.String({ minLength: 1 })),
				nameDE: t.Optional(t.String()),
				nameFR: t.Optional(t.String()),
				nameIT: t.Optional(t.String()),
				nameEN: t.Optional(t.String()),
				formula: t.Optional(t.String()),
				description: t.Optional(t.String()),
				sortOrder: t.Optional(t.Number())
			})
		}
	)

	// Delete a distribution key
	.delete(
		'/:id',
		async ({ params, set }) => {
			const result = await deleteDistributionKey(params.id);

			if (!result.success) {
				set.status = result.error?.includes('not found') ? 404 : 400;
				return { error: result.error };
			}

			set.status = 204;
			return null;
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	);
