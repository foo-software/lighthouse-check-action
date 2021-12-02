/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {Result as AuditResult} from './audit-result';
import {Locale} from './settings';

declare module Treemap {
  interface Options {
    lhr: {
      requestedUrl: string;
      finalUrl: string;
      audits: {
        'script-treemap-data': AuditResult;
      };
      configSettings: {
        locale: Locale;
      }
    }
  }

  type NodePath = string[];

  interface Selector {
    type: 'depthOneNode' | 'group';
    value: string;
  }

  interface Highlight {
    path: NodePath;
    /** If not set, will use the color based on the d1Node. */
    color?: string;
  }

  interface ViewMode {
    id: 'all' | 'unused-bytes' | 'duplicate-modules';
    label: string;
    subLabel: string;
    enabled: boolean;
    partitionBy?: 'resourceBytes' | 'unusedBytes';
    highlights?: Highlight[];
  }

  interface Node {
    /** Could be a url, a path component from a source map, or an arbitrary string. */
    name: string;
    resourceBytes: number;
    unusedBytes?: number;
    /** If present, this module is a duplicate. String is normalized source path. See ModuleDuplication.normalizeSource */
    duplicatedNormalizedModuleName?: string;
    children?: Node[];
  }
}

export default Treemap;
