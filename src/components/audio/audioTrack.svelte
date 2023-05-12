<script lang="ts">
	import { onMount } from 'svelte';
	import type { AudioTrack } from '../../lib/audio/audioTrack';
	import AudioClipView from './audioClip.svelte';
	import type { AudioClip } from '../../lib/audio/audioClip';
	import Events from '../../lib/events';

	export let track: AudioTrack;

	let clips: AudioClip[] = [];

	onMount(() => {
		clips = [...track.clips];

		Events.audio.track.clipAdded.on(() => (clips = [...track.clips]));
	});
</script>

<div>
	{#each track.clips as clip}
		<AudioClipView {clip} />
	{/each}
</div>

<style>
	div {
		border: 1px solid red;
		height: 50px;
		position: relative;
	}

	.controls {
		flex-grow: 0;
	}
</style>
