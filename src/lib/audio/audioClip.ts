import type { AudioPlayer } from './audioPlayer';
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

    constructor(public readonly audioPlayer: AudioPlayer, buffer: AudioBuffer, volume = 1, startTime = 0, inOffset = 0, outOffset = 0) {
        this.buffer = buffer;
        const {audioNode,sourceNode} = this.createNodes();
        this.sourceNode = sourceNode;
        this.audioNode = audioNode;
        this.volume = volume;
        this.startTime = startTime;
        this.in = inOffset;
        this.out = outOffset;
    }

    createNodes() {
        const { context } = this.audioPlayer;
        this.sourceNode = context.createBufferSource();
        this.sourceNode.buffer = this.buffer;
        this.audioNode = context.createGain();
        this.sourceNode.connect(this.audioNode);
        return {
            sourceNode: this.sourceNode,
            audioNode: this.audioNode,
        }
    }

    recreateNodes() {
        this.createNodes();
    }

    play(offsetSeconds = 0): void {
        const effectiveIn = this.in + offsetSeconds;
        const effectiveDuration = this.buffer.duration - effectiveIn - this.out;
        this.sourceNode.start(this.startTime, effectiveIn, effectiveDuration);
    }
    

    stop(): void {
        this.sourceNode.stop();
        // Reinitialize the sourceNode for subsequent plays
        // this.createNodes();
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
