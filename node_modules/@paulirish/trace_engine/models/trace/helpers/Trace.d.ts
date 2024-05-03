import type * as CPUProfile from '../../cpu_profile/cpu_profile.js';
import * as Types from '../types/types.js';
type MatchedPairType<T extends Types.TraceEvents.TraceEventPairableAsync> = Types.TraceEvents.SyntheticEventPair<T>;
export declare function stackTraceForEvent(event: Types.TraceEvents.TraceEventData): Types.TraceEvents.TraceEventCallFrame[] | null;
export declare function extractOriginFromTrace(firstNavigationURL: string): string | null;
export type EventsInThread<T extends Types.TraceEvents.TraceEventData> = Map<Types.TraceEvents.ThreadID, T[]>;
export declare function addEventToProcessThread<T extends Types.TraceEvents.TraceEventData>(event: T, eventsInProcessThread: Map<Types.TraceEvents.ProcessID, EventsInThread<T>>): void;
/**
 * Sorts all the events in place, in order, by their start time. If they have
 * the same start time, orders them by longest first.
 */
export declare function sortTraceEventsInPlace(events: {
    ts: Types.Timing.MicroSeconds;
    dur?: Types.Timing.MicroSeconds;
}[]): void;
/**
 * Returns an array of ordered events that results after merging the two
 * ordered input arrays.
 */
export declare function mergeEventsInOrder<T1 extends Types.TraceEvents.TraceEventData, T2 extends Types.TraceEvents.TraceEventData>(eventsArray1: readonly T1[], eventsArray2: readonly T2[]): (T1 | T2)[];
export declare function getNavigationForTraceEvent(event: Types.TraceEvents.TraceEventData, eventFrameId: string, navigationsByFrameId: Map<string, Types.TraceEvents.TraceEventNavigationStart[]>): Types.TraceEvents.TraceEventNavigationStart | null;
export declare function extractId(event: Types.TraceEvents.TraceEventPairableAsync | MatchedPairType<Types.TraceEvents.TraceEventPairableAsync>): string | undefined;
export declare function activeURLForFrameAtTime(frameId: string, time: Types.Timing.MicroSeconds, rendererProcessesByFrame: Map<string, Map<Types.TraceEvents.ProcessID, {
    frame: Types.TraceEvents.TraceFrame;
    window: Types.Timing.TraceWindowMicroSeconds;
}[]>>): string | null;
export declare function makeProfileCall(node: CPUProfile.ProfileTreeModel.ProfileNode, ts: Types.Timing.MicroSeconds, pid: Types.TraceEvents.ProcessID, tid: Types.TraceEvents.ThreadID): Types.TraceEvents.SyntheticProfileCall;
export declare function makeSyntheticTraceEntry(name: string, ts: Types.Timing.MicroSeconds, pid: Types.TraceEvents.ProcessID, tid: Types.TraceEvents.ThreadID): Types.TraceEvents.SyntheticTraceEntry;
export declare function matchBeginningAndEndEvents(unpairedEvents: Types.TraceEvents.TraceEventPairableAsync[]): Map<string, {
    begin: Types.TraceEvents.TraceEventPairableAsyncBegin | null;
    end: Types.TraceEvents.TraceEventPairableAsyncEnd | null;
}>;
export declare function createSortedSyntheticEvents<T extends Types.TraceEvents.TraceEventPairableAsync>(matchedPairs: Map<string, {
    begin: Types.TraceEvents.TraceEventPairableAsyncBegin | null;
    end: Types.TraceEvents.TraceEventPairableAsyncEnd | null;
}>, syntheticEventCallback?: (syntheticEvent: MatchedPairType<T>) => void): MatchedPairType<T>[];
export declare function createMatchedSortedSyntheticEvents<T extends Types.TraceEvents.TraceEventPairableAsync>(unpairedAsyncEvents: T[], syntheticEventCallback?: (syntheticEvent: MatchedPairType<T>) => void): MatchedPairType<T>[];
export {};
