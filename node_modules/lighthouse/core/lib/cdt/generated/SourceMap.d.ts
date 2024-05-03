export = SourceMap;
declare class SourceMap {
    /**
     * Implements Source Map V3 model. See https://github.com/google/closure-compiler/wiki/Source-Maps
     * for format description.
     */
    constructor(compiledURL: any, sourceMappingURL: any, payload: any);
    compiledURL(): any;
    url(): any;
    sourceURLs(): any[];
    embeddedContentByURL(sourceURL: any): any;
    findEntry(lineNumber: any, columnNumber: any): {
        lineNumber: number;
        columnNumber: number;
        sourceURL?: string | undefined;
        sourceLineNumber: number;
        sourceColumnNumber: number;
        name?: string | undefined;
        lastColumnNumber?: number | undefined;
    } | null;
    findEntryRanges(lineNumber: any, columnNumber: any): {
        range: any;
        sourceRange: any;
        sourceURL: string;
    } | null;
    sourceLineMapping(sourceURL: any, lineNumber: any, columnNumber: any): {
        lineNumber: number;
        columnNumber: number;
        sourceURL?: string | undefined;
        sourceLineNumber: number;
        sourceColumnNumber: number;
        name?: string | undefined;
        lastColumnNumber?: number | undefined;
    } | null;
    findReverseIndices(sourceURL: any, lineNumber: any, columnNumber: any): any;
    findReverseEntries(sourceURL: any, lineNumber: any, columnNumber: any): any;
    findReverseRanges(sourceURL: any, lineNumber: any, columnNumber: any): any[];
    /** @return {Array<{lineNumber: number, columnNumber: number, sourceURL?: string, sourceLineNumber: number, sourceColumnNumber: number, name?: string, lastColumnNumber?: number}>} */
    mappings(): {
        lineNumber: number;
        columnNumber: number;
        sourceURL?: string | undefined;
        sourceLineNumber: number;
        sourceColumnNumber: number;
        name?: string | undefined;
        lastColumnNumber?: number | undefined;
    }[];
    reversedMappings(sourceURL: any): any;
    eachSection(callback: any): void;
    parseSources(sourceMap: any): void;
    parseMap(map: any, lineNumber: any, columnNumber: any): void;
    isSeparator(char: any): boolean;
    decodeVLQ(stringCharIterator: any): number;
    mapsOrigin(): boolean;
    hasIgnoreListHint(sourceURL: any): any;
    /**
     * Returns a list of ranges in the generated script for original sources that
     * match a predicate. Each range is a [begin, end) pair, meaning that code at
     * the beginning location, up to but not including the end location, matches
     * the predicate.
     */
    findRanges(predicate: any, options: any): any[];
    #private;
}
declare namespace SourceMap {
    export { parseSourceMap, __esModule, SourceMapEntry, SourceMap };
}
/**
 * Parses the {@link content} as JSON, ignoring BOM markers in the beginning, and
 * also handling the CORB bypass prefix correctly.
 *
 * @param content the string representation of a sourcemap.
 * @returns the {@link SourceMapV3} representation of the {@link content}.
 */
declare function parseSourceMap(content: any): any;
declare const __esModule: boolean;
declare class SourceMapEntry {
    static compare(entry1: any, entry2: any): number;
    constructor(lineNumber: any, columnNumber: any, sourceURL: any, sourceLineNumber: any, sourceColumnNumber: any, name: any);
    lineNumber: any;
    columnNumber: any;
    sourceURL: any;
    sourceLineNumber: any;
    sourceColumnNumber: any;
    name: any;
}
//# sourceMappingURL=SourceMap.d.ts.map