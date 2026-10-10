import Apartment from './Apartment.svelte';
import Building from './Building.svelte';
import Contract from './Contract.svelte';
import Done from './Done.svelte';
import Envelope from './Envelope.svelte';
import Meter from './Meter.svelte';
import NoResults from './NoResults.svelte';
import Problem from './Problem.svelte';
import Receipts from './Receipts.svelte';
import Statement from './Statement.svelte';

/** Line illustrations from the domain, for empty states, onboarding, errors and completion */
export const illustrations = {
	building: Building,
	apartment: Apartment,
	contract: Contract,
	meter: Meter,
	receipts: Receipts,
	statement: Statement,
	envelope: Envelope,
	done: Done,
	'no-results': NoResults,
	problem: Problem
};

export type IllustrationName = keyof typeof illustrations;
