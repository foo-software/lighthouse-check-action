/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * COMPAT: update from the old TestDefn format (array of `expectations` per
 * definition) to the new format (single `expectations` per def), doing our best
 * generating some unique IDs.
 * TODO: remove in Lighthouse 9+ once PubAds (and others?) are updated.
 * @see https://github.com/GoogleChrome/lighthouse/issues/11950
 * @param {ReadonlyArray<Smokehouse.BackCompatTestDefn>} allTestDefns
 * @return {Array<Smokehouse.TestDfn>}
 */
function updateTestDefnFormat(allTestDefns) {
  const expandedTestDefns = allTestDefns.map(testDefn => {
    if (Array.isArray(testDefn.expectations)) {
      // Create a testDefn per expectation.
      return testDefn.expectations.map((expectations, index) => {
        return {
          ...testDefn,
          id: `${testDefn.id}-${index}`,
          expectations,
        };
      });
    } else {
      // New object to make tsc happy.
      return {
        ...testDefn,
        expectations: testDefn.expectations,
      };
    }
  });

  return expandedTestDefns.flat();
}

export {
  updateTestDefnFormat,
};
