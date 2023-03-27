export namespace TextEncoding {
    export { toBase64 };
    export { fromBase64 };
}
/**
 * Takes an UTF-8 string and returns a base64 encoded string.
 * If gzip is true, the UTF-8 bytes are gzipped before base64'd, using
 * CompressionStream (currently only in Chrome), falling back to pako
 * (which is only used to encode in our Node tests).
 * @param {string} string
 * @param {{gzip: boolean}} options
 * @return {Promise<string>}
 */
declare function toBase64(string: string, options: {
    gzip: boolean;
}): Promise<string>;
/**
 * @param {string} encoded
 * @param {{gzip: boolean}} options
 * @return {string}
 */
declare function fromBase64(encoded: string, options: {
    gzip: boolean;
}): string;
export {};
//# sourceMappingURL=text-encoding.d.ts.map