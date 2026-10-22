import { Count, Enabled, Text, Value } from '../screenplay/questions';
import { kiApiKeyInput, kiBaseUrlInput, kiCheckResult, kiModelDownloadButton, kiPage, kiSaveButton } from '../targets/ki-settings';

export const kiPageText = Text.of(kiPage);
export const enteredApiKey = Value.of(kiApiKeyInput);
export const shownKiAddress = Value.of(kiBaseUrlInput);
export const kiSaveButtons = Count.of(kiSaveButton);
export const kiCheckText = Text.of(kiCheckResult);
export const modelDownloadOffered = Enabled.of(kiModelDownloadButton);
