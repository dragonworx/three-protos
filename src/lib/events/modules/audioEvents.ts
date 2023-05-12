import type { AudioClip } from '../../audio/audioClip';
import { Emit } from '../emitter';

export default {
    player: {
        load: {
            start: Emit(),
            end: Emit(),
        }
    },
    track: {
        clipAdded: Emit<AudioClip>(),
    },
};
