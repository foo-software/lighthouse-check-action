/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-disable no-unused-vars */

/**
 * Base class for all gatherers supporting both Fraggle Rock and the legacy flow.
 * Most extending classes should implement the Fraggle Rock API and let this class handle translation.
 * See lighthouse-core/gather/gatherers/gatherer.js for legacy method explanations.
 *
 * @implements {LH.Gatherer.GathererInstance}
 * @implements {LH.Gatherer.FRGathererInstance}
 */
class FRGatherer {
  /** @type {LH.Gatherer.GathererMeta} */
  meta = {supportedModes: []}

  /**
   * Method to start observing a page before a navigation.
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<void>|void}
   */
  beforeNavigation(passContext) { }

  /**
   * Method to start observing a page for an arbitrary period of time.
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<void>|void}
   */
  beforeTimespan(passContext) { }

  /**
   * Method to end observing a page after an arbitrary period of time and return the results.
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {LH.Gatherer.PhaseResult}
   */
  afterTimespan(passContext) { }

  /**
   * Method to end observing a page after a navigation and return the results.
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {LH.Gatherer.PhaseResult}
   */
  afterNavigation(passContext) { }

  /**
   * Method to gather results about a page in a particular state.
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {LH.Gatherer.PhaseResult}
   */
  snapshot(passContext) { }

  /**
   * Legacy property used to define the artifact ID. In Fraggle Rock, the artifact ID lives on the config.
   * @return {keyof LH.GathererArtifacts}
   */
  get name() {
    // @ts-expect-error - assume that class name has been added to LH.GathererArtifacts.
    return this.constructor.name;
  }

  /**
   * Legacy method. Called before navigation to target url, roughly corresponds to `beforeTimespan`.
   * @param {LH.Gatherer.PassContext} passContext
   * @return {Promise<LH.Gatherer.PhaseResultNonPromise>}
   */
  async beforePass(passContext) {
    await this.beforeTimespan({...passContext, dependencies: {}});
  }

  /**
   * Legacy method. Should never be used by a Fraggle Rock gatherer, here for compat only.
   * @param {LH.Gatherer.PassContext} passContext
   * @return {LH.Gatherer.PhaseResult}
   */
  pass(passContext) { }

  /**
   * Legacy method. Roughly corresponds to `afterTimespan` or `snapshot` depending on type of gatherer.
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {Promise<LH.Gatherer.PhaseResultNonPromise>}
   */
  async afterPass(passContext, loadData) {
    if (this.meta.supportedModes.includes('timespan')) {
      return this.afterTimespan({...passContext, dependencies: {}});
    }

    return this.snapshot({...passContext, dependencies: {}});
  }
}

module.exports = FRGatherer;
