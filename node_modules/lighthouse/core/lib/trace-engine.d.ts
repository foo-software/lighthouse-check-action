export type SyntheticLayoutShift = import('@paulirish/trace_engine').Types.TraceEvents.SyntheticLayoutShift;
export type SaneSyntheticLayoutShift = SyntheticLayoutShift & {
    args: {
        data: NonNullable<SyntheticLayoutShift['args']['data']>;
    };
};
export const TraceProcessor: typeof TraceEngine.Processor.TraceProcessor;
export const TraceHandlers: typeof TraceEngine.Handlers.ModelHandlers;
export const RootCauses: typeof TraceEngine.RootCauses.RootCauses.RootCauses;
import * as TraceEngine from '@paulirish/trace_engine';
//# sourceMappingURL=trace-engine.d.ts.map