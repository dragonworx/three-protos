<script lang="ts">
	import { onMount } from 'svelte';
	import * as Comlink from 'comlink';
	import type { MyClass } from '../lib/worker';
	import MyWorker from '../lib/worker?worker';
	import { setupThreeJsScene } from '../lib/three';

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		// test loading web worker with Comlink (nice and easy)
		const Cls = Comlink.wrap(new MyWorker()) as Comlink.Remote<typeof MyClass>;

		const instance = await new Cls();
		instance.logSomething();

		// test setting up threejs
		setupThreeJsScene({
			canvas,
			// cameraType: 'orthographic',
			cameraType: 'perspective',
			cameraOptions: {
				fov: 70,
				near: 1,
				far: 1000,
				orthoSize: 20
			}
		});
	});
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 80%;
		height: 80%;
		border: 1px solid red;
	}
</style>
