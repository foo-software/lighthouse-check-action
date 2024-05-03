/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Logs messages via a UI butter.
 */
export class Logger {
    /**
     * @param {HTMLElement} element - expected to have id #lh-log
     */
    constructor(element: HTMLElement);
    el: HTMLElement;
    _id: number | undefined;
    /**
     * Shows a butter bar.
     * @param {string} msg The message to show.
     * @param {boolean=} autoHide True to hide the message after a duration.
     *     Default is true.
     */
    log(msg: string, autoHide?: boolean | undefined): void;
    /**
     * @param {string} msg
     */
    warn(msg: string): void;
    /**
     * @param {string} msg
     */
    error(msg: string): void;
    /**
     * Explicitly hides the butter bar.
     */
    hide(): void;
}
//# sourceMappingURL=logger.d.ts.map