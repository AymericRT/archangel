<script lang="ts">
	import { onMount } from 'svelte';
	import { hero, capabilities } from '$lib/content';

	const slugs = ['', 'defense', 'infrastructure', 'investments', 'energy'] as const;

	type Pane =
		| { kind: 'home' }
		| { kind: 'cap'; slug: 'defense' | 'infrastructure' | 'investments' | 'energy'; title: string; accent: string; lead: string };

	const panes: Pane[] = [
		{ kind: 'home' },
		{ kind: 'cap', slug: 'defense', title: 'Defense', accent: '& Security', lead: capabilities.defense.lead },
		{ kind: 'cap', slug: 'infrastructure', title: 'Sustainable Infrastructure', accent: '& Engineering', lead: capabilities.infra.lead },
		{ kind: 'cap', slug: 'investments', title: 'Strategic', accent: 'Investments', lead: capabilities.investments.lead },
		{ kind: 'cap', slug: 'energy', title: 'Energy', accent: '& Mining', lead: capabilities.energy.lead }
	];

	let { activeIdx = $bindable(0) }: { activeIdx?: number } = $props();

	let pagerEl: HTMLElement;
	let isLoaded = $state(false);

	onMount(() => {
		const t = setTimeout(() => (isLoaded = true), 80);

		// Deep-link via URL hash (e.g. /#defense) — jump pager to that pane and react to hash changes.
		const idxFromHash = () => {
			const hash = window.location.hash.replace(/^#/, '');
			const i = slugs.indexOf(hash as (typeof slugs)[number]);
			return i > 0 ? i : -1;
		};
		const jumpToHash = (smooth = false) => {
			const i = idxFromHash();
			if (i < 0) return;
			pagerEl.scrollTo({ left: i * pagerEl.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
			activeIdx = i;
		};
		jumpToHash();
		window.addEventListener('hashchange', () => jumpToHash(true));

		// ---- Wheel handling ----
		// Horizontal-dominant gestures (touchpad two-finger swipe) drive the pager.
		// Vertical wheel events fall through to the document so the user can scroll
		// down into the active pane's content. The multiplier amplifies input so
		// short swipes traverse multiple panes.
		const SWIPE_MULT = 2.6;
		const onWheel = (e: WheelEvent) => {
			if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
			e.preventDefault();
			pagerEl.scrollLeft += e.deltaX * SWIPE_MULT;
		};
		pagerEl.addEventListener('wheel', onWheel, { passive: false });

		// ---- Pointer drag (click-drag to swipe, for mouse users) ----
		let dragging = false;
		let dragStartX = 0;
		let dragStartScroll = 0;
		let dragMoved = false;
		let activePointerId: number | null = null;

		const isInteractive = (el: EventTarget | null) =>
			!!(el as HTMLElement | null)?.closest?.('button, a, input, select, textarea, [data-no-drag]');

		const onPointerDown = (e: PointerEvent) => {
			if (e.pointerType === 'touch') return; // touch handled natively by overflow-x
			if (e.button !== 0) return;
			if (isInteractive(e.target)) return;
			e.preventDefault(); // suppress default text selection / image drag
			dragging = true;
			dragMoved = false;
			dragStartX = e.clientX;
			dragStartScroll = pagerEl.scrollLeft;
			activePointerId = e.pointerId;
			pagerEl.style.scrollSnapType = 'none';
			pagerEl.style.cursor = 'grabbing';
			pagerEl.setPointerCapture(e.pointerId);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!dragging || e.pointerId !== activePointerId) return;
			const dx = e.clientX - dragStartX;
			if (Math.abs(dx) > 4) dragMoved = true;
			pagerEl.scrollLeft = dragStartScroll - dx * SWIPE_MULT;
		};

		const endDrag = (e: PointerEvent) => {
			if (!dragging || e.pointerId !== activePointerId) return;
			dragging = false;
			pagerEl.style.cursor = '';
			pagerEl.releasePointerCapture(e.pointerId);
			activePointerId = null;
			// Re-enable snap → browser will animate to the nearest pane
			pagerEl.style.scrollSnapType = '';
			// Suppress the click that follows a drag (so dots/buttons don't fire)
			if (dragMoved) {
				const suppress = (ev: MouseEvent) => {
					ev.stopPropagation();
					ev.preventDefault();
					window.removeEventListener('click', suppress, true);
				};
				window.addEventListener('click', suppress, true);
			}
		};

		pagerEl.addEventListener('pointerdown', onPointerDown);
		pagerEl.addEventListener('pointermove', onPointerMove);
		pagerEl.addEventListener('pointerup', endDrag);
		pagerEl.addEventListener('pointercancel', endDrag);

		// ---- URL sync on snap settle ----
		let settleTimer: number | undefined;
		const onScroll = () => {
			window.clearTimeout(settleTimer);
			settleTimer = window.setTimeout(() => {
				const idx = Math.round(pagerEl.scrollLeft / pagerEl.clientWidth);
				if (idx === activeIdx) return;
				activeIdx = idx;
				const slug = slugs[idx];
				const targetHash = slug ? `#${slug}` : '';
				if (targetHash !== window.location.hash) {
					history.replaceState(null, '', `${window.location.pathname}${targetHash}`);
				}
			}, 140);
		};
		pagerEl.addEventListener('scroll', onScroll, { passive: true });

		// ---- Keyboard ←/→ at the hero ----
		const onKey = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;
			if (window.scrollY > 80) return;
			if (e.key === 'ArrowRight') {
				pagerEl.scrollBy({ left: pagerEl.clientWidth, behavior: 'smooth' });
			} else if (e.key === 'ArrowLeft') {
				pagerEl.scrollBy({ left: -pagerEl.clientWidth, behavior: 'smooth' });
			}
		};
		window.addEventListener('keydown', onKey);

		return () => {
			clearTimeout(t);
			pagerEl.removeEventListener('wheel', onWheel);
			pagerEl.removeEventListener('scroll', onScroll);
			pagerEl.removeEventListener('pointerdown', onPointerDown);
			pagerEl.removeEventListener('pointermove', onPointerMove);
			pagerEl.removeEventListener('pointerup', endDrag);
			pagerEl.removeEventListener('pointercancel', endDrag);
			window.removeEventListener('keydown', onKey);
			window.clearTimeout(settleTimer);
		};
	});
</script>

<div class="hero-region">
<div bind:this={pagerEl} class="h-pager" data-h-pager data-hero class:loaded={isLoaded}>
	{#each panes as pane, i}
		<section class="h-pane" class:active={activeIdx === i}>
			{#if i > 0}
				<span class="pane-connector pane-connector-left" aria-hidden="true"></span>
			{/if}
			{#if i < panes.length - 1}
				<span class="pane-connector pane-connector-right" aria-hidden="true"></span>
			{/if}
			<div class="pane-frame">
				<div class="pane-top">
					{#if pane.kind === 'home'}
						<div class="overflow-hidden">
							<div class="hero-line flex items-center justify-center gap-4 md:gap-6">
								<img src="/self_logo.png" alt="KEG" width="199" height="187" fetchpriority="high" class="h-10 w-auto md:h-14 lg:h-16" />
								<h1 class="t-hero text-[var(--ink)]">{hero.brand}</h1>
							</div>
						</div>
					{:else}
						<div class="overflow-hidden">
							<h1 class="hero-line t-hero text-[var(--ink)]">
								{pane.title}<br /><span class="text-[var(--accent)]">{pane.accent}</span>
							</h1>
						</div>
					{/if}
				</div>
			</div>
		</section>
	{/each}
</div>

<!-- Pane indicator — sits at the bottom of the hero region only. -->
<div class="pane-indicator" class:loaded={isLoaded}>
	{#each panes as _, i}
		<button
			type="button"
			class="dot"
			class:dot-active={activeIdx === i}
			aria-label="Go to pane {i + 1}"
			onclick={() => pagerEl?.scrollTo({ left: i * pagerEl.clientWidth, behavior: 'smooth' })}
		></button>
	{/each}
</div>
</div>

<style>
	.h-pager {
		position: relative;
		height: 100vh;
		width: 100vw;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		display: flex;
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* Disable back/forward swipe gestures on macOS so horizontal trackpad
		   swipes always scroll the pager and never trigger page navigation. */
		overscroll-behavior-x: none;
		cursor: grab;
		user-select: none;
		-webkit-user-select: none;
	}
	.h-pager::-webkit-scrollbar {
		display: none;
	}

	.h-pane {
		flex: 0 0 100vw;
		width: 100vw;
		height: 100vh;
		scroll-snap-align: center;
		position: relative;
	}

	/* Hairline connectors between adjacent panes — short segments at each pane's
	   left and right edges that meet at the boundary, forming a continuous line
	   only in the inter-pane gap, never across the hero content. */
	.pane-connector {
		position: absolute;
		top: 50%;
		height: 1px;
		background: var(--rule);
		pointer-events: none;
	}
	.pane-connector-left {
		left: 0;
		width: 18vw;
	}
	.pane-connector-right {
		right: 0;
		width: 18vw;
	}
	.h-pager.loaded .pane-connector {
		animation: connector-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both;
	}
	@keyframes connector-in {
		from { transform: scaleX(0); opacity: 0; }
		to   { transform: scaleX(1); opacity: 1; }
	}
	.pane-connector-left { transform-origin: right center; }
	.pane-connector-right { transform-origin: left center; }

	.pane-frame {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 22vh 2rem 14vh;
		text-align: center;
	}
	@media (min-width: 768px) {
		.pane-frame { padding: 24vh 4rem 14vh; }
	}
	@media (min-width: 1024px) {
		.pane-frame { padding: 26vh 6rem 14vh; }
	}
	.pane-top {
		max-width: 56rem;
		width: 100%;
	}

	/* Per-pane reveal */
	.h-pane :global(.hero-eyebrow),
	.h-pane :global(.hero-line),
	.h-pane :global(.hero-tagline) {
		opacity: 0;
		transform: translateY(28px);
		transition:
			opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.h-pager.loaded .h-pane.active :global(.hero-eyebrow) {
		opacity: 1;
		transform: none;
		transition-delay: 0.05s;
	}
	.h-pager.loaded .h-pane.active :global(.hero-line) {
		opacity: 1;
		transform: none;
		transition-delay: 0.18s;
	}
	.h-pager.loaded .h-pane.active :global(.hero-tagline) {
		opacity: 1;
		transform: none;
		transition-delay: 0.36s;
	}

	/* Hero region wraps the pager + its indicator so the indicator scrolls
	   away with the pager rather than sticking to the viewport. */
	.hero-region {
		position: relative;
		height: 100vh;
	}

	/* Indicator dots — pinned to the bottom of the hero region, not the viewport. */
	.pane-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.6rem;
		z-index: 40;
		opacity: 0;
		transition: opacity 0.6s ease 0.4s;
		pointer-events: none;
	}
	.pane-indicator.loaded {
		opacity: 1;
		pointer-events: auto;
	}
	.dot {
		width: 28px;
		height: 2px;
		background: var(--mid-light);
		opacity: 0.4;
		transition: opacity 0.3s ease, background-color 0.3s ease, width 0.3s ease;
		cursor: pointer;
	}
	.dot:hover {
		opacity: 0.8;
	}
	.dot-active {
		opacity: 1;
		background: var(--ink);
		width: 44px;
	}

	@media (prefers-reduced-motion: reduce) {
		.h-pager { scroll-behavior: auto; }
		.h-pane :global(.hero-eyebrow),
		.h-pane :global(.hero-line),
		.h-pane :global(.hero-tagline) {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
