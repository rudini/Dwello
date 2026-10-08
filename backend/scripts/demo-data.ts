/**
 * Loads the demo data into the database in DATABASE_URL (bun run db:demo)
 */

import { closeConnection } from '../src/db/connection';
import { loadDemoData } from '../src/db/demo-data';

await loadDemoData();
await closeConnection();
console.log('Demodaten geladen');
