/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview An assertion library for comparing smoke-test expectations
 * against the results actually collected from Lighthouse.
 */

import cloneDeep from 'lodash/cloneDeep.js';
import log from 'lighthouse-logger';

import {LocalConsole} from './lib/local-console.js';
import {chromiumVersionCheck} from './version-check.js';

/**
 * @typedef Difference
 * @property {string} path
 * @property {any} actual
 * @property {any} expected
 */

/**
 * @typedef Comparison
 * @property {string} name
 * @property {any} actual
 * @property {any} expected
 * @property {boolean} equal
 * @property {Difference|null} [diff]
 */

const NUMBER_REGEXP = /(?:\d|\.)+/.source;
const OPS_REGEXP = /<=?|>=?|\+\/-|±/.source;
// An optional number, optional whitespace, an operator, optional whitespace, a number.
const NUMERICAL_EXPECTATION_REGEXP =
  new RegExp(`^(${NUMBER_REGEXP})?\\s*(${OPS_REGEXP})\\s*(${NUMBER_REGEXP})$`);

/**
 * Checks if the actual value matches the expectation. Does not recursively search. This supports
 *    - Greater than/less than operators, e.g. "<100", ">90"
 *    - Regular expressions
 *    - Strict equality
 *    - plus or minus a margin of error, e.g. '10+/-5', '100±10'
 *
 * @param {*} actual
 * @param {*} expected
 * @return {boolean}
 */
function matchesExpectation(actual, expected) {
  if (typeof actual === 'number' && NUMERICAL_EXPECTATION_REGEXP.test(expected)) {
    const parts = expected.match(NUMERICAL_EXPECTATION_REGEXP);
    const [, prefixNumber, operator, postfixNumber] = parts;
    switch (operator) {
      case '>':
        return actual > postfixNumber;
      case '>=':
        return actual >= postfixNumber;
      case '<':
        return actual < postfixNumber;
      case '<=':
        return actual <= postfixNumber;
      case '+/-':
      case '±':
        return Math.abs(actual - prefixNumber) <= postfixNumber;
      default:
        throw new Error(`unexpected operator ${operator}`);
    }
  } else if (typeof actual === 'string' && expected instanceof RegExp && expected.test(actual)) {
    return true;
  } else {
    // Strict equality check, plus NaN equivalence.
    return Object.is(actual, expected);
  }
}

/**
 * Walk down expected result, comparing to actual result. If a difference is found,
 * the path to the difference is returned, along with the expected primitive value
 * and the value actually found at that location. If no difference is found, returns
 * null.
 *
 * Only checks own enumerable properties, not object prototypes, and will loop
 * until the stack is exhausted, so works best with simple objects (e.g. parsed JSON).
 * @param {string} path
 * @param {*} actual
 * @param {*} expected
 * @return {(Difference|null)}
 */
function findDifference(path, actual, expected) {
  if (matchesExpectation(actual, expected)) {
    return null;
  }

  // If they aren't both an object we can't recurse further, so this is the difference.
  if (actual === null || expected === null || typeof actual !== 'object' ||
      typeof expected !== 'object' || expected instanceof RegExp) {
    return {
      path,
      actual,
      expected,
    };
  }

  let inclExclCopy;

  // We only care that all expected's own properties are on actual (and not the other way around).
  // Note an expected `undefined` can match an actual that is either `undefined` or not defined.
  for (const key of Object.keys(expected)) {
    // Bracket numbers, but property names requiring quotes will still be unquoted.
    const keyAccessor = /^\d+$/.test(key) ? `[${key}]` : `.${key}`;
    const keyPath = path + keyAccessor;
    const expectedValue = expected[key];

    if (key === '_includes') {
      inclExclCopy = [...actual];

      if (!Array.isArray(expectedValue)) throw new Error('Array subset must be array');
      if (!Array.isArray(actual)) {
        return {
          path,
          actual: 'Actual value is not an array',
          expected,
        };
      }

      for (const expectedEntry of expectedValue) {
        const matchingIndex =
          inclExclCopy.findIndex(actualEntry =>
            !findDifference(keyPath, actualEntry, expectedEntry));
        if (matchingIndex !== -1) {
          inclExclCopy.splice(matchingIndex, 1);
          continue;
        }

        return {
          path,
          actual: 'Item not found in array',
          expected: expectedEntry,
        };
      }

      continue;
    }

    if (key === '_excludes') {
      // Re-use state from `_includes` check, if there was one.
      /** @type {any[]} */
      const arrToCheckAgainst = inclExclCopy || actual;

      if (!Array.isArray(expectedValue)) throw new Error('Array subset must be array');
      if (!Array.isArray(actual)) continue;

      const expectedExclusions = expectedValue;
      for (const expectedExclusion of expectedExclusions) {
        const matchingIndex = arrToCheckAgainst.findIndex(actualEntry =>
            !findDifference(keyPath, actualEntry, expectedExclusion));
        if (matchingIndex !== -1) {
          return {
            path,
            actual: arrToCheckAgainst[matchingIndex],
            expected: {
              message: 'Expected to not find matching entry via _excludes',
              expectedExclusion,
            },
          };
        }
      }

      continue;
    }

    const actualValue = actual[key];
    const subDifference = findDifference(keyPath, actualValue, expectedValue);

    // Break on first difference found.
    if (subDifference) {
      return subDifference;
    }
  }

  // If the expected value is an array, assert the length as well.
  // This still allows for asserting that the first n elements of an array are specified elements,
  // but requires using an object literal (ex: {0: x, 1: y, 2: z} matches [x, y, z, q, w, e] and
  // {0: x, 1: y, 2: z, length: 5} does not match [x, y, z].
  if (Array.isArray(expected) && actual.length !== expected.length) {
    return {
      path: `${path}.length`,
      actual,
      expected,
    };
  }

  return null;
}

/**
 * @param {string} name – name of the value being asserted on (e.g. the result of a certain audit)
 * @param {any} actualResult
 * @param {any} expectedResult
 * @return {Comparison}
 */
function makeComparison(name, actualResult, expectedResult) {
  const diff = findDifference(name, actualResult, expectedResult);

  return {
    name,
    actual: actualResult,
    expected: expectedResult,
    equal: !diff,
    diff,
  };
}

/**
 * Delete expectations that don't match environment criteria.
 * @param {LocalConsole} localConsole
 * @param {LH.Result} lhr
 * @param {Smokehouse.ExpectedRunnerResult} expected
 * @param {{runner?: string, isBundled?: boolean}=} reportOptions
 */
function pruneExpectations(localConsole, lhr, expected, reportOptions) {
  const isFraggleRock = lhr.configSettings.channel === 'fraggle-rock-cli';
  const isBundled = reportOptions?.isBundled;

  /**
   * Lazily compute the Chrome version because some reports are explicitly asserting error conditions.
   * @returns {string}
   */
  function getChromeVersionString() {
    const userAgent = lhr.environment.hostUserAgent;
    const userAgentMatch = /Chrome\/([\d.]+)/.exec(userAgent); // Chrome/85.0.4174.0
    if (!userAgentMatch) throw new Error('Could not get chrome version.');
    const versionString = userAgentMatch[1];
    if (versionString.split('.').length !== 4) throw new Error(`unexpected ua: ${userAgent}`);
    return versionString;
  }

  /**
   * @param {*} obj
   */
  function failsChromeVersionCheck(obj) {
    return !chromiumVersionCheck({
      version: getChromeVersionString(),
      min: obj._minChromiumVersion,
      max: obj._maxChromiumVersion,
    });
  }

  /**
   * @param {*} obj
   */
  function pruneRecursively(obj) {
    /**
     * @param {string} key
     */
    const remove = (key) => {
      if (Array.isArray(obj)) {
        obj.splice(Number(key), 1);
      } else {
        delete obj[key];
      }
    };

    // Because we may be deleting keys, we should iterate the keys backwards
    // otherwise arrays with multiple pruning checks will skip elements.
    for (const [key, value] of Object.entries(obj).reverse()) {
      if (!value || typeof value !== 'object') {
        continue;
      }

      if (failsChromeVersionCheck(value)) {
        localConsole.log([
          `[${key}] failed chrome version check, pruning expectation:`,
          JSON.stringify(value, null, 2),
          `Actual Chromium version: ${getChromeVersionString()}`,
        ].join(' '));
        remove(key);
      } else if (value._legacyOnly && isFraggleRock) {
        localConsole.log([
          `[${key}] marked legacy only but run is Fraggle Rock, pruning expectation:`,
          JSON.stringify(value, null, 2),
        ].join(' '));
        remove(key);
      } else if (value._fraggleRockOnly && !isFraggleRock) {
        localConsole.log([
          `[${key}] marked Fraggle Rock only but run is legacy, pruning expectation:`,
          JSON.stringify(value, null, 2),
          `Actual channel: ${lhr.configSettings.channel}`,
        ].join(' '));
        remove(key);
      } else if (value._skipInBundled && !isBundled) {
        localConsole.log([
          `[${key}] marked as skip in bundled and runner is bundled, pruning expectation:`,
          JSON.stringify(value, null, 2),
        ].join(' '));
        remove(key);
      } else if (value._runner && reportOptions?.runner !== value._runner) {
        localConsole.log([
          `[${key}] is only for runner ${value._runner}, pruning expectation:`,
          JSON.stringify(value, null, 2),
        ].join(' '));
        remove(key);
      } else {
        pruneRecursively(value);
      }
    }

    delete obj._legacyOnly;
    delete obj._fraggleRockOnly;
    delete obj._skipInBundled;
    delete obj._minChromiumVersion;
    delete obj._maxChromiumVersion;
    delete obj._runner;
  }

  const cloned = cloneDeep(expected);

  pruneRecursively(cloned);
  return cloned;
}

/**
 * Collate results into comparisons of actual and expected scores on each audit/artifact.
 * @param {LocalConsole} localConsole
 * @param {{lhr: LH.Result, artifacts: LH.Artifacts, networkRequests?: string[]}} actual
 * @param {Smokehouse.ExpectedRunnerResult} expected
 * @return {Comparison[]}
 */
function collateResults(localConsole, actual, expected) {
  // If actual run had a runtimeError, expected *must* have a runtimeError.
  // Relies on the fact that an `undefined` argument to makeComparison() can only match `undefined`.
  const runtimeErrorAssertion = makeComparison('runtimeError', actual.lhr.runtimeError,
      expected.lhr.runtimeError);

  // Same for warnings, exclude the slow CPU warning which is flaky and differs between CI machines.
  const warnings = actual.lhr.runWarnings
    .filter(warning => !warning.includes('loaded too slowly'))
    .filter(warning => !warning.includes('a slower CPU'));
  const runWarningsAssertion = makeComparison('runWarnings', warnings,
      expected.lhr.runWarnings || []);

  /** @type {Comparison[]} */
  let artifactAssertions = [];
  if (expected.artifacts) {
    const expectedArtifacts = expected.artifacts;
    const artifactNames = /** @type {(keyof LH.Artifacts)[]} */ (Object.keys(expectedArtifacts));
    const actualArtifacts = actual.artifacts || {};
    artifactAssertions = artifactNames.map(artifactName => {
      if (!(artifactName in actualArtifacts)) {
        localConsole.log(log.redify('Error: ') +
          `Config run did not generate artifact ${artifactName}`);
      }

      const actualResult = actualArtifacts[artifactName];
      const expectedResult = expectedArtifacts[artifactName];
      return makeComparison(artifactName + ' artifact', actualResult, expectedResult);
    });
  }

  /** @type {Comparison[]} */
  let auditAssertions = [];
  auditAssertions = Object.keys(expected.lhr.audits).map(auditName => {
    const actualResult = actual.lhr.audits[auditName];
    if (!actualResult) {
      localConsole.log(log.redify('Error: ') +
        `Config did not trigger run of expected audit ${auditName}`);
    }

    const expectedResult = expected.lhr.audits[auditName];
    return makeComparison(auditName + ' audit', actualResult, expectedResult);
  });

  const timingAssertions = [];
  if (expected.lhr.timing) {
    const comparison = makeComparison('timing', actual.lhr.timing, expected.lhr.timing);
    timingAssertions.push(comparison);
  }

  /** @type {Comparison[]} */
  const requestCountAssertion = [];
  if (expected.networkRequests) {
    requestCountAssertion.push(makeComparison(
      'Requests',
      actual.networkRequests,
      expected.networkRequests
    ));
  }

  return [
    makeComparison('final url', actual.lhr.finalUrl, expected.lhr.finalUrl),
    runtimeErrorAssertion,
    runWarningsAssertion,
    ...requestCountAssertion,
    ...artifactAssertions,
    ...auditAssertions,
    ...timingAssertions,
  ];
}

/**
 * @param {unknown} obj
 */
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * Log the result of an assertion of actual and expected results to the provided
 * console.
 * @param {LocalConsole} localConsole
 * @param {Comparison} assertion
 */
function reportAssertion(localConsole, assertion) {
  // @ts-expect-error - this doesn't exist now but could one day, so try not to break the future
  const _toJSON = RegExp.prototype.toJSON;
  // @ts-expect-error
  // eslint-disable-next-line no-extend-native
  RegExp.prototype.toJSON = RegExp.prototype.toString;

  if (assertion.equal) {
    if (isPlainObject(assertion.actual)) {
      localConsole.log(`  ${log.greenify(log.tick)} ${assertion.name}`);
    } else {
      localConsole.log(`  ${log.greenify(log.tick)} ${assertion.name}: ` +
          log.greenify(assertion.actual));
    }
  } else {
    if (assertion.diff) {
      const diff = assertion.diff;
      const fullActual = String(JSON.stringify(assertion.actual, null, 2))
          .replace(/\n/g, '\n      ');
      const msg = `
  ${log.redify(log.cross)} difference at ${log.bold}${diff.path}${log.reset}
              expected: ${JSON.stringify(diff.expected)}
                 found: ${JSON.stringify(diff.actual)}

          found result:
      ${log.redify(fullActual)}
`;
      localConsole.log(msg);
    } else {
      localConsole.log(`  ${log.redify(log.cross)} ${assertion.name}:
              expected: ${JSON.stringify(assertion.expected)}
                 found: ${JSON.stringify(assertion.actual)}
`);
    }
  }

  // @ts-expect-error
  // eslint-disable-next-line no-extend-native
  RegExp.prototype.toJSON = _toJSON;
}

/**
 * Log all the comparisons between actual and expected test results, then print
 * summary. Returns count of passed and failed tests.
 * @param {{lhr: LH.Result, artifacts: LH.Artifacts, networkRequests?: string[]}} actual
 * @param {Smokehouse.ExpectedRunnerResult} expected
 * @param {{runner?: string, isDebug?: boolean, isBundled?: boolean}=} reportOptions
 * @return {{passed: number, failed: number, log: string}}
 */
function getAssertionReport(actual, expected, reportOptions = {}) {
  const localConsole = new LocalConsole();

  expected = pruneExpectations(localConsole, actual.lhr, expected, reportOptions);
  const comparisons = collateResults(localConsole, actual, expected);

  let correctCount = 0;
  let failedCount = 0;

  comparisons.forEach(assertion => {
    if (assertion.equal) {
      correctCount++;
    } else {
      failedCount++;
    }

    if (!assertion.equal || reportOptions.isDebug) {
      reportAssertion(localConsole, assertion);
    }
  });

  return {
    passed: correctCount,
    failed: failedCount,
    log: localConsole.getLog(),
  };
}

export {getAssertionReport};
