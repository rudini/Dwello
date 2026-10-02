<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="grid gap-4 sm:grid-cols-3" data-testid="quick-links">
	<a
		href="/config/categories"
		class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
		data-testid="quick-link-categories"
	>
		<div class="p-3 bg-blue-100 rounded-lg">
			<Icon name="category" size={24} class="text-blue-600" />
		</div>
		<div>
			<h3 class="font-medium text-gray-900">Kategorien</h3>
			<p class="text-sm text-gray-500">Kostenkategorien verwalten</p>
		</div>
	</a>
	<a
		href="/config/heating-profiles"
		class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
		data-testid="quick-link-heating-profiles"
	>
		<div class="p-3 bg-orange-100 rounded-lg">
			<Icon name="local_fire_department" size={24} class="text-orange-600" />
		</div>
		<div>
			<h3 class="font-medium text-gray-900">Heizprofile</h3>
			<p class="text-sm text-gray-500">Heizverteilung konfigurieren</p>
		</div>
	</a>
	<a
		href="/config/distribution-keys"
		class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
		data-testid="quick-link-distribution-keys"
	>
		<div class="p-3 bg-purple-100 rounded-lg">
			<Icon name="calculate" size={24} class="text-purple-600" />
		</div>
		<div>
			<h3 class="font-medium text-gray-900">Verteilschlüssel</h3>
			<p class="text-sm text-gray-500">Kostenverteilung definieren</p>
		</div>
	</a>
</div>
