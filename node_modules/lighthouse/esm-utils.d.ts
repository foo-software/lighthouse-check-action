/**
 * Commonjs equivalent of `require.resolve`.
 * @param {string} packageName
 */
export function resolveModulePath(packageName: string): string;
/**
 * @param {ImportMeta} importMeta
 */
export function getModulePath(importMeta: ImportMeta): string;
/**
 * @param {ImportMeta} importMeta
 */
export function getModuleDirectory(importMeta: ImportMeta): string;
//# sourceMappingURL=esm-utils.d.ts.map