/**
 * Dwello API application (all routes, without starting the server)
 */

import { Elysia, NotFoundError } from 'elysia';
import { cors } from '@elysiajs/cors';
import { restoreElysiaFormats } from './elysia-formats';
import { openapi } from '@elysiajs/openapi';
import { dashboardRoutes } from './routes/dashboard';
import { buildingRoutes } from './routes/buildings';
import { apartmentRoutes } from './routes/apartments';
import { tenantRoutes } from './routes/tenants';
import { contractRoutes } from './routes/contracts';
import { categoryRoutes } from './routes/categories';
import { invoiceRoutes } from './routes/invoices';
import { currentKi, kiRecipient } from './services/ki-settings.service';
import { kiSettingsRoutes } from './routes/ki-settings';
import { distributionKeyRoutes } from './routes/distribution-keys';
import { heatingProfileRoutes } from './routes/heating-profiles';
import { configRoutes } from './routes/config';
import { documentRoutes } from './routes/documents';
import { statementRoutes } from './routes/statements';
import { auditLogRoutes } from './routes/audit-log';
import { localAccountRoutes, passwordSignInRoutes, setupRoutes } from './routes/local-accounts';
import { authMiddleware } from './middleware/auth';
import { mailTransportName } from './mail';
import { refusal } from './services/coded-error';

restoreElysiaFormats();

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
			credentials: true
		})
	)
	// the API documentation only outside production, so an installation does not show its API to everyone (#720);
	// Bun.env, since bun build fixes process.env.NODE_ENV at build time (code review 720 C-1)
	.use(
		Bun.env.NODE_ENV === 'production'
			? new Elysia()
			: openapi({
					documentation: {
						info: {
							title: 'Dwello API',
							version: '1.0.0',
							description: 'Swiss Property Management System API'
						},
						tags: [
							{ name: 'Buildings', description: 'Building management' },
							{ name: 'Apartments', description: 'Apartment management' },
							{ name: 'Tenants', description: 'Tenant management' },
							{ name: 'Contracts', description: 'Rental contract management' },
							{ name: 'Invoices', description: 'Invoice management with LLM categorization' },
							{ name: 'Categories', description: 'Cost category management' },
							{ name: 'Distribution Keys', description: 'Cost distribution keys' },
							{ name: 'Heating Profiles', description: 'Heating distribution profiles' },
							{ name: 'Statements', description: 'Utility cost statements' },
							{ name: 'Config', description: 'System configuration' }
						]
					},
					path: '/swagger',
					exclude: { paths: ['/swagger', '/swagger/json'] }
				})
	)
	// Every schema refusal (body, query, params) with a code the UI translates, instead of Elysia's own text
	.onError({ as: 'global' }, ({ code, set }) => {
		if (code === 'NOT_FOUND') {
			set.status = 404;
			return refusal('NOT_FOUND', 'Not found');
		}
		if (code !== 'VALIDATION') return;
		set.status = 422;
		return refusal('VALIDATION_ERROR', 'Invalid request');
	})
	// A path id that is no UUID names no record: not found, before its schema or PostgreSQL refuse it (422, 500)
	.onTransform({ as: 'global' }, ({ params }) => {
		const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (Object.entries(params ?? {}).some(([name, id]) => /id$/i.test(name) && !uuid.test(id ?? ''))) throw new NotFoundError();
	})
	// Health check endpoint
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	// Who receives invoice data for the KI categorisation: the privacy notice is public, so this is too
	.get('/api/v1/invoices/llm-recipient', async () => ({
		recipient: await kiRecipient(),
		enabled: (await currentKi()).mode !== 'none'
	}))
	// Which mail provider receives tenants' data, for the same notice (#82)
	.get('/api/v1/mail-transport', () => ({ transport: mailTransportName() }))
	// Sign-in with a Konto mit Passwort (#576): the BFF asks before there is a session
	.use(passwordSignInRoutes)
	.use(setupRoutes)
	// Everything below requires a valid JWT
	.use(authMiddleware)
	.use(localAccountRoutes)
	// The KI set in the browser (#580) and the local KI's model (#577)
	.use(kiSettingsRoutes)
	.use(dashboardRoutes)
	// Register route modules
	.use(buildingRoutes)
	.use(apartmentRoutes)
	.use(tenantRoutes)
	.use(contractRoutes)
	.use(categoryRoutes)
	.use(invoiceRoutes)
	.use(distributionKeyRoutes)
	.use(heatingProfileRoutes)
	.use(configRoutes)
	.use(statementRoutes)
	.use(documentRoutes)
	.use(auditLogRoutes);
