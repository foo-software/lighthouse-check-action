import { Event, SentryRequest, Session, SessionAggregates } from '@sentry/types';
import { APIDetails } from './api';
/** Creates a SentryRequest from a Session. */
export declare function sessionToSentryRequest(session: Session | SessionAggregates, api: APIDetails): SentryRequest;
/** Creates a SentryRequest from an event. */
export declare function eventToSentryRequest(event: Event, api: APIDetails): SentryRequest;
//# sourceMappingURL=request.d.ts.map