<script lang="ts">
	import Field from './Field.svelte';
	import IconButton from './IconButton.svelte';
	import { controlClass } from './field';
	import { flushSync } from 'svelte';
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
		testid: string;
	} = $props();

	const FORMAT = 'Format TT.MM.JJJJ.';
	// the example is the last day of this year: never in the past
	const EXAMPLE = `31.12.${new Date().getFullYear()}`;
	const NOT_A_DATE = `Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel ${EXAMPLE}.`;
	const toText = (iso: string) => (iso ? formatDate(iso) : '');

	let text = $state(toText(value));
	let left = $state(false); // left the field once: only then a half-typed date is wrong
	let calendar = $state<HTMLInputElement>();
	let frame = $state<HTMLElement>();

	// the form emptied (after saving): the date it sends and its words go too; sent (also by Enter): check the date
	$effect(() => {
		const form = frame?.closest('form');
		const reset = () => ((text = ''), (value = ''));
		// before the form data is read: a two-digit year goes out written in full
		const sent = () => flushSync(onblur);
		form?.addEventListener('reset', reset);
		form?.addEventListener('submit', sent, true);
		return () => {
			form?.removeEventListener('reset', reset);
			form?.removeEventListener('submit', sent, true);
		};
	});

	// while typing, "31.12.20" is not yet a date: a two-digit year counts only when the field is left
	const typed = (text: string) => (/\.\d{2}$/.test(text.trim()) ? '' : (parseSwissDate(text) ?? ''));

	// a value set from outside (a draft, the calendar) shows in the field
	$effect(() => {
		if (value !== typed(text)) text = toText(value);
	});

	const invalid = $derived(!!text.trim() && !parseSwissDate(text));
	// checked when leaving the field; a half-typed date is no error yet
	// "1.12" is a real day without its year: say what is missing
	const NO_YEAR = $derived(
		`Es fehlt das Jahr. Bitte geben Sie das Datum als TT.MM.JJJJ ein, zum Beispiel ${text.trim().replace(/\.$/, '').split('.').map((n) => n.padStart(2, '0')).join('.')}.${new Date().getFullYear()}.`
	);
	// a day that does not exist, a missing year, or another way of writing it (words, slashes)
	const FORMAT_ONLY = `Bitte geben Sie das Datum in Ziffern als TT.MM.JJJJ ein, zum Beispiel ${EXAMPLE}.`;
	const wrongDate = $derived(
		/^\d{1,2}\.\d{1,2}\.?$/.test(text.trim())
			? NO_YEAR
			: /^(\d{1,2}\.\d{1,2}\.\d{2,4}|\d{8})$/.test(text.trim())
				? NOT_A_DATE
				: FORMAT_ONLY
	);
	const shownError = $derived(invalid && left ? wrongDate : error);
	const wordsId = $derived(`${id}-words`);
	const helpText = $derived(help ? `${help} ${FORMAT}` : FORMAT);
	const words = $derived(value ? formatDateLong(value) : '');
	// said when the field is left, and an error of the page, also when the field kept the focus (Enter)
	const announced = $derived(invalid && left ? wrongDate : (error ?? ''));

	function oninput(event: Event & { currentTarget: HTMLInputElement; inputType?: string }) {
		left = false;
		const input = event.currentTarget;
		text = input.value;
		// typing at the end: the dots come by themselves after day and month, so the number keypad is enough;
		// an edit in the middle stays as it is, the cursor too
		if (input.selectionStart === input.value.length) {
			const at = text.replace(/\.{2,}/g, '.'); // a dot typed after the automatic one
			text = /^\d{2}$|^\d{1,2}\.\d{2}$/.test(at) && event.inputType !== 'deleteContentBackward' ? `${at}.` : at;
			input.value = text;
		}
		value = typed(text);
	}

	// Enter (in a dialog it confirms): the date counts as when the field is left, «01.01.25» as 2025
	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') flushSync(onblur);
	}

	function onblur() {
		left = true;
		value = parseSwissDate(text) ?? '';
		if (value) text = toText(value);
	}
</script>

<div bind:this={frame} class="flex flex-col gap-2">
	<Field {id} {label} help={helpText} example={EXAMPLE} error={shownError} {optional}>
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
					{onkeydown}
					aria-required={!optional}
					aria-describedby={[control.describedBy, value && wordsId].filter(Boolean).join(' ')}
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
					oninput={(event) => {
						// input, not change: the field's frame takes the error away on input, the date must be in by then
						value = event.currentTarget.value;
						text = toText(value);
					}}
				/>
			</div>
		{/snippet}
	</Field>
	{#if name}<input type="hidden" {name} {value} />{/if}
	<!-- always there, so screen readers hear the first date too -->
	<p
		id={wordsId}
		class="font-semibold text-ink empty:hidden"
		aria-live="polite"
		data-testid="{testid}-words"
	>
		{words}
	</p>
	<!-- the focus is in the next field when the check on leaving fails: say it -->
	<p class="sr-only" aria-live="assertive">{announced}</p>
</div>
