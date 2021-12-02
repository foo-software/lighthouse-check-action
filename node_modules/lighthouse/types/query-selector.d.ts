/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Stricter querySelector/querySelectorAll using typed-query-selector.
 */

import {ParseSelectorToTagNames} from 'typed-query-selector/parser';

/** Merge properties of the types in union `T`. Where properties overlap, property types becomes the union of the two (or more) possible types. */
type MergeTypes<T> = {
  [K in (T extends unknown ? keyof T : never)]: T extends Record<K, infer U> ? U : never;
};

// Helper types for strict querySelector/querySelectorAll that includes the overlap
// between HTML and SVG node names (<a>, <script>, etc).
// see https://github.com/GoogleChrome/lighthouse/issues/12011
type HtmlAndSvgElementTagNameMap = MergeTypes<HTMLElementTagNameMap|SVGElementTagNameMap> & {
  // Fall back to Element (base of HTMLElement and SVGElement) if no specific tag name matches.
  [id: string]: Element;
};
type QuerySelectorParse<I extends string> = ParseSelectorToTagNames<I> extends infer TagNames ?
  TagNames extends Array<string> ?
    HtmlAndSvgElementTagNameMap[TagNames[number]] :
    Element: // Fall back for queries typed-query-selector fails to parse, e.g. `'[alt], [aria-label]'`.
  never;

declare global {
  interface ParentNode {
    querySelector<S extends string>(selector: S): QuerySelectorParse<S> | null;
    querySelectorAll<S extends string>(selector: S): NodeListOf<QuerySelectorParse<S>>;
  }
}
