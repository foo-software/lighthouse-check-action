import { type TraceWindowMicroSeconds } from './Timing.js';
import { type TraceEventData } from './TraceEvents.js';
export type TraceFile = {
    traceEvents: readonly TraceEventData[];
    metadata: MetaData;
};
export interface Breadcrumb {
    window: TraceWindowMicroSeconds;
    child: Breadcrumb | null;
}
export declare const enum DataOrigin {
    CPUProfile = "CPUProfile",
    TraceEvents = "TraceEvents"
}
export interface Annotations {
    entriesFilterAnnotations: {
        hiddenEntriesIndexes: number[];
        modifiedEntriesIndexes: number[];
    };
    initialBreadcrumb: Breadcrumb;
}
/**
 * Trace metadata that we persist to the file. This will allow us to
 * store specifics for the trace, e.g., which tracks should be visible
 * on load.
 */
export interface MetaData {
    source?: 'DevTools';
    startTime?: string;
    networkThrottling?: string;
    cpuThrottling?: number;
    hardwareConcurrency?: number;
    dataOrigin?: DataOrigin;
    annotations?: Annotations;
}
export type Contents = TraceFile | TraceEventData[];
