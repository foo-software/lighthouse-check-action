/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import FlowResult_ from '../../types/lhr/flow-result';
import * as Settings from '../../types/lhr/settings';

// Import to augment querySelector/querySelectorAll with stricter type checking.
import '../../types/query-selector';
import '../../report/types/html-renderer';

declare global {
  interface Window {
    __LIGHTHOUSE_FLOW_JSON__: FlowResult_;
    __initLighthouseFlowReport__: () => void;
  }

  // Expose global types in LH namespace.
  module LH {
    export type ConfigSettings = Settings.ConfigSettings;

    export interface FlowReportOptions {
      getReportHtml?: (flowResult: FlowResult_) => string;
      saveAsGist?: (flowResult: FlowResult_) => void;
    }

    export interface HashState {
      currentLhr: Result;
      index: number;
      anchor: string|null;
    }

    export import FlowResult = FlowResult_;
  }
}

export {};
