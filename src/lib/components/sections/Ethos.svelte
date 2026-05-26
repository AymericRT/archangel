<script lang="ts">
	import { ethos } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="ethos" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="mb-16 md:mb-24" use:reveal>
			<h2 class="t-display text-[var(--ink)]">{ethos.heading}</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-14" use:reveal>
			{#each ethos.items as item, i}
				<div class="pillar group flex flex-col items-stretch">
					<!-- Capital (top) — wider band with a thick stroke and thin under-line -->
					<div class="pillar-capital flex flex-col items-center">
						<div class="h-[3px] w-full bg-[var(--ink)]"></div>
						<div class="mt-1 h-px w-full bg-[var(--rule)]"></div>
					</div>

					<!-- Shaft — narrower body with vertical sides, content centered -->
					<div class="pillar-shaft relative mx-auto flex w-[78%] flex-1 flex-col items-center justify-between gap-8 border-x border-[var(--rule)] px-6 py-12 text-center md:min-h-[60vh] md:gap-10 md:py-16">
						<!-- Subtle interior groove for added depth -->
						<span
							class="pointer-events-none absolute top-4 bottom-4 left-1/2 w-px -translate-x-1/2 bg-[var(--rule)] opacity-30"
							aria-hidden="true"
						></span>

						<span class="cap-number relative bg-[var(--paper)] px-2">0{i + 1}</span>

						<div class="relative flex flex-col items-center gap-6">
							<div class="h-10 w-px bg-[var(--rule)]"></div>
							<h3 class="t-pillar relative bg-[var(--paper)] px-3 text-[var(--ink)]">{item.title}</h3>
							<div class="h-10 w-px bg-[var(--rule)]"></div>
						</div>

						<p class="t-body relative max-w-[26ch] bg-[var(--paper)] px-2">{item.desc}</p>
					</div>

					<!-- Base (bottom) — mirrors capital -->
					<div class="pillar-base flex flex-col items-center">
						<div class="h-px w-full bg-[var(--rule)]"></div>
						<div class="mt-1 h-[3px] w-full bg-[var(--ink)]"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.pillar {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.pillar:hover {
		transform: translateY(-3px);
	}
	.pillar-capital,
	.pillar-base {
		transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.pillar:hover .pillar-capital {
		transform: scaleX(1.02);
	}
	.pillar:hover .pillar-base {
		transform: scaleX(1.02);
	}

	@media (prefers-reduced-motion: reduce) {
		.pillar,
		.pillar-capital,
		.pillar-base {
			transition: none;
			transform: none !important;
		}
	}
</style>
