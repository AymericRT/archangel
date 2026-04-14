<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { heading, lead, items } = capabilities.defense;
</script>

<section id="capabilities" class="focus-on-scroll">
	<div class="section section-rule mx-auto max-w-6xl px-8 text-center">
		<h2 class="t-section mb-20 text-slate-900 dark:text-neutral-50" use:reveal>{capabilities.intro.heading}</h2>

		<div id="cap-defense" class="mx-auto mb-14 max-w-3xl" use:reveal={{ delay: 120 }}>
			<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50">{heading}</h3>
			<p class="t-lead">{lead}</p>
		</div>

		<div class="mx-auto max-w-3xl space-y-0">
			{#each items as item, i}
				<div
					class="cap-item border-t border-slate-200 last:border-b dark:border-neutral-800"
					use:reveal={{ delay: 60 * i }}
				>
					<div class="py-7 md:py-8">
						<h4 class="t-card mb-2 text-slate-900 dark:text-neutral-50">{item.title}</h4>
						<p class="t-body mx-auto max-w-2xl">{item.desc}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
