<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	const items = [
		{
			title: capabilities.defense.heading,
			lead: capabilities.defense.lead,
			href: '/capabilities/defense'
		},
		{
			title: `${capabilities.infra.headingMain} ${capabilities.infra.headingAccent}`,
			lead: capabilities.infra.lead,
			href: '/capabilities/infrastructure'
		},
		{
			title: capabilities.investments.heading,
			lead: capabilities.investments.lead,
			href: '/capabilities/investments'
		},
		{
			title: capabilities.energy.heading,
			lead: capabilities.energy.lead,
			href: '/capabilities/energy'
		}
	];
</script>

<section id="capabilities" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="mb-16 text-center md:mb-20" use:reveal>
			<p class="t-eyebrow mb-4">{capabilities.intro.heading}</p>
			<div class="mx-auto h-px w-16 bg-[var(--rule)]"></div>
		</div>

		<div class="border-t border-[var(--rule)]" use:reveal>
			{#each items as item, i}
				<a
					href={item.href}
					class="cap-row group grid grid-cols-[auto_1fr_auto] items-start gap-x-6 border-b border-[var(--rule)] py-8 md:gap-x-10 md:py-10"
				>
					<span class="cap-number">0{i + 1}</span>
					<div>
						<h3 class="t-pillar mb-3 text-[var(--ink)]">{item.title}</h3>
						<p class="t-body max-w-2xl">{item.lead}</p>
					</div>
					<span class="cap-arrow mt-1 hidden items-center gap-3 self-center text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase md:flex">
						Explore
						<svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
						</svg>
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.cap-row {
		transition: background-color 0.3s ease;
	}
	.cap-row:hover {
		background-color: var(--paper-alt);
	}
	.cap-row:hover :global(.cap-arrow) {
		color: var(--ink);
	}
</style>
