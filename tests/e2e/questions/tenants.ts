import type { Actor } from '../fixtures/actor';
import { tenantActiveBadge, tenantCard, tenantCards } from '../interactions/tenants';

export const listedTenant = (actor: Actor, name: string) => tenantCard(actor.page, name);
export const allListedTenants = (actor: Actor) => tenantCards(actor.page);
export const activeBadge = (actor: Actor, name: string) => tenantActiveBadge(actor.page, name);
