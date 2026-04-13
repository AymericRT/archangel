<script lang="ts">
	import { ethos } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="ethos">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<h2 class="t-section mb-16 text-slate-900 dark:text-neutral-50" use:reveal>{ethos.heading}</h2>

		<div class="grid gap-12 md:grid-cols-3 md:gap-10">
			{#each ethos.items as item, i}
				<div class="group relative" use:reveal={{ delay: 90 * i }}>
					<div class="mb-7 h-px w-12 bg-slate-400 dark:bg-neutral-600"></div>
					<h3 class="t-card mb-3 text-slate-900 dark:text-neutral-50">{item.title}</h3>
					<p class="t-body">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
