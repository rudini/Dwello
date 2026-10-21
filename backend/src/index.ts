/**
 * Dwello Backend Entry Point
 * ElysiaJS server with all API routes
 */

import { app } from './app';
import { llmConfig, llmRecipient } from './config/llm';
import { testConnection } from './db/connection';
import { loadModel } from './services/ki-model.service';
import { announceSetupCode } from './services/setup.service';

// Refuse to start with an external LLM the privacy statement could not name
llmRecipient();

// Test database connection on startup
testConnection().then((connected) => {
	if (!connected) {
		console.warn('⚠️ Database connection failed - some features may not work');
	}
});

app.listen(Number(process.env.PORT) || 3001);

// #577: the Einrichtungscode while Dwello has no account yet, and the local KI's model when it is missing
announceSetupCode().catch((error) => console.warn('⚠️ Einrichtungscode nicht erzeugt', error));
void loadModel({ baseUrl: llmConfig.baseUrl, model: llmConfig.model, local: llmConfig.enabled && !llmRecipient() });

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
