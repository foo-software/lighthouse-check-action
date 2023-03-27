export const __esModule: boolean;
/**
 * http://tools.ietf.org/html/rfc3986#section-5.2.4
 */
export function normalizePath(path: any): any;
export class ParsedURL {
    static concatenate(devToolsPath: any, ...appendage: any[]): any;
    static beginsWithWindowsDriveLetter(url: any): boolean;
    static beginsWithScheme(url: any): boolean;
    static isRelativeURL(url: any): boolean;
    static urlRegexInstance: null;
    constructor(url: any);
    isValid: boolean;
    url: any;
    scheme: any;
    user: any;
    host: any;
    port: any;
    path: any;
    queryParams: any;
    fragment: any;
    folderPathComponents: any;
    lastPathComponent: any;
    blobInnerScheme: any;
    get displayName(): any;
    #private;
}
//# sourceMappingURL=ParsedURL.d.ts.map