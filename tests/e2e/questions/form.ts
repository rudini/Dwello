import type { Actor } from '../fixtures/actor';
import { deleteConfirmButton, formError } from '../interactions/form';

export const errorMessage = (actor: Actor, text: string) => formError(actor.page, text);
export const deleteConfirmation = (actor: Actor) => deleteConfirmButton(actor.page);
