<script lang="ts">
	import CapabilitySection from '$lib/components/sections/CapabilitySection.svelte';
	import CapabilitiesInfra from '$lib/components/sections/CapabilitiesInfra.svelte';
	import Contact from '$lib/components/sections/Contact.svelte';
	import PageHero from '$lib/components/sections/PageHero.svelte';
	import { capabilities } from '$lib/content';

	let { data } = $props();

	const titles: Record<string, { title: string; accent?: string; lead: string; index: number }> = {
		defense: {
			title: 'Defense',
			accent: '& Security.',
			lead: capabilities.defense.lead,
			index: 1
		},
		infrastructure: {
			title: 'Sustainable Infrastructure',
			accent: '& Engineering.',
			lead: capabilities.infra.lead,
			index: 2
		},
		investments: {
			title: 'Strategic',
			accent: 'Investments.',
			lead: capabilities.investments.lead,
			index: 3
		},
		energy: {
			title: 'Energy',
			accent: '& Mining.',
			lead: capabilities.energy.lead,
			index: 4
		}
	};

	const meta = $derived(titles[data.slug]);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>

<PageHero
	eyebrow="Capabilities · 0{meta.index}"
	title={meta.title}
	titleAccent={meta.accent}
	lead={meta.lead}
/>

<div class="divide-y divide-[var(--rule)]">
	{#if data.slug === 'infrastructure'}
		<CapabilitiesInfra />
	{:else}
		<CapabilitySection slug={data.slug} />
	{/if}
	<Contact />
</div>
