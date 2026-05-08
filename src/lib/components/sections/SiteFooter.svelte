<script lang="ts">
	import { footer } from '$lib/content';
</script>

<footer class="border-t border-[var(--rule)]">
	<div class="mx-auto max-w-7xl px-8 py-12 md:px-16 md:py-16 lg:px-24">
		<div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
			<div class="flex items-center gap-4">
				<img src="/self_logo.png" alt="KEG" width="199" height="187" loading="lazy" class="h-7 w-auto opacity-50" />
				<p class="text-[11px] font-medium tracking-[0.18em] text-[var(--ink)] uppercase">{footer.brand}</p>
			</div>

			<div class="flex flex-wrap gap-x-8 gap-y-3">
				<a href="/#about" class="text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase transition-colors duration-300 hover:text-[var(--ink)]">About</a>
				<a href="/#capabilities" class="text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase transition-colors duration-300 hover:text-[var(--ink)]">Capabilities</a>
				<a href="/#ethos" class="text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase transition-colors duration-300 hover:text-[var(--ink)]">Ethos</a>
				<a href="/#contact" class="text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase transition-colors duration-300 hover:text-[var(--ink)]">Contact</a>
			</div>

			<p class="tabular text-[10px] font-medium tracking-[0.25em] text-[var(--mid-light)] uppercase">{footer.copyright}</p>
		</div>
	</div>
</footer>
