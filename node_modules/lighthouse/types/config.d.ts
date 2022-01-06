/* eslint-disable strict */
/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import Audit = require('../lighthouse-core/audits/audit.js');
import {SharedFlagsSettings, ConfigSettings} from './lhr/settings';
import Gatherer from './gatherer';
import {IcuMessage} from './lhr/i18n';

interface ClassOf<T> {
  new (): T;
}

declare module Config {
  /**
   * The pre-normalization Lighthouse Config format.
   */
  interface Json {
    extends?: 'lighthouse:default' | string;
    settings?: SharedFlagsSettings;
    audits?: Config.AuditJson[] | null;
    categories?: Record<string, CategoryJson> | null;
    groups?: Record<string, Config.GroupJson> | null;
    plugins?: Array<string>;

    // Fraggle Rock Only
    artifacts?: ArtifactJson[] | null;
    navigations?: NavigationJson[] | null;

    // Legacy Only
    passes?: PassJson[] | null;
  }

  /**
   * The normalized and fully resolved config.
   */
  interface Config {
    settings: Settings;
    passes: Pass[] | null;
    audits: AuditDefn[] | null;
    categories: Record<string, Category> | null;
    groups: Record<string, Group> | null;
  }

  /**
   * The normalized and fully resolved Fraggle Rock config.
   */
  interface FRConfig {
    settings: Settings;
    artifacts: AnyArtifactDefn[] | null;
    navigations: NavigationDefn[] | null;
    audits: AuditDefn[] | null;
    categories: Record<string, Category> | null;
    groups: Record<string, Group> | null;
  }

  /**
   * Additional information about the context in which a Fraggle Rock config should be interpreted.
   * This information is typically set by the CLI or other channel integrations.
   */
  interface FRContext {
    gatherMode?: Gatherer.GatherMode;
    configPath?: string;
    settingsOverrides?: SharedFlagsSettings & Pick<LH.Flags, 'plugins'>;
    skipAboutBlank?: boolean;
  }

  interface SharedPassNavigationJson {
    /**
     * Controls the behavior when the navigation fails to complete (due to server error, no FCP, etc).
     * Fatal means Lighthouse will exit immediately and return a runtimeError / non-zero exit code.
     * Warn means a toplevel warning will appear in the report, but the run will complete with success.
     * Ignore means a failure is expected and no action should be taken.
     */
    loadFailureMode?: 'fatal'|'warn'|'ignore';
    /** The number of milliseconds to wait after FCP until the page should be considered loaded. */
    pauseAfterFcpMs?: number;
    /** The number of milliseconds to wait after the load event until the page should be considered loaded. */
    pauseAfterLoadMs?: number;
    /** The number of milliseconds to wait between high priority network requests or 3 simulataneous requests before the page should be considered loaded. */
    networkQuietThresholdMs?: number;
    /** The number of milliseconds to wait between long tasks until the page should be considered loaded. */
    cpuQuietThresholdMs?: number;
    /** Substring patterns of network resources to block during this navigation, '*' wildcards supported though unnecessary as prefix or suffix (due to substring matching). */
    blockedUrlPatterns?: string[];
    /** The URL to use for the "blank" neutral page in between navigations. Defaults to `about:blank`. */
    blankPage?: string;
  }

  interface PassJson extends SharedPassNavigationJson {
    /** The identifier for the pass. Config extension will deduplicate passes with the same passName. */
    passName: string;
    /** Whether a trace and devtoolsLog should be recorded for the pass. */
    recordTrace?: boolean;
    /** Whether throttling settings should be used for the pass. */
    useThrottling?: boolean;
    /** The array of gatherers to run during the pass. */
    gatherers?: GathererJson[];
  }

  interface NavigationJson extends SharedPassNavigationJson {
    /** The identifier for the navigation. Config extension will deduplicate navigations with the same id. */
    id: string;
    /** Whether throttling settings should be skipped for the pass. */
    disableThrottling?: boolean;
    /** Whether storage clearing (service workers, cache storage) should be skipped for the pass. A run-wide setting of `true` takes precedence over this value. */
    disableStorageReset?: boolean;
    /** The array of artifacts to collect during the navigation. */
    artifacts?: Array<string>;
  }

  interface ArtifactJson {
    id: string;
    gatherer: FRGathererJson;
  }

  type GathererJson = {
    path: string;
    options?: {};
  } | {
    implementation: ClassOf<Gatherer.GathererInstance>;
    options?: {};
  } | {
    instance: Gatherer.GathererInstance;
    options?: {};
  } | Gatherer.GathererInstance | ClassOf<Gatherer.GathererInstance> | string;

  type FRGathererJson = string | {instance: Gatherer.FRGathererInstance}

  interface CategoryJson {
    title: string | IcuMessage;
    auditRefs: AuditRefJson[];
    description?: string | IcuMessage;
    manualDescription?: string | IcuMessage;
    supportedModes?:  Gatherer.GatherMode[];
  }

  interface GroupJson {
    title: string | IcuMessage;
    description?: string | IcuMessage;
  }

  type AuditJson = {
    path: string,
    options?: {};
  } | {
    implementation: typeof Audit;
    options?: {};
  } | typeof Audit | string;

  /**
   * Reference to an audit member of a category and how its score should be
   * weighted and how its results grouped with other members.
   */
  interface AuditRefJson {
    id: string;
    weight: number;
    group?: string;
    acronym?: string;
    relevantAudits?: string[];
  }

  type Settings = ConfigSettings;

  interface Pass extends Required<PassJson> {
    gatherers: GathererDefn[];
  }

  interface NavigationDefn extends Omit<Required<NavigationJson>, 'artifacts'> {
    artifacts: AnyArtifactDefn[];
  }

  interface ArtifactDefn<TDependencies extends Gatherer.DependencyKey = Gatherer.DependencyKey> {
    id: string;
    gatherer: FRGathererDefn<TDependencies>;
    dependencies?: TDependencies extends Gatherer.DefaultDependenciesKey ?
      undefined :
      Record<Exclude<TDependencies, Gatherer.DefaultDependenciesKey>, {id: string}>;
  }

  type ArtifactDefnExpander<TDependencies extends Gatherer.DependencyKey> =
    // Lack of brackets intentional here to convert to the union of all individual dependencies.
    TDependencies extends Gatherer.DefaultDependenciesKey ?
      ArtifactDefn<Gatherer.DefaultDependenciesKey> :
      ArtifactDefn<TDependencies>
  type AnyArtifactDefn = ArtifactDefnExpander<Gatherer.DefaultDependenciesKey>|ArtifactDefnExpander<Gatherer.DependencyKey>

  interface FRGathererDefn<TDependencies extends Gatherer.DependencyKey = Gatherer.DependencyKey> {
    implementation?: ClassOf<Gatherer.FRGathererInstance<TDependencies>>;
    instance: Gatherer.FRGathererInstance<TDependencies>;
    path?: string;
  }

  type FRGathererDefnExpander<TDependencies extends Gatherer.DependencyKey> =
    // Lack of brackets intentional here to convert to the union of all individual dependencies.
    TDependencies extends Gatherer.DefaultDependenciesKey ?
      FRGathererDefn<Gatherer.DefaultDependenciesKey> :
      FRGathererDefn<TDependencies>
  type AnyFRGathererDefn = FRGathererDefnExpander<Gatherer.DefaultDependenciesKey>|FRGathererDefnExpander<Gatherer.DependencyKey>

  interface GathererDefn {
    implementation?: ClassOf<Gatherer.GathererInstance>;
    instance: Gatherer.GathererInstance;
    path?: string;
  }

  interface AuditDefn {
    implementation: typeof Audit;
    path?: string;
    options: {};
  }

  // TODO: For now, these are unchanged from JSON and Result versions. Need to harmonize.
  interface AuditRef extends AuditRefJson {}
  interface Category extends CategoryJson {
    auditRefs: AuditRef[];
  }
  interface Group extends GroupJson {}

  interface Plugin {
    /** Optionally provide more audits to run in addition to those specified by the base config. */
    audits?: Array<{path: string}>;
    /** Provide a category to display the plugin results in the report. */
    category: Config.Category;
    /** Optionally provide more groups in addition to those specified by the base config. */
    groups?: Record<string, Config.GroupJson>;
  }

  type Merge = {
    <T extends Record<string, any>, U extends Record<string, any>>(base: T|null|undefined, extension: U, overwriteArrays?: boolean): T & U;
    <T extends Array<any>, U extends Array<any>>(base: T|null|undefined, extension: T, overwriteArrays?: boolean): T & U;
  }
}

export default Config;
