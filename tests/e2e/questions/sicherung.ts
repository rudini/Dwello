import { Attribute, Text } from '../screenplay/questions';
import {
	backupCode,
	backupConfirmation,
	backupError,
	backupGuideLink,
	backupPage,
	backupWarning,
	newCodeConfirmation,
	newCodeGoogleLink
} from '../targets/sicherung';

export const shownBackupCode = Text.of(backupCode);
export const backupPageText = Text.of(backupPage);
export const backupHint = Text.of(backupError);
export const backupConfirmed = Text.of(backupConfirmation);
export const backupGuide = Attribute.named('href').of(backupGuideLink);
export const backupWarningText = Text.of(backupWarning);
export const newCodeConfirmed = Text.of(newCodeConfirmation);
export const googleSignInAgain = Attribute.named('href').of(newCodeGoogleLink);
