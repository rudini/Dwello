import type { Actor } from '../fixtures/actor';
import { comingSoonNotice } from '../interactions/coming-soon';

export const announcement = (actor: Actor) => comingSoonNotice(actor.page);
