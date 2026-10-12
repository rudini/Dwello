import { m } from '$lib/paraglide/messages';

// Gebäudetyp (UBIQUITOUS_LANGUAGE.md): stored in German, shown in the UI language
const labels: Record<string, () => string> = {
	Mehrfamilienhaus: m.buildings_type_multi_family,
	Einfamilienhaus: m.buildings_type_single_family,
	Geschäftshaus: m.buildings_type_commercial,
	Gewerbegebäude: m.buildings_type_industrial,
	Mischnutzung: m.buildings_type_mixed
};

/** The stored building types, in their order of choice */
export const buildingTypes = Object.keys(labels);

/** A building type in the UI language; an unknown one as stored */
export const buildingTypeLabel = (type: string) => labels[type]?.() ?? type;
