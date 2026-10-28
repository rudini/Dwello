/**
 * Brings the database in DATABASE_URL up to date with backend/migrations (bun run db:migrate), after a Sicherung when
 * BACKUP_DIR is set (#718)
 */

import { join } from 'path';
import { migrate } from '../src/db/migrate';
import { backupBeforeMigration } from '../src/services/backup.service';

const url = process.env.DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello';
const applied = await migrate(url, join(import.meta.dir, '..', 'migrations'), () => backupBeforeMigration(url));
console.log(applied.length ? `Migrationen angewendet: ${applied.join(', ')}` : 'Datenbank ist aktuell');
