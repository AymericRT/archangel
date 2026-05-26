<script lang="ts">
	import { onMount } from 'svelte';
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	const items = [
		{
			title: capabilities.defense.heading,
			lead: capabilities.defense.lead,
			href: '/#defense'
		},
		{
			title: `${capabilities.infra.headingMain} ${capabilities.infra.headingAccent}`,
			lead: capabilities.infra.lead,
			href: '/#infrastructure'
		},
		{
			title: capabilities.investments.heading,
			lead: capabilities.investments.lead,
			href: '/#investments'
		},
		{
			title: capabilities.energy.heading,
			lead: capabilities.energy.lead,
			href: '/#energy'
		}
	];

	let sectionEl: HTMLElement;
	let textViewportEl: HTMLElement;
	let textInnerEl: HTMLElement;
	let stepEls: HTMLElement[] = $state([]);
	let active = $state(0);
	let translateY = $state(0);

	onMount(() => {
		let rafId = 0;

		const sizeSteps = () => {
			if (!textViewportEl) return;
			const h = textViewportEl.clientHeight;
			for (const el of stepEls) if (el) el.style.height = `${h}px`;
		};

		const update = () => {
			if (!sectionEl || !textInnerEl || !textViewportEl) return;
			const rect = sectionEl.getBoundingClientRect();
			const vh = window.innerHeight;
			const maxScroll = Math.max(1, sectionEl.offsetHeight - vh);
			const progress = Math.max(0, Math.min(1, -rect.top / maxScroll));

			const overflow = textInnerEl.scrollHeight - textViewportEl.clientHeight;
			translateY = Math.max(0, progress * overflow);
			active = Math.round(progress * (items.length - 1));
		};

		const onScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(update);
		};

		const onResize = () => {
			sizeSteps();
			onScroll();
		};

		sizeSteps();
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);

		// Toggle scroll-snap only while this section is in view, so other
		// sections scroll freely without any magnet pull.
		const snapObs = new IntersectionObserver(
			([entry]) => {
				document.documentElement.classList.toggle('cap-snap-active', entry.isIntersecting);
			},
			{ threshold: 0 }
		);
		snapObs.observe(sectionEl);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			if (rafId) cancelAnimationFrame(rafId);
			snapObs.disconnect();
			document.documentElement.classList.remove('cap-snap-active');
		};
	});

	// Section height = 1 sticky viewport + (N-1) viewports of scroll-through for translation.
	const sectionHeightVh = items.length * 100;
</script>

<section
	bind:this={sectionEl}
	id="capabilities"
	class="focus-on-scroll relative"
	style:height="{sectionHeightVh}vh"
>
	<!-- Snap markers: one per item at its active scroll-Y, plus release markers
	     just above and just below the section so mandatory snap can let you out
	     either direction (up to About, down to Ethos). -->
	<div
		class="cap-snap pointer-events-none absolute left-0 h-px w-px"
		style:top="-100vh"
		aria-hidden="true"
	></div>
	{#each items as _, i}
		<div
			class="cap-snap pointer-events-none absolute left-0 h-px w-px"
			style:top="{i * 100}vh"
			aria-hidden="true"
		></div>
	{/each}
	<div
		class="cap-snap pointer-events-none absolute left-0 h-px w-px"
		style:top="{items.length * 100}vh"
		aria-hidden="true"
	></div>

	<div class="sticky top-0 flex h-screen flex-col overflow-hidden">
		<div class="shrink-0 pt-8 pb-4 text-center md:pt-12 md:pb-6" use:reveal>
			<p class="t-eyebrow mb-3">{capabilities.intro.heading}</p>
			<div class="mx-auto h-px w-16 bg-[var(--rule)]"></div>
		</div>

		<div class="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-8 pb-8 md:px-16 md:pb-12 lg:px-24">
			<div
				class="cap-frame relative grid min-h-0 flex-1 grid-cols-1 grid-rows-[1fr] overflow-hidden rounded-2xl border border-[var(--rule)] md:grid-cols-[7fr_3fr]"
			>
				<!-- Image side (70%) -->
				<div class="relative hidden border-r border-[var(--rule)] md:block">
					{#each items as _, i}
						<div
							class="cap-img absolute inset-0 flex items-center justify-center p-10"
							class:is-active={active === i}
							aria-hidden={active !== i}
						>
							<svg
								viewBox="0 0 200 200"
								class="h-full max-h-full w-full text-[var(--ink)]"
								fill="none"
								stroke="currentColor"
								stroke-width="0.8"
								stroke-linecap="round"
								stroke-linejoin="round"
								preserveAspectRatio="xMidYMid meet"
							>
								{#if i === 0}
									<path d="M100 24 L160 50 L160 108 Q160 158 100 184 Q40 158 40 108 L40 50 Z" />
									<circle cx="100" cy="104" r="22" />
									<line x1="100" y1="80" x2="100" y2="128" />
									<line x1="76" y1="104" x2="124" y2="104" />
								{:else if i === 1}
									<line x1="20" y1="160" x2="180" y2="160" />
									<path d="M28 92 Q100 36 172 92" />
									<rect x="42" y="92" width="16" height="68" />
									<rect x="92" y="62" width="16" height="98" />
									<rect x="142" y="92" width="16" height="68" />
								{:else if i === 2}
									<line x1="20" y1="170" x2="180" y2="170" opacity="0.3" />
									<line x1="20" y1="170" x2="20" y2="30" opacity="0.3" />
									<polyline points="30,150 70,120 100,130 130,80 170,50" stroke-width="1.2" />
									<circle cx="30" cy="150" r="2.5" fill="currentColor" />
									<circle cx="70" cy="120" r="2.5" fill="currentColor" />
									<circle cx="100" cy="130" r="2.5" fill="currentColor" />
									<circle cx="130" cy="80" r="2.5" fill="currentColor" />
									<circle cx="170" cy="50" r="2.5" fill="currentColor" />
								{:else}
									<circle cx="100" cy="100" r="30" />
									<g>
										<line x1="100" y1="40" x2="100" y2="58" />
										<line x1="100" y1="142" x2="100" y2="160" />
										<line x1="40" y1="100" x2="58" y2="100" />
										<line x1="142" y1="100" x2="160" y2="100" />
										<line x1="57" y1="57" x2="70" y2="70" />
										<line x1="130" y1="130" x2="143" y2="143" />
										<line x1="143" y1="57" x2="130" y2="70" />
										<line x1="70" y1="130" x2="57" y2="143" />
									</g>
								{/if}
							</svg>
						</div>
					{/each}
				</div>

				<!-- Text side (30%) — clipped viewport with translating inner -->
				<div bind:this={textViewportEl} class="relative overflow-hidden">
					<div
						bind:this={textInnerEl}
						class="will-change-transform"
						style:transform="translateY(-{translateY}px)"
					>
						{#each items as item, i}
							<div
								bind:this={stepEls[i]}
								class="cap-step flex w-full items-center px-6 py-8 md:px-10"
								class:is-active={active === i}
							>
								<a href={item.href} class="group block">
									<span class="cap-number">0{i + 1}</span>
									<h3 class="t-pillar mt-3 mb-4 text-[var(--ink)]">{item.title}</h3>
									<p class="t-body">{item.lead}</p>
									<span
										class="mt-6 inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase transition-colors group-hover:text-[var(--ink)]"
									>
										Explore
										<svg
											class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="1.5"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
											/>
										</svg>
									</span>
								</a>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.cap-snap {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.cap-step {
		opacity: 0.25;
		transition: opacity 0.5s ease;
	}
	.cap-step.is-active {
		opacity: 1;
	}

	.cap-img {
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.cap-img.is-active {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.cap-step,
		.cap-img {
			transition: none;
		}
		.cap-step {
			opacity: 1;
		}
	}
</style>
