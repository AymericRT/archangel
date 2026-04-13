<script lang="ts">
	import { statement } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section>
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<div use:reveal>
			{#each statement.lines as line, i}
				<h2
					class="t-section {i === 0
						? 'text-slate-900 dark:text-neutral-50'
						: 'mt-1.5 text-slate-500 dark:text-neutral-400'}"
				>{line}</h2>
			{/each}
		</div>

		<div class="mt-16 max-w-3xl" use:reveal={{ delay: 180 }}>
			<p class="t-lead">
				{statement.body}
			</p>
		</div>
	</div>
</section>
