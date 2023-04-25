<script lang="ts">
	import { onMount } from 'svelte';
	import { DropZone } from '../../lib/dropzone';
	import * as Comlink from 'comlink';
	import type { AudioLoader } from '../../lib/audio2/worker';
	import AudioWorker from '../../lib/audio/worker?worker';
	import { AudioEngine } from '../../lib/audio2/AudioEngine';
	import { AudioWaveform } from '../../lib/audio2/waveform';

	let container: HTMLElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		DropZone.init();

		const dropzone = new DropZone(container);

		dropzone.on('files', async (files: FileList) => {
			const audioBlob = files.item(0) as Blob;
			// const Cls = Comlink.wrap(new AudioWorker()) as Comlink.Remote<typeof AudioLoader>;

			// const instance = await new Cls();
			// const result = await instance.load(audioBlob);
			// console.log('RESULT', result);

			// ensure canvas is sized correctly
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = width;
			canvas.height = height;

			const audioEngine = new AudioEngine();
			console.log('loading');
			const audioBuffer = await audioEngine.loadAudioFile(audioBlob);
			console.log('done');
			console.log('drawing');
			new AudioWaveform(canvas, audioBuffer);
			console.log('done');
		});
	});
</script>

<div bind:this={container}>
	<canvas bind:this={canvas} />
</div>

<style>
	div {
		width: 80%;
		height: 80%;
	}

	canvas {
		width: 100%;
		height: 100%;
		outline: 1px solid red;
	}
</style>
