<script lang="ts">
	import { about } from '$lib/content';
</script>

<section id="about" class="overflow-hidden">
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-slate-800 px-8 py-24 md:py-32">
		<div class="mb-20">
			<h2 class="text-4xl font-extralight leading-[1.1] tracking-tight text-slate-800 dark:text-slate-100 md:text-5xl lg:text-6xl">{about.heading}</h2>
		</div>

		<div class="max-w-3xl space-y-24">
			{#each about.panels as panel}
				<div>
					<div class="mb-8 h-px bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent"></div>
					{#if panel.eyebrow}
						<p class="mb-3 text-xs font-light tracking-[0.3em] text-slate-500 dark:text-slate-300 uppercase">{panel.eyebrow}</p>
					{/if}
					<h3 class="mb-6 text-2xl font-extralight leading-[1.3] text-slate-800 dark:text-slate-100 md:text-3xl" style="white-space: pre-line;">{panel.heading}</h3>
					<p class="text-sm font-light leading-[1.9] text-slate-500 dark:text-slate-300 md:text-base">{panel.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
