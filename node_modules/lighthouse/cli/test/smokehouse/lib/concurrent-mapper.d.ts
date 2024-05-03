/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A class that maintains a concurrency pool to coordinate many jobs that should
 * only be run `concurrencyLimit` at a time.
 * API inspired by http://bluebirdjs.com/docs/api/promise.map.html, but
 * independent callers of `concurrentMap()` share the same concurrency limit.
 */
export class ConcurrentMapper {
    /**
     * Runs callbackfn on `values` in parallel, at a max of `concurrency` at a
     * time. Resolves to an array of the results or rejects with the first
     * rejected result. Default `concurrency` limit is `Infinity`.
     * @template T, U
     * @param {Array<T>} values
     * @param {(value: T, index: number, array: Array<T>) => Promise<U>} callbackfn
     * @param {{concurrency: number}} [options]
     * @return {Promise<Array<U>>}
     */
    static map<T_1, U_2>(values: T_1[], callbackfn: (value: T_1, index: number, array: T_1[]) => Promise<U_2>, options?: {
        concurrency: number;
    } | undefined): Promise<U_2[]>;
    /** @type {Set<Promise<unknown>>} */
    _promisePool: Set<Promise<unknown>>;
    /**
     * The limits of all currently running jobs. There will be duplicates.
     * @type {Array<number>}
     */
    _allConcurrencyLimits: Array<number>;
    /**
     * Returns whether there are fewer running jobs than the minimum current
     * concurrency limit and the proposed new `concurrencyLimit`.
     * @param {number} concurrencyLimit
     */
    _canRunMoreAtLimit(concurrencyLimit: number): boolean;
    /**
     * Add a job to pool.
     * @param {Promise<unknown>} job
     * @param {number} concurrencyLimit
     */
    _addJob(job: Promise<unknown>, concurrencyLimit: number): void;
    /**
     * Remove a job from pool.
     * @param {Promise<unknown>} job
     * @param {number} concurrencyLimit
     */
    _removeJob(job: Promise<unknown>, concurrencyLimit: number): void;
    /**
     * Runs callbackfn on `values` in parallel, at a max of `concurrency` at
     * a time across all callers on this instance. Resolves to an array of the
     * results (for each caller separately) or rejects with the first rejected
     * result. Default `concurrency` limit is `Infinity`.
     * @template T, U
     * @param {Array<T>} values
     * @param {(value: T, index: number, array: Array<T>) => Promise<U>} callbackfn
     * @param {{concurrency: number}} [options]
     * @return {Promise<Array<U>>}
     */
    pooledMap<T, U>(values: T[], callbackfn: (value: T, index: number, array: T[]) => Promise<U>, options?: {
        concurrency: number;
    } | undefined): Promise<U[]>;
    /**
     * Runs `fn` concurrent to other operations in the pool, at a max of
     * `concurrency` at a time across all callers on this instance. Default
     * `concurrency` limit is `Infinity`.
     * @template U
     * @param {() => Promise<U>} fn
     * @param {{concurrency: number}} [options]
     * @return {Promise<U>}
     */
    runInPool<U_1>(fn: () => Promise<U_1>, options?: {
        concurrency: number;
    } | undefined): Promise<U_1>;
}
//# sourceMappingURL=concurrent-mapper.d.ts.map