import type { Actor } from '../fixtures/actor';
import { tenantCard, tenantCards } from '../interactions/tenants';

export const listedTenant = (actor: Actor, name: string) => tenantCard(actor.page, name);
export const allListedTenants = (actor: Actor) => tenantCards(actor.page);
