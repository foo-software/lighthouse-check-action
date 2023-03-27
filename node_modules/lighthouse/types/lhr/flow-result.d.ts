/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import Result from './lhr.js';

declare module FlowResult {
  interface Step {
    /** Lighthouse report for this flow step. */
    lhr: Result;
    /** Display name of this flow step. */
    name: string;
  }
}

/**
 * The full output of a Lighthouse flow. Includes a series of Lighthouse runs.
 */
interface FlowResult {
  /** Ordered list of flow steps, each corresponding to a navigation, timespan, or snapshot. */
  steps: FlowResult.Step[];
  /** Display name of this user flow. */
  name: string;
}

export default FlowResult;
