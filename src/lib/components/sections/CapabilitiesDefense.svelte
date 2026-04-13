<script lang="ts">
	import { capabilities } from '$lib/content';
	const { heading, lead, items } = capabilities.defense;
</script>

<section id="cap-defense">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-neutral-800 px-8 py-24 md:py-32">
		<div class="mb-20 max-w-3xl">
			<h3 class="cap-anim mb-6 text-3xl font-extralight leading-[1.3] text-slate-800 dark:text-neutral-100 md:text-4xl lg:text-5xl">{heading}</h3>
			<p class="cap-anim text-lg font-light leading-[1.8] text-slate-600 dark:text-neutral-300 md:text-xl">{lead}</p>
		</div>

		<div class="space-y-0">
			{#each items as item}
				<div class="cap-item group border-t border-slate-200 dark:border-neutral-800 last:border-b">
					<div class="py-8">
						<h4 class="mb-2 text-xl font-extralight text-slate-800 dark:text-neutral-100 md:text-2xl">{item.title}</h4>
						<p class="max-w-xl text-sm font-light leading-relaxed text-slate-500 dark:text-neutral-300 md:text-base">{item.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
