export { ResponsivenessComputed as Responsiveness };
export type ResponsivenessEvent = LH.Trace.CompleteEvent & {
    name: 'Responsiveness.Renderer.UserInteraction';
    args: {
        frame: string;
        data: {
            interactionType: 'drag' | 'keyboard' | 'tapOrClick';
            maxDuration: number;
        };
    };
};
export type EventTimingType = 'keydown' | 'keypress' | 'keyup' | 'mousedown' | 'mouseup' | 'pointerdown' | 'pointerup' | 'click';
export type EventTimingData = {
    frame: string;
    /**
     * The time of user interaction (in ms from navStart).
     */
    timeStamp: number;
    /**
     * The start of interaction handling (in ms from navStart).
     */
    processingStart: number;
    /**
     * The end of interaction handling (in ms from navStart).
     */
    processingEnd: number;
    /**
     * The time from user interaction to browser paint (in ms).
     */
    duration: number;
    type: EventTimingType;
    nodeId: number;
    interactionId: number;
};
export type EventTimingEvent = LH.Trace.AsyncEvent & {
    name: 'EventTiming';
    args: {
        data: EventTimingData;
    };
};
declare const ResponsivenessComputed: typeof Responsiveness & {
    request: (dependencies: {
        trace: LH.Trace;
        settings: LH.Audit.Context['settings'];
    }, context: import("../../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<EventTimingEvent | null>;
};
declare class Responsiveness {
    /**
     * @param {LH.Artifacts.ProcessedTrace} processedTrace
     * @return {ResponsivenessEvent|null}
     */
    static getHighPercentileResponsiveness(processedTrace: LH.Artifacts.ProcessedTrace): ResponsivenessEvent | null;
    /**
     * Finds the interaction event that was probably the responsivenessEvent.maxDuration
     * source.
     * Note that (presumably due to rounding to ms), the interaction duration may not
     * be the same value as `maxDuration`, just the closest value. Function will throw
     * if the closest match is off by more than 4ms.
     * TODO: this doesn't try to match inputs to interactions and break ties if more than
     * one interaction had this duration by returning the first found.
     * @param {ResponsivenessEvent} responsivenessEvent
     * @param {LH.Trace} trace
     * @return {EventTimingEvent}
     */
    static findInteractionEvent(responsivenessEvent: ResponsivenessEvent, { traceEvents }: LH.Trace): EventTimingEvent;
    /**
     * @param {{trace: LH.Trace, settings: LH.Audit.Context['settings']}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<EventTimingEvent|null>}
     */
    static compute_(data: {
        trace: LH.Trace;
        settings: LH.Audit.Context['settings'];
    }, context: LH.Artifacts.ComputedContext): Promise<EventTimingEvent | null>;
}
import { ProcessedTrace } from '../processed-trace.js';
//# sourceMappingURL=responsiveness.d.ts.map