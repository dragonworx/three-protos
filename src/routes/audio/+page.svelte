<script lang="ts">
	import { onMount } from 'svelte';
	import { DropZone } from '../../lib/dropzone';
	import { AudioEngine } from '../../lib/audio/audioEngine';
	import { AudioWaveform } from '../../lib/audio/waveform';

	let container: HTMLElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		DropZone.init();

		const dropzone = new DropZone(container);

		dropzone.on('files', async (files: FileList) => {
			const audioBlob = files.item(0) as Blob;

			// ensure canvas is sized correctly
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = width;
			canvas.height = height;

			console.log('loading');
			const audioEngine = new AudioEngine();
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
