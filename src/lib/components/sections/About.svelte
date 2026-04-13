<script lang="ts">
	import { about } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="about" class="overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<h2 class="t-section mb-20 text-slate-900 dark:text-neutral-50" use:reveal>{about.heading}</h2>

		<div class="max-w-3xl space-y-20">
			{#each about.panels as panel, i}
				<div use:reveal={{ delay: 80 * i }}>
					<div class="mb-8 h-px w-12 bg-slate-400 dark:bg-neutral-600"></div>
					{#if panel.eyebrow}
						<p class="t-eyebrow mb-4">{panel.eyebrow}</p>
					{/if}
					<h3 class="t-subsection mb-6 text-slate-900 dark:text-neutral-50" style="white-space: pre-line;">{panel.heading}</h3>
					<p class="t-body">{panel.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
