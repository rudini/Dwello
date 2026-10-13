import { question } from '../screenplay/actor';
import { ThePage } from '../screenplay/questions';

export const pageTitle = ThePage.title;
export const pageAddress = ThePage.url;
export const pagePath = question('the path of the page', async (actor) => new URL(await actor.answer(ThePage.url)).pathname);
