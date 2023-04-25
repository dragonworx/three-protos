import type { AudioClip } from './AudioClip';

export class AudioTrack {
	public id: string;
	public volume: number;
	public pan: number;
	public clips: AudioClip[] = [];

	constructor(id: string, volume = 1, pan = 0) {
		this.id = id;
		this.volume = volume;
		this.pan = pan;
	}

	public addClip(clip: AudioClip): void {
		this.clips.push(clip);
	}

	public removeClip(clip: AudioClip): void {
		const index = this.clips.indexOf(clip);
		if (index !== -1) {
			this.clips.splice(index, 1);
		}
	}

	public getClipById(id: string): AudioClip | null {
		const clip = this.clips.find((c) => c.id === id);
		return clip ? clip : null;
	}

	public setVolume(volume: number): void {
		this.volume = volume;
		// Update volume on associated AudioWorkletNode when implemented
	}

	public setPan(pan: number): void {
		this.pan = pan;
		// Update pan on associated AudioWorkletNode when implemented
	}

	public setCurrentTime(time: number): void {
		for (const clip of this.clips) {
			clip.setCurrentTime(time);
		}

		// Update playback time for associated AudioWorkletNode when implemented
	}
}
