/** Look of every text-like control: 48 px high, 16 px text, a border that stays visible (3:1) */
export const controlClass = (invalid: boolean) =>
	`block w-full min-h-12 rounded-control border-2 bg-surface px-4 py-2 text-base text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:bg-sunken ${
		invalid ? 'border-critical' : 'border-line-strong'
	}`;

/** What a Field hands its control: the id its label points to and the texts that describe it */
export interface FieldControl {
	id: string;
	describedBy: string | undefined;
	invalid: boolean;
}
