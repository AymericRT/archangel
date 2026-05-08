<script lang="ts">
	import { about } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="about" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<!-- Centered eyebrow header -->
		<div class="mb-16 text-center md:mb-20" use:reveal>
			<p class="t-eyebrow mb-4">{about.heading}</p>
			<div class="mx-auto h-px w-16 bg-[var(--rule)]"></div>
		</div>

		<!-- Panel 1: heritage text left, illustration right -->
		<div class="mb-16 grid grid-cols-1 items-center gap-10 md:mb-24 md:grid-cols-2 md:gap-16" use:reveal={{ delay: 80 }}>
			<div>
				<h3 class="t-display mb-8 text-[var(--ink)]" style="white-space: pre-line;">{about.panels[0].heading}</h3>
				<p class="t-body">{about.panels[0].body}</p>
			</div>
			<figure class="about-figure relative aspect-[4/3] w-full overflow-hidden bg-[var(--paper-alt)]">
				<!-- Heritage: layered architectural plan lines -->
				<svg viewBox="0 0 400 300" class="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
					<g class="text-[var(--ink)]" stroke-width="0.5" opacity="0.12">
						{#each Array(20) as _, i}
							<line x1="0" y1={i * 15} x2="400" y2={i * 15} />
						{/each}
						{#each Array(27) as _, i}
							<line x1={i * 15} y1="0" x2={i * 15} y2="300" />
						{/each}
					</g>
					<g class="text-[var(--ink)]" stroke-width="0.8" opacity="0.6">
						<rect x="60" y="80" width="120" height="160" />
						<rect x="180" y="120" width="80" height="120" />
						<rect x="260" y="60" width="80" height="180" />
						<line x1="60" y1="120" x2="340" y2="120" />
						<line x1="60" y1="180" x2="340" y2="180" />
					</g>
					<g class="text-[var(--ink)]" stroke-width="0.4" opacity="0.4">
						<line x1="60" y1="260" x2="340" y2="260" stroke-dasharray="3 3" />
						<text x="200" y="278" font-size="8" fill="currentColor" text-anchor="middle" letter-spacing="2">A — A'</text>
					</g>
					<circle cx="60" cy="80" r="2.5" fill="currentColor" class="text-[var(--ink)]" opacity="0.7" />
					<circle cx="340" cy="80" r="2.5" fill="currentColor" class="text-[var(--ink)]" opacity="0.7" />
					<circle cx="60" cy="240" r="2.5" fill="currentColor" class="text-[var(--ink)]" opacity="0.7" />
					<circle cx="340" cy="240" r="2.5" fill="currentColor" class="text-[var(--ink)]" opacity="0.7" />
				</svg>
			</figure>
		</div>

		<!-- Panel 2: illustration left, stewardship text right -->
		<div class="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16" use:reveal={{ delay: 80 }}>
			<figure class="about-figure relative aspect-[4/3] w-full overflow-hidden bg-[var(--paper-alt)] md:order-1">
				<!-- Stewardship: orbital / compass diagram -->
				<svg viewBox="0 0 400 300" class="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
					<g class="text-[var(--ink)]" stroke-width="0.4" opacity="0.15">
						{#each Array(20) as _, i}
							<line x1="0" y1={i * 15} x2="400" y2={i * 15} />
						{/each}
					</g>
					<g class="text-[var(--ink)]" stroke-width="0.6" opacity="0.5" transform="translate(200 150)">
						<circle r="40" />
						<circle r="80" />
						<circle r="120" />
						<line x1="-130" y1="0" x2="130" y2="0" stroke-dasharray="2 4" />
						<line x1="0" y1="-130" x2="0" y2="130" stroke-dasharray="2 4" />
						<line x1="-92" y1="-92" x2="92" y2="92" stroke-dasharray="2 4" opacity="0.5" />
						<line x1="-92" y1="92" x2="92" y2="-92" stroke-dasharray="2 4" opacity="0.5" />
					</g>
					<g class="text-[var(--ink)]" fill="currentColor" transform="translate(200 150)">
						<circle r="3" opacity="0.9" />
						<circle cx="40" cy="0" r="2" opacity="0.7" />
						<circle cx="-57" cy="-57" r="2" opacity="0.7" />
						<circle cx="0" cy="120" r="2" opacity="0.7" />
						<circle cx="103" cy="-60" r="2" opacity="0.7" />
					</g>
					<text x="200" y="40" font-size="8" fill="currentColor" text-anchor="middle" letter-spacing="3" class="text-[var(--ink)]" opacity="0.4">N</text>
				</svg>
			</figure>
			<div class="md:order-2">
				{#if about.panels[1].eyebrow}
					<p class="t-eyebrow mb-5 text-[var(--accent)]">{about.panels[1].eyebrow}</p>
				{/if}
				<h3 class="t-display mb-8 text-[var(--ink)]" style="white-space: pre-line;">{about.panels[1].heading}</h3>
				<p class="t-body">{about.panels[1].body}</p>
			</div>
		</div>
	</div>
</section>

<style>
	.about-figure {
		color: var(--ink);
		border: 1px solid var(--rule);
	}
</style>
