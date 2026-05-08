<script lang="ts">
	import { capabilities } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	type Slug = 'defense' | 'investments' | 'energy';
	let { slug }: { slug: Slug } = $props();

	const data = $derived(capabilities[slug]);
	const heading = $derived('heading' in data ? data.heading : '');
</script>

<section id="cap-{slug}" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<div class="mb-16 md:mb-20" use:reveal>
			<h3 class="t-display text-[var(--ink)] mb-4">{heading}</h3>
			<p class="t-lead max-w-2xl">{data.lead}</p>
		</div>

		<table class="w-full border-collapse" use:reveal>
			<tbody>
				{#each data.items as item, i}
					<tr class="border-t border-[var(--rule)] last:border-b">
						<td class="py-5 pr-6 align-top md:py-6">
							<span class="cap-number">0{i + 1}</span>
						</td>
						<td class="py-5 pr-10 align-top whitespace-nowrap md:py-6">
							<h4 class="t-pillar text-[var(--ink)]">{item.title}</h4>
						</td>
						<td class="py-5 align-top md:py-6">
							<p class="t-body">{item.desc}</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
