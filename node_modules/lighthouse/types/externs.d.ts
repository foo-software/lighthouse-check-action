/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Artifacts} from './artifacts.js';
import LHResult from './lhr/lhr.js';
import {SharedFlagsSettings, OutputMode} from './lhr/settings.js';

/**
 * Extends the flags in SharedFlagsSettings with flags used to configure the
 * Lighthouse module but will not end up in the Config settings.
 */
export interface Flags extends SharedFlagsSettings {
  /** The port to use for the debugging protocol, if manually connecting. */
  port?: number;
  /** The hostname to use for the debugging protocol, if manually connecting. */
  hostname?: string;
  /** The level of logging to enable. */
  logLevel?: 'silent'|'error'|'info'|'verbose';
  /** The path to the config JSON. */
  configPath?: string;
  /** Run the specified plugins. */
  plugins?: string[];
}

/**
 * Extends the flags accepted by the Lighthouse module with additional flags
 * used just for controlling the CLI.
 */
export interface CliFlags extends Flags {
  _: string[];
  chromeIgnoreDefaultFlags: boolean;
  chromeFlags: string | string[];
  /** Output path for the generated results. */
  outputPath?: string;
  /** Flag to save the trace contents and screenshots to disk. */
  saveAssets: boolean;
  /** Flag to open the report immediately. */
  view: boolean;
  /** Flag to enable error reporting. */
  enableErrorReporting?: boolean;
  /** Flag to print a list of all audits + categories. */
  listAllAudits: boolean;
  /** Flag to print a list of all supported locales. */
  listLocales: boolean;
  /** Flag to print a list of all required trace categories. */
  listTraceCategories: boolean;
  /** A preset audit of selected audit categories to run. */
  preset?: 'experimental'|'perf'|'desktop';
  /** A flag to enable logLevel 'verbose'. */
  verbose: boolean;
  /** A flag to enable logLevel 'silent'. */
  quiet: boolean;
  /** Use the legacy navigation runner to gather CLI results. */
  legacyNavigation: boolean;
  /** Path to the file where precomputed lantern data should be read from. */
  precomputedLanternDataPath?: string;
  /** Path to the file where precomputed lantern data should be written to. */
  lanternDataOutputPath?: string;
  /** Path to the budget.json file for LightWallet. */
  budgetPath?: string | null;

  // The following are given defaults in cli-flags, so are not optional like in Flags or SharedFlagsSettings.
  output: OutputMode[];
  port: number;
  hostname: string;
}

export interface RunnerResult {
  lhr: LHResult;
  report: string|string[];
  /**
   * @internal
   * WARNING: Some artifacts are not guaranteed to be stable. The structure is subject to change in minor releases.
   */
  artifacts: Artifacts;
}

export interface DevToolsJsonTarget {
  description: string;
  devtoolsFrontendUrl: string;
  id: string;
  title: string;
  type: string;
  url: string;
  webSocketDebuggerUrl: string;
}
