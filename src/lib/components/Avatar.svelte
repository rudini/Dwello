<script lang="ts">
	type Size = 'sm' | 'md' | 'lg' | 'xl';

	interface Props {
		name: string;
		src?: string;
		size?: Size;
		class?: string;
	}

	let { name, src = '', size = 'md', class: className = '' }: Props = $props();

	// Generate initials from name
	const initials = $derived.by(() => {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	});

	// Generate consistent color based on name
	const bgColor = $derived.by(() => {
		const colors = [
			'bg-blue-500',
			'bg-green-500',
			'bg-purple-500',
			'bg-amber-500',
			'bg-red-500',
			'bg-cyan-500',
			'bg-pink-500',
			'bg-indigo-500'
		];
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	});

	const sizeClasses: Record<Size, string> = {
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-lg'
	};

	const classes = $derived(
		`rounded-full flex items-center justify-center font-semibold text-white ${sizeClasses[size]} ${className}`
	);
</script>

{#if src}
	<img {src} alt={name} class="{classes} object-cover" />
{:else}
	<div class="{classes} {bgColor}">
		{initials}
	</div>
{/if}
