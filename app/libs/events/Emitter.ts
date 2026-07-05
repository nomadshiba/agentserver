export type Subscriber<T> = (data: T) => unknown;

export class Emitter<T> {
    private readonly subscribers = new Set<Subscriber<T>>();

    get size() {
        return this.subscribers.size;
    }

    subscribe(subscriber: Subscriber<T>) {
        this.subscribers.add(subscriber);
        return () => this.subscribers.delete(subscriber);
    }

    emit(data: T) {
        for (const subscriber of this.subscribers) subscriber(data);
    }
}
