/**
 * Returns false if fails check.
 * @param {{version: string, min?: string, max?: string}} opts
 */
export function chromiumVersionCheck(opts: {
    version: string;
    min?: string | undefined;
    max?: string | undefined;
}): boolean;
/**
 * @param {number[]} versionA
 * @param {number[]} versionB
 */
export function compareVersions(versionA: number[], versionB: number[]): 1 | 0 | -1;
//# sourceMappingURL=version-check.d.ts.map