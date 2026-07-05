export class WeakRefMap<K, V extends object> {
    private map = new Map<K, WeakRef<V>>();
    private finalizer = new FinalizationRegistry<K>((key) => this.map.delete(key));

    set(key: K, value: V): void {
        const oldRef = this.map.get(key);
        if (oldRef) {
            if (oldRef.deref() === value) return;
            this.finalizer.unregister(oldRef);
        }
        const newRef = new WeakRef(value);
        this.map.set(key, newRef);
        this.finalizer.register(value, key, newRef);
    }

    get(key: K): V | undefined {
        return this.map.get(key)?.deref();
    }

    has(key: K): boolean {
        const ref = this.map.get(key);
        if (!ref) return false;
        // If the ref exists in the map but the value has been GC'd,
        // clean it up eagerly rather than waiting for the finalizer.
        if (ref.deref() === undefined) {
            this.finalizer.unregister(ref);
            this.map.delete(key);
            return false;
        }
        return true;
    }

    delete(key: K): boolean {
        const ref = this.map.get(key);
        if (!ref) return false;
        this.finalizer.unregister(ref);
        this.map.delete(key);
        return true;
    }

    clear(): void {
        for (const ref of this.map.values()) {
            this.finalizer.unregister(ref);
        }
        this.map.clear();
    }

    /** Yields only entries whose values are still alive. */
    *entries(): IterableIterator<[K, V]> {
        for (const [key, ref] of this.map.entries()) {
            const value = ref.deref();
            if (value !== undefined) yield [key, value];
        }
    }

    *keys(): IterableIterator<K> {
        for (const [key] of this.entries()) yield key;
    }

    *values(): IterableIterator<V> {
        for (const [, value] of this.entries()) yield value;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: this) => void, thisArg?: unknown): void {
        for (const [key, value] of this.entries()) {
            callback.call(thisArg, value, key, this);
        }
    }

    /**
     * Number of keys currently tracked — including any not yet pruned by the
     * finalizer. Use with awareness that some entries may be GC'd already.
     */
    get size(): number {
        return this.map.size;
    }
}
