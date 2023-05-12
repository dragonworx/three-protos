import Events from '../events';
import type { AudioClip } from './audioClip';

export class AudioTrack {
    audioNode: GainNode;
    clips: AudioClip[];
    volume: number;
    pan: number;

    constructor(context: AudioContext, volume = 1, pan = 0) {
        this.audioNode = context.createGain();
        this.clips = [];
        this.volume = volume;
        this.pan = pan;
    }

    addClip(clip: AudioClip): void {
        clip.connect(this.audioNode);
        this.clips.push(clip);
        this.sortClips();
        Events.audio.track.clipAdded.emit(clip);
    }

    removeClip(clip: AudioClip): void {
        const index = this.clips.indexOf(clip);
        if (index > -1) {
            clip.disconnect(this.audioNode);
            this.clips.splice(index, 1);
        }
    }

    sortClips(): void {
        this.clips.sort((a, b) => a.startTime - b.startTime);
    }

    play(offsetSeconds = 0): void {
        this.clips.forEach(clip => {
            const clipDuration = clip.buffer.duration - clip.in - clip.out;
            if (clip.startTime <= offsetSeconds && offsetSeconds <= clip.startTime + clipDuration) {
                const clipOffset = offsetSeconds - clip.startTime;
                clip.play(clipOffset);
            } else if (clip.startTime >= offsetSeconds) {
                clip.play();
            }
        });
    }
    
    

    connect(node: AudioNode): void {
        this.audioNode.connect(node);
    }

    disconnect(node: AudioNode): void {
        this.audioNode.disconnect(node);
    }
}
