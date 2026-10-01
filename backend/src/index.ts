/**
 * Dwello Backend Entry Point
 * ElysiaJS server with all API routes
 */

import { app } from './app';
import { testConnection } from './db/connection';

// Test database connection on startup
testConnection().then((connected) => {
	if (!connected) {
		console.warn('⚠️ Database connection failed - some features may not work');
	}
});

app.listen(3001);

console.log(`🚀 Dwello Backend running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger API docs at http://${app.server?.hostname}:${app.server?.port}/swagger`);
console.log('📝 Available routes:');
console.log('   - GET  /health');
console.log('   - GET  /api/v1/dashboard');
console.log('   - CRUD /api/v1/buildings');
console.log('   - CRUD /api/v1/apartments');
console.log('   - CRUD /api/v1/tenants');
console.log('   - CRUD /api/v1/contracts');
console.log('   - CRUD /api/v1/categories');
console.log('   - CRUD /api/v1/invoices');
console.log('   - CRUD /api/v1/distribution-keys');
console.log('   - CRUD /api/v1/heating-profiles');
console.log('   - CRUD /api/v1/config');
console.log('   - CRUD /api/v1/statements');

export type App = typeof app;
