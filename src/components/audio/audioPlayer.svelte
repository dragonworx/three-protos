<script lang="ts">
	import { onMount } from 'svelte';
	import type { AudioPlayer } from '../../lib/audio/audioPlayer';
	import { DropZone } from '../../lib/dropzone';
	import AudioTrackView from './audioTrack.svelte';
	import Events from '../../lib/events';
	import type { AudioTrack } from '../../lib/audio/audioTrack';
	import {
		pixelToTimeOffset,
		timeOffsetToPixel,
		waveformResolution
	} from '../../lib/audio/waveform';

	export let audioPlayer: AudioPlayer;

	let container: HTMLElement;
	let playbackHead: HTMLElement;
	let isLoading = false;
	let tracks: AudioTrack[] = [];

	onMount(() => {
		const dropzone = new DropZone(container);

		Events.audio.player.load.start.on(() => (isLoading = true));
		Events.audio.player.load.end.on(() => (isLoading = false));
		Events.audio.track.clipAdded.on(() => (tracks = [...audioPlayer.tracks]));
		Events.audio.player.render.on(() => {
			const currentTime = audioPlayer.context.currentTime;
			const pixelCoordinate = timeOffsetToPixel(
				currentTime,
				waveformResolution,
				audioPlayer.context.sampleRate
			);
			playbackHead.style.left = `${pixelCoordinate}px`;
		});

		dropzone.on('files', async (files: FileList) => {
			if (audioPlayer.isPlaying) {
				audioPlayer.stop();
			}
			const audioBlob = files.item(0) as Blob;
			const clip = await audioPlayer.loadAudioFile(audioBlob);
			const track = audioPlayer.createTrack();
			track.addClip(clip);
		});
	});

	const onMouseDown = (e: MouseEvent) => {
		const x = e.clientX;
		const offset = timeOffsetToPixel(
			audioPlayer.context.currentTime,
			waveformResolution,
			audioPlayer.context.sampleRate
		);
		const time = pixelToTimeOffset(x, waveformResolution, audioPlayer.context.sampleRate);
		const delta = time - offset;
		// audioPlayer.seek(delta);
	};
</script>

<div bind:this={container}>
	<div class="controls">
		<button on:click={() => audioPlayer.play()}>Play</button>
		<button on:click={() => audioPlayer.stop()}>Stop</button>
	</div>
	<div class="tracks" on:mousedown={onMouseDown}>
		<div class="playback" bind:this={playbackHead} />
		{#each tracks as track}
			<AudioTrackView {track} />
		{/each}
	</div>
	<div class="footer">
		{#if isLoading}
			<div class="loading-bar" />
		{/if}
	</div>
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		border: 1px solid green;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.controls,
	.footer {
		flex-grow: 0;
		height: 50px;
	}

	.tracks {
		flex-grow: 1;
		overflow: auto;
	}

	.playback {
		position: absolute;
		top: 0;
		left: 0;
		width: 0px;
		height: 100%;
		border-right: 1px solid blue;
	}

	.loading-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to right, #093f13 40%, #202020 50%, #0d7d2d 100%);
		background-size: 200% 100%;
		animation: move-stripes 5s infinite;
	}

	@keyframes move-stripes {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: -100% 0;
		}
	}
</style>
