export const waveformResolution = 1024 * 8;
export const waveformHeight = 50;

export class AudioWaveform {
	public canvas: HTMLCanvasElement;

	constructor(public audioBuffer: AudioBuffer, canvas?: HTMLCanvasElement) {
		const w = audioBuffer.length / waveformResolution;
		canvas = this.canvas = canvas ?? document.createElement('canvas');
		canvas.width = w;
		canvas.height = waveformHeight;
		canvas.style.width = `${w}px`;
		canvas.style.height = `${waveformHeight}px`;
		this.draw();
	}

	public draw(): void {
		const { canvas, audioBuffer } = this;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		const width = canvas.width;
		const height = canvas.height;
		const numChannels = audioBuffer.numberOfChannels;
		const step = Math.ceil(audioBuffer.length / width);
		const amp = height / (numChannels * 2);

		ctx.fillStyle = '#222222';
		ctx.fillRect(0, 0, width, height);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#0e4ead';

		for (let channel = 0; channel < numChannels; channel++) {
			const data = audioBuffer.getChannelData(channel);

			const y = (channel * 2 + 1) * amp;

			for (let i = 0; i < width; i++) {
				let min = 1.0;
				let max = -1.0;

				for (let j = 0; j < step; j++) {
					const datum = data[i * step + j];

					if (datum < min) {
						min = datum;
					}
					if (datum > max) {
						max = datum;
					}
				}

				ctx.moveTo(i, y + min * amp);
				ctx.lineTo(i, y + max * amp);
			}

			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
		}

		ctx.stroke();
	}
}

export function pixelToTimeOffset(
	pixelCoordinate: number,
	resolution: number,
	sampleRate: number
) {
	const pixelDuration = resolution / sampleRate;
	const timeOffset = pixelCoordinate * pixelDuration;
	return timeOffset;
}

export function timeOffsetToPixel(timeOffset: number, resolution: number, sampleRate: number): number {
    const pixelDuration = resolution / sampleRate;
    const pixelCoordinate = timeOffset / pixelDuration;
    return pixelCoordinate;
}
