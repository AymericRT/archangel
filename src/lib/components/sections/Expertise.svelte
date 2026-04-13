<script lang="ts">
	import { expertise } from '$lib/content';
</script>

<section id="expertise" class="overflow-hidden">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-neutral-800 px-8 py-24 md:py-32">
		<h2 class="expertise-heading mb-14 text-4xl font-extralight tracking-tight text-slate-800 dark:text-neutral-100 md:text-5xl lg:text-6xl">Our Expertise</h2>
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each expertise as item}
				<div class="expertise-card group relative overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black px-10 py-16 shadow-sm transition-all duration-500 hover:border-slate-300 hover:shadow-lg">
					<h4 class="expertise-title mb-4 text-xl font-extralight text-slate-800 dark:text-neutral-100 transition-colors duration-300 md:text-2xl">{item.title}</h4>
					<p class="expertise-desc text-sm font-light leading-relaxed text-slate-500 dark:text-neutral-300 md:text-base">{item.desc}</p>
					<div class="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-slate-500 to-transparent transition-all duration-700 group-hover:w-full"></div>
				</div>
			{/each}
		</div>
	</div>
</section>
