<script lang="ts">
	import { onMount } from 'svelte';
	import { nav } from '$lib/content';

	let mobileMenuOpen = $state(false);
	let mobileSubOpen = $state<Record<string, boolean>>({});
	let isDark = $state(false);
	let openMenu = $state<string | null>(null);
	let navHidden = $state(false);

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const themeHandler = (e: MediaQueryListEvent) => {
			if (localStorage.getItem('theme')) return;
			isDark = e.matches;
			document.documentElement.classList.toggle('dark', e.matches);
		};
		mq.addEventListener('change', themeHandler);

		let lastY = 0;
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const y = window.scrollY;
				navHidden = y > lastY && y > 80;
				lastY = y;
				ticking = false;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			mq.removeEventListener('change', themeHandler);
			window.removeEventListener('scroll', onScroll);
		};
	});

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}
</script>

<nav
	class="nav-bar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {navHidden ? '-translate-y-full' : ''}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-8 py-5 md:px-16 lg:px-24">
		<a href="/" class="flex items-center gap-3">
			<img src="/self_logo.png" alt="KEG" width="199" height="187" class="h-6 w-auto md:h-7" />
		</a>
		<div class="hidden items-center gap-10 md:flex">
			{#each nav.links as link}
				{#if link.children}
					<div
						class="nav-dropdown relative"
						onmouseenter={() => (openMenu = link.label)}
						onmouseleave={() => (openMenu = null)}
						role="none"
					>
						<button
							type="button"
							class="nav-link flex items-center gap-1.5 text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
							aria-haspopup="true"
							aria-expanded={openMenu === link.label}
						>
							{link.label}
							<svg class="h-2.5 w-2.5 transition-transform duration-300 {openMenu === link.label ? 'rotate-180' : ''}" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 4.5L6 7.5L9 4.5" />
							</svg>
						</button>
						<div
							class="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 pt-4"
							class:dropdown-open={openMenu === link.label}
						>
							<div class="dropdown-inner min-w-[240px] py-3">
								{#each link.children as child}
									<a
										href={child.href}
										class="block px-6 py-3 text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
									>{child.label}</a>
								{/each}
							</div>
						</div>
					</div>
				{:else if link.href}
					<a href={link.href} class="nav-link text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300">{link.label}</a>
				{/if}
			{/each}
			<!-- Theme toggle -->
			<button
				onclick={toggleTheme}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				class="nav-link flex h-8 w-8 items-center justify-center transition-colors duration-300"
			>
				{#if isDark}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
					</svg>
				{:else}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{/if}
			</button>
		</div>
		<!-- Mobile: hamburger + theme toggle -->
		<div class="flex items-center gap-4 md:hidden">
			<button
				onclick={toggleTheme}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				class="nav-link flex h-8 w-8 items-center justify-center transition-colors duration-300"
			>
				{#if isDark}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
					</svg>
				{:else}
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{/if}
			</button>
			<button
				class="nav-link flex h-8 w-8 items-center justify-center"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="Toggle menu"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					{#if mobileMenuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	<div
		class="mobile-menu grid md:hidden"
		class:mobile-menu-open={mobileMenuOpen}
	>
		<div class="overflow-hidden">
			<div class="flex flex-col items-center gap-5 pb-6">
				{#each nav.links as link}
					{#if link.children}
						<button
							type="button"
							class="nav-link flex items-center gap-1.5 text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
							onclick={() => (mobileSubOpen[link.label] = !mobileSubOpen[link.label])}
						>
							{link.label}
							<svg class="h-2.5 w-2.5 transition-transform duration-300 {mobileSubOpen[link.label] ? 'rotate-180' : ''}" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 4.5L6 7.5L9 4.5" />
							</svg>
						</button>
						{#if mobileSubOpen[link.label]}
							<div class="flex flex-col items-center gap-3 pb-1">
								{#each link.children as child}
									<a
										href={child.href}
										class="nav-link text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
										onclick={() => (mobileMenuOpen = false)}
									>{child.label}</a>
								{/each}
							</div>
						{/if}
					{:else if link.href}
						<a
							href={link.href}
							class="nav-link text-[10px] font-medium tracking-[0.25em] uppercase transition-colors duration-300"
							onclick={() => mobileMenuOpen = false}
						>{link.label}</a>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</nav>

<style>
	.nav-bar {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	.nav-bar :global(.nav-link) {
		color: #404040;
	}
	.nav-bar :global(.nav-link:hover) {
		color: #111111;
	}

	:global(.dark) .nav-bar {
		background: rgba(0, 0, 0, 0.7);
		border-bottom-color: rgba(255, 255, 255, 0.06);
	}
	:global(.dark) .nav-bar :global(.nav-link) {
		color: rgba(255, 255, 255, 0.6);
	}
	:global(.dark) .nav-bar :global(.nav-link:hover) {
		color: #ffffff;
	}

	.mobile-menu {
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.4s ease-in-out;
	}
	.mobile-menu.mobile-menu-open {
		grid-template-rows: 1fr;
	}

	.dropdown-panel {
		opacity: 0;
		visibility: hidden;
		transform: translate(-50%, -4px);
		transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
	}
	.dropdown-panel.dropdown-open {
		opacity: 1;
		visibility: visible;
		transform: translate(-50%, 0);
	}
	.dropdown-inner {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px) saturate(180%);
		-webkit-backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(0, 0, 0, 0.06);
	}
	:global(.dark) .dropdown-inner {
		background: rgba(17, 17, 17, 0.95);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.dropdown-inner :global(a) {
		color: #404040;
		white-space: nowrap;
	}
	.dropdown-inner :global(a:hover) {
		color: #111111;
		background-color: rgba(0, 0, 0, 0.03);
	}
	:global(.dark) .dropdown-inner :global(a) {
		color: rgba(255, 255, 255, 0.7);
	}
	:global(.dark) .dropdown-inner :global(a:hover) {
		color: #ffffff;
		background-color: rgba(255, 255, 255, 0.04);
	}
</style>
