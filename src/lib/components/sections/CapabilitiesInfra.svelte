<script lang="ts">
	import { onMount } from 'svelte';
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
	const { headingMain, headingAccent, lead, items } = capabilities.infra;

	let sectionEl: HTMLElement;
	let visible = $state(false);

	onMount(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				if (!entries[0].isIntersecting) return;
				visible = true;
				obs.disconnect();
			},
			{ threshold: 0.1 }
		);
		obs.observe(sectionEl);
		return () => obs.disconnect();
	});

	// Isometric helper: convert (col, row, height) to screen (x, y)
	// Isometric projection: x_screen = (col - row) * tileW/2, y_screen = (col + row) * tileH/2 - height
	const tW = 60; // tile width
	const tH = 30; // tile height
	const ox = 720; // origin x offset (center of viewbox)
	const oy = 520; // origin y offset (bottom area)

	function iso(col: number, row: number, z: number = 0): [number, number] {
		return [
			ox + (col - row) * (tW / 2),
			oy + (col + row) * (tH / 2) - z
		];
	}

	// Define buildings: [col, row, width, depth, height, delay]
	const buildings: [number, number, number, number, number, number][] = [
		// Back row
		[-5, -4, 2, 2, 180, 1],
		[-2, -5, 1, 1, 90, 2],
		[0, -4, 3, 2, 240, 0.5],
		[4, -5, 2, 1, 130, 1.5],
		[6, -4, 1, 2, 200, 1],
		// Middle row
		[-6, -1, 2, 3, 100, 2],
		[-3, -1, 1, 2, 160, 1.5],
		[-1, 0, 2, 2, 280, 0.5],
		[2, -1, 3, 1, 70, 3],
		[5, 0, 2, 2, 210, 1],
		[8, -1, 1, 1, 120, 2.5],
		// Front row
		[-5, 2, 3, 2, 60, 3],
		[-1, 3, 1, 1, 140, 2],
		[1, 2, 2, 3, 110, 2.5],
		[4, 3, 2, 1, 190, 1],
		[7, 2, 1, 2, 80, 3.5],
	];

	// Generate isometric box paths for each building
	function isoBox(col: number, row: number, w: number, d: number, h: number): string[] {
		const paths: string[] = [];

		// Top face
		const tTL = iso(col, row, h);
		const tTR = iso(col + w, row, h);
		const tBR = iso(col + w, row + d, h);
		const tBL = iso(col, row + d, h);
		paths.push(`M${tTL[0]},${tTL[1]} L${tTR[0]},${tTR[1]} L${tBR[0]},${tBR[1]} L${tBL[0]},${tBL[1]} Z`);

		// Left face
		const bBL = iso(col, row + d, 0);
		const bTL = iso(col, row, 0);
		paths.push(`M${tTL[0]},${tTL[1]} L${tBL[0]},${tBL[1]} L${bBL[0]},${bBL[1]} L${bTL[0]},${bTL[1]} Z`);

		// Right face
		const bBR = iso(col + w, row + d, 0);
		paths.push(`M${tTR[0]},${tTR[1]} L${tBR[0]},${tBR[1]} L${bBR[0]},${bBR[1]} L${iso(col + w, row, 0)[0]},${iso(col + w, row, 0)[1]} Z`);

		return paths;
	}

	// Generate window lines on the front-right face
	function isoWindows(col: number, row: number, w: number, d: number, h: number): string[] {
		const lines: string[] = [];
		const floors = Math.floor(h / 30);
		for (let f = 1; f < floors; f++) {
			const fh = f * 30;
			// Right face horizontal lines
			const l = iso(col + w, row, fh);
			const r = iso(col + w, row + d, fh);
			lines.push(`M${l[0]},${l[1]} L${r[0]},${r[1]}`);
		}
		// Vertical divisions on right face
		for (let v = 1; v < d; v++) {
			const t = iso(col + w, row + v, h);
			const b = iso(col + w, row + v, 0);
			lines.push(`M${t[0]},${t[1]} L${b[0]},${b[1]}`);
		}
		// Left face horizontal lines
		for (let f = 1; f < floors; f++) {
			const fh = f * 30;
			const l = iso(col, row, fh);
			const r = iso(col, row + d, fh);
			lines.push(`M${l[0]},${l[1]} L${r[0]},${r[1]}`);
		}
		return lines;
	}

	// Ground grid lines
	function groundGrid(): string[] {
		const lines: string[] = [];
		for (let i = -8; i <= 10; i++) {
			const a = iso(i, -6, 0);
			const b = iso(i, 6, 0);
			lines.push(`M${a[0]},${a[1]} L${b[0]},${b[1]}`);
		}
		for (let j = -6; j <= 6; j++) {
			const a = iso(-8, j, 0);
			const b = iso(10, j, 0);
			lines.push(`M${a[0]},${a[1]} L${b[0]},${b[1]}`);
		}
		return lines;
	}
</script>

<section id="cap-infra" class="focus-on-scroll relative overflow-hidden" class:blueprint-visible={visible} bind:this={sectionEl}>
	<!-- Blueprint background -->
	<div class="blueprint-bg pointer-events-none absolute inset-0" aria-hidden="true">
		<!-- Fine blueprint grid -->
		<div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(var(--mid-light) 1px, transparent 1px), linear-gradient(90deg, var(--mid-light) 1px, transparent 1px); background-size: 40px 40px;"></div>

		<!-- Isometric 3D city -->
		<svg
			class="absolute inset-0 h-full w-full"
			viewBox="0 0 1440 700"
			preserveAspectRatio="xMidYMid slice"
			fill="none"
		>
			<!-- Ground grid -->
			{#each groundGrid() as d, i}
				<path d={d} stroke="var(--rule)" stroke-width="0.5" opacity="0.3" class="blueprint-line" style="--d:0" />
			{/each}

			<!-- Buildings -->
			{#each buildings as [col, row, w, depth, h, delay], bi}
				<!-- Box faces -->
				{#each isoBox(col, row, w, depth, h) as face, fi}
					<path
						d={face}
						stroke="var(--mid-light)"
						stroke-width="0.8"
						fill="none"
						class="blueprint-line"
						style="--d:{delay + fi * 0.2}"
					/>
				{/each}
				<!-- Window detail -->
				{#each isoWindows(col, row, w, depth, h) as win, wi}
					<path
						d={win}
						stroke="var(--mid-light)"
						stroke-width="0.3"
						opacity="0.5"
						class="blueprint-line"
						style="--d:{delay + 0.8 + wi * 0.05}"
					/>
				{/each}
			{/each}

			<!-- Dimension lines / annotations -->
			<line x1="160" y1="620" x2="300" y2="620" stroke="var(--mid-light)" stroke-width="0.5" stroke-dasharray="4 3" class="blueprint-line" style="--d:4" opacity="0.4" />
			<line x1="1140" y1="620" x2="1280" y2="620" stroke="var(--mid-light)" stroke-width="0.5" stroke-dasharray="4 3" class="blueprint-line" style="--d:4.5" opacity="0.4" />
			<circle cx="720" cy="350" r="80" stroke="var(--mid-light)" stroke-width="0.3" stroke-dasharray="3 4" class="blueprint-line" style="--d:5" opacity="0.2" />
			<line x1="640" y1="350" x2="800" y2="350" stroke="var(--mid-light)" stroke-width="0.3" class="blueprint-line" style="--d:5.2" opacity="0.2" />
			<line x1="720" y1="270" x2="720" y2="430" stroke="var(--mid-light)" stroke-width="0.3" class="blueprint-line" style="--d:5.2" opacity="0.2" />
		</svg>
	</div>

	<!-- Content -->
	<div class="relative z-10 section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="mb-16 md:mb-20" use:reveal>
			<h3 class="t-display text-[var(--ink)] mb-4">{headingMain} {headingAccent}</h3>
			<p class="t-lead max-w-2xl">{lead}</p>
		</div>

		<table class="w-full border-collapse" use:reveal>
			<tbody>
				{#each items as item, i}
					<tr class="border-t border-[var(--rule)] last:border-b">
						<td class="py-5 pr-6 align-top md:py-6">
							<span class="cap-number">0{i + 1}</span>
						</td>
						<td class="py-5 pr-10 align-top whitespace-nowrap md:py-6">
							<h4 class="t-pillar text-[var(--ink)]">{item.title}</h4>
						</td>
						<td class="py-5 align-top md:py-6">
							<p class="t-body">{item.desc}</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.blueprint-line {
		stroke-dasharray: 2000;
		stroke-dashoffset: 2000;
		animation: blueprint-draw 2s ease-out forwards;
		animation-delay: calc(var(--d, 0) * 0.3s);
		animation-play-state: paused;
	}

	:global(.blueprint-visible) .blueprint-line {
		animation-play-state: running;
	}

	@keyframes blueprint-draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blueprint-line {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
