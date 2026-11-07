import type { Activity } from '../screenplay/actor';
import { Enter, Focus, Select } from '../screenplay/interactions';
import { listFilter, listSearchField } from '../targets/list';

// #662: typed, not searched yet
export const typeIntoListSearch = (term: string) => Enter.theValue(term).into(listSearchField);

// #662: a filter applies on change, without «Suchen»; from the keyboard, as the focus then stays in the filter (#677)
export const chooseInListFilter = (label: string, option: string): Activity => (actor) =>
	actor.attemptsTo(Focus.on(listFilter(label)), Select.option({ label: option }).from(listFilter(label)));
