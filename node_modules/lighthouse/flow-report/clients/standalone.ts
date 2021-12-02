/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview The entry point for rendering the Lighthouse flow report for the HTML file created by ReportGenerator.
 * The renderer code is bundled and injected into the report HTML along with the JSON report.
 */

import {renderFlowReport} from '../api';

function __initLighthouseFlowReport__() {
  const container = document.body.querySelector('main');
  if (!container) throw Error('Container element not found');
  renderFlowReport(window.__LIGHTHOUSE_FLOW_JSON__, container, {
    getReportHtml: () => document.documentElement.outerHTML,
  });
}

window.__initLighthouseFlowReport__ = __initLighthouseFlowReport__;
window.__initLighthouseFlowReport__();
