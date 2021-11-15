/**
 * @license Copyright 2018 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Result as AuditResult}  from '../../types/lhr/audit-result';
import LHResult from '../../types/lhr/lhr';

/**
 * During report generation, the LHR object is transformed a bit for convenience
 * Primarily, the auditResult is added as .result onto the auditRef. We're lazy sometimes. It'll be removed in due time.
 */
interface ReportResult extends LHResult {
  categories: Record<string, ReportResult.Category>;
}

declare module ReportResult {
  interface Category extends LHResult.Category {
    auditRefs: Array<AuditRef>;
  }

  interface AuditRef extends LHResult.AuditRef {
    result: AuditResult;
    stackPacks?: StackPackDescription[];
    relevantMetrics?: ReportResult.AuditRef[];
  }

  interface StackPackDescription {
      /** The title of the stack pack. */
    title: string;
    /** A base64 data url to be used as the stack pack's icon. */
    iconDataURL: string;
    /** The stack-specific description for this audit. */
    description: string;
  }
}

export default ReportResult;
