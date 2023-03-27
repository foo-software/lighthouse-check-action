/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {UserFlow as UserFlow_} from '../core/user-flow.js';
import Config from './config.js';
import {Flags} from './externs.js';
import {Artifacts} from './artifacts.js';

declare module UserFlow {
  export interface FlowArtifacts {
    gatherSteps: GatherStep[];
    name?: string;
  }

  export interface Options {
    /** Config to use for each flow step. */
    config?: Config;
    /** Base flags to use for each flow step. Step specific flags will override these flags. */
    flags?: Flags;
    /** Display name for this user flow. */
    name?: string;
  }

  export interface StepFlags extends Flags {
    /** Display name for this flow step. */
    name?: string;
  }

  export interface GatherStep {
    artifacts: Artifacts;
    flags?: StepFlags;
  }
}

type UserFlow = InstanceType<typeof UserFlow_>;

export default UserFlow;
