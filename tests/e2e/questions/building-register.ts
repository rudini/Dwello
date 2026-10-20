import type { Question } from '../screenplay/actor';
import { question } from '../screenplay/actor';
import { Count, Text, Value, Visibility } from '../screenplay/questions';
import {
	buildingApartmentRows,
	registerApartmentField,
	registerApartmentNote,
	registerApartmentNumbers,
	registerApartmentsHelp,
	registerNotice,
	registerRoomsHelp
} from '../targets/building-register';

export const registerNoticeText = Text.of(registerNotice);
export const registerApartmentsHelpText = Text.of(registerApartmentsHelp);
export const proposedApartmentNumbers = Value.ofAll(registerApartmentNumbers);
export const shownApartmentCount = Count.of(buildingApartmentRows);

/** Where the Wohnung with this number is in the preview (-1 when it is not there) */
export const indexOfApartment = (number: string): Question<number> =>
	question(`where Wohnung ${number} is in the preview`, async (actor) =>
		(await actor.answer(proposedApartmentNumbers)).indexOf(number)
	);

export const proposedRooms = (number: string): Question<string | null> =>
	question(`the Zimmeranzahl proposed for Wohnung ${number}`, async (actor) =>
		actor.answer(Value.of(registerApartmentField('rooms', await actor.answer(indexOfApartment(number)))))
	);

export const roomsHelp = (index: number) => Text.of(registerRoomsHelp(index));

const fieldNames = { number: 'Wohnungsnummer', floor: 'Stockwerk', area: 'Fläche', rooms: 'Zimmeranzahl' } as const;

/** The fields of a Wohnung the register lacks, by name in the order Fläche, Stockwerk, Wohnungsnummer, Zimmeranzahl */
export const missingInRegister = (number: string): Question<string> =>
	question(`what the register lacks for Wohnung ${number}`, async (actor) => {
		const index = await actor.answer(indexOfApartment(number));
		const missing: string[] = [];
		for (const field of ['area', 'floor', 'number', 'rooms'] as const) {
			if (await actor.answer(Visibility.of(registerApartmentNote(field, index)))) missing.push(fieldNames[field]);
		}
		return missing.join(', ');
	});
