<script lang="ts">
	import { onMount } from 'svelte';
	import { statement } from '$lib/content';

	let sectionEl: HTMLElement;
	let active = $state(false);

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) {
			active = true;
			return;
		}
		const obs = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				active = true;
				obs.disconnect();
			},
			{ threshold: 0.25 }
		);
		obs.observe(sectionEl);
		return () => obs.disconnect();
	});
</script>

<section id="statement" class="focus-on-scroll min-h-screen flex flex-col" bind:this={sectionEl}>
	<div class="section mx-auto w-full max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="max-w-4xl" class:active>
			<h2 class="t-hero text-[var(--ink)]">
				{#each statement.lines as line, i}
					<span class="statement-line block" style="--i:{i}">{line}</span>
				{/each}
			</h2>
		</div>
	</div>
</section>

<section id="statement-prose" class="focus-on-scroll min-h-screen flex flex-col">
	<div class="flex h-1/2 min-h-[50vh] items-center">
		<div class="section mx-auto w-full max-w-7xl px-8 md:px-16 lg:px-24">
			<div class="ml-auto w-1/2 max-w-2xl" class:active>
				<p class="statement-lead text-justify text-[1.25rem] leading-[1.4] font-light text-[var(--ink)] md:text-[1.5rem]">
					{statement.lead}
				</p>
			</div>
		</div>
	</div>
	<div class="flex h-1/2 min-h-[50vh] items-center">
		<div class="section mx-auto w-full max-w-7xl px-8 md:px-16 lg:px-24">
			<div class="ml-auto w-1/2 max-w-2xl" class:active>
				<p class="statement-body text-justify text-[1.25rem] leading-[1.4] font-light text-[var(--ink)] md:text-[1.5rem]">
					{statement.body}
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.statement-line {
		color: var(--mid-light);
		opacity: 0.5;
		transition: color 0.9s ease, opacity 0.9s ease;
		transition-delay: calc(var(--i) * 0.4s);
	}
	.active .statement-line {
		color: var(--ink);
		opacity: 1;
	}

	.statement-lead,
	.statement-body {
		opacity: 0;
		transform: translateY(8px);
		transition: opacity 0.9s ease, transform 0.9s ease;
	}
	.active .statement-lead {
		opacity: 1;
		transform: none;
		/* after lines: 3 lines * 0.4s + 0.9s = 2.1s */
		transition-delay: 1.6s;
	}
	.active .statement-body {
		opacity: 1;
		transform: none;
		transition-delay: 2.4s;
	}

	@media (prefers-reduced-motion: reduce) {
		.statement-line,
		.statement-lead,
		.statement-body {
			transition: none;
		}
	}
</style>
