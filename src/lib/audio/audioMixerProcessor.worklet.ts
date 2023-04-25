// audioMixerProcessor.worklet.ts

class AudioMixerProcessor extends AudioWorkletProcessor {
	private tracks: Map<string, any> = new Map();
	private messagePort: MessagePort;

	constructor(options: any) {
		super();

		// Initialize tracks from the options object
		for (const trackData of options.processorOptions.tracks) {
			this.tracks.set(trackData.id, trackData);
		}

		// Set up the message port for communication with the main thread
		this.messagePort = options.processorOptions.messagePort;
		this.messagePort.onmessage = this.handleMessage.bind(this);
	}

	handleMessage(event: MessageEvent): void {
		// Handle updates from the main thread
		const { type, payload } = event.data;

		switch (type) {
			case 'updateTrack':
				this.tracks.set(payload.id, payload.trackData);
				break;

			case 'removeTrack':
				this.tracks.delete(payload.id);
				break;

			default:
				console.warn('Unhandled message type:', type);
		}
	}

	process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: any): boolean {
		// Create an empty stereo output buffer
		const output = outputs[0];
		const leftOutput = output[0];
		const rightOutput = output[1];
		const outputLength = leftOutput.length;

		// Reset output buffer to zero
		for (let i = 0; i < outputLength; i++) {
			leftOutput[i] = 0;
			rightOutput[i] = 0;
		}

		// Process each track and mix into the output buffer
		for (const trackData of this.tracks.values()) {
			const currentTime = this.currentTime;
			const { clips, volume, pan } = trackData;

			// Iterate through the clips and mix active ones into the output buffer
			for (const clip of clips) {
				const { audioBuffer, startTime, endTime } = clip;

				if (currentTime >= startTime && currentTime < endTime) {
					// Calculate the playback position within the clip
					const playbackPosition = currentTime - startTime;

					// Get the audio data from the clip
					const leftInput = audioBuffer.getChannelData(0);
					const rightInput = audioBuffer.getChannelData(1);

					// Calculate the number of samples to mix
					const inputLength = audioBuffer.length;
					const samplesToMix = Math.min(
						inputLength - Math.round(playbackPosition * audioBuffer.sampleRate),
						outputLength
					);

					// Apply volume and pan settings
					const gainLeft = volume * (1 - pan);
					const gainRight = volume * (1 + pan);

					// Mix the audio data into the output buffer
					for (let i = 0; i < samplesToMix; i++) {
						const inputIndex = Math.round(playbackPosition * audioBuffer.sampleRate) + i;
						leftOutput[i] += leftInput[inputIndex] * gainLeft;
						rightOutput[i] += rightInput[inputIndex] * gainRight;
					}
				}
			}
		}

		return true;
	}
}

registerProcessor('audio-mixer-processor', AudioMixerProcessor);
