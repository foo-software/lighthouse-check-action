/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 *
 * @param {{id: string}} dependency
 * @param {Error} error
 */
function createDependencyError(dependency, error) {
  return new Error(`Dependency "${dependency.id}" failed with exception: ${error.message}`);
}

/**
 * @param {LH.Config.ArtifactDefn} artifact
 * @param {Record<string, LH.Gatherer.PhaseResult>} artifactsById
 * @return {Promise<LH.Gatherer.FRTransitionalContext<LH.Gatherer.DependencyKey>['dependencies']>}
 */
async function collectArtifactDependencies(artifact, artifactsById) {
  if (!artifact.dependencies) return {};

  const dependencyPromises = Object.entries(artifact.dependencies).map(
    async ([dependencyName, dependency]) => {
      const dependencyArtifact = artifactsById[dependency.id];
      if (dependencyArtifact === undefined) throw new Error(`"${dependency.id}" did not run`);
      if (dependencyArtifact instanceof Error) {
        throw createDependencyError(dependency, dependencyArtifact);
      }

      const dependencyPromise = Promise.resolve()
        .then(() => dependencyArtifact)
        .catch(err => Promise.reject(createDependencyError(dependency, err)));

      return [dependencyName, await dependencyPromise];
    }
  );

  return Object.fromEntries(await Promise.all(dependencyPromises));
}

module.exports = {collectArtifactDependencies};
