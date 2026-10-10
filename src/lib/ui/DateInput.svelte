<script lang="ts">
	import Field from './Field.svelte';
	import IconButton from './IconButton.svelte';
	import { controlClass } from './field';
	import { parseSwissDate } from '$lib/swiss-date';
	import { formatDate, formatDateLong } from '$lib/utils/format';

	// Date typed as TT.MM.JJJJ whatever the browser's language; value and form field are YYYY-MM-DD
	let {
		id,
		label,
		value = $bindable(''),
		name,
		help,
		error,
		optional = false,
		min,
		max,
		testid
	}: {
		id: string;
		label: string;
		value?: string;
		name?: string;
		help?: string;
		error?: string;
		optional?: boolean;
		min?: string; // limits the calendar only; the page checks the date
		max?: string;
		testid?: string;
	} = $props();

	const FORMAT = 'Format TT.MM.JJJJ, zum Beispiel 31.12.2025.';
	const toText = (iso: string) => (iso ? formatDate(iso) : '');

	let text = $state(toText(value));
	let left = $state(false); // left the field once: only then a half-typed date is wrong
	let calendar = $state<HTMLInputElement>();

	// a value set from outside (a draft, the calendar) shows in the field
	$effect(() => {
		if (value !== (parseSwissDate(text) ?? '')) text = toText(value);
	});

	const invalid = $derived(!!text.trim() && !parseSwissDate(text));
	const shownError = $derived(
		invalid && (left || error)
			? 'Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2025.'
			: error
	);

	function oninput(event: Event & { currentTarget: HTMLInputElement; inputType?: string }) {
		left = false;
		// the dots come by themselves after day and month, so the number keypad is enough
		const typed = event.currentTarget.value;
		text =
			/^\d{2}$|^\d{1,2}\.\d{2}$/.test(typed) && event.inputType !== 'deleteContentBackward'
				? `${typed}.`
				: typed;
		event.currentTarget.value = text;
		value = parseSwissDate(text) ?? '';
	}

	function onblur() {
		left = true;
		if (value) text = toText(value);
	}
</script>

<div class="flex flex-col gap-2">
	<Field {id} {label} help={help ? `${help} ${FORMAT}` : FORMAT} error={shownError} {optional}>
		{#snippet children(control)}
			<div class="flex gap-2">
				<input
					id={control.id}
					type="text"
					inputmode="numeric"
					autocomplete="off"
					value={text}
					{oninput}
					{onblur}
					aria-required={!optional}
					aria-describedby={control.describedBy}
					aria-invalid={control.invalid || undefined}
					class="{controlClass(control.invalid)} tabular-nums"
					data-testid={testid}
				/>
				<IconButton
					icon="calendar"
					label="Kalender für {label} öffnen"
					onclick={() => calendar?.showPicker?.()}
					testid="{testid}-calendar"
				/>
				<!-- the browser's own calendar, opened by the button; typing stays in the text field -->
				<input
					bind:this={calendar}
					type="date"
					tabindex="-1"
					aria-hidden="true"
					class="sr-only"
					{value}
					{min}
					{max}
					onchange={(event) => {
						value = event.currentTarget.value;
						text = toText(value);
					}}
				/>
			</div>
		{/snippet}
	</Field>
	{#if name}<input type="hidden" {name} {value} />{/if}
	{#if value}
		<p class="font-semibold text-ink" aria-live="polite" data-testid="{testid}-words">
			{formatDateLong(value)}
		</p>
	{/if}
</div>
