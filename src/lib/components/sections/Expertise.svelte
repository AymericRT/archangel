<script lang="ts">
	import { expertise } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="expertise" class="overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<h2 class="t-section mb-14 text-slate-900 dark:text-neutral-50" use:reveal>Our Expertise</h2>
		<div class="grid gap-px bg-slate-200 dark:bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
			{#each expertise as item, i}
				<div
					class="group relative bg-white p-10 transition-colors duration-500 dark:bg-black"
					use:reveal={{ delay: 90 * i }}
				>
					<h4 class="t-card mb-3 text-slate-900 dark:text-neutral-50">{item.title}</h4>
					<p class="t-body">{item.desc}</p>
					<div class="absolute bottom-0 left-0 h-px w-0 bg-current opacity-60 transition-all duration-700 group-hover:w-full"></div>
				</div>
			{/each}
		</div>
	</div>
</section>
