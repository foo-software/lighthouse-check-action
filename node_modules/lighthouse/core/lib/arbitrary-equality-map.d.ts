/**
 * @fileoverview This class is designed to allow maps with arbitrary equality functions.
 * It is not meant to be performant and is well-suited to use cases where the number of entries is
 * likely to be small (like computed artifacts).
 */
export class ArbitraryEqualityMap {
    /**
     * Determines whether two objects are deeply equal. Defers to lodash isEqual, but is kept here for
     * easy usage by consumers.
     * See https://lodash.com/docs/4.17.5#isEqual.
     * @param {*} objA
     * @param {*} objB
     * @return {boolean}
     */
    static deepEquals(objA: any, objB: any): boolean;
    _equalsFn: typeof ArbitraryEqualityMap.deepEquals;
    /** @type {Array<{key: *, value: *}>} */
    _entries: {
        key: any;
        value: any;
    }[];
    /**
     * @param {function(*,*):boolean} equalsFn
     */
    setEqualityFn(equalsFn: (arg0: any, arg1: any) => boolean): void;
    /**
     * @param {*} key
     * @return {boolean}
     */
    has(key: any): boolean;
    /**
     * @param {*} key
     * @return {*}
     */
    get(key: any): any;
    /**
     * @param {*} key
     * @param {*} value
     */
    set(key: any, value: any): void;
    /**
     * @param {*} key
     * @return {number}
     */
    _findIndexOf(key: any): number;
}
//# sourceMappingURL=arbitrary-equality-map.d.ts.map