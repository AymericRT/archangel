if (typeof globalThis.structuredClone === 'undefined') {
	globalThis.structuredClone = ((val: unknown) => JSON.parse(JSON.stringify(val))) as typeof structuredClone;
}
