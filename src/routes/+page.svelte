<script lang="ts">
	import { onMount } from 'svelte';
	import * as Comlink from 'comlink';
	import type { MyClass } from '../lib/worker';
	import MyWorker from '../lib/worker?worker';

	onMount(async () => {
		const Cls = Comlink.wrap(new MyWorker()) as Comlink.Remote<typeof MyClass>;

		const instance = await new Cls();
		instance.logSomething();
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
