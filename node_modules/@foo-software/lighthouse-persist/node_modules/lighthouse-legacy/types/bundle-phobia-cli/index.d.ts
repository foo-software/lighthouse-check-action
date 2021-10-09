/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

declare module 'bundle-phobia-cli' {
  interface Assets {
    gzip: number;
    name: string;
    size: number;
    type: string;
  }

  interface DependencySize {
    approximateSize: number;
    name: string;
  }

  interface BundlePhobiaLibrary {
    assets: Assets[];
    dependencyCount: number;
    dependencySizes: DependencySize[];
    description: string;
    gzip: number;
    hasJSModule: boolean;
    hasJSNext: boolean;
    hasSideEffects: boolean;
    name: string;
    repository: string;
    scoped: boolean;
    size: number;
    version: string;
  }

  export namespace fetchPackageStats {
    export function getPackageVersionList(packageName: string, limit: number): string[];
    export function fetchPackageStats(packageName: string): Array<BundlePhobiaLibrary | undefined>;
  }
}
