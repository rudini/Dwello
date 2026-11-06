<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	// The full notice of the public demo (DEMO=on), on the sign-in page and in the help (#675);
	// one's own installation through the operator's contact (OPERATOR_CONTACT), left out without one
	let { contact }: { contact: string | null } = $props();
</script>

<p>{m.demo_notice_text()}</p>
<p>{m.demo_notice_try()}</p>
<p>{m.demo_notice_key()}</p>
{#if contact}
	<p>{m.demo_notice_own({ contact })}</p>
{/if}
