<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error - Dwello</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<span class="material-symbols-outlined text-6xl text-red-500">error</span>
		</div>
		<h1 class="text-4xl font-bold text-gray-900 mb-2">
			{$page.status}
		</h1>
		<p class="text-lg text-gray-600 mb-8">
			{$page.error?.message || 'An unexpected error occurred'}
		</p>
		<div class="space-x-4">
			<a
				href="/"
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
			>
				<span class="material-symbols-outlined text-sm mr-2">home</span>
				Go Home
			</a>
			<button
				type="button"
				onclick={() => history.back()}
				class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
			>
				<span class="material-symbols-outlined text-sm mr-2">arrow_back</span>
				Go Back
			</button>
		</div>
	</div>
</div>
