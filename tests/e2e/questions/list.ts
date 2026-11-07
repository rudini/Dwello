import { Count, FocusedLabel, Text, Value } from '../screenplay/questions';
import { listResultStatus, listResultsHeading, listSearchField, resetFilterControls } from '../targets/list';

export const offeredResets = Count.of(resetFilterControls);
export const listHeading = Text.of(listResultsHeading);
// #662: the label of the field that has the focus, e.g. a filter after a choice
export const focusedFilter = FocusedLabel;
export const announcedResult = Text.of(listResultStatus);
// #662, #680: the text the search field shows
export const listSearchText = Value.of(listSearchField);
