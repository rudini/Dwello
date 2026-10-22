import { Count, Text, Value } from '../screenplay/questions';
import { kiApiKeyInput, kiBaseUrlInput, kiCheckResult, kiPage, kiSaveButton } from '../targets/ki-settings';

export const kiPageText = Text.of(kiPage);
export const enteredApiKey = Value.of(kiApiKeyInput);
export const shownKiAddress = Value.of(kiBaseUrlInput);
export const kiSaveButtons = Count.of(kiSaveButton);
export const kiCheckText = Text.of(kiCheckResult);
