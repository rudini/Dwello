import { Count, Enabled, Text, Visibility } from '../screenplay/questions';
import { deleteButton, formula, keyActions, keyRow, sampleShare, usage } from '../targets/distribution-keys';

export const keyListed = (name: string) => Visibility.of(keyRow(name));
export const listedKeysNamed = (name: string) => Count.of(keyRow(name));
export const formulaOf = (name: string) => Text.of(formula(name));
export const invoicesBy = (name: string) => Text.of(usage(name));
export const keyDeletable = (name: string) => Enabled.of(deleteButton(name));
export const keyActionCount = (name: string) => Count.of(keyActions(name));
export const shareOfSample = (apartment: string) => Text.of(sampleShare(apartment));
