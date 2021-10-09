/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Audit = require('../audit.js');
const ComputedTBT = require('../../computed/metrics/total-blocking-time.js');
const i18n = require('../../lib/i18n/i18n.js');

const UIStrings = {
  /** Description of the Total Blocking Time (TBT) metric, which calculates the total duration of blocking time for a web page. Blocking times are time periods when the page would be blocked (prevented) from responding to user input (clicks, taps, and keypresses will feel slow to respond). This is displayed within a tooltip when the user hovers on the metric name to see more. No character length limits.*/
  description: 'Sum of all time periods between FCP and Time to Interactive, ' +
      'when task length exceeded 50ms, expressed in milliseconds. [Learn more](https://web.dev/lighthouse-total-blocking-time/).',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

class TotalBlockingTime extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'total-blocking-time',
      title: str_(i18n.UIStrings.totalBlockingTimeMetric),
      description: str_(UIStrings.description),
      scoreDisplayMode: Audit.SCORING_MODES.NUMERIC,
      requiredArtifacts: ['traces', 'devtoolsLogs', 'GatherContext'],
    };
  }

  /**
   * @return {{mobile: {scoring: LH.Audit.ScoreOptions}, desktop: {scoring: LH.Audit.ScoreOptions}}}
   */
  static get defaultOptions() {
    return {
      mobile: {
        // If determined from HTTP Archive data…
        //     SELECT
        //         APPROX_QUANTILES(tbt_value, 100)[OFFSET(8)] AS p08_tbt,
        //         APPROX_QUANTILES(tbt_value, 100)[OFFSET(25)] AS p25_tbt
        //     FROM (
        //         SELECT CAST(JSON_EXTRACT_SCALAR(report, '$.audits.total-blocking-time.numericValue') AS FLOAT64) AS tbt_value
        //         FROM `httparchive.lighthouse.2021_05_01_mobile`
        //         WHERE report is not NULL
        //     )
        // …we'd use control points of 19 and 189, which leads to surprisingly harsh scoring.
        //
        // The following coefficients are semi-arbitrarily chosen, but start to approach the "correct" ones:
        // See https://www.desmos.com/calculator/pwcgna1cvf go/lh8-tbt-curves
        scoring: {
          p10: 200,
          median: 600,
        },
      },
      desktop: {
        // Chosen in HTTP Archive desktop results to approximate curve easing described above.
        // SELECT
        //   APPROX_QUANTILES(tbtValue, 100)[OFFSET(40)] AS p40_tbt,
        //   APPROX_QUANTILES(tbtValue, 100)[OFFSET(60)] AS p60_tbt
        // FROM (
        //   SELECT CAST(JSON_EXTRACT_SCALAR(payload, '$._TotalBlockingTime') AS NUMERIC) AS tbtValue
        //   FROM `httparchive.pages.2020_04_01_desktop`
        // )
        scoring: {
          p10: 150,
          median: 350,
        },
      },
    };
  }

  /**
   * Audits the page to calculate Total Blocking Time.
   *
   * We define Blocking Time as any time interval in the loading timeline where task length exceeds
   * 50ms. For example, if there is a 110ms main thread task, the last 60ms of it is blocking time.
   * Total Blocking Time is the sum of all Blocking Time between First Contentful Paint and
   * Interactive Time (TTI).
   *
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts, context) {
    const trace = artifacts.traces[Audit.DEFAULT_PASS];
    const devtoolsLog = artifacts.devtoolsLogs[Audit.DEFAULT_PASS];
    const gatherContext = artifacts.GatherContext;
    const metricComputationData = {trace, devtoolsLog, gatherContext, settings: context.settings};
    if (
      gatherContext.gatherMode === 'timespan' &&
      context.settings.throttlingMethod === 'simulate'
    ) {
      return {score: 1, notApplicable: true};
    }

    const metricResult = await ComputedTBT.request(metricComputationData, context);

    const options = context.options[context.settings.formFactor];


    return {
      score: Audit.computeLogNormalScore(
        options.scoring,
        metricResult.timing
      ),
      numericValue: metricResult.timing,
      numericUnit: 'millisecond',
      displayValue: str_(i18n.UIStrings.ms, {timeInMs: metricResult.timing}),
    };
  }
}

module.exports = TotalBlockingTime;
module.exports.UIStrings = UIStrings;
