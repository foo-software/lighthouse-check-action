export type Configuration = Readonly<{
    settings: {};
    experiments: {
        /**
         * Include V8 RCS in the timeline
         */
        timelineV8RuntimeCallStats: boolean;
        /**
         * Show all events: disable the default filtering which hides and excludes some events.
         */
        timelineShowAllEvents: boolean;
    };
    processing: {
        /**
         * How long the processor should pause between event chunks.
         */
        pauseDuration: number;
        /**
         * How many events should be processed before yielding to the main thread for a pause.
         */
        eventsPerChunk: number;
    };
}>;
export declare const DEFAULT: Configuration;
/**
 * Generates a key that can be used to represent this config in a cache. This is
 * used mainly in tests, where we want to avoid re-parsing a file if we have
 * already processed it with the same configuration. This cache key purposefully
 * does not include all settings in the configuration; the processing settings
 * do not impact the actual resulting data. Only new flags in the config that
 * alter parsing should be added to this cache key.
 */
export declare function configToCacheKey(config: Configuration): string;
