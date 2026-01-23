import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
			credentials: true
		})
	)
	.get('/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString(),
		service: 'dwello-backend'
	}))
	.listen(3001);

console.log(`🚀 Dwello Backend running at http://${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
