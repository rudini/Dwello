import type { Download } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Actor } from '../fixtures/actor';

// The file the actor downloaded last: its name and its first bytes
export const downloadedFile = async (actor: Actor) => {
	const download = actor.recall<Download>('download');
	const content = await readFile(await download.path());
	return { name: download.suggestedFilename(), header: content.subarray(0, 5).toString() };
};
