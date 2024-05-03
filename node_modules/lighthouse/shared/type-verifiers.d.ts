/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview A collection of general type verification functions for dealing
 * with external data. If these grow in scope they could be auto-generated with
 * something like `io-ts`, but it's not worth the complexity yet.
 */
/**
 * Type predicate verifying `val` is an object (excluding `Array` and `null`).
 * @param {unknown} val
 * @return {val is Record<string, unknown>}
 */
export function isObjectOfUnknownValues(val: unknown): val is Record<string, unknown>;
/**
 * Type predicate verifying `val` is an object or an array.
 * @param {unknown} val
 * @return {val is Record<string, unknown>|Array<unknown>}
 */
export function isObjectOrArrayOfUnknownValues(val: unknown): val is Record<string, unknown> | unknown[];
//# sourceMappingURL=type-verifiers.d.ts.map