import Events from '../events';
import type { AudioClip } from './audioClip';
import type { AudioPlayer } from './audioPlayer';

export class AudioTrack {
    audioNode: GainNode;
    clips: AudioClip[];
    volume: number;
    pan: number;

    constructor(public readonly audioPlayer: AudioPlayer, volume = 1, pan = 0) {
     
        this.clips = [];
        this.volume = volume;
        this.pan = pan;
        this.audioNode = this.createNodes().audioNode;
    }

    createNodes() {
        this.audioNode = this.audioPlayer.context.createGain();
        return {
            audioNode: this.audioNode,
        }
    }

    recreateNodes() {
        this.createNodes();
        this.clips.forEach(clip => {
            clip.recreateNodes();
            clip.connect(this.audioNode);
        });
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
    
    stop() {
        this.clips.forEach(clip => clip.stop());
    }

    connect(node: AudioNode): void {
        this.audioNode.connect(node);
    }

    disconnect(node: AudioNode): void {
        this.audioNode.disconnect(node);
    }
}
