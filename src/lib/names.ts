/** The German name of a master data record (category, distribution key, heating profile); own records may lack one */
export const germanName = (record: { name: string; nameDE?: string | null }) =>
	record.nameDE || record.name;
