/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import _NetworkNode = require('../lighthouse-core/lib/dependency-graph/network-node');
import _CPUNode = require('../lighthouse-core/lib/dependency-graph/cpu-node');
import _Simulator = require('../lighthouse-core/lib/dependency-graph/simulator/simulator');
import Driver = require('../lighthouse-core/gather/driver');
import ExecutionContext = require('../lighthouse-core/gather/driver/execution-context');

declare global {
  module LH.Gatherer {
    /** The Lighthouse wrapper around a raw CDP session. */
    export interface FRProtocolSession {
      hasNextProtocolTimeout(): boolean;
      getNextProtocolTimeout(): number;
      setNextProtocolTimeout(ms: number): void;
      on<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
      once<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
      addProtocolMessageListener(callback: (payload: LH.Protocol.RawEventMessage) => void): void
      removeProtocolMessageListener(callback: (payload: LH.Protocol.RawEventMessage) => void): void
      off<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
      sendCommand<TMethod extends keyof LH.CrdpCommands>(method: TMethod, ...params: LH.CrdpCommands[TMethod]['paramsType']): Promise<LH.CrdpCommands[TMethod]['returnType']>;
    }

    /** The limited driver interface shared between pre and post Fraggle Rock Lighthouse. */
    export interface FRTransitionalDriver {
      defaultSession: FRProtocolSession;
      executionContext: ExecutionContext;
    }

    /** The limited context interface shared between pre and post Fraggle Rock Lighthouse. */
    export interface FRTransitionalContext<TDependencies extends DependencyKey = DefaultDependenciesKey> {
      /** The URL of the page that is currently active. Might be `about:blank` in the before phases */
      url: string;
      /** The gather mode Lighthouse is currently in. */
      gatherMode: GatherMode;
      /** The connection to the page being analyzed. */
      driver: FRTransitionalDriver;
      /** The set of available dependencies requested by the current gatherer. */
      dependencies: TDependencies extends DefaultDependenciesKey ?
        {} :
        Pick<GathererArtifacts, Exclude<TDependencies, DefaultDependenciesKey>>;
    }

    export interface PassContext {
      gatherMode: 'navigation';
      /** The url of the currently loaded page. If the main document redirects, this will be updated to keep track. */
      url: string;
      driver: Driver;
      passConfig: Config.Pass
      settings: Config.Settings;
      /** Gatherers can push to this array to add top-level warnings to the LHR. */
      LighthouseRunWarnings: Array<string | IcuMessage>;
      baseArtifacts: BaseArtifacts;
    }

    export interface LoadData {
      networkRecords: Array<Artifacts.NetworkRequest>;
      devtoolsLog: DevtoolsLog;
      trace?: Trace;
    }

    export type PhaseArtifact = |
        LH.GathererArtifacts[keyof LH.GathererArtifacts] |
      LH.Artifacts['devtoolsLogs'] |
      LH.Artifacts['traces'] |
      LH.Artifacts['WebAppManifest'] |
      LH.Artifacts['InstallabilityErrors'];
    export type PhaseResultNonPromise = void|PhaseArtifact
    export type PhaseResult = PhaseResultNonPromise | Promise<PhaseResultNonPromise>

    export type GatherMode = 'snapshot'|'timespan'|'navigation';

    export type DefaultDependenciesKey = '__none__'
    export type DependencyKey = keyof GathererArtifacts | DefaultDependenciesKey

    interface GathererMetaNoDependencies {
      /**
       * Used to validate the dependency requirements of gatherers.
       * If this property is not defined, this gatherer cannot be the dependency of another. */
      symbol?: Symbol;
      /** Lists the modes in which this gatherer can run. */
      supportedModes: Array<GatherMode>;
    }

    interface GathererMetaWithDependencies<
      TDependencies extends DependencyKey = DefaultDependenciesKey
    > extends GathererMetaNoDependencies {
      /**
       * The set of required dependencies that this gatherer needs before it can compute its results.
       */
      dependencies: Record<TDependencies, Symbol>;
    }

    export type GathererMeta<TDependencies extends DependencyKey = DefaultDependenciesKey> =
      TDependencies extends DefaultDependenciesKey ?
        GathererMetaNoDependencies :
        GathererMetaWithDependencies<TDependencies>;

    export interface GathererInstance {
      name: keyof LH.GathererArtifacts;
      beforePass(context: LH.Gatherer.PassContext): PhaseResult;
      pass(context: LH.Gatherer.PassContext): PhaseResult;
      afterPass(context: LH.Gatherer.PassContext, loadData: LH.Gatherer.LoadData): PhaseResult;
    }

    export interface FRGathererInstance<TDependencies extends DependencyKey = DefaultDependenciesKey> {
      name: keyof LH.GathererArtifacts; // temporary COMPAT measure until artifact config support is available
      meta: GathererMeta<TDependencies>;
      beforeNavigation(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
      beforeTimespan(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
      afterTimespan(context: FRTransitionalContext<TDependencies>): PhaseResult;
      afterNavigation(context: FRTransitionalContext<TDependencies>): PhaseResult;
      snapshot(context: FRTransitionalContext<TDependencies>): PhaseResult;
    }

    namespace Simulation {
      export type GraphNode = import('../lighthouse-core/lib/dependency-graph/base-node').Node;
      export type GraphNetworkNode = _NetworkNode;
      export type GraphCPUNode = _CPUNode;
      export type Simulator = _Simulator;

      export interface MetricCoefficients {
        intercept: number;
        optimistic: number;
        pessimistic: number;
      }

      export interface Options {
        rtt?: number;
        throughput?: number;
        maximumConcurrentRequests?: number;
        cpuSlowdownMultiplier?: number;
        layoutTaskMultiplier?: number;
        additionalRttByOrigin?: Map<string, number>;
        serverResponseTimeByOrigin?: Map<string, number>;
      }

      export interface NodeTiming {
        startTime: number;
        endTime: number;
        duration: number;
      }

      export interface Result {
        timeInMs: number;
        nodeTimings: Map<GraphNode, NodeTiming>;
      }
    }
  }
}

// empty export to keep file a module
export {};
