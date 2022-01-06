/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Artifacts} from './artifacts';
import LHResult from './lhr/lhr';
import {SharedFlagsSettings, OutputMode} from './lhr/settings';

declare global {
  // Augment Intl to include
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/getCanonicalLocales
  namespace Intl {
    var getCanonicalLocales: (locales?: string | Array<string>) => Array<string>;
  }

  interface Window {
    // Cached native functions/objects for use in case the page overwrites them.
    // See: `executionContext.cacheNativesOnNewDocument`.
    __nativePromise: PromiseConstructor;
    __nativePerformance: Performance;
    __nativeFetch: typeof fetch,
    __nativeURL: typeof URL;
    __ElementMatches: Element['matches'];

    /** Used for monitoring long tasks in the test page. */
    ____lastLongTask?: number;

    /** Used by FullPageScreenshot gatherer. */
    __lighthouseNodesDontTouchOrAllVarianceGoesAway: Map<Element, string>;
    __lighthouseExecutionContextId?: number;

    /** Injected into the page when the `--debug` flag is used. */
    continueLighthouseRun(): void;

    // Not defined in tsc yet: https://github.com/microsoft/TypeScript/issues/40807
    requestIdleCallback(callback: (deadline: {didTimeout: boolean, timeRemaining: () => DOMHighResTimeStamp}) => void, options?: {timeout: number}): number;
  }

  /** Make properties K in T optional. */
  type MakeOptional<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P]
  } & {
    [P in K]+?: T[P]
  }

  /** An object with the keys in the union K mapped to themselves as values. */
  type SelfMap<K extends string> = {
    [P in K]: P;
  };

  /** Make optional all properties on T and any properties on object properties of T. */
  type RecursivePartial<T> =
    // Recurse into arrays and tuples: elements aren't (newly) optional, but any properties they have are.
    T extends (infer U)[] ? RecursivePartial<U>[] :
    // Recurse into objects: properties and any of their properties are optional.
    T extends object ? {[P in keyof T]?: RecursivePartial<T[P]>} :
    // Strings, numbers, etc. (terminal types) end here.
    T;

  /** Recursively makes all properties of T read-only. */
  type Immutable<T> =
    T extends Function ? T :
    T extends Array<infer R> ? ImmutableArray<R> :
    T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
    T extends Set<infer M> ? ImmutableSet<M> :
    T extends object ? ImmutableObject<T> :
    T

  // Intermediate immutable types. Prefer e.g. Immutable<Set<T>> over direct use.
  type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
  type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
  type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
  type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
  };

  /**
   * Exclude void from T
   */
  type NonVoid<T> = T extends void ? never : T;

  /** Remove properties K from T. */
  type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  /** Obtain the type of the first parameter of a function. */
  type FirstParamType<T extends (arg1: any, ...args: any[]) => any> =
    T extends (arg1: infer P, ...args: any[]) => any ? P : never;

  /**
   * If `S` is a kebab-style string `S`, convert to camelCase.
   */
  type KebabToCamelCase<S> =
    S extends `${infer T}-${infer U}` ?
    `${T}${Capitalize<KebabToCamelCase<U>>}` :
    S

  /** Returns T with any kebab-style property names rewritten as camelCase. */
  type CamelCasify<T> = {
    [K in keyof T as KebabToCamelCase<K>]: T[K];
  }
}

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
  /** A flag to print the normalized config for the given config and options, then exit. */
  printConfig: boolean;
  /** Use the new Fraggle Rock navigation runner to gather CLI results. */
  fraggleRock: boolean;
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
