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

	const field =
		'block w-full border-0 border-b border-[var(--rule)] bg-transparent py-5 text-[0.9375rem] font-light text-[var(--ink)] outline-none transition-[border-color] duration-300 placeholder:font-light placeholder:text-[var(--mid-light)] focus:border-[var(--ink)]';
</script>

<section id="contact" class="focus-on-scroll">
	<div class="section mx-auto max-w-7xl px-8 md:px-16 lg:px-24">
		<!-- Centered heading -->
		<div class="mb-16 text-center md:mb-20" use:reveal>
			<p class="t-eyebrow mb-10">{contact.eyebrow}</p>
			<h2 class="t-display mb-6 text-[var(--ink)]">
				{contact.headingTop.join(' ')} {contact.headingBottom.join(' ')}
			</h2>
			<p class="t-lead mx-auto max-w-xl">
				{contact.body}
			</p>
		</div>

		<!-- Centered form -->
		<div class="mx-auto max-w-2xl" use:reveal={{ delay: 150 }}>
			<form onsubmit={handleFormSubmit} class="space-y-1">
				<div class="grid gap-x-8 sm:grid-cols-2">
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
					<p class="text-[0.6875rem] font-medium tracking-[0.2em] uppercase min-h-[1em] {formStatus === 'sent' ? 'text-[var(--ink)]' : 'text-[var(--mid-light)]'}">
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
						class="cta-btn disabled:cursor-not-allowed disabled:opacity-40"
					>
						<span>
							{#if formStatus === 'sending'}
								Sending…
							{:else if formStatus === 'sent'}
								Sent
							{:else}
								Send
							{/if}
						</span>
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
						</svg>
					</button>
				</div>
			</form>
		</div>
	</div>
</section>
