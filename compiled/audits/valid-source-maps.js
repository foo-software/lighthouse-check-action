/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const thirdPartyWeb = require('../lib/third-party-web.js');
const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a Lighthouse audit that provides detail on HTTP to HTTPS redirects. This descriptive title is shown to users when HTTP traffic is redirected to HTTPS. */
  title: 'Page has valid source maps',
  /** Title of a Lighthouse audit that provides detail on HTTP to HTTPS redirects. This descriptive title is shown to users when HTTP traffic is not redirected to HTTPS. */
  failureTitle: 'Missing source maps for large first-party JavaScript',
  /** Description of a Lighthouse audit that tells the user that their JavaScript source maps are invalid or missing. This is displayed after a user expands the section to see more. No character length limits. 'Learn More' becomes link text to additional documentation. */
  description: 'Source maps translate minified code to the original source code. This helps ' +
    'developers debug in production. In addition, Lighthouse is able to provide further ' +
    'insights. Consider deploying source maps to take advantage of these benefits. ' +
    '[Learn more](https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps).',
  /** Label for a column in a data table. Entries will be URLs to JavaScript source maps. */
  columnMapURL: 'Map URL',
  /** Label for a possible error message indicating that a source map for a large, first-party JavaScript script is missing. */
  missingSourceMapErrorMessage: 'Large JavaScript file is missing a source map',
  /** Label for a possible error message indicating that the content of a source map is invalid because it is missing items in the sourcesContent attribute. */
  missingSourceMapItemsWarningMesssage: `{missingItems, plural,
    =1 {Warning: missing 1 item in \`.sourcesContent\`}
    other {Warning: missing # items in \`.sourcesContent\`}
    }`,
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

const LARGE_JS_BYTE_THRESHOLD = 500 * 1024;

class ValidSourceMaps extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'valid-source-maps',
      title: str_(UIStrings.title),
      failureTitle: str_(UIStrings.failureTitle),
      description: str_(UIStrings.description),
      requiredArtifacts: ['ScriptElements', 'SourceMaps', 'URL'],
    };
  }

  /**
   * Returns true if the size of the script exceeds a static threshold.
   * @param {LH.Artifacts.ScriptElement} scriptElement
   * @param {string} finalURL
   * @return {boolean}
   */
  static isLargeFirstPartyJS(scriptElement, finalURL) {
    if (scriptElement.content === null) return false;

    const isLargeJS = scriptElement.content.length >= LARGE_JS_BYTE_THRESHOLD;
    const isFirstPartyJS = scriptElement.src ?
      thirdPartyWeb.isFirstParty(scriptElement.src, thirdPartyWeb.getEntity(finalURL)) : false;

    return isLargeJS && isFirstPartyJS;
  }

  /**
   * @param {LH.Artifacts} artifacts
   */
  static async audit(artifacts) {
    const {SourceMaps} = artifacts;

    /** @type {Set<string>} */
    const isMissingMapForLargeFirstPartyScriptUrl = new Set();

    let missingMapsForLargeFirstPartyFile = false;
    const results = [];
    for (const scriptElement of artifacts.ScriptElements) {
      if (!scriptElement.src) continue; // TODO: inline scripts, how do they work?

      const sourceMap = SourceMaps.find(m => m.scriptUrl === scriptElement.src);
      const errors = [];
      const isLargeFirstParty = this.isLargeFirstPartyJS(scriptElement, artifacts.URL.finalUrl);

      if (isLargeFirstParty && (!sourceMap || !sourceMap.map)) {
        missingMapsForLargeFirstPartyFile = true;
        isMissingMapForLargeFirstPartyScriptUrl.add(scriptElement.src);
        errors.push({error: str_(UIStrings.missingSourceMapErrorMessage)});
      }

      if (sourceMap && !sourceMap.map) {
        errors.push({error: sourceMap.errorMessage});
      }

      // Sources content errors.
      if (sourceMap && sourceMap.map) {
        const sourcesContent = sourceMap.map.sourcesContent || [];
        let missingSourcesContentCount = 0;
        for (let i = 0; i < sourceMap.map.sources.length; i++) {
          if (sourcesContent.length < i || !sourcesContent[i]) missingSourcesContentCount += 1;
        }
        if (missingSourcesContentCount > 0) {
          errors.push({error: str_(UIStrings.missingSourceMapItemsWarningMesssage,
              {missingItems: missingSourcesContentCount})});
        }
      }

      if (sourceMap || errors.length) {
        results.push({
          scriptUrl: scriptElement.src,
          sourceMapUrl: sourceMap && sourceMap.sourceMapUrl,
          subItems: {
            type: /** @type {'subitems'} */ ('subitems'),
            items: errors,
          },
        });
      }
    }

    /** @type {LH.Audit.Details.TableColumnHeading[]} */
    const headings = [
      /* eslint-disable max-len */
      {
        key: 'scriptUrl',
        itemType: 'url',
        subItemsHeading: {key: 'error'},
        text: str_(i18n.UIStrings.columnURL),
      },
      {key: 'sourceMapUrl', itemType: 'url', text: str_(UIStrings.columnMapURL)},
      /* eslint-enable max-len */
    ];

    results.sort((a, b) => {
      // Show the items that can fail the audit first.
      const missingMapA = isMissingMapForLargeFirstPartyScriptUrl.has(a.scriptUrl);
      const missingMapB = isMissingMapForLargeFirstPartyScriptUrl.has(b.scriptUrl);
      if (missingMapA && !missingMapB) return -1;
      if (!missingMapA && missingMapB) return 1;

      // Then sort by whether one has errors and the other doesn't.
      if (a.subItems.items.length && !b.subItems.items.length) return -1;
      if (!a.subItems.items.length && b.subItems.items.length) return 1;

      // Then sort by script url.
      return b.scriptUrl.localeCompare(a.scriptUrl);
    });

    // Only fails if `missingMapsForLargeFirstPartyFile` is true. All other errors are diagnostical.
    return {
      score: missingMapsForLargeFirstPartyFile ? 0 : 1,
      details: Audit.makeTableDetails(headings, results),
    };
  }
}

module.exports = ValidSourceMaps;
module.exports.UIStrings = UIStrings;
