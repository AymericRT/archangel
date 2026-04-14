<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { headingMain, headingAccent, lead, items } = capabilities.infra;
</script>

<section id="cap-infra" class="focus-on-scroll md:overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8 text-center">
		<div class="mx-auto mb-16 max-w-3xl" use:reveal>
			<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50">
				{headingMain}<br />
				<span class="text-slate-500 dark:text-neutral-400">{headingAccent}</span>
			</h3>
			<p class="t-lead">{lead}</p>
		</div>

		<div class="mx-auto grid max-w-4xl gap-px bg-slate-200 dark:bg-neutral-800 sm:grid-cols-2">
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
