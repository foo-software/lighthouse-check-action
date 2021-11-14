/* eslint-disable strict */
/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import Audit = require('../lighthouse-core/audits/audit.js');

interface ClassOf<T> {
  new (): T;
}

declare global {
  module LH {
    module Config {
      /**
       * The pre-normalization Lighthouse Config format.
       */
      export interface Json {
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
      export interface Config {
        settings: Settings;
        passes: Pass[] | null;
        audits: AuditDefn[] | null;
        categories: Record<string, Category> | null;
        groups: Record<string, Group> | null;
      }

      /**
       * The normalized and fully resolved Fraggle Rock config.
       */
      export interface FRConfig {
        settings: Settings;
        artifacts: ArtifactDefn[] | null;
        navigations: NavigationDefn[] | null;
        audits: AuditDefn[] | null;
        categories: Record<string, Category> | null;
        groups: Record<string, Group> | null;
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

      export interface PassJson extends SharedPassNavigationJson {
        /** The identifier for the pass. Config extension will deduplicate passes with the same passName. */
        passName: string;
        /** Whether a trace and devtoolsLog should be recorded for the pass. */
        recordTrace?: boolean;
        /** Whether throttling settings should be used for the pass. */
        useThrottling?: boolean;
        /** The array of gatherers to run during the pass. */
        gatherers?: GathererJson[];
      }

      export interface NavigationJson extends SharedPassNavigationJson {
        /** The identifier for the navigation. Config extension will deduplicate navigations with the same id. */
        id: string;
        /** Whether throttling settings should be skipped for the pass. */
        disableThrottling?: boolean;
        /** Whether storage clearing (service workers, cache storage) should be skipped for the pass. A run-wide setting of `true` takes precedence over this value. */
        disableStorageReset?: boolean;
        /** The array of artifacts to collect during the navigation. */
        artifacts?: Array<string>;
      }

      export interface ArtifactJson {
        id: string;
        gatherer: FRGathererJson;
      }

      export type GathererJson = {
        path: string;
        options?: {};
      } | {
        implementation: ClassOf<Gatherer.GathererInstance>;
        options?: {};
      } | {
        instance: Gatherer.GathererInstance;
        options?: {};
      } | Gatherer.GathererInstance | ClassOf<Gatherer.GathererInstance> | string;

      export type FRGathererJson = string | {instance: Gatherer.FRGathererInstance}

      export interface CategoryJson {
        title: string | IcuMessage;
        auditRefs: AuditRefJson[];
        description?: string | IcuMessage;
        manualDescription?: string | IcuMessage;
      }

      export interface GroupJson {
        title: string | IcuMessage;
        description?: string | IcuMessage;
      }

      export type AuditJson = {
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
      export interface AuditRefJson {
        id: string;
        weight: number;
        group?: string;
        acronym?: string;
        relevantAudits?: string[];
      }

      export interface Settings extends Required<SharedFlagsSettings> {
        throttling: Required<ThrottlingSettings>;
        screenEmulation: ScreenEmulationSettings;
      }

      export interface Pass extends Required<PassJson> {
        gatherers: GathererDefn[];
      }

      export interface NavigationDefn extends Omit<Required<NavigationJson>, 'artifacts'> {
        artifacts: ArtifactDefn[];
      }

      export interface ArtifactDefn<TDependencies extends Gatherer.DependencyKey = Gatherer.DependencyKey> {
        id: string;
        gatherer: FRGathererDefn<TDependencies>;
        dependencies?: TDependencies extends Gatherer.DefaultDependenciesKey ?
          undefined :
          Record<Exclude<TDependencies, Gatherer.DefaultDependenciesKey>, {id: string}>;
      }

      export interface FRGathererDefn<TDependencies extends Gatherer.DependencyKey = Gatherer.DependencyKey> {
        implementation?: ClassOf<Gatherer.FRGathererInstance<TDependencies>>;
        instance: Gatherer.FRGathererInstance<TDependencies>;
        path?: string;
      }

      export interface GathererDefn {
        implementation?: ClassOf<Gatherer.GathererInstance>;
        instance: Gatherer.GathererInstance;
        path?: string;
      }

      export interface AuditDefn {
        implementation: typeof Audit;
        path?: string;
        options: {};
      }

      // TODO: For now, these are unchanged from JSON and Result versions. Need to harmonize.
      export interface AuditRef extends AuditRefJson {}
      export interface Category extends CategoryJson {
        auditRefs: AuditRef[];
      }
      export interface Group extends GroupJson {}

      export interface Plugin {
        /** Optionally provide more audits to run in addition to those specified by the base config. */
        audits?: Array<{path: string}>;
        /** Provide a category to display the plugin results in the report. */
        category: LH.Config.Category;
        /** Optionally provide more groups in addition to those specified by the base config. */
        groups?: Record<string, LH.Config.GroupJson>;
      }

      export type MergeOptionsOfItems = <T extends {path?: string, options: Record<string, any>}>(items: T[]) => T[];

      export type Merge = {
        <T extends Record<string, any>, U extends Record<string, any>>(base: T|null|undefined, extension: U, overwriteArrays?: boolean): T & U;
        <T extends Array<any>, U extends Array<any>>(base: T|null|undefined, extension: T, overwriteArrays?: boolean): T & U;
      }
    }
  }
}

// empty export to keep file a module
export {};
