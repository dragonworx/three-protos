import Events from '../events';
import { AudioClip } from './audioClip';
import { AudioTrack } from './audioTrack';

export class AudioPlayer  {
    context: AudioContext;
    masterMixer: GainNode;
    tracks: AudioTrack[];
    isPlaying: boolean;

    constructor() {
        this.context = new AudioContext();
        this.masterMixer = this.createNodes().masterMixer;
        this.tracks = [];
        this.isPlaying = false;
        console.log(this.context.sampleRate)

        requestAnimationFrame(this.render);
    }

    get trackCount(): number {
        return this.tracks.length;
    }

    render = () => {
        requestAnimationFrame(this.render);
        if (this.isPlaying) {
            Events.audio.player.render.emit();
        }
    }

    createNodes() {
        this.masterMixer = this.context.createGain();
        this.masterMixer.connect(this.context.destination);
        return {
            masterMixer: this.masterMixer
        }
    }

    recreateNodes() {
        this.createNodes();
        this.tracks.forEach(track => {
            track.recreateNodes();
            track.connect(this.masterMixer);
        });
    }


    play(offsetSeconds = 0): void {
        this.isPlaying = true;
        this.tracks.forEach(track => track.play(offsetSeconds));
    }

    pause(): void {
        this.context.suspend();
        this.isPlaying = false;
    }

    stop(): void {
        this.context.close();
        this.isPlaying = false;
        this.tracks.forEach(track => track.stop());
        this.context = new AudioContext();
        this.recreateNodes();
    }


    createTrack(): AudioTrack {
        const track = new AudioTrack(this);
        track.connect(this.masterMixer);
        this.tracks.push(track);
        return track;
    }

    getTrack(index: number): AudioTrack {
        return this.tracks[index];
    }

    removeTrack(index: number): void {
        const track = this.tracks[index];
        track.disconnect(this.masterMixer);
        this.tracks.splice(index, 1);
    }

    async loadAudioUrl(url: string): Promise<AudioClip> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        const audioClip = new AudioClip(this, audioBuffer); // Assuming AudioClip constructor takes AudioBuffer
        return audioClip;
    }

    async loadAudioFile(blob: Blob): Promise<AudioClip> {
		try {
            Events.audio.player.load.start.emit();
			const audioData = await blob.arrayBuffer();
			const audioBuffer = await this.context.decodeAudioData(audioData);
			const clip = new AudioClip(this, audioBuffer); // Assuming AudioClip constructor takes AudioBuffer
            Events.audio.player.load.end.emit();
            return clip;
		} catch (error) {
			console.error('Error loading audio file:', error);
			throw new Error('Error loading audio file');
		}
	}
}
