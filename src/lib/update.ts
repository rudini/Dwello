/** The notice of a new version after sign-in (#1453): update with one click, the Sicherung first, or by hand without
 * the update service; releaseUrl: the release notes on GitHub («Was ist neu?») */
export type UpdateNotice = {
	latest: string;
	current: string;
	releaseUrl: string;
	variant: 'update' | 'backup' | 'manual';
};
