<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { heading, lead, items } = capabilities.defense;
</script>

<section id="cap-defense">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<div class="mb-16 max-w-3xl" use:reveal>
			<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50">{heading}</h3>
			<p class="t-lead">{lead}</p>
		</div>

		<div class="space-y-0">
			{#each items as item, i}
				<div
					class="cap-item group border-t border-slate-200 last:border-b dark:border-neutral-800"
					use:reveal={{ delay: 60 * i }}
				>
					<div class="grid gap-y-2 py-7 md:grid-cols-12 md:gap-x-8 md:py-8">
						<h4 class="t-card text-slate-900 dark:text-neutral-50 md:col-span-4">{item.title}</h4>
						<p class="t-body max-w-2xl md:col-span-8">{item.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
