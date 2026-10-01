import type { Actor } from '../fixtures/actor';
import { statementLineItem, statementStatus } from '../interactions/statement-detail';

export const statusOfStatement = (actor: Actor) => statementStatus(actor.page);
export const heatingCosts = (actor: Actor) => statementLineItem(actor.page, 'Heating');
