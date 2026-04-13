<script lang="ts">
	import { capabilities } from '$lib/content';
	const { heading, lead, items } = capabilities.investments;
</script>

<section id="cap-investments">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-slate-800 px-8 py-24 md:py-32">
		<div class="mb-20 max-w-3xl">
			<h3 class="cap-anim mb-6 text-3xl font-extralight leading-[1.3] text-slate-800 dark:text-slate-100 md:text-4xl lg:text-5xl">{heading}</h3>
			<p class="cap-anim text-lg font-light leading-[1.8] text-slate-600 dark:text-slate-300 md:text-xl">{lead}</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each items as item}
				<div class="cap-item group overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-black p-8 shadow-sm transition-all duration-500 hover:border-slate-300 hover:shadow-lg">
					<h4 class="mb-4 text-xl font-light text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-slate-900 md:text-2xl">{item.title}</h4>
					<p class="text-sm font-light leading-relaxed text-slate-500 dark:text-slate-300 md:text-base">{item.desc}</p>
					<div class="mt-6 h-px w-0 bg-gradient-to-r from-slate-500 to-transparent transition-all duration-700 group-hover:w-full"></div>
				</div>
			{/each}
		</div>
	</div>
</section>
