import EventEmitter from 'eventemitter3';

const internalEventToken = '*';
const typeConst = {};

type ReducedEventEmitter = new() => Omit<
EventEmitter,
| 'addListener'
| 'eventNames'
| 'emit'
| 'listenerCount'
| 'listeners'
| 'on'
| 'off'
| 'removeAllListeners'
| 'removeListener'
>;

const ReducedEventEmitter: ReducedEventEmitter = EventEmitter;

export const debugEmitter: EventEmitter<'event'> = new EventEmitter<'event'>();

let enableDebugEmitter = false;
let id = 0;
const defaultPath = '?';

export function enableDebugEvents(isEnabled = true)
{
    enableDebugEmitter = isEnabled;
}

export class TypedEmitter<T> extends ReducedEventEmitter
{
    protected _fireCount = 0;
    protected _listenerIds: string[] = [];

    public path = defaultPath;
    public id = -1;

    public emit(data: T)
    {
        this._fireCount++;

        if (enableDebugEmitter)
        {
            debugEmitter.emit('event', {
                path: this.path,
                data,
            });
        }

        return EventEmitter.prototype.emit.call(this, internalEventToken, data);
    }

    public on(callback: (data: T) => void, listenerId?: string)
    {
        if (listenerId)
        {
            this._listenerIds.push(listenerId);
        }

        return EventEmitter.prototype.on.call(this, internalEventToken, callback);
    }

    public off(callback?: (data: T) => void)
    {
        if (callback)
        {
            return EventEmitter.prototype.off.call(this, internalEventToken, callback);
        }

        return EventEmitter.prototype.removeAllListeners.call(this);
    }

    public next(callback: (data: T) => void)
    {
        const handler = (data: T) =>
        {
            callback(data);
            this.off(handler);
        };

        return this.on(handler);
    }

    public listenerCount()
    {
        return EventEmitter.prototype.listenerCount.call(this, internalEventToken);
    }

    public fireCount()
    {
        return this._fireCount;
    }

    public listenerIds()
    {
        return this._listenerIds;
    }

    public listeners()
    {
        return EventEmitter.prototype.listeners.call(this, internalEventToken);
    }

    public get type(): T
    {
        return typeConst as T;
    }
}

export function Emit<T = void>()
{
    return new TypedEmitter<T>();
}

export function walkEmitters<T extends object>(
    emitterMap: T,
    callback: (path: string, emitter: TypedEmitter<unknown>) => void,
): T
{
    const walk = (obj: object, path: string[] = []) =>
    {
        for (const [k, v] of Object.entries(obj))
        {
            const fullPath = [...path, k].join('.');

            if (v instanceof TypedEmitter)
            {
                if (v.id === -1)
                {
                    v.id = id++;
                }
                if (v.path === defaultPath)
                {
                    v.path = fullPath;
                }
                callback(fullPath, v);
            }
            else
            {
                path.push(k);
                walk(v, path);
                path.pop();
            }
        }
    };

    walk(emitterMap);

    return emitterMap;
}

export function EventMap<T extends object>(emitterMap: T): T
{
    walkEmitters(emitterMap, (path, emitter) =>
    {
        if (emitter.path !== defaultPath)
        {
            emitter.path = path;
        }
    });

    return emitterMap;
}

export function eventsOf(emitterMap: object): TypedEmitter<unknown>[]
{
    const emitters: TypedEmitter<unknown>[] = [];

    walkEmitters(emitterMap, (_, emitter) =>
    {
        emitters.push(emitter);
    });

    return emitters;
}
