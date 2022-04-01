/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import ArbitraryEqualityMap_ = require('../lighthouse-core/lib/arbitrary-equality-map.js');
import * as Artifacts_ from './artifacts';
import Audit_ from './audit';
import Budget_ from './lhr/budget';
import Config_ from './config';
import _Crdp from 'devtools-protocol/types/protocol';
import _CrdpMappings from 'devtools-protocol/types/protocol-mapping';
import * as Externs from './externs';
import Gatherer_ from './gatherer';
import * as I18n from './lhr/i18n';
import LHError = require('../lighthouse-core/lib/lh-error.js');
import LHResult from './lhr/lhr';
import FlowResult_ from './lhr/flow';
import Protocol_ from './protocol';
import * as Settings from './lhr/settings';
import StructuredData_ from './structured-data';
import Treemap_ from './lhr/treemap';
import UserFlow_ from './user-flow';

// Construct hierarchy of global types under the LH namespace.
declare global {
  module LH {
    export type ArbitraryEqualityMap = ArbitraryEqualityMap_;
    export type NavigationRequestor = string | (() => Promise<void> | void);

    // artifacts.d.ts
    export import Artifacts = Artifacts_.Artifacts;
    export import BaseArtifacts = Artifacts_.BaseArtifacts;
    export import FRArtifacts = Artifacts_.FRArtifacts;
    export import FRBaseArtifacts = Artifacts_.FRBaseArtifacts;
    export import GathererArtifacts = Artifacts_.GathererArtifacts;
    export import DevtoolsLog = Artifacts_.DevtoolsLog;
    export import Trace = Artifacts_.Trace;
    export import TraceCpuProfile = Artifacts_.TraceCpuProfile;
    export import TraceEvent = Artifacts_.TraceEvent;

    export import Audit = Audit_;
    export import Budget = Budget_;
    export import Config = Config_;
    export import Crdp = _Crdp;
    export import CrdpEvents = _CrdpMappings.Events;
    export import CrdpCommands = _CrdpMappings.Commands;

    export import UserFlow = UserFlow_;

    // externs.d.ts
    export import Flags = Externs.Flags;
    export import CliFlags = Externs.CliFlags;
    export import RunnerResult = Externs.RunnerResult;
    export import DevToolsJsonTarget = Externs.DevToolsJsonTarget;

    export import Gatherer = Gatherer_;
    export import LighthouseError = LHError;
    export import Result = LHResult;
    export import FlowResult = FlowResult_;

    // i18n.d.ts.
    export import IcuMessage = I18n.IcuMessage;
    export import RawIcu = I18n.RawIcu;
    export import FormattedIcu = I18n.FormattedIcu;

    export import Protocol = Protocol_;

    // lhr/settings.d.ts
    export import Locale = Settings.Locale;
    export import ThrottlingSettings = Settings.ThrottlingSettings;
    export import ScreenEmulationSettings = Settings.ScreenEmulationSettings;
    export import SharedFlagsSettings = Settings.SharedFlagsSettings;
    export import OutputMode = Settings.OutputMode;
    export import PrecomputedLanternData = Settings.PrecomputedLanternData;

    export import StructuredData = StructuredData_;
    export import Treemap = Treemap_;
  }
}
