<script lang="ts">
	import { hero } from '$lib/content';
	let { isLoaded = false }: { isLoaded?: boolean } = $props();
</script>

<section class="hero-section focus-on-scroll relative z-10 flex min-h-screen items-center">

	<div class="relative mx-auto w-full max-w-6xl px-8 text-center">
		<div class="hero-est tabular absolute right-8 top-10 text-[10px] font-medium tracking-[0.4em] text-slate-500 dark:text-neutral-500">{hero.est}</div>

		<div class="hero-content relative z-10" class:loaded={isLoaded}>
			<div class="overflow-hidden">
				<div class="hero-title mb-10 flex items-center justify-center gap-5" style="transform: translateY(100%); opacity: 0;">
					<img src="/self_logo.png" alt="KEG" class="h-11 w-auto md:h-14 lg:h-16" />
					<h1 class="t-display text-slate-900 dark:text-neutral-50">
						{hero.brand}
					</h1>
				</div>
			</div>

			<div class="overflow-hidden">
				<p class="hero-tagline t-lead mx-auto mb-12 max-w-xl" style="transform: translateY(100%); opacity: 0;">
					{hero.tagline}
				</p>
			</div>
		</div>
	</div>

	<div class="hero-scroll absolute bottom-12 left-1/2 -translate-x-1/2">
		<a href="#about" class="scroll-indicator flex flex-col items-center gap-3 text-slate-600 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100">
			<span class="text-[10px] font-medium tracking-[0.4em] uppercase">Scroll</span>
			<div class="h-12 w-px bg-gradient-to-b from-current to-transparent opacity-60"></div>
		</a>
	</div>
</section>
