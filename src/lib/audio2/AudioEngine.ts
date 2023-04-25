import type { AudioTrack } from './AudioTrack';

export class AudioEngine {
	public tracks: AudioTrack[] = [];
	private audioContext: AudioContext;

	constructor() {
		this.audioContext = new AudioContext();
	}

	public addTrack(track: AudioTrack): void {
		this.tracks.push(track);
	}

	public removeTrack(track: AudioTrack): void {
		const index = this.tracks.indexOf(track);
		if (index !== -1) {
			this.tracks.splice(index, 1);
		}
	}

	public getTrackById(id: string): AudioTrack | null {
		const track = this.tracks.find((t) => t.id === id);
		return track ? track : null;
	}

	public async loadAudioFile(blob: Blob): Promise<AudioBuffer> {
		try {
			const audioData = await blob.arrayBuffer();
			const audioBuffer = await this.audioContext.decodeAudioData(audioData);
			return audioBuffer;
		} catch (error) {
			console.error('Error loading audio file:', error);
			throw new Error('Error loading audio file');
		}
	}

	public play(time = 0): void {
		// Set the playback time for all tracks and their clips
		for (const track of this.tracks) {
			track.setCurrentTime(time);
		}

		// Placeholder for the actual implementation.
		// We'll implement this later using AudioWorklets for tracks and clips.
	}

	public stop(): void {
		// Placeholder for the actual implementation.
		// We'll implement this later using AudioWorklets for tracks and clips.
	}
}
