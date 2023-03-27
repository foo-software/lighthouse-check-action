/**
 * Parse a manifest from the given inputs.
 * @param {string} string Manifest JSON string.
 * @param {string} manifestUrl URL of manifest file.
 * @param {string} documentUrl URL of document containing manifest link element.
 */
export function parseManifest(string: string, manifestUrl: string, documentUrl: string): {
    raw: string;
    value: undefined;
    warning: string;
    url: string;
} | {
    raw: string;
    value: {
        name: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        short_name: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        start_url: {
            raw: any;
            value: string;
            warning?: string | undefined;
        };
        display: {
            raw: any;
            value: string;
            warning: string | undefined;
        };
        orientation: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        icons: {
            raw: any;
            /** @type {Array<ReturnType<typeof parseIcon>>} */
            value: Array<ReturnType<typeof parseIcon>>;
            warning: undefined;
        } | {
            raw: any;
            /** @type {Array<ReturnType<typeof parseIcon>>} */
            value: Array<ReturnType<typeof parseIcon>>;
            warning: string;
        } | {
            raw: any[];
            value: {
                raw: any;
                value: {
                    src: {
                        raw: any;
                        value: string | undefined;
                        warning: string | undefined;
                    };
                    type: {
                        raw: any;
                        value: string | undefined;
                        warning: string | undefined;
                    };
                    density: {
                        raw: any;
                        value: number;
                        /** @type {string|undefined} */
                        warning: string | undefined;
                    };
                    sizes: {
                        raw: any;
                        value: string[] | undefined;
                        warning: undefined;
                    } | {
                        value: undefined;
                        raw: any;
                        warning: string | undefined;
                    };
                    purpose: {
                        raw: any;
                        value: string[];
                        /** @type {string|undefined} */
                        warning: string | undefined;
                    };
                };
                warning: undefined;
            }[];
            warning: string | undefined;
        };
        related_applications: {
            raw: any;
            value: undefined;
            warning: undefined;
        } | {
            raw: any;
            value: undefined;
            warning: string;
        } | {
            raw: any[];
            value: {
                raw: any;
                value: {
                    platform: {
                        raw: any;
                        value: string | undefined;
                        warning: string | undefined;
                    };
                    id: {
                        raw: any;
                        value: string | undefined;
                        warning: string | undefined;
                    };
                    url: {
                        raw: any;
                        value: string | undefined;
                        warning: string | undefined;
                    };
                };
                warning: undefined;
            }[];
            warning: undefined;
        };
        prefer_related_applications: {
            raw: any;
            value: boolean | undefined;
            warning: string | undefined;
        };
        theme_color: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        background_color: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
    };
    warning: string | undefined;
    url: string;
};
/**
 * @see https://www.w3.org/TR/2016/WD-appmanifest-20160825/#src-member
 * @param {*} raw
 * @param {string} manifestUrl
 */
declare function parseIcon(raw: any, manifestUrl: string): {
    raw: any;
    value: {
        src: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        type: {
            raw: any;
            value: string | undefined;
            warning: string | undefined;
        };
        density: {
            raw: any;
            value: number;
            /** @type {string|undefined} */
            warning: string | undefined;
        };
        sizes: {
            raw: any;
            value: string[] | undefined;
            warning: undefined;
        } | {
            value: undefined;
            raw: any;
            warning: string | undefined;
        };
        purpose: {
            raw: any;
            value: string[];
            /** @type {string|undefined} */
            warning: string | undefined;
        };
    };
    warning: undefined;
};
export {};
//# sourceMappingURL=manifest-parser.d.ts.map