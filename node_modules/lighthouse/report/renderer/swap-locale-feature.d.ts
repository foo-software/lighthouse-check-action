/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Creates a <select> element, filled with all supported locales
 */
/** @typedef {import('./dom.js').DOM} DOM */
/** @typedef {import('./report-ui-features').ReportUIFeatures} ReportUIFeatures */
export class SwapLocaleFeature {
    /**
     * @param {ReportUIFeatures} reportUIFeatures
     * @param {DOM} dom
     * @param {{onLocaleSelected: (localeModuleName: LH.Locale) => Promise<void>}} callbacks
     *        Specifiy the URL where the i18n module script can be found, and the URLS for the locale JSON files.
     */
    constructor(reportUIFeatures: ReportUIFeatures, dom: DOM, callbacks: {
        onLocaleSelected: (localeModuleName: LH.Locale) => Promise<void>;
    });
    _reportUIFeatures: import("./report-ui-features").ReportUIFeatures;
    _dom: import("./dom.js").DOM;
    _localeSelectedCallback: (localeModuleName: LH.Locale) => Promise<void>;
    /**
     * @param {Array<LH.Locale>} locales
     */
    enable(locales: Array<LH.Locale>): void;
}
export type DOM = import('./dom.js').DOM;
export type ReportUIFeatures = import('./report-ui-features').ReportUIFeatures;
//# sourceMappingURL=swap-locale-feature.d.ts.map