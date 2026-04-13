<script lang="ts">
	import { contact } from '$lib/content';
	import { reveal } from '$lib/actions/reveal';

	let formName = $state('');
	let formEmail = $state('');
	let formCompany = $state('');
	let formSubject = $state('');
	let formMessage = $state('');
	let formStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		formStatus = 'sending';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formName,
					email: formEmail,
					company: formCompany,
					subject: formSubject,
					message: formMessage
				})
			});
			if (!res.ok) throw new Error('Send failed');
			formStatus = 'sent';
			formName = '';
			formEmail = '';
			formCompany = '';
			formSubject = '';
			formMessage = '';
		} catch {
			formStatus = 'error';
		}
	}

	// Minimal underlined input — no frame, no label above, no float-label.
	const field =
		'block w-full border-0 border-b border-slate-200 bg-transparent py-5 text-lg font-light text-slate-900 outline-none transition-[border-color,color] duration-300 placeholder:font-light placeholder:text-slate-400 focus:border-slate-900 dark:border-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-600 dark:focus:border-neutral-50';
</script>

<section id="contact" class="overflow-hidden">
	<div class="section section-rule mx-auto max-w-6xl px-8">
		<div class="mb-20 text-center" use:reveal>
			<p class="t-eyebrow mb-10">{contact.eyebrow}</p>
			<h2 class="t-section mb-3 text-slate-900 dark:text-neutral-50">
				{#each contact.headingTop as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingTop.length - 1}{' '}{/if}{/each}
			</h2>
			<h2 class="t-section mb-12 text-slate-500 dark:text-neutral-500">
				{#each contact.headingBottom as word, i}<span class="inline-block">{word}</span>{#if i < contact.headingBottom.length - 1}{' '}{/if}{/each}
			</h2>
			<p class="t-lead mx-auto max-w-xl">
				{contact.body}
			</p>
		</div>

		<div class="mx-auto max-w-2xl" use:reveal={{ delay: 180 }}>
			<form onsubmit={handleFormSubmit} class="space-y-2">
				<div class="grid gap-x-10 sm:grid-cols-2">
					<div>
						<label for="contact-name" class="sr-only">Full name</label>
						<input id="contact-name" type="text" bind:value={formName} required placeholder="Full name" autocomplete="name" class={field} />
					</div>
					<div>
						<label for="contact-email" class="sr-only">Email</label>
						<input id="contact-email" type="email" bind:value={formEmail} required placeholder="Email" autocomplete="email" class={field} />
					</div>
				</div>

				<div>
					<label for="contact-company" class="sr-only">Company</label>
					<input id="contact-company" type="text" bind:value={formCompany} placeholder="Company" autocomplete="organization" class={field} />
				</div>

				<div>
					<label for="contact-subject" class="sr-only">Subject</label>
					<input id="contact-subject" type="text" bind:value={formSubject} required placeholder="Subject" class={field} />
				</div>

				<div>
					<label for="contact-message" class="sr-only">Message</label>
					<textarea id="contact-message" bind:value={formMessage} required rows="4" placeholder="Your message" class="{field} resize-none"></textarea>
				</div>

				<div class="flex flex-col-reverse items-center gap-6 pt-10 md:flex-row md:justify-between">
					<p
						class="t-eyebrow min-h-[1em]"
						class:text-slate-900={formStatus === 'sent'}
						class:dark:text-neutral-50={formStatus === 'sent'}
					>
						{#if formStatus === 'sent'}
							Message sent
						{:else if formStatus === 'error'}
							Something went wrong — please try again
						{:else}
							&nbsp;
						{/if}
					</p>
					<button
						type="submit"
						disabled={formStatus === 'sending'}
						class="group relative inline-flex items-center justify-center overflow-hidden border border-slate-900 px-12 py-4 text-[11px] font-medium tracking-[0.32em] text-slate-900 uppercase transition-colors duration-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-50 dark:text-neutral-50 dark:hover:text-black"
					>
						<span class="relative z-10">
							{#if formStatus === 'sending'}
								Sending…
							{:else if formStatus === 'sent'}
								Sent
							{:else}
								Send
							{/if}
						</span>
						<span
							aria-hidden="true"
							class="absolute inset-0 -translate-y-full bg-slate-900 transition-transform duration-500 group-hover:translate-y-0 dark:bg-neutral-50"
						></span>
					</button>
				</div>
			</form>
		</div>
	</div>
</section>
