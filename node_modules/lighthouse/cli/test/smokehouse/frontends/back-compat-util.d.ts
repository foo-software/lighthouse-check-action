/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * COMPAT: update from the old TestDefn format (array of `expectations` per
 * definition) to the new format (single `expectations` per def), doing our best
 * generating some unique IDs.
 * TODO: remove in Lighthouse 9+ once PubAds (and others?) are updated.
 * @see https://github.com/GoogleChrome/lighthouse/issues/11950
 * @param {ReadonlyArray<Smokehouse.BackCompatTestDefn>} allTestDefns
 * @return {Array<Smokehouse.TestDfn>}
 */
export function updateTestDefnFormat(allTestDefns: ReadonlyArray<Smokehouse.BackCompatTestDefn>): Array<Smokehouse.TestDfn>;
//# sourceMappingURL=back-compat-util.d.ts.map