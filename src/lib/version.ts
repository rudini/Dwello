/**
 * The version shown in the app, from `git describe --tags`: «0.4.0» on a tag, «0.4.0+3-gabc1234» three commits
 * after it; undefined without a tag (no git, no tag fetched)
 */
export function versionFrom(describe: string): string | undefined {
	const [, version, since] = describe.trim().match(/^v(\d+\.\d+\.\d+)(?:-(\d+-g[0-9a-f]+))?$/) ?? [];
	return version && (since ? `${version}+${since}` : version);
}
