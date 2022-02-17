import { getCurrentHub } from '@sentry/hub';
import { logger } from '@sentry/utils';
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
export function initAndBind(clientClass, options) {
    if (options.debug === true) {
        logger.enable();
    }
    var hub = getCurrentHub();
    var scope = hub.getScope();
    if (scope) {
        scope.update(options.initialScope);
    }
    var client = new clientClass(options);
    hub.bindClient(client);
}
//# sourceMappingURL=sdk.js.map