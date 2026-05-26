<script lang="ts">
	import { onMount } from 'svelte';
	import { expertise } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	const categories = ['Defense', 'Infrastructure', 'Investments', 'Energy'];

	let gridEl: HTMLElement;
	let inView = $state(false);

	onMount(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				inView = entries[0].isIntersecting;
			},
			{ threshold: 0, rootMargin: '50px' }
		);
		obs.observe(gridEl);
		return () => obs.disconnect();
	});
</script>

<section id="expertise" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="mb-16 flex items-end justify-between gap-8 md:mb-20" use:reveal>
			<h2 class="t-display text-[var(--ink)]">Our Expertise</h2>
			<span class="hidden text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase md:inline">Four Pillars</span>
		</div>

		<div bind:this={gridEl} class="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4" class:in-view={inView} use:reveal>
			{#each expertise as item, i}
				<article class="card group relative flex aspect-[3/4] w-full max-w-[260px] flex-col overflow-hidden border border-[var(--rule)] bg-[var(--paper)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
					<!-- Top accent line -->
					<span class="card-accent pointer-events-none absolute top-0 left-0 z-30 h-px w-0 bg-[var(--ink)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"></span>

					<!-- Visual frame fills the entire card -->
					<div class="absolute inset-0 z-0 overflow-hidden bg-[var(--paper-alt)]">
						<!-- Meta strip: number + category -->
						<div class="absolute top-5 left-5 z-10 flex items-center gap-3 md:top-6 md:left-6">
							<span class="cap-number">0{i + 1}</span>
							<span class="h-px w-6 bg-[var(--rule)]"></span>
							<span class="text-[9.5px] font-medium tracking-[0.3em] text-[var(--mid-light)] uppercase">{categories[i]}</span>
						</div>

						<!-- Corner tick marks -->
						<span class="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[var(--rule)]"></span>
						<span class="pointer-events-none absolute bottom-3 left-3 z-20 h-2.5 w-2.5 border-b border-l border-[var(--rule)]"></span>

						<!-- Animation -->
						<div class="card-visual absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
							{#if i === 0}
								<!-- Defense: radar sweep with pings -->
								<svg viewBox="0 0 300 220" class="h-full w-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
									<g class="text-[var(--ink)]" stroke-width="0.6" opacity="0.3">
										<circle cx="150" cy="110" r="30" />
										<circle cx="150" cy="110" r="60" />
										<circle cx="150" cy="110" r="90" />
										<line x1="60" y1="110" x2="240" y2="110" />
										<line x1="150" y1="20" x2="150" y2="200" />
									</g>
									<defs>
										<linearGradient id="sweep" x1="0" x2="1" y1="0" y2="0">
											<stop offset="0%" stop-color="currentColor" stop-opacity="0" />
											<stop offset="100%" stop-color="currentColor" stop-opacity="0.7" />
										</linearGradient>
									</defs>
									<g class="radar-sweep text-[var(--ink)]">
										<path d="M150 110 L240 110 A90 90 0 0 0 213.6 46.4 Z" fill="url(#sweep)" />
									</g>
									<g class="text-[var(--ink)]" fill="currentColor">
										<circle class="ping ping-1" cx="195" cy="78" r="2" />
										<circle class="ping ping-2" cx="108" cy="148" r="2" />
										<circle class="ping ping-3" cx="178" cy="158" r="2" />
									</g>
								</svg>
							{:else if i === 1}
								<!-- Infrastructure: rising columns -->
								<svg viewBox="0 0 300 220" class="h-full w-full" fill="none" stroke="currentColor" stroke-width="0.8" preserveAspectRatio="xMidYMid meet">
									<g class="text-[var(--ink)]" opacity="0.25">
										<line x1="0" y1="180" x2="300" y2="180" />
										<line x1="0" y1="140" x2="300" y2="140" stroke-dasharray="2 4" />
										<line x1="0" y1="100" x2="300" y2="100" stroke-dasharray="2 4" />
										<line x1="0" y1="60" x2="300" y2="60" stroke-dasharray="2 4" />
									</g>
									<g class="text-[var(--ink)]" fill="currentColor" fill-opacity="0.06" stroke="currentColor">
										<rect class="col col-1" x="40" y="180" width="36" height="0" />
										<rect class="col col-2" x="92" y="180" width="36" height="0" />
										<rect class="col col-3" x="144" y="180" width="36" height="0" />
										<rect class="col col-4" x="196" y="180" width="36" height="0" />
									</g>
								</svg>
							{:else if i === 2}
								<!-- Investments: ascending chart -->
								<svg viewBox="0 0 300 220" class="h-full w-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
									<g class="text-[var(--ink)]" stroke-width="0.6" opacity="0.25">
										<line x1="30" y1="30" x2="30" y2="190" />
										<line x1="30" y1="190" x2="280" y2="190" />
										<line x1="30" y1="150" x2="280" y2="150" stroke-dasharray="2 4" />
										<line x1="30" y1="110" x2="280" y2="110" stroke-dasharray="2 4" />
										<line x1="30" y1="70" x2="280" y2="70" stroke-dasharray="2 4" />
									</g>
									<path
										class="chart-line text-[var(--ink)]"
										stroke-width="1.2"
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M40 170 L90 145 L130 155 L170 105 L210 90 L260 50"
									/>
									<g class="text-[var(--ink)]" fill="currentColor">
										<circle class="dot dot-1" cx="40" cy="170" r="2.5" />
										<circle class="dot dot-2" cx="90" cy="145" r="2.5" />
										<circle class="dot dot-3" cx="130" cy="155" r="2.5" />
										<circle class="dot dot-4" cx="170" cy="105" r="2.5" />
										<circle class="dot dot-5" cx="210" cy="90" r="2.5" />
										<circle class="dot dot-6" cx="260" cy="50" r="2.5" />
									</g>
								</svg>
							{:else}
								<!-- Energy: waveform -->
								<svg viewBox="0 0 300 220" class="h-full w-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid meet">
									<g class="text-[var(--ink)]" stroke-width="0.6" opacity="0.25">
										<line x1="0" y1="110" x2="300" y2="110" />
										<line x1="50" y1="40" x2="50" y2="180" stroke-dasharray="2 4" />
										<line x1="150" y1="40" x2="150" y2="180" stroke-dasharray="2 4" />
										<line x1="250" y1="40" x2="250" y2="180" stroke-dasharray="2 4" />
									</g>
									<path
										class="wave wave-back text-[var(--ink)]"
										stroke-width="0.8"
										opacity="0.3"
										d="M0 110 Q 25 60, 50 110 T 100 110 T 150 110 T 200 110 T 250 110 T 300 110"
									/>
									<path
										class="wave wave-front text-[var(--ink)]"
										stroke-width="1.2"
										stroke-linecap="round"
										d="M0 110 Q 25 60, 50 110 T 100 110 T 150 110 T 200 110 T 250 110 T 300 110"
									/>
									<g class="text-[var(--ink)]" fill="currentColor">
										<circle class="spark spark-1" cx="50" cy="60" r="1.8" />
										<circle class="spark spark-2" cx="150" cy="60" r="1.8" />
										<circle class="spark spark-3" cx="250" cy="60" r="1.8" />
									</g>
								</svg>
							{/if}
						</div>
					</div>

					<!-- Glass content panel overlaying the visual -->
					<div class="card-glass relative z-20 mt-auto border-t border-[var(--rule)] p-6 md:p-7">
						<h3 class="t-pillar mb-2 text-[var(--ink)]">{item.title}</h3>
						<p class="t-body">{item.desc}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.card {
		will-change: transform;
	}

	/* Pause all card animations when grid is offscreen */
	.radar-sweep,
	.ping,
	.col-1, .col-2, .col-3, .col-4,
	.chart-line,
	.dot,
	.wave-front,
	.wave-back,
	.spark {
		animation-play-state: paused;
	}
	.in-view .radar-sweep,
	.in-view .ping,
	.in-view .col-1,
	.in-view .col-2,
	.in-view .col-3,
	.in-view .col-4,
	.in-view .chart-line,
	.in-view .dot,
	.in-view .wave-front,
	.in-view .wave-back,
	.in-view .spark {
		animation-play-state: running;
	}
	.card:hover {
		border-color: var(--ink);
		transform: translateY(-2px);
	}

	.card-visual {
		color: var(--ink);
	}

	/* Frosted-glass content panel overlaying the visual */
	.card-glass {
		background-color: color-mix(in srgb, var(--paper) 55%, transparent);
		backdrop-filter: blur(14px) saturate(140%);
		-webkit-backdrop-filter: blur(14px) saturate(140%);
	}
	@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.card-glass {
			background-color: color-mix(in srgb, var(--paper) 88%, transparent);
		}
	}

	/* ---- Defense: radar ---- */
	.radar-sweep {
		transform-origin: 150px 110px;
		animation: radar-rotate 4s linear infinite;
	}
	@keyframes radar-rotate {
		to { transform: rotate(360deg); }
	}
	.ping {
		opacity: 0;
		animation: ping-fade 4s linear infinite;
	}
	.ping-1 { animation-delay: 0.6s; }
	.ping-2 { animation-delay: 2.2s; }
	.ping-3 { animation-delay: 3.1s; }
	@keyframes ping-fade {
		0% { opacity: 0; r: 2; }
		8% { opacity: 1; }
		40% { opacity: 0; r: 8; }
		100% { opacity: 0; r: 8; }
	}

	/* ---- Infrastructure: columns ---- */
	.col-1 { animation: col-rise-1 3s ease-in-out infinite; }
	.col-2 { animation: col-rise-2 3s ease-in-out infinite 0.15s; }
	.col-3 { animation: col-rise-3 3s ease-in-out infinite 0.3s; }
	.col-4 { animation: col-rise-4 3s ease-in-out infinite 0.45s; }
	@keyframes col-rise-1 {
		0%, 100% { y: 180px; height: 0; }
		50%, 60% { y: 100px; height: 80px; }
	}
	@keyframes col-rise-2 {
		0%, 100% { y: 180px; height: 0; }
		50%, 60% { y: 70px; height: 110px; }
	}
	@keyframes col-rise-3 {
		0%, 100% { y: 180px; height: 0; }
		50%, 60% { y: 90px; height: 90px; }
	}
	@keyframes col-rise-4 {
		0%, 100% { y: 180px; height: 0; }
		50%, 60% { y: 50px; height: 130px; }
	}

	/* ---- Investments: chart ---- */
	.chart-line {
		stroke-dasharray: 400;
		stroke-dashoffset: 400;
		animation: line-draw 4s ease-in-out infinite;
	}
	@keyframes line-draw {
		0% { stroke-dashoffset: 400; }
		40%, 80% { stroke-dashoffset: 0; }
		100% { stroke-dashoffset: 400; }
	}
	.dot {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: dot-show 4s ease-in-out infinite;
	}
	.dot-1 { animation-delay: 0.4s; }
	.dot-2 { animation-delay: 0.7s; }
	.dot-3 { animation-delay: 1.0s; }
	.dot-4 { animation-delay: 1.3s; }
	.dot-5 { animation-delay: 1.6s; }
	.dot-6 { animation-delay: 1.9s; }
	@keyframes dot-show {
		0%, 10% { opacity: 0; transform: scale(0.4); }
		15%, 80% { opacity: 1; transform: scale(1); }
		90%, 100% { opacity: 0; transform: scale(0.4); }
	}

	/* ---- Energy: waveform ---- */
	.wave-front {
		stroke-dasharray: 2 4;
		animation: wave-flow 1.4s linear infinite;
	}
	.wave-back {
		stroke-dasharray: 600;
		stroke-dashoffset: 600;
		animation: wave-draw 3s ease-in-out infinite;
	}
	@keyframes wave-flow {
		to { stroke-dashoffset: -60; }
	}
	@keyframes wave-draw {
		0% { stroke-dashoffset: 600; }
		50% { stroke-dashoffset: 0; }
		100% { stroke-dashoffset: -600; }
	}
	.spark {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: spark-pulse 2.4s ease-in-out infinite;
	}
	.spark-1 { animation-delay: 0s; }
	.spark-2 { animation-delay: 0.5s; }
	.spark-3 { animation-delay: 1.0s; }
	@keyframes spark-pulse {
		0%, 100% { opacity: 0; r: 1.8; }
		50% { opacity: 1; r: 3; }
	}

	@media (prefers-reduced-motion: reduce) {
		.radar-sweep,
		.ping,
		.col-1, .col-2, .col-3, .col-4,
		.chart-line,
		.dot,
		.wave-front,
		.wave-back,
		.spark {
			animation: none;
		}
		.ping, .dot, .spark { opacity: 1; }
		.chart-line, .wave-back { stroke-dashoffset: 0; }
		.card:hover { transform: none; }
	}
</style>
