import { question } from '../screenplay/actor';
import { FocusedElement, FocusedText, ThePage } from '../screenplay/questions';

export const pageTitle = ThePage.title;
export const pageAddress = ThePage.url;
export const pagePath = question('the path of the page', async (actor) => new URL(await actor.answer(ThePage.url)).pathname);

/** The data-testid of the focused element, e.g. the result heading of a list after a search (#681) */
export const focusedPlace = FocusedElement;
/** The text of the focused element, e.g. which result of a list the focus is on */
export const focusedText = FocusedText;
