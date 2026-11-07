import type { Activity } from '../screenplay/actor';
import { Enter, Focus, Select, Wait } from '../screenplay/interactions';
import { Attribute, Value } from '../screenplay/questions';
import { listFilter, listSearchField } from '../targets/list';

// #662: typed, not searched yet
export const typeIntoListSearch = (term: string) => Enter.theValue(term).into(listSearchField);

// #662: a filter applies on change, without «Suchen»; from the keyboard, as the focus then stays in the filter (#677);
// done once the address carries the choice
export const chooseInListFilter = (label: string, option: string): Activity => async (actor) => {
	const filter = listFilter(label);
	await actor.attemptsTo(Focus.on(filter), Select.option({ label: option }).from(filter));
	const [name, value] = [await actor.answer(Attribute.named('name').of(filter)), await actor.answer(Value.of(filter))];
	await actor.attemptsTo(Wait.forUrl((url) => url.searchParams.get(name ?? '') === value));
};
