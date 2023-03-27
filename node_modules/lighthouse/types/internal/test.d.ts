/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

declare global {
  var expect: import('expect').Expect;
  type Mock<T, Y> = import('jest-mock').Mock<T, Y>;
}

declare module 'expect' {
  interface Matchers<R extends void | Promise<void>, T={}> {
    /**
     * This ensures that a value matches the most recent snapshot with property matchers.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    // tslint:disable-next-line: no-unnecessary-generics
    toMatchSnapshot<U extends { [P in keyof T]: any }>(propertyMatchers: Partial<U>, snapshotName?: string): R;
    /**
     * This ensures that a value matches the most recent snapshot.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    toMatchSnapshot(snapshotName?: string): R;
    /**
     * This ensures that a value matches the most recent snapshot with property matchers.
     * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    // tslint:disable-next-line: no-unnecessary-generics
    toMatchInlineSnapshot<U extends { [P in keyof T]: any }>(propertyMatchers: Partial<U>, snapshot?: string): R;

    // The following are custom matchers defined in expect-setup.js

    /**
     * Jest's `toBeCloseTo()` exposed as an asymmetric matcher. This allows
     * approximate numeric testing within matchers like `toMatchObject()`.
     * The default for `numDigits` is 2.
     */
    toBeApproximately(expected: number, numDigits?: number): R;
    /**
     * Asserts that an inspectable promise created by makePromiseInspectable is currently resolved or rejected.
     * This is useful for situations where we want to test that we are actually waiting for a particular event.
     */
    toBeDone: (failureMessage?: string) => R;
    /**
     * Asserts that an i18n string (using en-US) matches an expected pattern.
     */
    toBeDisplayString: (pattern: RegExp | string) => R;
  }
}

export {};
