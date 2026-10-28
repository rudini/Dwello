<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import FormDialog from './FormDialog.svelte';

	// #506: an open Übertrag settled by hand, with its real consequence (Fachreview 506-1 V-5)
	let { open = $bindable(), statement }: { open: boolean; statement: StatementWithDetails } =
		$props();
</script>

<FormDialog
	bind:open
	action="?/settleCarry"
	title={m.statements_carry_settle_title()}
	confirmLabel={m.statements_carry_settle()}
	confirmTestid="statement-carry-settle-confirm"
	success={m.statements_carry_settle_done()}
>
	<p>
		{statement.balance < 0
			? m.statements_carry_settle_confirm_refund()
			: m.statements_carry_settle_confirm_due()}
	</p>
</FormDialog>
