<script lang="ts">
	import { onMount } from 'svelte';
	import { statement, expertise } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	let trigger: HTMLElement;
	let line2: HTMLElement;
	let line3: HTMLElement;
	let body: HTMLElement;

	const reduceMotion =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	onMount(() => {
		if (reduceMotion) {
			line2?.classList.add('is-active');
			line3?.classList.add('is-active');
			body?.classList.add('is-active');
			return;
		}

		const obs = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				const t1 = window.setTimeout(() => line2?.classList.add('is-active'), 700);
				const t2 = window.setTimeout(() => line3?.classList.add('is-active'), 1500);
				const t3 = window.setTimeout(() => body?.classList.add('is-active'), 2400);
				obs.disconnect();
				return () => {
					clearTimeout(t1);
					clearTimeout(t2);
					clearTimeout(t3);
				};
			},
			{ rootMargin: '0px 0px -15% 0px', threshold: 0.1 }
		);
		obs.observe(trigger);
		return () => obs.disconnect();
	});
</script>

<section class="focus-on-scroll">
	<div bind:this={trigger} class="section section-rule mx-auto max-w-6xl px-8 text-center">
		<!-- Three-part declaration. Lines 2 and 3 darken sequentially as the section enters view. -->
		<div>
			<h2 class="t-section text-slate-900 dark:text-neutral-50">{statement.lines[0]}</h2>
			<h2
				bind:this={line2}
				class="statement-line t-section mt-1 text-slate-400 dark:text-neutral-600"
			>{statement.lines[1]}</h2>
			<h2
				bind:this={line3}
				class="statement-line t-section mt-1 text-slate-400 dark:text-neutral-600"
			>{statement.lines[2]}</h2>
		</div>

		<!-- Body paragraph appears after both color transitions complete -->
		<div bind:this={body} class="statement-body mx-auto mt-14 max-w-3xl">
			<p class="t-lead">
				{statement.body}
			</p>
		</div>

		<!-- Expertise teaser — compact, left-aligned within the centered section -->
		<div class="mx-auto mt-20 max-w-4xl border-t border-slate-200 pt-12 text-left dark:border-neutral-800" use:reveal={{ delay: 120 }}>
			<h3 class="t-subsection mb-10 text-slate-900 dark:text-neutral-50">Our Expertise</h3>
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

<style>
	.statement-line {
		transition: color 1100ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	.statement-line:global(.is-active) {
		color: #0f172a;
	}
	:global(.dark) .statement-line:global(.is-active) {
		color: #fafafa;
	}

	.statement-body {
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: opacity, transform;
	}
	.statement-body:global(.is-active) {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.statement-line,
		.statement-body {
			transition: none;
		}
		.statement-line {
			color: #0f172a;
		}
		:global(.dark) .statement-line {
			color: #fafafa;
		}
		.statement-body {
			opacity: 1;
			transform: none;
		}
	}
</style>
