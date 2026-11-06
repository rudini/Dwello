<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	// The full notice of the public demo (DEMO=on), on the sign-in page and in the help (#675);
	// one's own installation through the operator's contact (OPERATOR_CONTACT), left out without one
	let { contact }: { contact: string | null } = $props();
	// an e-mail address is a link, so it need not be copied (personas Helga H-1, Marco N-5)
	const [before, after] = $derived(m.demo_notice_own({ contact: '\u0000' }).split('\u0000'));
</script>

<p>{m.demo_notice_text()}</p>
<p>{m.demo_notice_try()}</p>
<p>{m.demo_notice_key()}</p>
{#if contact}
	<p>
		{before}{#if contact.includes('@')}<a
				href="mailto:{contact}"
				class="text-accent underline underline-offset-4 hover:text-accent-strong">{contact}</a
			>{:else}{contact}{/if}{after}
	</p>
{/if}
