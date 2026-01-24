/**
 * Tenant Routes
 * CRUD endpoints for tenant management
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	listTenants,
	getTenant,
	getTenantWithHistory,
	createTenant,
	updateTenant,
	deleteTenant
} from '../services/tenant.service';

// Validation schemas
const tenantQuerySchema = t.Object({
	search: t.Optional(t.String()),
	language: t.Optional(t.String()),
	hasActiveContract: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const tenantBodySchema = t.Object({
	firstName: t.String({ minLength: 1 }),
	lastName: t.String({ minLength: 1 }),
	email: t.Optional(t.Nullable(t.String({ format: 'email' }))),
	phone: t.Optional(t.Nullable(t.String())),
	language: t.Optional(t.String()),
	address: t.Optional(t.Nullable(t.String())),
	postalCode: t.Optional(t.Nullable(t.String())),
	city: t.Optional(t.Nullable(t.String()))
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
				hasActiveContract: query.hasActiveContract === 'true' ? true : undefined,
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
		return tenant;
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
