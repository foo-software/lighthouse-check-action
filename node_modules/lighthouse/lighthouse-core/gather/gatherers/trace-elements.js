/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview
 * This gatherer identifies elements that contribrute to metrics in the trace (LCP, CLS, etc.).
 * We take the backend nodeId from the trace and use it to find the corresponding element in the DOM.
 */

const Gatherer = require('./gatherer.js');
const pageFunctions = require('../../lib/page-functions.js');
const TraceProcessor = require('../../lib/tracehouse/trace-processor.js');
const RectHelpers = require('../../lib/rect-helpers.js');

/** @typedef {{nodeId: number, score?: number}} TraceElementData */

/**
 * @this {HTMLElement}
 * @param {string} metricName
 * @return {LH.Artifacts.TraceElement | undefined}
 */
/* istanbul ignore next */
function setAttributeMarker(metricName) {
  const elem = this.nodeType === document.ELEMENT_NODE ? this : this.parentElement; // eslint-disable-line no-undef
  let traceElement;
  if (elem) {
    traceElement = {
      metricName,
      // @ts-ignore - put into scope via stringification
      devtoolsNodePath: getNodePath(elem), // eslint-disable-line no-undef
      // @ts-ignore - put into scope via stringification
      selector: getNodeSelector(elem), // eslint-disable-line no-undef
      // @ts-ignore - put into scope via stringification
      nodeLabel: getNodeLabel(elem), // eslint-disable-line no-undef
      // @ts-ignore - put into scope via stringification
      snippet: getOuterHTMLSnippet(elem), // eslint-disable-line no-undef
    };
  }
  return traceElement;
}

class TraceElements extends Gatherer {
  /**
   * @param {LH.TraceEvent | undefined} event
   * @return {number | undefined}
   */
  static getNodeIDFromTraceEvent(event) {
    return event && event.args &&
      event.args.data && event.args.data.nodeId;
  }

  /**
   * @param {Array<number>} rect
   * @return {LH.Artifacts.Rect}
   */
  static traceRectToLHRect(rect) {
    const rectArgs = {
      x: rect[0],
      y: rect[1],
      width: rect[2],
      height: rect[3],
    };
    return RectHelpers.addRectTopAndBottom(rectArgs);
  }

  /**
   * This function finds the top (up to 5) elements that contribute to the CLS score of the page.
   * Each layout shift event has a 'score' which is the amount added to the CLS as a result of the given shift(s).
   * We calculate the score per element by taking the 'score' of each layout shift event and
   * distributing it between all the nodes that were shifted, proportianal to the impact region of
   * each shifted element.
   * @param {Array<LH.TraceEvent>} mainThreadEvents
   * @return {Array<TraceElementData>}
   */
  static getTopLayoutShiftElements(mainThreadEvents) {
    /** @type {Map<number, number>} */
    const clsPerNode = new Map();
    const shiftEvents = mainThreadEvents
      .filter(e => e.name === 'LayoutShift')
      .map(e => e.args && e.args.data);

    shiftEvents.forEach(event => {
      if (!event || !event.impacted_nodes || !event.score || event.had_recent_input) {
        return;
      }

      let totalAreaOfImpact = 0;
      /** @type {Map<number, number>} */
      const pixelsMovedPerNode = new Map();

      event.impacted_nodes.forEach(node => {
        if (!node.node_id || !node.old_rect || !node.new_rect) {
          return;
        }

        const oldRect = TraceElements.traceRectToLHRect(node.old_rect);
        const newRect = TraceElements.traceRectToLHRect(node.new_rect);
        const areaOfImpact = RectHelpers.getRectArea(oldRect) +
          RectHelpers.getRectArea(newRect) -
          RectHelpers.getRectOverlapArea(oldRect, newRect);

        pixelsMovedPerNode.set(node.node_id, areaOfImpact);
        totalAreaOfImpact += areaOfImpact;
      });

      for (const [nodeId, pixelsMoved] of pixelsMovedPerNode.entries()) {
        let clsContribution = clsPerNode.get(nodeId) || 0;
        clsContribution += (pixelsMoved / totalAreaOfImpact) * event.score;
        clsPerNode.set(nodeId, clsContribution);
      }
    });

    const topFive = [...clsPerNode.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nodeId, clsContribution]) => {
      return {
        nodeId: nodeId,
        score: clsContribution,
      };
    });

    return topFive;
  }

  /**
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Artifacts['TraceElements']>}
   */
  async afterPass(passContext, loadData) {
    const driver = passContext.driver;
    if (!loadData.trace) {
      throw new Error('Trace is missing!');
    }

    const {largestContentfulPaintEvt, mainThreadEvents} =
      TraceProcessor.computeTraceOfTab(loadData.trace);
    /** @type {Array<TraceElementData>} */
    const backendNodeData = [];

    const lcpNodeId = TraceElements.getNodeIDFromTraceEvent(largestContentfulPaintEvt);
    const clsNodeData = TraceElements.getTopLayoutShiftElements(mainThreadEvents);
    if (lcpNodeId) {
      backendNodeData.push({nodeId: lcpNodeId});
    }
    backendNodeData.push(...clsNodeData);

    const traceElements = [];
    for (let i = 0; i < backendNodeData.length; i++) {
      const backendNodeId = backendNodeData[i].nodeId;
      const metricName =
        lcpNodeId === backendNodeId ? 'largest-contentful-paint' : 'cumulative-layout-shift';
      const objectId = await driver.resolveNodeIdToObjectId(backendNodeId);
      if (!objectId) continue;
      const response = await driver.sendCommand('Runtime.callFunctionOn', {
        objectId,
        functionDeclaration: `function () {
          ${setAttributeMarker.toString()};
          ${pageFunctions.getNodePathString};
          ${pageFunctions.getNodeSelectorString};
          ${pageFunctions.getNodeLabelString};
          ${pageFunctions.getOuterHTMLSnippetString};
          return setAttributeMarker.call(this, '${metricName}');
        }`,
        returnByValue: true,
        awaitPromise: true,
      });

      if (response && response.result && response.result.value) {
        traceElements.push({...response.result.value, score: backendNodeData[i].score});
      }
    }

    return traceElements;
  }
}

module.exports = TraceElements;
