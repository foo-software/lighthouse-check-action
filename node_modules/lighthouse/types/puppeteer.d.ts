/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import * as puppeteerCore from 'puppeteer-core';

/**
 * @fileoverview Lighthouse should be compatible with puppeteer and puppeteer-core even though the types can be slightly different between the two packages.
 * Anytime we want to use a Puppeteer type within Lighthouse, we should pull the union type from here rather than one of the packages directly.
 */

type IfNotAny<T> = [T & 0] extends [1] ? never : T;

declare module Puppeteer {
  // @ts-ignore Puppeteer is an optional dependency. `IfNotAny` will handle the `any` type if it's not installed.
  export type Browser = puppeteerCore.Browser | IfNotAny<import('puppeteer').Browser>;
  // @ts-ignore Puppeteer is an optional dependency. `IfNotAny` will handle the `any` type if it's not installed.
  export type Page = puppeteerCore.Page | IfNotAny<import('puppeteer').Page>;
  // @ts-ignore Puppeteer is an optional dependency. `IfNotAny` will handle the `any` type if it's not installed.
  export type CDPSession = puppeteerCore.CDPSession | IfNotAny<import('puppeteer').CDPSession>;
  // @ts-ignore Puppeteer is an optional dependency. `IfNotAny` will handle the `any` type if it's not installed.
  export type Connection = puppeteerCore.Connection | IfNotAny<import('puppeteer').Connection>;
}

export default Puppeteer;
