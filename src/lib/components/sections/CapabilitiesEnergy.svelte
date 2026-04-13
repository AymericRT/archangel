<script lang="ts">
	import { capabilities } from '$lib/content';
	const { heading, lead, items } = capabilities.energy;
</script>

<section id="cap-energy" class="md:overflow-hidden">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-neutral-800 px-8 py-24 md:py-32">
		<div class="mb-20 max-w-3xl">
			<h3 class="cap-anim mb-6 text-3xl font-extralight leading-[1.2] text-slate-800 dark:text-neutral-100 md:text-4xl lg:text-5xl">{heading}</h3>
			<p class="cap-anim text-lg font-light leading-[1.8] text-slate-500 dark:text-neutral-300 md:text-xl">{lead}</p>
		</div>

		<div class="grid gap-12 md:grid-cols-2">
			{#each items as item}
				<div class="cap-item group border-t border-slate-300 dark:border-neutral-700 pt-6 transition-colors duration-500 group-hover:border-slate-400">
					<h4 class="mb-3 text-xl font-light text-slate-800 dark:text-neutral-100 transition-colors duration-300 group-hover:text-slate-700 md:text-2xl">{item.title}</h4>
					<p class="text-sm font-light leading-relaxed text-slate-500 dark:text-neutral-300 md:text-base">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
