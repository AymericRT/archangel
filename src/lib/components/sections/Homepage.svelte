<script lang="ts">
	import { statement, expertise } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section>
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<!-- Three-part declaration -->
		<div use:reveal>
			{#each statement.lines as line, i}
				<h2
					class="t-section {i === 0
						? 'text-slate-900 dark:text-neutral-50'
						: 'mt-1 text-slate-500 dark:text-neutral-500'}"
				>{line}</h2>
			{/each}
		</div>

		<!-- Intro paragraph -->
		<div class="mt-14 max-w-3xl" use:reveal={{ delay: 160 }}>
			<p class="t-lead">
				{statement.body}
			</p>
		</div>

		<!-- Expertise teaser — quiet two-column definition list, clearly secondary -->
		<div class="mt-20 border-t border-slate-200 pt-12 dark:border-neutral-800" use:reveal={{ delay: 280 }}>
			<p class="t-eyebrow mb-10">Our Expertise</p>
			<dl class="grid gap-x-10 gap-y-8 md:grid-cols-2">
				{#each expertise as item}
					<div class="grid gap-y-1 sm:grid-cols-[11rem_1fr] sm:gap-x-6">
						<dt class="text-[0.95rem] font-medium tracking-tight text-slate-900 dark:text-neutral-50">{item.title}</dt>
						<dd class="t-body">{item.desc}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
