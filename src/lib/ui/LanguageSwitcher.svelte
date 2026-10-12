<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales, setLocale, type Locale } from '$lib/paraglide/runtime';
	import { flushSync } from 'svelte';
	import Icon from './Icon.svelte';

	// Each language in its own words, so it is found whatever language the page shows
	const names: Record<Locale, string> = {
		de: 'Deutsch',
		fr: 'Français',
		it: 'Italiano',
		en: 'English'
	};
	const current = getLocale();

	let open = $state(false);
	let button = $state<HTMLButtonElement>();
	let frame = $state<HTMLElement>();

	function close() {
		open = false;
		button?.focus();
	}

	// Arrow keys, Home and End move between the languages; from the closed button they open on the current one
	const moves: Record<string, (at: number, last: number) => number> = {
		ArrowDown: (at, last) => (at < last ? at + 1 : 0),
		ArrowUp: (at, last) => (at > 0 ? at - 1 : last),
		Home: () => 0,
		End: (_, last) => last
	};
	function move(event: KeyboardEvent) {
		if (!(event.key in moves)) return;
		event.preventDefault();
		const options = () => [
			...(frame?.querySelectorAll<HTMLElement>('[data-testid="language-option"]') ?? [])
		];
		if (!open) {
			open = true;
			flushSync();
			return options()[locales.indexOf(current)]?.focus();
		}
		const all = options();
		all[
			moves[event.key](all.indexOf(document.activeElement as HTMLElement), all.length - 1)
		]?.focus();
	}
</script>

<svelte:window onkeydown={(event) => open && event.key === 'Escape' && close()} />

<!-- The choice goes into a cookie and the page reloads in the new language, at the same address -->
<div
	bind:this={frame}
	class="relative shrink-0"
	onfocusout={(event) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) open = false;
	}}
>
	<button
		bind:this={button}
		type="button"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-controls="language-menu"
		onkeydown={move}
		class="flex min-h-12 items-center gap-2 rounded-control px-2 text-ink hover:bg-sunken"
		data-testid="language-button"
	>
		<Icon name="language" size={24} />
		<span class="sr-only">{m.language_prefix()}</span>{names[current]}
	</button>

	{#if open}
		<button
			type="button"
			class="fixed inset-0 z-10 cursor-default"
			tabindex="-1"
			aria-hidden="true"
			onclick={() => (open = false)}
		></button>
		<ul
			id="language-menu"
			class="absolute right-0 z-20 mt-2 flex w-48 flex-col rounded-panel border border-line bg-surface py-2 shadow-raised"
		>
			{#each locales as locale (locale)}
				<li>
					<button
						type="button"
						lang={locale}
						aria-current={locale === current ? 'true' : undefined}
						onclick={() => setLocale(locale)}
						onkeydown={move}
						class="flex min-h-12 w-full items-center gap-2 px-4 text-left text-ink hover:bg-sunken {locale ===
						current
							? 'font-semibold'
							: ''}"
						data-testid="language-option"
					>
						{names[locale]}
						{#if locale === current}<Icon name="check" />{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
