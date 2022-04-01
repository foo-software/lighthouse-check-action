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
import Fetcher = require('../lighthouse-core/gather/fetcher');
import ArbitraryEqualityMap = require('../lighthouse-core/lib/arbitrary-equality-map');

import {Artifacts, BaseArtifacts, FRBaseArtifacts, GathererArtifacts} from './artifacts';
import Config from './config';
import {IcuMessage} from './lhr/i18n';
import Result from './lhr/lhr';
import Protocol from './protocol';
import {Trace, DevtoolsLog} from './artifacts';

declare module Gatherer {
  /** The Lighthouse wrapper around a raw CDP session. */
  interface FRProtocolSession {
    setTargetInfo(targetInfo: LH.Crdp.Target.TargetInfo): void;
    hasNextProtocolTimeout(): boolean;
    getNextProtocolTimeout(): number;
    setNextProtocolTimeout(ms: number): void;
    on<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
    once<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
    addProtocolMessageListener(callback: (payload: Protocol.RawEventMessage) => void): void
    removeProtocolMessageListener(callback: (payload: Protocol.RawEventMessage) => void): void
    addSessionAttachedListener(callback: (session: FRProtocolSession) => void): void
    removeSessionAttachedListener(callback: (session: FRProtocolSession) => void): void
    off<TEvent extends keyof LH.CrdpEvents>(event: TEvent, callback: (...args: LH.CrdpEvents[TEvent]) => void): void;
    sendCommand<TMethod extends keyof LH.CrdpCommands>(method: TMethod, ...params: LH.CrdpCommands[TMethod]['paramsType']): Promise<LH.CrdpCommands[TMethod]['returnType']>;
    dispose(): Promise<void>;
  }

  /** The limited driver interface shared between pre and post Fraggle Rock Lighthouse. */
  interface FRTransitionalDriver {
    defaultSession: FRProtocolSession;
    executionContext: ExecutionContext;
    fetcher: Fetcher;
  }

  /** The limited context interface shared between pre and post Fraggle Rock Lighthouse. */
  interface FRTransitionalContext<TDependencies extends DependencyKey = DefaultDependenciesKey> {
    /** The URL of the page that is currently active. Might be `about:blank` in the before phases */
    url: string;
    /** The gather mode Lighthouse is currently in. */
    gatherMode: GatherMode;
    /** The connection to the page being analyzed. */
    driver: FRTransitionalDriver;
    /** The set of base artifacts that are always collected. */
    baseArtifacts: FRBaseArtifacts;
    /** The cached results of computed artifacts. */
    computedCache: Map<string, ArbitraryEqualityMap>;
    /** The set of available dependencies requested by the current gatherer. */
    dependencies: Pick<GathererArtifacts, Exclude<TDependencies, DefaultDependenciesKey>>;
    /** The settings used for gathering. */
    settings: Config.Settings;
  }

  interface FRGatherResult {
    artifacts: Artifacts;
    runnerOptions: {
      config: Config.FRConfig;
      computedCache: Map<string, ArbitraryEqualityMap>
    }
  }

  interface PassContext {
    gatherMode: 'navigation';
    /** The url of the currently loaded page. If the main document redirects, this will be updated to keep track. */
    url: string;
    driver: Driver;
    passConfig: Config.Pass
    settings: Config.Settings;
    computedCache: Map<string, ArbitraryEqualityMap>
    /** Gatherers can push to this array to add top-level warnings to the LHR. */
    LighthouseRunWarnings: Array<string | IcuMessage>;
    baseArtifacts: BaseArtifacts;
  }

  interface LoadData {
    networkRecords: Array<Artifacts.NetworkRequest>;
    devtoolsLog: DevtoolsLog;
    trace?: Trace;
  }

  type PhaseResultNonPromise = void | GathererArtifacts[keyof GathererArtifacts];
  type PhaseResult = PhaseResultNonPromise | Promise<PhaseResultNonPromise>

  type GatherMode = Result.GatherMode;

  type DefaultDependenciesKey = '__none__'
  type DependencyKey = keyof GathererArtifacts | DefaultDependenciesKey

  interface GathererMetaNoDependencies {
    /**
     * Used to validate the dependency requirements of gatherers.
     * If this property is not defined, this gatherer cannot be the dependency of another. */
    symbol?: Symbol;
    /** Lists the modes in which this gatherer can run. */
    supportedModes: Array<GatherMode>;
  }

  interface GathererMetaWithDependencies<
    TDependencies extends Exclude<DependencyKey, DefaultDependenciesKey>
  > extends GathererMetaNoDependencies {
    /**
     * The set of required dependencies that this gatherer needs before it can compute its results.
     */
    dependencies: Record<TDependencies, Symbol>;
  }

  type GathererMeta<TDependencies extends DependencyKey = DefaultDependenciesKey> =
    [TDependencies] extends [DefaultDependenciesKey] ?
      GathererMetaNoDependencies :
      GathererMetaWithDependencies<Exclude<TDependencies, DefaultDependenciesKey>>;

  interface GathererInstance {
    name: keyof GathererArtifacts;
    beforePass(context: Gatherer.PassContext): PhaseResult;
    pass(context: Gatherer.PassContext): PhaseResult;
    afterPass(context: Gatherer.PassContext, loadData: Gatherer.LoadData): PhaseResult;
  }

  type FRGatherPhase = keyof Omit<Gatherer.FRGathererInstance, 'name'|'meta'>

  interface FRGathererInstance<TDependencies extends DependencyKey = DefaultDependenciesKey> {
    name: keyof GathererArtifacts; // temporary COMPAT measure until artifact config support is available
    meta: GathererMeta<TDependencies>;
    startInstrumentation(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
    startSensitiveInstrumentation(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
    stopSensitiveInstrumentation(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
    stopInstrumentation(context: FRTransitionalContext<DefaultDependenciesKey>): Promise<void>|void;
    getArtifact(context: FRTransitionalContext<TDependencies>): PhaseResult;
  }

  type FRGathererInstanceExpander<TDependencies extends Gatherer.DependencyKey> =
    // Lack of brackets intentional here to convert to the union of all individual dependencies.
    TDependencies extends Gatherer.DefaultDependenciesKey ?
      FRGathererInstance<Gatherer.DefaultDependenciesKey> :
      FRGathererInstance<Exclude<TDependencies, DefaultDependenciesKey>>
  type AnyFRGathererInstance = FRGathererInstanceExpander<Gatherer.DependencyKey>

  namespace Simulation {
    type GraphNode = import('../lighthouse-core/lib/dependency-graph/base-node').Node;
    type GraphNetworkNode = _NetworkNode;
    type GraphCPUNode = _CPUNode;
    type Simulator = _Simulator;

    interface MetricCoefficients {
      intercept: number;
      optimistic: number;
      pessimistic: number;
    }

    interface Options {
      rtt?: number;
      throughput?: number;
      observedThroughput: number;
      maximumConcurrentRequests?: number;
      cpuSlowdownMultiplier?: number;
      layoutTaskMultiplier?: number;
      additionalRttByOrigin?: Map<string, number>;
      serverResponseTimeByOrigin?: Map<string, number>;
    }

    interface NodeTiming {
      startTime: number;
      endTime: number;
      duration: number;
    }

    interface Result {
      timeInMs: number;
      nodeTimings: Map<GraphNode, NodeTiming>;
    }
  }
}

export default Gatherer;
