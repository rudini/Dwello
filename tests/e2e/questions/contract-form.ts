import { Checked, Enabled, Text, Value, Visibility } from '../screenplay/questions';
import { apartmentOption, apartmentSelect, durationOption, reviewItem, tenantSelect } from '../targets/contract-form';
import { successToast } from '../targets/form';
import { draftRestored } from '../targets/wizard';

export const apartmentSelectable = (apartmentId: string) => Enabled.of(apartmentOption(apartmentId));
export const chosenApartmentId = Value.of(apartmentSelect);
export const chosenTenantId = Value.of(tenantSelect);
export const chosenTenantName = Value.chosenIn(tenantSelect);
export const reviewed = (label: string) => Text.of(reviewItem(label));
export const draftRestoredShown = Visibility.of(draftRestored);
export const confirmation = Text.of(successToast);
export const durationChosen = (label: string) => Checked.of(durationOption(label));
