import { question } from '../screenplay/actor';
import { Accessible, Checked, Count, Enabled, HiddenText, Text, Visibility } from '../screenplay/questions';
import { roomBesideConfirmation } from './app-frame';
import {
	allocabilityQuestion,
	allocabilityText,
	allowanceOption,
	allowedBadge,
	categoryRow,
	focusedCategoryRow,
	deleteButton,
	categoryNames,
	deleteQuestion,
	description,
	descriptionInput,
	sortOrderInput,
	contractNote,
	formReason,
	formReasonLabel,
	allowanceQuestion,
	heatingCheckbox,
	heatingHelp,
	kindBadge,
	predefinedHint,
	proposal,
	reason,
	usage
} from '../targets/categories';

export const categoryListed = (name: string) => Visibility.of(categoryRow(name));
export const listedCategoriesNamed = (name: string) => Count.of(categoryRow(name));
export const allowance = (name: string) => Text.of(allowedBadge(name));
export const invoicesOf = (name: string) => Text.of(usage(name));
export const categoryDeletable = (name: string) => Enabled.of(deleteButton(name));
export const descriptionOf = (name: string) => Text.of(description(name));
export const notAllowedChosen = Checked.of(allowanceOption('Nicht umlagefähig'));
export const allowedChosen = Checked.of(allowanceOption('Umlagefähig'));
export const proposalText = Text.of(proposal);
export const reasonOf = (name: string) => Text.of(reason(name));
export const reasonsOf = (name: string) => Count.of(reason(name));
export const contractHint = Text.of(contractNote);
export const formReasonText = Text.of(formReason);
export const formReasonLabelText = Text.of(formReasonLabel);
export const allowanceQuestionDescription = Accessible.descriptionOf(allowanceQuestion);
export const hiddenDescription = HiddenText.of(descriptionInput);
export const kindOf = (name: string) => Text.of(kindBadge(name));
export const whyNotDeletable = (name: string) => Accessible.descriptionOf(deleteButton(name));
export const predefinedHintText = Text.of(predefinedHint);
export const heatingChangeable = Enabled.of(heatingCheckbox);
export const heatingChecked = Checked.of(heatingCheckbox);
export const heatingHelpText = Text.of(heatingHelp);
export const allocabilityQuestionText = Text.of(allocabilityQuestion);
export const allocabilityConsequence = Text.of(allocabilityText);
/** #1113: the room between the row with the focus and the confirmation (negative: it covers the row) */
export const roomBesideFocusedCategory = roomBesideConfirmation(focusedCategoryRow);
// #672: the help of a field, as a screen reader reads it with the field
export const fieldHelp = { Beschreibung: Accessible.descriptionOf(descriptionInput), Reihenfolge: Accessible.descriptionOf(sortOrderInput) };
export const deleteQuestionText = Text.of(deleteQuestion);
/** #672: whether the list shows the one category before the other */
export const listedBefore = (first: string, second: string) =>
	question(`whether ${first} stands before ${second}`, async (actor) => {
		const listed = await actor.answer(Text.ofAll(categoryNames));
		return listed.includes(first) && listed.indexOf(first) < listed.indexOf(second);
	});
