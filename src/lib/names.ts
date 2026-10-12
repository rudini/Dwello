import { getLocale } from '$lib/paraglide/runtime';

type Named = {
	name: string;
	nameDE?: string | null;
	nameFR?: string | null;
	nameIT?: string | null;
	nameEN?: string | null;
};

/** The German name of a master data record (category, distribution key, heating profile); own records may lack one */
export const germanName = (record: { name: string; nameDE?: string | null }) =>
	record.nameDE || record.name;

/** The name of a master data record in the UI language, else its German name */
export function localName(record: Named) {
	const key = `name${getLocale().toUpperCase()}` as 'nameDE' | 'nameFR' | 'nameIT' | 'nameEN';
	return record[key] || germanName(record);
}
