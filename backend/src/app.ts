/**
 * Dwello API application (all routes, without starting the server)
 */

import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { dashboardRoutes } from './routes/dashboard';
import { buildingRoutes } from './routes/buildings';
import { apartmentRoutes } from './routes/apartments';
import { tenantRoutes } from './routes/tenants';
import { contractRoutes } from './routes/contracts';
import { categoryRoutes } from './routes/categories';
import { invoiceRoutes } from './routes/invoices';
import { llmConfig, llmRecipient } from './config/llm';
import { distributionKeyRoutes } from './routes/distribution-keys';
import { heatingProfileRoutes } from './routes/heating-profiles';
import { configRoutes } from './routes/config';
import { documentRoutes } from './routes/documents';
import { statementRoutes } from './routes/statements';
import { auditLogRoutes } from './routes/audit-log';
import { authMiddleware } from './middleware/auth';
import { mailTransportName } from './mail';
import { refusal } from './services/coded-error';

export const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
			credentials: true
		})
	)
	.use(
		swagger({
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
			exclude: ['/swagger', '/swagger/json']
		})
	)
	// Every schema refusal (body, query, params) with a code the UI translates, instead of Elysia's own text
	.onError({ as: 'global' }, ({ code, set }) => {
		if (code !== 'VALIDATION') return;
		set.status = 422;
		return refusal('VALIDATION_ERROR', 'Invalid request');
	})
	// Health check endpoint
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	// Who receives invoice data for the KI categorisation: the privacy notice is public, so this is too
	.get('/api/v1/invoices/llm-recipient', () => ({ recipient: llmRecipient(), enabled: llmConfig.enabled }))
	// Which mail provider receives tenants' data, for the same notice (#82)
	.get('/api/v1/mail-transport', () => ({ transport: mailTransportName() }))
	// Everything below requires a valid JWT
	.use(authMiddleware)
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
