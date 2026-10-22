import { Text, Value } from '../screenplay/questions';
import { kiModelLoading, setupError, setupPasswordInput, setupPasswordRepeatInput } from '../targets/einrichtung';

export const setupHint = Text.of(setupError);
export const kiModelHint = Text.of(kiModelLoading);
export const enteredSetupPassword = Value.of(setupPasswordInput);
export const repeatedSetupPassword = Value.of(setupPasswordRepeatInput);
