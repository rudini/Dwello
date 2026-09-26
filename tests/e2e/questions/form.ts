import type { Actor } from '../fixtures/actor';
import { formError } from '../interactions/form';

export const errorMessage = (actor: Actor, text: string) => formError(actor.page, text);
