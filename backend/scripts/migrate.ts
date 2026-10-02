/**
 * Brings the database in DATABASE_URL up to date with backend/migrations (bun run db:migrate)
 */

import { join } from 'path';
import { migrate } from '../src/db/migrate';

const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello';
const applied = await migrate(url, join(import.meta.dir, '..', 'migrations'));
console.log(applied.length ? `Migrationen angewendet: ${applied.join(', ')}` : 'Datenbank ist aktuell');
