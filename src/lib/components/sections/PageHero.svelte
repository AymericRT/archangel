<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { next, prev, indexOf, flow } from '$lib/nav-flow';

	type Props = {
		eyebrow?: string;
		title: string;
		titleAccent?: string;
		lead?: string;
	};
	let { eyebrow, title, titleAccent, lead }: Props = $props();

	let isLoaded = $state(false);
	let heroEl: HTMLElement;

	const labels: Record<string, string> = {
		'/': 'Home',
		'/capabilities/defense': 'Defense',
		'/capabilities/infrastructure': 'Infrastructure',
		'/capabilities/investments': 'Investments',
		'/capabilities/energy': 'Energy'
	};

	const idx = $derived(indexOf(page.url.pathname));
	const prevPath = $derived(prev(page.url.pathname));
	const nextPath = $derived(next(page.url.pathname));

	onMount(() => {
		const t = setTimeout(() => (isLoaded = true), 80);
		return () => clearTimeout(t);
	});
</script>

<section
	bind:this={heroEl}
	class="hero-wrap relative z-10 flex min-h-screen flex-col overflow-hidden"
	data-hero
>
	<!-- EST / step indicator — top-right edge -->
	<div class="absolute top-24 right-8 z-20 md:top-28 md:right-16" class:loaded={isLoaded}>
		<div class="hero-badge flex items-center gap-3 opacity-0">
			<span class="tabular text-[10px] font-medium tracking-[0.4em] text-[var(--mid-light)]">
				{idx >= 0 ? `${String(idx + 1).padStart(2, '0')} / ${String(flow.length).padStart(2, '0')}` : ''}
			</span>
		</div>
	</div>

	<!-- Main content — centered -->
	<div class="relative z-10 flex flex-1 items-center justify-center px-8 text-center md:px-16 lg:px-24" class:loaded={isLoaded}>
		<div class="max-w-4xl">
			{#if eyebrow}
				<div class="overflow-hidden">
					<p class="hero-eyebrow opacity-0 t-eyebrow text-[var(--mid-light)]">{eyebrow}</p>
				</div>
			{/if}
			<div class="overflow-hidden">
				<h1 class="hero-line t-hero mt-6 opacity-0 text-[var(--ink)]">
					{title}{#if titleAccent}<br /><span class="text-[var(--mid)]">{titleAccent}</span>{/if}
				</h1>
			</div>
			{#if lead}
				<p class="hero-tagline mt-8 opacity-0 t-lead mx-auto max-w-2xl text-[var(--mid)]">{lead}</p>
			{/if}
		</div>
	</div>

	<!-- Bottom affordance: prev / next pager -->
	<div class="hero-pager relative z-10 flex items-end justify-between px-8 pb-10 md:px-16 md:pb-12 lg:px-24" class:loaded={isLoaded}>
		<button
			type="button"
			class="pager-btn opacity-0"
			disabled={!prevPath}
			onclick={() => prevPath && goto(prevPath)}
			aria-label="Previous"
		>
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			<span>{prevPath ? labels[prevPath] : ''}</span>
		</button>

		<span class="pager-hint opacity-0 hidden text-[10px] font-medium tracking-[0.3em] text-[var(--mid-light)] uppercase md:inline">
			Swipe ⟶
		</span>

		<button
			type="button"
			class="pager-btn opacity-0"
			disabled={!nextPath}
			onclick={() => nextPath && goto(nextPath)}
			aria-label="Next"
		>
			<span>{nextPath ? labels[nextPath] : ''}</span>
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</section>

<style>
	.hero-eyebrow,
	.hero-line,
	.hero-tagline {
		transform: translateY(40px);
		transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.loaded .hero-eyebrow {
		opacity: 1;
		transform: none;
		transition-delay: 0.1s;
	}
	.loaded .hero-line {
		opacity: 1;
		transform: none;
		transition-delay: 0.25s;
	}
	.loaded .hero-tagline {
		opacity: 1;
		transform: none;
		transition-delay: 0.5s;
	}
	.loaded .hero-badge {
		opacity: 1;
		transition: opacity 1.2s ease 0.8s;
	}

	.pager-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--mid-light);
		transition: color 0.3s ease, opacity 1s ease 0.9s;
	}
	.pager-btn:not(:disabled):hover {
		color: var(--ink);
	}
	.pager-btn:disabled {
		visibility: hidden;
	}
	.loaded .pager-btn,
	.loaded .pager-hint {
		opacity: 1;
	}
	.pager-hint {
		transition: opacity 1s ease 1.1s;
	}
</style>
