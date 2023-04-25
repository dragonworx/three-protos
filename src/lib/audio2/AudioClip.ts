// AudioClip.ts

export class AudioClip {
	public id: string;
	public audioBuffer: AudioBuffer;
	public startTime: number;
	public endTime: number;
	public volume: number;
	public pan: number;

	constructor(
		id: string,
		audioBuffer: AudioBuffer,
		startTime = 0,
		endTime: number = audioBuffer.duration,
		volume = 1,
		pan = 0
	) {
		this.id = id;
		this.audioBuffer = audioBuffer;
		this.startTime = startTime;
		this.endTime = endTime;
		this.volume = volume;
		this.pan = pan;
	}

	public setStartTime(startTime: number): void {
		this.startTime = startTime;
		// Update startTime on associated AudioWorkletNode when implemented
	}

	public setEndTime(endTime: number): void {
		this.endTime = endTime;
		// Update endTime on associated AudioWorkletNode when implemented
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
		// Implement logic to update the playback position of the clip
		// based on the given time value, if the clip should be playing
		// at that time
		// Update playback time for associated AudioWorkletNode when implemented
	}
}
