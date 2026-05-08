<script lang="ts">
	import { goto } from '$app/navigation';
	import { hero } from '$lib/content';
	import { next, flow } from '$lib/nav-flow';

	let { isLoaded = false }: { isLoaded?: boolean } = $props();

	const phrases = hero.tagline.split('. ').map((s) => s.replace(/\.$/, ''));
	const nextPath = next('/');
</script>

<section class="hero-wrap relative z-10 flex min-h-screen flex-col overflow-hidden" data-hero>
	<!-- Step indicator — top-right edge -->
	<div class="absolute top-24 right-8 z-20 md:top-28 md:right-16" class:loaded={isLoaded}>
		<div class="hero-badge flex items-center gap-3 opacity-0">
			<span class="tabular text-[10px] font-medium tracking-[0.4em] text-[var(--mid-light)]">
				01 / {String(flow.length).padStart(2, '0')} · {hero.est}
			</span>
		</div>
	</div>

	<!-- Main content — centered -->
	<div class="relative z-10 flex flex-1 items-center justify-center px-8 text-center md:px-16 lg:px-24" class:loaded={isLoaded}>
		<div>
			<div class="overflow-hidden">
				<div class="hero-line flex items-center justify-center gap-4 opacity-0 md:gap-6">
					<img src="/self_logo.png" alt="KEG" width="199" height="187" fetchpriority="high" class="h-10 w-auto md:h-14 lg:h-16" />
					<h1 class="t-hero text-[var(--ink)]">{hero.brand}</h1>
				</div>
			</div>
			<p class="hero-tagline mt-6 opacity-0 t-lead text-[var(--mid)] md:mt-8">
				{phrases.join(' · ')}
			</p>
		</div>
	</div>

	<!-- Bottom affordance: next pager -->
	<div class="hero-pager relative z-10 flex items-end justify-end px-8 pb-10 md:px-16 md:pb-12 lg:px-24" class:loaded={isLoaded}>
		<button
			type="button"
			class="pager-btn opacity-0"
			onclick={() => nextPath && goto(nextPath)}
			aria-label="Next"
		>
			<span class="hidden text-[10px] font-medium tracking-[0.3em] text-[var(--mid-light)] uppercase md:inline">Swipe ⟶</span>
			<span>Defense</span>
			<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</section>

<style>
	.pager-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: var(--mid-light);
		transition: color 0.3s ease, opacity 1s ease 1s;
	}
	.pager-btn:hover {
		color: var(--ink);
	}
	.loaded .pager-btn {
		opacity: 1;
	}
</style>
