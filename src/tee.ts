/**
 * The pair class.
 */
export class Pair<T> {
    /**
     * The first item.
     */
    readonly first: T;
    /**
     * The second item.
     */
    readonly second: T;
    readonly [index: number]: T;
    /**
     * Returns 2.
     */
    get length(): 2 {
        return 2;
    }

    /**
     * Creates a new `Pair<T>` object.
     */
    constructor(first: T, second: T) {
        this.first = first;
        this.second = second;
        
        Object.defineProperty(this, '0', {
            get: () => this.first,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(this, '1', {
            get: () => this.second,
            enumerable: false,
            configurable: false
        });
    }

    /**
     * Returns a new pair where both items are `value`.
     */
    static split<T>(value: T): Pair<T> {
        return new Pair(value, value);
    }
    /**
     * Creates a new pair from `array`.
     */
    static fromArray<T>(array: [T, T]): Pair<T> {
        return new Pair(array[0], array[1]);
    }
    /**
     * Returns a mapped pair.
     * @param firstMapper Maps first item.
     * @param secondMapper Maps second item.
     */
    map<TMapped>(firstMapper: (first: T) => TMapped, secondMapper?: ((second: T) => TMapped) | null) {
        return new Pair(
            firstMapper(this.first),
            (secondMapper ?? firstMapper)(this.second));
    }
    /**
     * Returns a mapped pair.
     * @param mapper Maps both items.
     */
    do<TMapped>(mapper: (first: T, second: T) => Pair<TMapped> | [TMapped, TMapped]): Pair<TMapped> {
        const result = mapper(this.first, this.second);

        return Array.isArray(result) ? Pair.fromArray(result) : result;
    }
    /**
     * Returns this pair copy with swapped items.
     */
    swap(): Pair<T> {
        return new Pair(this.second, this.first);
    }
    /**
     * Converts this pair to an array.
     */
    toArray(): [T, T] {
        return [this.first, this.second];
    }
    /**
     * Unifies both to one mapped.
     */
    reduce<TMapped>(unifier: (first: T, second: T) => TMapped): TMapped {
        return unifier(this.first, this.second);
    }
    /**
     * If type of `processor` is not `undefined` and `processor` is not `null` calls `processor` with `this.first`; otherwise does nothing. Then returns `this.second`.
     */
    process(processor?: ((first: T) => void) | null): T {
        if (typeof processor !== 'undefined' && processor !== null)
            processor(this.first);
        
        return this.second;
    }
}
/**
 * Wraps `Pair.split<T>` method.
 */
export default function tee<T>(value: T): Pair<T> {
    return Pair.split(value);
}
// solve name conflicts
function teeImpl(value: any): any {
    return tee(value);
}

/**
 * Uses `tee` function in method-like syntax.
 */
export interface ITeeObject {
    /**
     * Returns a new pair where both items are `this`.
     */
    tee(): Pair<this>;
}
/**
 * The base implementation of `ITeeObject`.
 */
export class TeeObject implements ITeeObject {
    /**
     * Returns a new pair where both items are `this`.
     */
    tee(): Pair<this> {
        return tee(this);
    }
}
/**
 * Adds to `prototype` a new `tee` method
 * @param prototype Targeting prototype (optional).
 * @param createDummy When true the method adds to new intermediate prototype; otherwise adds or sets to `prototype` (`false` by default).
 */
export function injectTee(prototype?: object, createDummy?: boolean | null): ITeeObject {
    prototype ??= Object.prototype;
    createDummy ??= false;

    if (createDummy) return Object.create(prototype, {
        'tee': {
            value: function tee() { return teeImpl(this); },
            writable: false,
            enumerable: false,
            configurable: true
        }
    });
    
    if (prototype.hasOwnProperty('tee')) delete (prototype as any)['tee'];

    Object.defineProperty(prototype, 'tee', {
        value: function tee() { return teeImpl(this); },
        writable: false,
        enumerable: false,
        configurable: true
    });

    return prototype as ITeeObject;
}