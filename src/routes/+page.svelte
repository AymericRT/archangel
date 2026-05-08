<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import HorizontalHeroPager from '$lib/components/sections/HorizontalHeroPager.svelte';
	import Homepage from '$lib/components/sections/Homepage.svelte';
	import Expertise from '$lib/components/sections/Expertise.svelte';
	import About from '$lib/components/sections/About.svelte';
	import CapabilitiesIndex from '$lib/components/sections/CapabilitiesIndex.svelte';
	import Ethos from '$lib/components/sections/Ethos.svelte';
	import CapabilitySection from '$lib/components/sections/CapabilitySection.svelte';
	import CapabilitiesInfra from '$lib/components/sections/CapabilitiesInfra.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import SiteFooter from '$lib/components/sections/SiteFooter.svelte';

	let activeIdx = $state(0);
</script>

<svelte:head>
	<title>Kleis Eschatos Group — Defense, Infrastructure, Investments, Energy</title>
	<meta name="description" content="Securing sovereignty, engineering resilience, powering the future. Kleis Eschatos Group delivers defense, infrastructure, investments, and energy solutions." />
	<meta property="og:title" content="Kleis Eschatos Group" />
	<meta property="og:description" content="Securing sovereignty, engineering resilience, powering the future. A multi-disciplinary industrial group bridging national security and sustainable development." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/self_logo.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Kleis Eschatos Group" />
	<meta name="twitter:description" content="Securing sovereignty, engineering resilience, powering the future." />
</svelte:head>

<div class="relative">
	<Navbar />

	<HorizontalHeroPager bind:activeIdx />

	<!-- Below-pager content swaps based on the active hero pane. -->
	{#key activeIdx}
		<div class="pane-content divide-y divide-[var(--rule)]">
			{#if activeIdx === 0}
				<Homepage />
				<Expertise />
				<About />
				<CapabilitiesIndex />
				<Ethos />
				<Contact />
			{:else if activeIdx === 1}
				<CapabilitySection slug="defense" />
				<Contact />
			{:else if activeIdx === 2}
				<CapabilitiesInfra />
				<Contact />
			{:else if activeIdx === 3}
				<CapabilitySection slug="investments" />
				<Contact />
			{:else if activeIdx === 4}
				<CapabilitySection slug="energy" />
				<Contact />
			{/if}
		</div>
	{/key}

	<SiteFooter />
</div>

<style>
	.pane-content {
		animation: pane-fade 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes pane-fade {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: none; }
	}
	@media (prefers-reduced-motion: reduce) {
		.pane-content { animation: none; }
	}
</style>
