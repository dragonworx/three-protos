import { EventMap } from './emitter';
import audioEvents from './modules/audioEvents';

const Events = EventMap({
    audio: audioEvents,
});

export default Events;
