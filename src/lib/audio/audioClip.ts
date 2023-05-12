import { AudioWaveform } from './waveform';

export class AudioClip {
    buffer: AudioBuffer;
    sourceNode: AudioBufferSourceNode;
    audioNode: GainNode;
    volume: number;
    startTime: number;
    in: number;
    out: number;
    waveform?: AudioWaveform;

    constructor(context: AudioContext, buffer: AudioBuffer, volume = 1, startTime = 0, inOffset = 0, outOffset = 0) {
        this.buffer = buffer;
        this.sourceNode = context.createBufferSource();
        this.sourceNode.buffer = this.buffer;
        this.audioNode = context.createGain();
        this.sourceNode.connect(this.audioNode);
        this.volume = volume;
        this.startTime = startTime;
        this.in = inOffset;
        this.out = outOffset;
    }

    play(offsetSeconds = 0): void {
        const effectiveIn = this.in + offsetSeconds;
        const effectiveDuration = this.buffer.duration - effectiveIn - this.out;
        this.sourceNode.start(0, effectiveIn, effectiveDuration);
    }
    

    stop(): void {
        this.sourceNode.stop();
        // Reinitialize the sourceNode for subsequent plays
        this.sourceNode = this.audioNode.context.createBufferSource();
        this.sourceNode.buffer = this.buffer;
        this.sourceNode.connect(this.audioNode);
    }

    connect(node: AudioNode): void {
        this.audioNode.connect(node);
    }

    disconnect(node: AudioNode): void {
        this.audioNode.disconnect(node);
    }

    createWaveform(canvas: HTMLCanvasElement) {
        if (!this.waveform) {
            this.waveform = new AudioWaveform(this.buffer, canvas);
        }

        return this.waveform
    }
}
