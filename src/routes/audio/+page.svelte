<script lang="ts">
	import { onMount } from 'svelte';
	import AudioPlayerView from '../../components/audio/audioPlayer.svelte';
	import { AudioPlayer } from '../../lib/audio/audioPlayer';

	let audioPlayer: AudioPlayer;

	onMount(() => {
		audioPlayer = new AudioPlayer();
	});
</script>

<div>
	{#if audioPlayer}
		<AudioPlayerView {audioPlayer} />
	{/if}
</div>

<style>
	div {
		width: 80%;
		height: 80%;
	}
</style>
