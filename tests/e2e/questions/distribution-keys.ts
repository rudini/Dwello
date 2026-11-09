import { Accessible, Attribute, Count, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import {
	deleteButton,
	formula,
	formulaError,
	formulaHelp,
	formulaInput,
	keyActions,
	keyRow,
	nameInput,
	sampleShare,
	testErrors,
	translations,
	usage
} from '../targets/distribution-keys';

export const keyListed = (name: string) => Visibility.of(keyRow(name));
export const listedKeysNamed = (name: string) => Count.of(keyRow(name));
export const formulaOf = (name: string) => Text.of(formula(name));
export const invoicesBy = (name: string) => Text.of(usage(name));
export const keyDeletable = (name: string) => Enabled.of(deleteButton(name));
export const keyActionCount = (name: string) => Count.of(keyActions(name));
export const shareOfSample = (apartment: string) => Text.of(sampleShare(apartment));
export const nameProblem = Accessible.descriptionOf(nameInput);
export const formulaProblem = Text.of(formulaError);
export const formulaMarkedInvalid = Attribute.named('aria-invalid').of(formulaInput);
export const formulaTestErrors = Text.ofAll(testErrors);
export const formulaValue = Value.of(formulaInput);
export const formulaHelpText = Text.of(formulaHelp);
export const translationsOf = (name: string) => Text.of(translations(name));
export const translationMarkers = (name: string) => Count.of(translations(name));
