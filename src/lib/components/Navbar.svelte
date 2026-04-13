<script lang="ts">
	import { nav } from '$lib/content';
	let { navHidden = false, navOnDark = false }: { navHidden?: boolean; navOnDark?: boolean } = $props();
	let mobileMenuOpen = $state(false);
</script>

<nav
	class="liquid-nav fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-4 py-3 transition-all duration-500 ease-in-out md:rounded-full md:px-8"
	class:nav-hidden={navHidden}
	class:nav-dark={navOnDark}
>
	<div class="flex items-center justify-between gap-4 md:gap-10">
		<img src="/self_logo.png" alt="KEG" class="h-6 w-auto md:h-8" />
		{#each nav.links as link}
			<a href={link.href} class="nav-link hidden text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300 md:inline">{link.label}</a>
		{/each}
		<button
			class="nav-link flex h-8 w-8 items-center justify-center md:hidden"
			onclick={() => mobileMenuOpen = !mobileMenuOpen}
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				{#if mobileMenuOpen}
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
				{/if}
			</svg>
		</button>
	</div>
	<div
		class="mobile-menu-inner grid md:hidden"
		class:mobile-menu-open={mobileMenuOpen}
	>
		<div class="overflow-hidden">
			<div class="flex flex-col items-center gap-4 pt-4 pb-2">
				{#each nav.links as link}
					<a
						href={link.href}
						class="nav-link text-[11px] font-light tracking-[0.3em] uppercase transition-colors duration-300"
						onclick={() => mobileMenuOpen = false}
					>{link.label}</a>
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.liquid-nav {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.25) 0%,
			rgba(255, 255, 255, 0.08) 40%,
			rgba(255, 255, 255, 0.15) 60%,
			rgba(255, 255, 255, 0.05) 100%
		);
		backdrop-filter: blur(24px) saturate(180%) brightness(1.1);
		-webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.1);
		border: 1px solid rgba(255, 255, 255, 0.35);
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.15) inset,
			0 1px 0 0 rgba(255, 255, 255, 0.4) inset,
			0 -1px 0 0 rgba(255, 255, 255, 0.1) inset,
			0 4px 16px rgba(0, 0, 0, 0.08),
			0 8px 40px rgba(0, 0, 0, 0.04);
	}

	.liquid-nav::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.3) 0%,
			rgba(255, 255, 255, 0.0) 50%
		);
		pointer-events: none;
		mask:
			linear-gradient(black, black) content-box,
			linear-gradient(black, black);
		mask-composite: exclude;
		-webkit-mask-composite: xor;
		padding: 1px;
	}

	.liquid-nav :global(.nav-link) {
		color: #1e293b;
	}
	.liquid-nav :global(.nav-link:hover) {
		color: #020617;
	}

	.liquid-nav.nav-dark,
	:global(.dark) .liquid-nav {
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.03) 40%,
			rgba(255, 255, 255, 0.06) 60%,
			rgba(255, 255, 255, 0.02) 100%
		);
		border-color: rgba(255, 255, 255, 0.15);
		box-shadow:
			0 0 0 0.5px rgba(255, 255, 255, 0.08) inset,
			0 1px 0 0 rgba(255, 255, 255, 0.15) inset,
			0 -1px 0 0 rgba(255, 255, 255, 0.05) inset,
			0 4px 16px rgba(0, 0, 0, 0.2),
			0 8px 40px rgba(0, 0, 0, 0.1);
	}

	.liquid-nav.nav-dark :global(.nav-link),
	:global(.dark) .liquid-nav :global(.nav-link) {
		color: #f1f5f9;
	}
	.liquid-nav.nav-dark :global(.nav-link:hover),
	:global(.dark) .liquid-nav :global(.nav-link:hover) {
		color: #ffffff;
	}

	.nav-hidden {
		transform: translate(-50%, -150%);
	}

	.mobile-menu-inner {
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s ease-in-out;
	}
	.mobile-menu-inner.mobile-menu-open {
		grid-template-rows: 1fr;
	}
</style>
