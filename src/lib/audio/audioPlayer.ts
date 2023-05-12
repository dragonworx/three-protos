import Events from '../events';
import { AudioClip } from './audioClip';
import type { AudioTrack } from './audioTrack';

export class AudioPlayer  {
    context: AudioContext;
    masterMixer: GainNode;
    tracks: AudioTrack[];

    constructor() {
        this.context = new AudioContext();
        this.masterMixer = this.context.createGain();
        this.masterMixer.connect(this.context.destination);
        this.tracks = [];
    }

    play(offsetSeconds = 0): void {
        this.tracks.forEach(track => track.play(offsetSeconds));
    }

    pause(): void {
        this.context.suspend();
    }

    stop(): void {
        this.context.close();
        // Recreate the AudioContext and masterMixer for subsequent plays
        this.context = new AudioContext();
        this.masterMixer = this.context.createGain();
        this.masterMixer.connect(this.context.destination);
    }

    addTrack(track: AudioTrack): void {
        track.connect(this.masterMixer);
        this.tracks.push(track);
    }

    removeTrack(track: AudioTrack): void {
        const index = this.tracks.indexOf(track);
        if (index > -1) {
            track.disconnect(this.masterMixer);
            this.tracks.splice(index, 1);
        }
    }

    async loadAudioUrl(url: string): Promise<AudioClip> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        const audioClip = new AudioClip(this.context, audioBuffer); // Assuming AudioClip constructor takes AudioBuffer
        return audioClip;
    }

    async loadAudioFile(blob: Blob): Promise<AudioClip> {
		try {
            Events.audio.player.load.start.emit();
			const audioData = await blob.arrayBuffer();
			const audioBuffer = await this.context.decodeAudioData(audioData);
			const clip = new AudioClip(this.context, audioBuffer); // Assuming AudioClip constructor takes AudioBuffer
            Events.audio.player.load.end.emit();
            return clip;
		} catch (error) {
			console.error('Error loading audio file:', error);
			throw new Error('Error loading audio file');
		}
	}
}
