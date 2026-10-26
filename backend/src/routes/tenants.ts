/**
 * Tenant Routes
 * CRUD endpoints for tenant management
 */

import { Elysia, t } from 'elysia';
import { swissToday } from '../services/today';
import { fieldsRefused } from '../services/coded-error';
import { newTenantFieldErrors, tenantFieldErrors } from '../services/tenant-fields';
import { authMiddleware } from '../middleware/auth';
import {
	listTenants,
	getTenant,
	getTenantWithHistory,
	createTenant,
	updateTenant,
	deleteTenant,
	tenantExists
} from '../services/tenant.service';
import type { TenantResponse } from '../api/tenant';
import { exportTenant } from '../services/tenant-export.service';
import { anonymisableFrom, anonymiseTenant } from '../services/tenant-anonymise.service';
import { errorBody } from '../services/coded-error';

// Validation schemas
const tenantQuerySchema = t.Object({
	search: t.Optional(t.String()),
	language: t.Optional(t.String()),
	status: t.Optional(t.Union([t.Literal('active'), t.Literal('future'), t.Literal('inactive')])),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const tenantBodySchema = t.Object({
	// H-28 (#717): what the form checks is checked in `tenant-fields.ts`, so every field shows its own message
	firstName: t.String(),
	lastName: t.String(),
	email: t.Optional(t.Nullable(t.String())),
	phone: t.Optional(t.Nullable(t.String())),
	language: t.Optional(t.Union(['de', 'fr', 'it', 'en'].map((l) => t.Literal(l)))),
	address: t.Optional(t.Nullable(t.String())),
	postalCode: t.Optional(t.Nullable(t.String())),
	city: t.Optional(t.Nullable(t.String())),
	country: t.Optional(t.String({ pattern: '^[A-Z]{2}$' })), // ISO 3166 code, Schweiz by default
	correspondenceChannel: t.Optional(t.Union([t.Literal('email'), t.Literal('letter')]))
});

const tenantUpdateSchema = t.Partial(tenantBodySchema);

export const tenantRoutes = new Elysia({ prefix: '/api/v1/tenants' })
	.use(authMiddleware)
	// List tenants with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				search: query.search,
				language: query.language,
				status: query.status,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listTenants(filters);
		},
		{
			query: tenantQuerySchema
		}
	)
	// Get single tenant
	.get('/:id', async ({ params, set }) => {
		const tenant = await getTenant(params.id);
		if (!tenant) {
			set.status = 404;
			return { error: 'Tenant not found' };
		}
		const from = await anonymisableFrom(params.id);
		// whether that day has come, by the Swiss day (#815)
		return { ...tenant, anonymisableFrom: from, anonymisable: !!from && from <= swissToday() } satisfies TenantResponse;
	})
	// «Mieter anonymisieren» after the retention (#459); the body: the replacement name in the landlord's language
	.post(
		'/:id/anonymise',
		async ({ params, body, set }) => {
			if (!(await tenantExists(params.id))) {
				set.status = 404;
				return { error: 'Tenant not found' };
			}
			try {
				await anonymiseTenant(params.id, body);
				return { success: true };
			} catch (error) {
				set.status = 409;
				return errorBody(error, 'Failed to anonymise the tenant');
			}
		},
		{ body: t.Object({ firstName: t.String({ minLength: 1 }), lastName: t.String({ minLength: 1 }) }) }
	)
	// Everything Dwello holds about the tenant, for the right to data handover (#435)
	.get('/:id/export', async ({ params, set }) => {
		const result = await exportTenant(params.id);
		if (!result) {
			set.status = 404;
			return { error: 'Tenant not found' };
		}
		return result;
	})
	// Get tenant with contract history
	.get('/:id/history', async ({ params, set }) => {
		const result = await getTenantWithHistory(params.id);
		if (!result) {
			set.status = 404;
			return { error: 'Tenant not found' };
		}
		return result;
	})
	// Create tenant
	.post(
		'/',
		async ({ body, set }) => {
			const invalid = newTenantFieldErrors(body);
			if (invalid.length) {
				set.status = 400;
				return fieldsRefused(invalid);
			}
			try {
				const tenant = await createTenant(body);
				set.status = 201;
				return tenant;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create tenant' };
			}
		},
		{
			body: tenantBodySchema
		}
	)
	// Update tenant
	.put(
		'/:id',
		async ({ params, body, set }) => {
			const invalid = tenantFieldErrors(body);
			if (invalid.length) {
				set.status = 400;
				return fieldsRefused(invalid);
			}
			const tenant = await updateTenant(params.id, body);
			if (!tenant) {
				set.status = 404;
				return { error: 'Tenant not found' };
			}
			return tenant;
		},
		{
			body: tenantUpdateSchema
		}
	)
	// Delete tenant
	.delete('/:id', async ({ params, set }) => {
		const result = await deleteTenant(params.id);
		if (!result.success) {
			set.status = result.error === 'Tenant not found' ? 404 : 400;
			return { error: result.error };
		}
		set.status = 204;
		return null;
	});
