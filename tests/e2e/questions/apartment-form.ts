import { Count, Text } from '../screenplay/questions';
import { discontinuedHelp, numberTakenWarning, rentedStatus, statusSelect } from '../targets/apartment-form';

export const numberTaken = Text.of(numberTakenWarning);

export const statusFromContracts = Text.of(rentedStatus);
export const manualStatusChoices = Count.of(statusSelect);
export const discontinuedHelpText = Text.of(discontinuedHelp);
