import { Text } from '../screenplay/questions';
import { kiModelLoading, setupError } from '../targets/einrichtung';

export const setupHint = Text.of(setupError);
export const kiModelHint = Text.of(kiModelLoading);
