import { question } from '../screenplay/actor';
import { Announcements, ThePage } from '../screenplay/questions';

// WCAG levels the check enforces (docs/archive/redesign/REDESIGN_BRIEF.md "Automated Checks")
export const accessibilityViolations = ThePage.accessibilityViolations(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);

/** What the check noted on every screen it looked at (tasks/accessibility.ts); [] when nothing */
export const findings = question('the findings of the check', (actor) => actor.recall<string[]>('findings') ?? []);

/** What a screen reader heard since it listens (tasks/accessibility.ts, #1173) */
export const heardAnnouncements = Announcements;
/** Those that contain the word */
export const heardAnnouncementsWith = (word: string) =>
	question(`what a screen reader announced with «${word}»`, async (actor) =>
		(await actor.answer(Announcements)).filter((announcement) => announcement.includes(word))
	);
