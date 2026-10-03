import type { Actor } from '../fixtures/actor';
import { pageSection } from '../interactions/app-frame';

export const sectionTitled = (actor: Actor, heading: string) => pageSection(actor.page, heading);
