<script lang="ts">
	import { footer } from '$lib/content';
</script>

<footer>
	<div class="section-rule mx-auto max-w-6xl px-8 py-10">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<p class="text-[11px] font-medium tracking-[0.18em] text-slate-700 uppercase dark:text-neutral-200">{footer.brand}</p>
			<div class="flex gap-10">
				<a href="#about" class="text-[10px] font-medium tracking-[0.32em] text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-50">About</a>
				<a href="#contact" class="text-[10px] font-medium tracking-[0.32em] text-slate-500 uppercase transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-50">Contact</a>
			</div>
			<p class="tabular text-[10px] font-medium tracking-[0.32em] text-slate-500 uppercase dark:text-neutral-500">{footer.copyright}</p>
		</div>
	</div>
</footer>
