<script lang="ts">
	import { onMount } from 'svelte';
	import type { AudioClip } from '../../lib/audio/audioClip';
	import { mouseDrag, type MouseDragInitialiser, type MouseDragUpdate } from '../../lib/mouseDrag';

	export let clip: AudioClip;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		// ensure canvas is sized correctly
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		canvas.width = width;
		canvas.height = height;

		clip.createWaveform(canvas);
	});

	const onMouseDown = (event: MouseEvent) => {
		const left = canvas.style.left;
		const top = canvas.style.top;
		mouseDrag({
			event,
			startX: left ? parseFloat(left) : 0,
			startY: top ? parseFloat(top) : 0,
			onMouseMove(update: MouseDragUpdate) {
				canvas.style.left = update.currentX + 'px';
			}
		});
	};
</script>

<div>
	<canvas bind:this={canvas} on:mousedown={onMouseDown} />
</div>

<style>
	div {
		position: absolute;
		top: 0;
		left: 0;
	}

	canvas {
		position: relative;
		left: 0;
		top: 0;
	}
</style>
