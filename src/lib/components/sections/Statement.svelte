<script lang="ts">
	import { statement } from '$lib/content';
</script>

<section>
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-neutral-800 px-8 py-24 md:py-32">
		<div>
			{#each statement.lines as line, i}
				<h2
					class="text-4xl font-extralight leading-[1.2] tracking-tight md:text-5xl lg:text-6xl {i === 0
						? 'text-slate-800 dark:text-neutral-100'
						: 'mt-2 text-slate-600 dark:text-neutral-300'}"
				>{line}</h2>
			{/each}
		</div>

		<div class="mt-16 max-w-3xl">
			<p class="text-lg font-light leading-[1.8] text-slate-600 dark:text-neutral-300 md:text-xl">
				{statement.body}
			</p>
		</div>
	</div>
</section>
