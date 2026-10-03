<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { listPageUrl } from '$lib/list-url';
	import Pagination from './Pagination.svelte';

	// Paging of a list page whose filters live in the URL
	let { data }: { data: { page: number; pageSize: number; total: number } } = $props();
</script>

<Pagination
	page={data.page}
	pageSize={data.pageSize}
	total={data.total}
	onchange={(newPage) => goto(listPageUrl($page.url, newPage))}
/>
