<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import SiteFooter from '$lib/components/sections/SiteFooter.svelte';

	let { children } = $props();
</script>

<div class="relative">
	<Navbar />
	{@render children()}
	<SiteFooter />
</div>
