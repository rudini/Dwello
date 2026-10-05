import type { Actor } from '../fixtures/actor';
import {
	deleteButton,
	editButton,
	formula,
	keyRow,
	sampleRow,
	usage
} from '../interactions/distribution-keys';

export const listedKey = (actor: Actor, name: string) => keyRow(actor.page, name);
export const formulaOf = (actor: Actor, name: string) => formula(actor.page, name);
export const invoicesBy = (actor: Actor, name: string) => usage(actor.page, name);
export const deletion = (actor: Actor, name: string) => deleteButton(actor.page, name);
export const keyActions = (actor: Actor, name: string) =>
	editButton(actor.page, name).or(deleteButton(actor.page, name));
export const sampleShare = (actor: Actor, apartment: string) =>
	sampleRow(actor.page, apartment).getByTestId('formula-test-share');
