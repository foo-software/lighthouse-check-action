/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import AuditDetails from '../../types/lhr/audit-details';
import {FormattedIcu as FormattedIcu_, IcuMessage as IcuMessage_} from '../../types/lhr/i18n';
import LHResult from '../../types/lhr/lhr';
import ReportResult_ from './report-result';
import Renderer_ from './report-renderer';
import * as Settings from '../../types/lhr/settings';
import Treemap_ from '../../types/lhr/treemap';

declare global {
  // Expose global types in LH namespace.
  module LH {
    export import Result = LHResult;
    export import ReportResult = ReportResult_;
    export import Renderer = Renderer_;
    export import Locale = Settings.Locale;
    export type IcuMessage = IcuMessage_;
    export type FormattedIcu<T> = FormattedIcu_<T>;

    module Audit {
      export import Details = AuditDetails;
    }

    export import Treemap = Treemap_;
  }
}
