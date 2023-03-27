/**
 * Verify output path to use, either stdout or a file path.
 * @param {string} path
 * @return {string}
 */
export function checkOutputPath(path: string): string;
/**
 * Writes the output.
 * @param {string} output
 * @param {LH.OutputMode} mode
 * @param {string} path
 * @return {Promise<void>}
 */
export function write(output: string, mode: LH.OutputMode, path: string): Promise<void>;
/**
 * An enumeration of acceptable output modes:
 *   'json': JSON formatted results
 *   'html': An HTML report
 *   'csv': CSV formatted results
 * @type {LH.Util.SelfMap<LH.OutputMode>}
 */
export const OutputMode: LH.Util.SelfMap<LH.OutputMode>;
/**
 * Returns a list of valid output options.
 * @return {Array<string>}
 */
export function getValidOutputOptions(): Array<string>;
//# sourceMappingURL=printer.d.ts.map