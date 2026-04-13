<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { heading, lead, items } = capabilities.energy;
</script>

<section id="cap-energy" class="md:overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<div class="mb-16 max-w-3xl" use:reveal>
			<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50">{heading}</h3>
			<p class="t-lead">{lead}</p>
		</div>

		<div class="grid gap-x-12 gap-y-10 sm:grid-cols-2">
			{#each items as item, i}
				<div
					class="border-t border-slate-200 pt-6 dark:border-neutral-800"
					use:reveal={{ delay: 70 * i }}
				>
					<h4 class="t-card mb-3 text-slate-900 dark:text-neutral-50">{item.title}</h4>
					<p class="t-body">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
