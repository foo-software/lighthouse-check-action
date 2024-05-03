/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A simple buffered log to use in place of `console`.
 */
export class LocalConsole {
    _log: string;
    /**
     * @param {string} str
     */
    log(str: string): void;
    /**
     * Log but without the ending newline.
     * @param {string} str
     */
    write(str: string): void;
    /**
     * @return {string}
     */
    getLog(): string;
    /**
     * Append a stdout and stderr to this log.
     * @param {{stdout: string, stderr: string}} stdStrings
     */
    adoptStdStrings(stdStrings: {
        stdout: string;
        stderr: string;
    }): void;
}
//# sourceMappingURL=local-console.d.ts.map