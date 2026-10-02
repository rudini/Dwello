import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { configuration } from '../db/schema';

/** Whether the settings propose this record by default (e.g. default_heating_profile_id) */
export async function isDefaultSetting(key: string, id: string) {
	const [setting] = await db.select({ value: configuration.value }).from(configuration).where(eq(configuration.key, key));
	return setting?.value === id;
}
