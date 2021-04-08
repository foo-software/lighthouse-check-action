export = stackPacks;
declare const stackPacks: ({
    id: string;
    title: string;
    icon: string;
    UIStrings: {
        'unminified-css': string;
        'unminified-javascript': string;
        'unused-javascript': string;
        'time-to-first-byte': string;
        redirects: string;
        'user-timings': string;
        'dom-size': string;
    };
} | {
    id: string;
    title: string;
    icon: string;
    UIStrings: {
        'total-byte-weight': string;
        'unminified-warning': string;
        'unused-javascript': string;
        'uses-responsive-images': string;
        'uses-rel-preload': string;
        'dom-size': string;
    };
} | {
    id: string;
    title: string;
    icon: string;
    UIStrings: {
        'uses-webp-images': string;
        'offscreen-images': string;
        'render-blocking-resources': string;
        'unminified-css': string;
        'efficient-animated-content': string;
        'uses-responsive-images': string;
    };
} | {
    id: string;
    title: string;
    icon: string;
    UIStrings: {
        'uses-webp-images': string;
        'offscreen-images': string;
        'disable-bundling': string;
        'unminified-css': string;
        'unminified-javascript': string;
        'unused-javascript': string;
        'uses-optimized-images': string;
        'time-to-first-byte': string;
        'uses-rel-preconnect': string;
        'uses-rel-preload': string;
        'critical-request-chains': string;
        'font-display': string;
    };
})[];
