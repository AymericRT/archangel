<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';
</script>

<section id="capabilities" class="overflow-hidden">
	<div class="section-tight section-rule mx-auto max-w-6xl px-8">
		<h2 class="t-section text-slate-900 dark:text-neutral-50" use:reveal>{capabilities.intro.heading}</h2>
	</div>
</section>
