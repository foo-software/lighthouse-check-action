/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

declare global {
  module LH.Treemap {
    interface Options {
      lhr: LH.Result;
    }

    interface RootNodeContainer {
      /** Arbitrary name identifier. Usually a script url. */
      name: string;
      node: Node;
    }

    interface Node {
      /** Arbitrary name identifier. Usually a path component from a source map. */
      name: string;
      resourceBytes: number;
      unusedBytes?: number;
      /** If present, this module is a duplicate. String is normalized source path. See ModuleDuplication.normalizeSource */
      duplicatedNormalizedModuleName?: string;
      children?: Node[];
    }    
  }
}

// empty export to keep file a module
export {}
