export type Store<V> = Map<string, V | Store<V>>;

export const cache = async <V>(store: Store<V>, resolve: () => Promise<V>, ...keys: string[]): Promise<V> => {
    return resolve();

    // if (keys.length === 0) {
    //     return resolve();
    // }
    //
    // if (keys.length === 1) {
    //     const [key] = keys;
    //
    //     const cached = store.get(key);
    //
    //     if (cached !== undefined && !(cached instanceof Map)) {
    //         return cached;
    //     }
    //
    //     const value = await resolve();
    //
    //     store.set(key, value);
    //
    //     return value;
    // }
    //
    // const [key, ...nextKeys] = keys;
    //
    // let subStore = store.get(key);
    //
    // if (!(subStore instanceof Map)) {
    //     subStore = new Map();
    //     store.set(key, subStore);
    // }
    //
    // return cache(subStore, resolve, ...nextKeys);
};

export const invalidate = <V>(store: Store<V>, ...keys: string[]): void => {
    if (keys.length === 0) {
        return;
    }

    if (keys.length === 1) {
        const [key] = keys;

        store.delete(key);
    }

    const [key, ...nextKeys] = keys;

    let subStore = store.get(key);

    if (subStore instanceof Map) {
        invalidate(subStore, ...nextKeys);
    }

    store.delete(key);
};
