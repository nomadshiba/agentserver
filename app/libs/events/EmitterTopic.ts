import { Emitter, Subscriber } from "~/libs/events/Emitter.ts";

export class EmitterTopic<T> {
    private readonly emitters = new Map<string, Emitter<T>>();

    subscribe(topic: string, subscriber: Subscriber<T>) {
        const emitter = this.emitters.getOrInsertComputed(topic, () => new Emitter());
        const unsubscribe = emitter.subscribe(subscriber);
        return () => {
            unsubscribe();
            if (emitter.size === 0) this.emitters.delete(topic);
        };
    }

    emit(topic: string, data: T) {
        this.emitters.get(topic)?.emit(data);
    }
}
