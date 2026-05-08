<script lang="ts">
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { direction } from '$lib/nav-flow';
	import './layout.css';
	import 'lenis/dist/lenis.css';

	let { children } = $props();

	// View Transitions API for slide-style page transitions between flow routes
	// (still used when prev/next pager buttons on capability pages are clicked).
	onNavigate((nav) => {
		if (typeof document === 'undefined' || !document.startViewTransition) return;
		const from = nav.from?.url.pathname ?? '';
		const to = nav.to?.url.pathname ?? '';
		document.documentElement.dataset.flowDir = direction(from, to);
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await nav.complete;
			});
		});
	});

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let cleanup = () => {};
		import('lenis').then(({ default: Lenis }) => {
			const lenis = new Lenis({
				duration: 1.1,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				smoothWheel: true,
				touchMultiplier: 1.2,
				// Skip Lenis's vertical smoothing for any wheel/touch interaction
				// inside the horizontal hero pager — it owns its own scroll axis.
				prevent: (node) => !!(node as HTMLElement).closest?.('[data-h-pager]')
			});

			let rafId = 0;
			const raf = (time: number) => {
				lenis.raf(time);
				rafId = requestAnimationFrame(raf);
			};
			rafId = requestAnimationFrame(raf);

			const onAnchorClick = (e: MouseEvent) => {
				const a = (e.target as HTMLElement).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
				if (!a) return;
				const url = new URL(a.href, location.href);
				if (url.pathname !== location.pathname || !url.hash) return;
				const target = document.querySelector(url.hash);
				if (!target) return;
				e.preventDefault();
				lenis.scrollTo(target as HTMLElement, { offset: -60 });
				history.pushState(null, '', url.hash);
			};
			document.addEventListener('click', onAnchorClick);

			cleanup = () => {
				cancelAnimationFrame(rafId);
				document.removeEventListener('click', onAnchorClick);
				lenis.destroy();
			};
		});

		return () => cleanup();
	});
</script>

{@render children()}
