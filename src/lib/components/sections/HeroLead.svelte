<script lang="ts">
	import { onMount } from 'svelte';
	import { hero, capabilities } from '$lib/content';

	let { activeIdx = 0 }: { activeIdx?: number } = $props();

	const leadFor = (idx: number) => {
		if (idx === 0)
			return hero.tagline
				.split('. ')
				.map((s) => s.replace(/\.$/, ''))
				.join(' · ');
		if (idx === 1) return capabilities.defense.lead;
		if (idx === 2) return capabilities.infra.lead;
		if (idx === 3) return capabilities.investments.lead;
		if (idx === 4) return capabilities.energy.lead;
		return '';
	};

	let sectionEl: HTMLElement;
	let descEl: HTMLElement;

	const text = $derived(leadFor(activeIdx));
	const words = $derived(text.split(/\s+/));

	onMount(() => {
		let cleanup = () => {};
		Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
			([{ default: gsap }, { ScrollTrigger }]) => {
				gsap.registerPlugin(ScrollTrigger);
				const inkColor =
					getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() ||
					'#111111';

				let trigger: any;
				const build = () => {
					trigger?.kill();
					if (!descEl || !sectionEl) return;
					const wEls = descEl.querySelectorAll('.word');
					const tween = gsap.to(wEls, {
						color: inkColor,
						ease: 'none',
						stagger: 1,
						scrollTrigger: {
							trigger: sectionEl,
							start: 'top top',
							end: () => '+=' + Math.max(600, wEls.length * 110),
							pin: true,
							pinSpacing: true,
							scrub: 0.5,
							anticipatePin: 1
						}
					});
					trigger = tween.scrollTrigger;
				};
				build();

				// Rebuild when activeIdx-driven text changes the word DOM.
				const mo = new MutationObserver(() => build());
				if (descEl) mo.observe(descEl, { childList: true });

				cleanup = () => {
					// revert: true unwraps the pin-spacer GSAP injected around the section.
					// Without it, the wrapper stays in the DOM after Svelte tears the block down,
					// and stale content from the previous pane keeps rendering under the pager.
					trigger?.kill(true);
					mo.disconnect();
				};
			}
		);
		return () => cleanup();
	});
</script>

<section bind:this={sectionEl} class="hero-lead">
	<h2 bind:this={descEl} class="hero-desc">
		{#each words as word}<span class="word">{word}&nbsp;</span>{/each}
	</h2>
</section>

<style>
	.hero-lead {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 2rem;
	}
	.hero-desc {
		max-width: 64rem;
		margin: 0 auto;
		text-align: center;
		font-weight: 300;
		line-height: 1.4;
		letter-spacing: -0.01em;
		font-size: clamp(1.25rem, 1.6vw + 0.95rem, 2.125rem);
	}
	.hero-desc :global(.word) {
		display: inline-block;
		color: var(--mid-light);
		transition: color 80ms linear;
		white-space: pre;
	}
	@media (prefers-reduced-motion: reduce) {
		.hero-desc :global(.word) {
			color: var(--ink);
		}
	}
</style>
