<script lang="ts">
	import { onMount } from 'svelte';
	import type { AudioPlayer } from '../../lib/audio/audioPlayer';
	import { DropZone } from '../../lib/dropzone';
	import AudioTrackView from './audioTrack.svelte';
	import { AudioTrack } from '../../lib/audio/audioTrack';
	import Events from '../../lib/events';

	export let audioPlayer: AudioPlayer;

	let container: HTMLElement;
	let isLoading = false;
	let tracks: AudioTrack[] = [];

	onMount(() => {
		const dropzone = new DropZone(container);

		Events.audio.player.load.start.on(() => (isLoading = true));
		Events.audio.player.load.end.on(() => (isLoading = false));
		Events.audio.track.clipAdded.on(() => (tracks = [...audioPlayer.tracks]));

		const track = new AudioTrack(audioPlayer.context);
		audioPlayer.addTrack(track);

		dropzone.on('files', async (files: FileList) => {
			const audioBlob = files.item(0) as Blob;

			const clip = await audioPlayer.loadAudioFile(audioBlob);

			track.addClip(clip);
		});
	});
</script>

<div bind:this={container}>
	<div class="controls">
		<button on:click={() => audioPlayer.play(60 + 12)}>Play</button>
		<button on:click={() => audioPlayer.stop()}>Stop</button>
	</div>
	<div class="tracks">
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
