<script lang="ts">
	import { footer } from '$lib/content';
</script>

<footer>
	<div class="mx-auto max-w-6xl border-t border-slate-200 dark:border-neutral-800 px-8 py-8">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<p class="text-sm font-light tracking-wide text-slate-500 dark:text-neutral-300">{footer.brand}</p>
			<div class="flex gap-8">
				<a href="#about" class="text-xs font-light tracking-[0.2em] text-slate-400 dark:text-neutral-400 uppercase transition-colors hover:text-slate-700">About</a>
				<a href="#contact" class="text-xs font-light tracking-[0.2em] text-slate-400 dark:text-neutral-400 uppercase transition-colors hover:text-slate-700">Contact</a>
			</div>
			<p class="text-[10px] font-light tracking-[0.2em] text-slate-400 dark:text-neutral-400">{footer.copyright}</p>
		</div>
	</div>
</footer>
