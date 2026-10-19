<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// #435: everything Dwello holds about the tenant as one ZIP, for the right to data handover (Art. 28 DSG); the help
	// says what to check before handing it over (domain review F-3)
	let { id }: { id: string } = $props();
</script>

<Panel title={m.tenants_export_title()}>
	<div class="flex flex-col items-start gap-4">
		<p id="tenant-export-help" class="text-ink" data-testid="tenant-export-help">
			{m.tenants_export_help()}
		</p>
		<Button
			href="/tenants/{id}/export"
			reload
			download
			icon="document-download"
			describedby="tenant-export-help"
			testid="tenant-export-button">{m.tenants_export()}</Button
		>
	</div>
</Panel>
