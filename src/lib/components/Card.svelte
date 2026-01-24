<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all p-6 {className}">
	<slot />
</div>
