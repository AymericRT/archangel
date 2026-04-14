<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { heading, lead, items } = capabilities.investments;
</script>

<section id="cap-investments" class="focus-on-scroll">
	<div class="section section-rule mx-auto max-w-6xl px-8 text-center">
		<div class="mx-auto mb-16 max-w-3xl" use:reveal>
			<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50">{heading}</h3>
			<p class="t-lead">{lead}</p>
		</div>

		<div class="grid gap-px bg-slate-200 dark:bg-neutral-800 sm:grid-cols-2 lg:grid-cols-3">
			{#each items as item, i}
				<div
					class="bg-white p-8 transition-colors duration-500 dark:bg-black"
					use:reveal={{ delay: 80 * i }}
				>
					<h4 class="t-card mb-3 text-slate-900 dark:text-neutral-50">{item.title}</h4>
					<p class="t-body">{item.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
