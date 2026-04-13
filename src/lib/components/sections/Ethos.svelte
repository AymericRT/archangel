<script lang="ts">
	import { ethos } from '$lib/content';
</script>

<section id="ethos">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-slate-800 px-8 py-24 md:py-32">
		<div class="mb-16">
			<h2 class="text-4xl font-extralight leading-[1.2] text-slate-800 dark:text-slate-100 md:text-5xl lg:text-6xl">{ethos.heading}</h2>
		</div>

		<div class="grid gap-12 md:grid-cols-3 md:gap-8">
			{#each ethos.items as item}
				<div>
					<div class="group relative">
						<div class="mb-8 h-px w-16 bg-slate-300 dark:bg-slate-700"></div>
						<h3 class="mb-4 text-xl font-extralight text-slate-800 dark:text-slate-100 md:text-2xl">{item.title}</h3>
						<p class="text-sm font-light leading-relaxed text-slate-500 dark:text-slate-300 md:text-base">{item.desc}</p>
						<div class="mt-6 h-px w-0 bg-gradient-to-r from-slate-400 dark:from-slate-600 to-transparent transition-all duration-700 group-hover:w-full"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
