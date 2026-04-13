<script lang="ts">
	import './layout.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-30">
	<div class="relative mx-auto h-full max-w-6xl">
		<div class="absolute inset-y-0 left-0 w-px bg-slate-200 dark:bg-neutral-800"></div>
		<div class="absolute inset-y-0 right-0 w-px bg-slate-200 dark:bg-neutral-800"></div>
	</div>
</div>

{@render children()}

<ThemeToggle />
