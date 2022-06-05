/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Artifacts} from './artifacts';
import Config from './config';
import LHResult from './lhr/lhr';

declare global {
  module Smokehouse {
    interface ExpectedLHR {
      audits: Record<string, any>;
      requestedUrl: string;
      finalUrl: string | RegExp;
      userAgent?: string | RegExp;
      runWarnings?: Array<string|RegExp> | {length: string | number};
      runtimeError?: {
        code?: any;
        message?: any;
      };
      timing?: {
        entries?: any
      }
    }

    export type ExpectedRunnerResult = {
      lhr: ExpectedLHR,
      artifacts?: Partial<Record<keyof Artifacts|'_maxChromiumVersion'|'_minChromiumVersion', any>>
      networkRequests?: {length: number, _legacyOnly?: boolean, _fraggleRockOnly?: boolean};
    }

    export interface TestDfn {
      /** Identification of test. Can be used for group selection (e.g. `yarn smoke pwa` will run all tests with `id.includes('pwa')`). */
      id: string;
      /** Expected test results. */
      expectations: ExpectedRunnerResult;
      /** An optional custom config. If none is present, uses the default Lighthouse config. */
      config?: Config.Json;
      /** If test is performance sensitive, set to true so that it won't be run parallel to other tests. */
      runSerially?: boolean;
    }

    /**
     * A TestDefn type that's compatible with the old array of `expectations` type and the current TestDefn type.
     * COMPAT: remove when no long needed.
     * @deprecated
     */
    export type BackCompatTestDefn =
      Omit<Smokehouse.TestDfn, 'expectations'> &
      {expectations: Smokehouse.ExpectedRunnerResult | Array<Smokehouse.ExpectedRunnerResult>}

    export type LighthouseRunner =
      {runnerName?: string} & ((url: string, configJson?: Config.Json, runnerOptions?: {isDebug?: boolean; useFraggleRock?: boolean}) => Promise<{lhr: LHResult, artifacts: Artifacts, log: string}>);

    export interface SmokehouseOptions {
      /** If true, performs extra logging from the test runs. */
      isDebug?: boolean;
      /** If true, uses the new Fraggle Rock runner. */
      useFraggleRock?: boolean;
      /** Manually set the number of jobs to run at once. `1` runs all tests serially. */
      jobs?: number;
      /** The number of times to retry failing tests before accepting. Defaults to 0. */
      retries?: number;
      /** A function that runs Lighthouse with the given options. Defaults to running Lighthouse via the CLI. */
      lighthouseRunner?: LighthouseRunner;
      /** A function that gets a list of URLs requested to the server since the last fetch. */
      takeNetworkRequestUrls?: () => string[];
    }

    export interface SmokehouseLibOptions extends SmokehouseOptions {
      urlFilterRegex?: RegExp;
      skip?: (test: TestDfn, expectation: ExpectedRunnerResult) => string | false;
      modify?: (test: TestDfn, expectation: ExpectedRunnerResult) => void;
      /** String of form `shardNumber/shardTotal`, e.g. `'1/4'`. */
      shardArg: string | undefined;
    }
  }
}
