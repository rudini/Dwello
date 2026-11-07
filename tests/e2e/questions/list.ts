import { Count, Text, Visibility } from '../screenplay/questions';
import { listResultsHeading, listSearch, resetFilterControls } from '../targets/list';

export const listSearchShown = Visibility.of(listSearch);
export const offeredResets = Count.of(resetFilterControls);
export const listHeading = Text.of(listResultsHeading);
