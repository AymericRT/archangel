<script lang="ts">
	import { hero } from '$lib/content';
	let { isLoaded = false }: { isLoaded?: boolean } = $props();
</script>

<section class="hero-section relative z-10 flex min-h-screen items-center">

	<div class="relative mx-auto w-full max-w-6xl px-8">
		<div class="hero-est absolute right-8 top-10 text-[10px] font-light tracking-[0.4em] text-slate-400 dark:text-neutral-400">{hero.est}</div>

		<div class="hero-content relative z-10" class:loaded={isLoaded}>
			<div class="overflow-hidden">
				<div class="hero-title mb-8 flex items-center gap-5" style="transform: translateY(100%); opacity: 0;">
					<img src="/self_logo.png" alt="KEG" class="h-12 w-auto md:h-16 lg:h-20" />
					<h1 class="text-4xl font-extralight tracking-tight text-slate-800 dark:text-neutral-100 md:text-6xl lg:text-7xl">
						{hero.brand}
					</h1>
				</div>
			</div>

			<div class="overflow-hidden">
				<p class="hero-tagline mb-12 max-w-xl text-lg font-light leading-relaxed text-slate-500 dark:text-neutral-300 md:text-xl" style="transform: translateY(100%); opacity: 0;">
					{hero.tagline}
				</p>
			</div>
		</div>
	</div>

	<div class="hero-scroll absolute bottom-16 left-1/2 -translate-x-1/2">
		<a href="#about" class="scroll-indicator flex flex-col items-center gap-4">
			<span class="text-sm font-light tracking-[0.4em] text-slate-600 dark:text-neutral-300 uppercase">Scroll</span>
			<div class="scroll-line h-14 w-px bg-gradient-to-b from-slate-600 to-transparent"></div>
		</a>
	</div>
</section>
