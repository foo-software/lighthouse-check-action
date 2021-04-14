/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const Fetcher = require('./fetcher.js');
const ExecutionContext = require('./driver/execution-context.js');
const {waitForFullyLoaded, waitForFrameNavigated} = require('./driver/wait-for-condition.js');
const emulation = require('../lib/emulation.js');
const LHElement = require('../lib/lh-element.js');
const LHError = require('../lib/lh-error.js');
const NetworkRequest = require('../lib/network-request.js');
const EventEmitter = require('events').EventEmitter;
const i18n = require('../lib/i18n/i18n.js');
const URL = require('../lib/url-shim.js');
const constants = require('../config/constants.js');

const log = require('lighthouse-logger');
const DevtoolsLog = require('./devtools-log.js');
const TraceGatherer = require('./gatherers/trace.js');

const pageFunctions = require('../lib/page-functions.js');

// Pulled in for Connection type checking.
// eslint-disable-next-line no-unused-vars
const Connection = require('./connections/connection.js');
const NetworkMonitor = require('./driver/network-monitor.js');
const {getBrowserVersion} = require('./driver/environment.js');

const UIStrings = {
  /**
   * @description A warning that previously-saved data may have affected the measured performance and instructions on how to avoid the problem. "locations" will be a list of possible types of data storage locations, e.g. "IndexedDB",  "Local Storage", or "Web SQL".
   * @example {IndexedDB, Local Storage} locations
   */
  warningData: `{locationCount, plural,
    =1 {There may be stored data affecting loading performance in this location: {locations}. ` +
      `Audit this page in an incognito window to prevent those resources ` +
      `from affecting your scores.}
    other {There may be stored data affecting loading ` +
      `performance in these locations: {locations}. ` +
      `Audit this page in an incognito window to prevent those resources ` +
      `from affecting your scores.}
  }`,
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

// Controls how long to wait after FCP before continuing
const DEFAULT_PAUSE_AFTER_FCP = 0;
// Controls how long to wait after onLoad before continuing
const DEFAULT_PAUSE_AFTER_LOAD = 0;
// Controls how long to wait between network requests before determining the network is quiet
const DEFAULT_NETWORK_QUIET_THRESHOLD = 5000;
// Controls how long to wait between longtasks before determining the CPU is idle, off by default
const DEFAULT_CPU_QUIET_THRESHOLD = 0;
// Controls how long to wait for a response after sending a DevTools protocol command.
const DEFAULT_PROTOCOL_TIMEOUT = 30000;

/**
 * @typedef {LH.Protocol.StrictEventEmitter<LH.CrdpEvents>} CrdpEventEmitter
 */

/**
 * @implements {LH.Gatherer.FRTransitionalDriver}
 */
class Driver {
  /**
   * @pri_vate (This should be private, but that makes our tests harder).
   * An event emitter that enforces mapping between Crdp event names and payload types.
   */
  _eventEmitter = /** @type {CrdpEventEmitter} */ (new EventEmitter());

  /**
   * @private
   * Used to save network and lifecycle protocol traffic. Just Page and Network are needed.
   */
  _devtoolsLog = new DevtoolsLog(/^(Page|Network)\./);

  /**
   * @private
   * @type {Map<string, number>}
   */
  _domainEnabledCounts = new Map();

  /**
   * @type {number}
   * @private
   */
  _nextProtocolTimeout = DEFAULT_PROTOCOL_TIMEOUT;

  online = true;

  // eslint-disable-next-line no-invalid-this
  fetcher = new Fetcher(this);

  // eslint-disable-next-line no-invalid-this
  executionContext = new ExecutionContext(this);

  // eslint-disable-next-line no-invalid-this
  defaultSession = this;

  /**
   * @param {Connection} connection
   */
  constructor(connection) {
    this._connection = connection;
    this._networkMonitor = new NetworkMonitor(this);

    this.on('Target.attachedToTarget', event => {
      this._handleTargetAttached(event).catch(this._handleEventError);
    });
    this.on('Debugger.paused', () => this.sendCommand('Debugger.resume'));

    connection.on('protocolevent', this._handleProtocolEvent.bind(this));

    /** @private @deprecated Only available for plugin backcompat. */
    this.evaluate = this.executionContext.evaluate.bind(this.executionContext);
    /** @private @deprecated Only available for plugin backcompat. */
    this.evaluateAsync = this.executionContext.evaluateAsync.bind(this.executionContext);
  }

  /** @deprecated - Not available on Fraggle Rock driver. */
  static get traceCategories() {
    return TraceGatherer.getDefaultTraceCategories();
  }

  /**
   * @return {Promise<LH.Crdp.Browser.GetVersionResponse & {milestone: number}>}
   */
  async getBrowserVersion() {
    return getBrowserVersion(this);
  }

  /**
   * @return {Promise<void>}
   */
  async connect() {
    const status = {msg: 'Connecting to browser', id: 'lh:init:connect'};
    log.time(status);
    await this._connection.connect();
    log.timeEnd(status);
  }

  /**
   * @return {Promise<void>}
   */
  disconnect() {
    return this._connection.disconnect();
  }

  /**
   * Get the browser WebSocket endpoint for devtools protocol clients like Puppeteer.
   * Only works with WebSocket connection, not extension or devtools.
   * @return {Promise<string>}
   */
  wsEndpoint() {
    return this._connection.wsEndpoint();
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  on(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }

    // log event listeners being bound
    log.formatProtocol('listen for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.on(eventName, cb);
  }

  /**
   * Bind a one-time listener for protocol events. Listener is removed once it
   * has been called.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  once(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }
    // log event listeners being bound
    log.formatProtocol('listen once for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.once(eventName, cb);
  }

  /**
   * Unbind event listener.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {Function} cb
   */
  off(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to remove an event listener.');
    }

    this._eventEmitter.removeListener(eventName, cb);
  }

  /**
   * Bind to *any* protocol event.
   * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
   */
  addProtocolMessageListener(callback) {
    this._connection.on('protocolevent', callback);
  }

  /**
   * Unbind to *any* protocol event.
   * @param {(payload: LH.Protocol.RawEventMessage) => void} callback
   */
  removeProtocolMessageListener(callback) {
    this._connection.off('protocolevent', callback);
  }

  /**
   * Debounce enabling or disabling domains to prevent driver users from
   * stomping on each other. Maintains an internal count of the times a domain
   * has been enabled. Returns false if the command would have no effect (domain
   * is already enabled or disabled), or if command would interfere with another
   * user of that domain (e.g. two gatherers have enabled a domain, both need to
   * disable it for it to be disabled). Returns true otherwise.
   * @param {string} domain
   * @param {string|undefined} sessionId
   * @param {boolean} enable
   * @return {boolean}
   * @private
   */
  _shouldToggleDomain(domain, sessionId, enable) {
    const key = domain + (sessionId || '');
    const enabledCount = this._domainEnabledCounts.get(key) || 0;
    const newCount = enabledCount + (enable ? 1 : -1);
    this._domainEnabledCounts.set(key, Math.max(0, newCount));

    // Switching to enabled or disabled, respectively.
    if ((enable && newCount === 1) || (!enable && newCount === 0)) {
      log.verbose('Driver', `${domain}.${enable ? 'enable' : 'disable'}`);
      return true;
    } else {
      if (newCount < 0) {
        log.error('Driver', `Attempted to disable domain '${domain}' when already disabled.`);
      }
      return false;
    }
  }

  /**
   * @return {boolean}
   */
  hasNextProtocolTimeout() {
    return this._nextProtocolTimeout !== DEFAULT_PROTOCOL_TIMEOUT;
  }

  /**
   * @return {number}
   */
  getNextProtocolTimeout() {
    return this._nextProtocolTimeout;
  }

  /**
   * timeout is used for the next call to 'sendCommand'.
   * NOTE: This can eventually be replaced when TypeScript
   * resolves https://github.com/Microsoft/TypeScript/issues/5453.
   * @param {number} timeout
   */
  setNextProtocolTimeout(timeout) {
    this._nextProtocolTimeout = timeout;
  }

  /**
   * @param {LH.Protocol.RawEventMessage} event
   */
  _handleProtocolEvent(event) {
    this._devtoolsLog.record(event);

    // @ts-expect-error TODO(bckenny): tsc can't type event.params correctly yet,
    // typing as property of union instead of narrowing from union of
    // properties. See https://github.com/Microsoft/TypeScript/pull/22348.
    this._eventEmitter.emit(event.method, event.params);
  }

  /**
   * @param {Error} error
   */
  _handleEventError(error) {
    log.error('Driver', 'Unhandled event error', error.message);
  }

  /**
   * @param {LH.Crdp.Target.AttachedToTargetEvent} event
   */
  async _handleTargetAttached(event) {
    // We're only interested in network requests from iframes for now as those are "part of the page".
    // If it's not an iframe, just resume it and move on.
    if (event.targetInfo.type !== 'iframe') {
      // We suspended the target when we auto-attached, so make sure it goes back to being normal.
      await this.sendCommandToSession('Runtime.runIfWaitingForDebugger', event.sessionId);
      return;
    }

    // Events from subtargets will be stringified and sent back on `Target.receivedMessageFromTarget`.
    // We want to receive information about network requests from iframes, so enable the Network domain.
    await this.sendCommandToSession('Network.enable', event.sessionId);

    // We also want to receive information about subtargets of subtargets, so make sure we autoattach recursively.
    await this.sendCommandToSession('Target.setAutoAttach', event.sessionId, {
      autoAttach: true,
      flatten: true,
      // Pause targets on startup so we don't miss anything
      waitForDebuggerOnStart: true,
    });

    // We suspended the target when we auto-attached, so make sure it goes back to being normal.
    await this.sendCommandToSession('Runtime.runIfWaitingForDebugger', event.sessionId);
  }

  /**
   * Call protocol methods, with a timeout.
   * To configure the timeout for the next call, use 'setNextProtocolTimeout'.
   * If 'sessionId' is undefined, the message is sent to the main session.
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {string|undefined} sessionId
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommandToSession(method, sessionId, ...params) {
    const timeout = this._nextProtocolTimeout;
    this._nextProtocolTimeout = DEFAULT_PROTOCOL_TIMEOUT;
    return new Promise(async (resolve, reject) => {
      const asyncTimeout = setTimeout((() => {
        const err = new LHError(
          LHError.errors.PROTOCOL_TIMEOUT,
          {protocolMethod: method}
        );
        reject(err);
      }), timeout);
      try {
        const result = await this._innerSendCommand(method, sessionId, ...params);
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        clearTimeout(asyncTimeout);
      }
    });
  }

  /**
   * Alias for 'sendCommandToSession(method, undefined, ...params)'
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...params) {
    return this.sendCommandToSession(method, undefined, ...params);
  }

  /**
   * Call protocol methods.
   * @private
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {string|undefined} sessionId
   * @param {LH.CrdpCommands[C]['paramsType']} params
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  _innerSendCommand(method, sessionId, ...params) {
    const domainCommand = /^(\w+)\.(enable|disable)$/.exec(method);
    if (domainCommand) {
      const enable = domainCommand[2] === 'enable';
      if (!this._shouldToggleDomain(domainCommand[1], sessionId, enable)) {
        return Promise.resolve();
      }
    }
    return this._connection.sendCommand(method, sessionId, ...params);
  }

  /**
   * Returns whether a domain is currently enabled.
   * @param {string} domain
   * @return {boolean}
   */
  isDomainEnabled(domain) {
    // Defined, non-zero elements of the domains map are enabled.
    return !!this._domainEnabledCounts.get(domain);
  }

  /**
   * Add a script to run at load time of all future page loads.
   * @param {string} scriptSource
   * @return {Promise<LH.Crdp.Page.AddScriptToEvaluateOnLoadResponse>} Identifier of the added script.
   */
  evaluateScriptOnNewDocument(scriptSource) {
    return this.sendCommand('Page.addScriptToEvaluateOnLoad', {
      scriptSource,
    });
  }

  /**
   * @return {Promise<LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent>}
   */
  getServiceWorkerVersions() {
    return new Promise((resolve, reject) => {
      /**
       * @param {LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent} data
       */
      const versionUpdatedListener = data => {
        // find a service worker with runningStatus that looks like active
        // on slow connections the serviceworker might still be installing
        const activateCandidates = data.versions.filter(sw => {
          return sw.status !== 'redundant';
        });
        const hasActiveServiceWorker = activateCandidates.find(sw => {
          return sw.status === 'activated';
        });

        if (!activateCandidates.length || hasActiveServiceWorker) {
          this.off('ServiceWorker.workerVersionUpdated', versionUpdatedListener);
          this.sendCommand('ServiceWorker.disable')
            .then(_ => resolve(data), reject);
        }
      };

      this.on('ServiceWorker.workerVersionUpdated', versionUpdatedListener);

      this.sendCommand('ServiceWorker.enable').catch(reject);
    });
  }

  /**
   * @return {Promise<LH.Crdp.ServiceWorker.WorkerRegistrationUpdatedEvent>}
   */
  getServiceWorkerRegistrations() {
    return new Promise((resolve, reject) => {
      this.once('ServiceWorker.workerRegistrationUpdated', data => {
        this.sendCommand('ServiceWorker.disable')
          .then(_ => resolve(data), reject);
      });

      this.sendCommand('ServiceWorker.enable').catch(reject);
    });
  }

  /**
   * Rejects if any open tabs would share a service worker with the target URL.
   * This includes the target tab, so navigation to something like about:blank
   * should be done before calling.
   * @param {string} pageUrl
   * @return {Promise<void>}
   */
  assertNoSameOriginServiceWorkerClients(pageUrl) {
    /** @type {Array<LH.Crdp.ServiceWorker.ServiceWorkerRegistration>} */
    let registrations;
    /** @type {Array<LH.Crdp.ServiceWorker.ServiceWorkerVersion>} */
    let versions;

    return this.getServiceWorkerRegistrations().then(data => {
      registrations = data.registrations;
    }).then(_ => this.getServiceWorkerVersions()).then(data => {
      versions = data.versions;
    }).then(_ => {
      const origin = new URL(pageUrl).origin;

      registrations
        .filter(reg => {
          const swOrigin = new URL(reg.scopeURL).origin;

          return origin === swOrigin;
        })
        .forEach(reg => {
          versions.forEach(ver => {
            // Ignore workers unaffiliated with this registration
            if (ver.registrationId !== reg.registrationId) {
              return;
            }

            // Throw if service worker for this origin has active controlledClients.
            if (ver.controlledClients && ver.controlledClients.length > 0) {
              throw new Error('You probably have multiple tabs open to the same origin.');
            }
          });
        });
    });
  }

  /**
   * Navigate to the given URL. Direct use of this method isn't advised: if
   * the current page is already at the given URL, navigation will not occur and
   * so the returned promise will only resolve after the MAX_WAIT_FOR_FULLY_LOADED
   * timeout. See https://github.com/GoogleChrome/lighthouse/pull/185 for one
   * possible workaround.
   * Resolves on the url of the loaded page, taking into account any redirects.
   * @param {string} url
   * @param {{waitForFcp?: boolean, waitForLoad?: boolean, waitForNavigated?: boolean, passContext?: LH.Gatherer.PassContext}} options
   * @return {Promise<{finalUrl: string, timedOut: boolean}>}
   */
  async gotoURL(url, options = {}) {
    const waitForFcp = options.waitForFcp || false;
    const waitForNavigated = options.waitForNavigated || false;
    const waitForLoad = options.waitForLoad || false;
    /** @type {Partial<LH.Gatherer.PassContext>} */
    const passContext = options.passContext || {};

    if (waitForNavigated && (waitForFcp || waitForLoad)) {
      throw new Error('Cannot use both waitForNavigated and another event, pick just one');
    }

    await this._networkMonitor.enable();
    await this.executionContext.clearContextId();

    // Enable auto-attaching to subtargets so we receive iframe information
    await this.sendCommand('Target.setAutoAttach', {
      flatten: true,
      autoAttach: true,
      // Pause targets on startup so we don't miss anything
      waitForDebuggerOnStart: true,
    });

    await this.sendCommand('Page.enable');
    await this.sendCommand('Page.setLifecycleEventsEnabled', {enabled: true});
    // No timeout needed for Page.navigate. See https://github.com/GoogleChrome/lighthouse/pull/6413.
    const waitforPageNavigateCmd = this._innerSendCommand('Page.navigate', undefined, {url});

    let timedOut = false;
    if (waitForNavigated) {
      await waitForFrameNavigated(this).promise;
    } else if (waitForLoad) {
      /** @type {Partial<LH.Config.Pass>} */
      const passConfig = passContext.passConfig || {};

      /* eslint-disable max-len */
      let {pauseAfterFcpMs, pauseAfterLoadMs, networkQuietThresholdMs, cpuQuietThresholdMs} = passConfig;
      let maxWaitMs = passContext.settings && passContext.settings.maxWaitForLoad;
      let maxFCPMs = passContext.settings && passContext.settings.maxWaitForFcp;

      if (typeof pauseAfterFcpMs !== 'number') pauseAfterFcpMs = DEFAULT_PAUSE_AFTER_FCP;
      if (typeof pauseAfterLoadMs !== 'number') pauseAfterLoadMs = DEFAULT_PAUSE_AFTER_LOAD;
      if (typeof networkQuietThresholdMs !== 'number') networkQuietThresholdMs = DEFAULT_NETWORK_QUIET_THRESHOLD;
      if (typeof cpuQuietThresholdMs !== 'number') cpuQuietThresholdMs = DEFAULT_CPU_QUIET_THRESHOLD;
      if (typeof maxWaitMs !== 'number') maxWaitMs = constants.defaultSettings.maxWaitForLoad;
      if (typeof maxFCPMs !== 'number') maxFCPMs = constants.defaultSettings.maxWaitForFcp;
      /* eslint-enable max-len */

      if (!waitForFcp) maxFCPMs = undefined;
      const waitOptions = {pauseAfterFcpMs, pauseAfterLoadMs, networkQuietThresholdMs,
        cpuQuietThresholdMs, maxWaitForLoadedMs: maxWaitMs, maxWaitForFcpMs: maxFCPMs};
      const loadResult = await waitForFullyLoaded(this, this._networkMonitor, waitOptions);
      timedOut = loadResult.timedOut;
    }

    const finalUrl = await this._networkMonitor.getFinalNavigationUrl() || url;

    // Bring `Page.navigate` errors back into the promise chain. See https://github.com/GoogleChrome/lighthouse/pull/6739.
    await waitforPageNavigateCmd;
    await this._networkMonitor.disable();

    return {
      finalUrl,
      timedOut,
    };
  }

  /**
   * @param {string} objectId Object ID for the resolved DOM node
   * @param {string} propName Name of the property
   * @return {Promise<string|null>} The property value, or null, if property not found
  */
  async getObjectProperty(objectId, propName) {
    const propertiesResponse = await this.sendCommand('Runtime.getProperties', {
      objectId,
      accessorPropertiesOnly: true,
      generatePreview: false,
      ownProperties: false,
    });

    const propertyForName = propertiesResponse.result
        .find(property => property.name === propName);

    if (propertyForName && propertyForName.value) {
      return propertyForName.value.value;
    } else {
      return null;
    }
  }

  /**
   * Return the body of the response with the given ID. Rejects if getting the
   * body times out.
   * @param {string} requestId
   * @param {number} [timeout]
   * @return {Promise<string>}
   */
  async getRequestContent(requestId, timeout = 1000) {
    requestId = NetworkRequest.getRequestIdForBackend(requestId);

    // Encoding issues may lead to hanging getResponseBody calls: https://github.com/GoogleChrome/lighthouse/pull/4718
    // driver.sendCommand will handle timeout after 1s.
    this.setNextProtocolTimeout(timeout);
    const result = await this.sendCommand('Network.getResponseBody', {requestId});
    return result.body;
  }

  /**
   * @param {string} selector Selector to find in the DOM
   * @return {Promise<LHElement|null>} The found element, or null, resolved in a promise
   */
  async querySelector(selector) {
    const documentResponse = await this.sendCommand('DOM.getDocument');
    const rootNodeId = documentResponse.root.nodeId;

    const targetNode = await this.sendCommand('DOM.querySelector', {
      nodeId: rootNodeId,
      selector,
    });

    if (targetNode.nodeId === 0) {
      return null;
    }
    return new LHElement(targetNode, this);
  }

  /**
   * Resolves a backend node ID (from a trace event, protocol, etc) to the object ID for use with
   * `Runtime.callFunctionOn`. `undefined` means the node could not be found.
   *
   * @param {number} backendNodeId
   * @return {Promise<string|undefined>}
   */
  async resolveNodeIdToObjectId(backendNodeId) {
    try {
      const resolveNodeResponse = await this.sendCommand('DOM.resolveNode', {backendNodeId});
      return resolveNodeResponse.object.objectId;
    } catch (err) {
      if (/No node.*found/.test(err.message) ||
        /Node.*does not belong to the document/.test(err.message)) return undefined;
      throw err;
    }
  }

  /**
   * Resolves a proprietary devtools node path (created from page-function.js) to the object ID for use
   * with `Runtime.callFunctionOn`. `undefined` means the node could not be found.
   * Requires `DOM.getDocument` to have been called since the object's creation or it will always be `undefined`.
   *
   * @param {string} devtoolsNodePath
   * @return {Promise<string|undefined>}
   */
  async resolveDevtoolsNodePathToObjectId(devtoolsNodePath) {
    try {
      const {nodeId} = await this.sendCommand('DOM.pushNodeByPathToFrontend', {
        path: devtoolsNodePath,
      });

      const {object: {objectId}} = await this.sendCommand('DOM.resolveNode', {
        nodeId,
      });

      return objectId;
    } catch (err) {
      if (/No node.*found/.test(err.message)) return undefined;
      throw err;
    }
  }

  /**
   * @param {{x: number, y: number}} position
   * @return {Promise<void>}
   */
  scrollTo(position) {
    const scrollExpression = `window.scrollTo(${position.x}, ${position.y})`;
    return this.executionContext.evaluateAsync(scrollExpression, {useIsolation: true});
  }

  /**
   * @return {Promise<{x: number, y: number}>}
   */
  getScrollPosition() {
    return this.executionContext.evaluateAsync(`({x: window.scrollX, y: window.scrollY})`,
      {useIsolation: true});
  }

  /**
   * @param {{additionalTraceCategories?: string|null}=} settings
   * @return {Promise<void>}
   */
  async beginTrace(settings) {
    const additionalCategories = (settings && settings.additionalTraceCategories &&
        settings.additionalTraceCategories.split(',')) || [];
    const traceCategories = TraceGatherer.getDefaultTraceCategories().concat(additionalCategories);

    const uniqueCategories = Array.from(new Set(traceCategories));

    // Check any domains that could interfere with or add overhead to the trace.
    if (this.isDomainEnabled('CSS')) {
      throw new Error('CSS domain enabled when starting trace');
    }
    if (this.isDomainEnabled('DOM')) {
      throw new Error('DOM domain enabled when starting trace');
    }

    // Enable Page domain to wait for Page.loadEventFired
    return this.sendCommand('Page.enable')
      .then(_ => this.sendCommand('Tracing.start', {
        categories: uniqueCategories.join(','),
        options: 'sampling-frequency=10000', // 1000 is default and too slow.
      }));
  }

  /**
   * @return {Promise<LH.Trace>}
   */
  endTrace() {
    return TraceGatherer.endTraceAndCollectEvents(this.defaultSession);
  }

  /**
   * Begin recording devtools protocol messages.
   */
  beginDevtoolsLog() {
    this._devtoolsLog.reset();
    this._devtoolsLog.beginRecording();
  }

  /**
   * Stop recording to devtoolsLog and return log contents.
   * @return {LH.DevtoolsLog}
   */
  endDevtoolsLog() {
    this._devtoolsLog.endRecording();
    return this._devtoolsLog.messages;
  }

  /**
   * @return {Promise<void>}
   */
  enableRuntimeEvents() {
    return this.sendCommand('Runtime.enable');
  }

  /**
   * Enables `Debugger` domain to receive async stacktrace information on network request initiators.
   * This is critical for tracing certain performance simulation situations.
   *
   * @return {Promise<void>}
   */
  async enableAsyncStacks() {
    await this.sendCommand('Debugger.enable');
    await this.sendCommand('Debugger.setSkipAllPauses', {skip: true});
    await this.sendCommand('Debugger.setAsyncCallStackDepth', {maxDepth: 8});
  }

  /**
   * @param {LH.Config.Settings} settings
   * @return {Promise<void>}
   */
  async beginEmulation(settings) {
    await emulation.emulate(this, settings);
    await this.setThrottling(settings, {useThrottling: true});
  }

  /**
   * @param {LH.Config.Settings} settings
   * @param {{useThrottling?: boolean}} passConfig
   * @return {Promise<void>}
   */
  async setThrottling(settings, passConfig) {
    if (settings.throttlingMethod !== 'devtools') {
      return emulation.clearAllNetworkEmulation(this);
    }

    const cpuPromise = passConfig.useThrottling ?
        emulation.enableCPUThrottling(this, settings.throttling) :
        emulation.disableCPUThrottling(this);
    const networkPromise = passConfig.useThrottling ?
        emulation.enableNetworkThrottling(this, settings.throttling) :
        emulation.clearAllNetworkEmulation(this);

    await Promise.all([cpuPromise, networkPromise]);
  }

  /**
   * Clear the network cache on disk and in memory.
   * @return {Promise<void>}
   */
  async cleanBrowserCaches() {
    const status = {msg: 'Cleaning browser cache', id: 'lh:driver:cleanBrowserCaches'};
    log.time(status);

    // Wipe entire disk cache
    await this.sendCommand('Network.clearBrowserCache');
    // Toggle 'Disable Cache' to evict the memory cache
    await this.sendCommand('Network.setCacheDisabled', {cacheDisabled: true});
    await this.sendCommand('Network.setCacheDisabled', {cacheDisabled: false});

    log.timeEnd(status);
  }

  /**
   * @param {LH.Crdp.Network.Headers|null} headers key/value pairs of HTTP Headers.
   * @return {Promise<void>}
   */
  async setExtraHTTPHeaders(headers) {
    if (!headers) {
      return;
    }

    return this.sendCommand('Network.setExtraHTTPHeaders', {headers});
  }

  /**
   * @param {string} url
   * @return {Promise<void>}
   */
  async clearDataForOrigin(url) {
    const origin = new URL(url).origin;

    // Clear some types of storage.
    // Cookies are not cleared, so the user isn't logged out.
    // indexeddb, websql, and localstorage are not cleared to prevent loss of potentially important data.
    //   https://chromedevtools.github.io/debugger-protocol-viewer/tot/Storage/#type-StorageType
    const typesToClear = [
      'appcache',
      // 'cookies',
      'file_systems',
      'shader_cache',
      'service_workers',
      'cache_storage',
    ].join(',');

    // `Storage.clearDataForOrigin` is one of our PROTOCOL_TIMEOUT culprits and this command is also
    // run in the context of PAGE_HUNG to cleanup. We'll keep the timeout low and just warn if it fails.
    this.setNextProtocolTimeout(5000);

    try {
      await this.sendCommand('Storage.clearDataForOrigin', {
        origin: origin,
        storageTypes: typesToClear,
      });
    } catch (err) {
      if (/** @type {LH.LighthouseError} */(err).code === 'PROTOCOL_TIMEOUT') {
        log.warn('Driver', 'clearDataForOrigin timed out');
      } else {
        throw err;
      }
    }
  }

  /**
   * @param {string} url
   * @return {Promise<LH.IcuMessage | undefined>}
   */
  async getImportantStorageWarning(url) {
    const usageData = await this.sendCommand('Storage.getUsageAndQuota', {
      origin: url,
    });
    /** @type {Record<string, string>} */
    const storageTypeNames = {
      local_storage: 'Local Storage',
      indexeddb: 'IndexedDB',
      websql: 'Web SQL',
    };
    const locations = usageData.usageBreakdown
      .filter(usage => usage.usage)
      .map(usage => storageTypeNames[usage.storageType] || '')
      .filter(Boolean);
    if (locations.length) {
      // TODO(#11495): Use Intl.ListFormat with Node 12
      return str_(
        UIStrings.warningData,
        {locations: locations.join(', '), locationCount: locations.length}
      );
    }
  }

  /**
   * Cache native functions/objects inside window
   * so we are sure polyfills do not overwrite the native implementations
   * @return {Promise<void>}
   */
  async cacheNatives() {
    await this.evaluateScriptOnNewDocument(`
        window.__nativePromise = Promise;
        window.__nativeURL = URL;
        window.__ElementMatches = Element.prototype.matches;
        window.__perfNow = performance.now.bind(performance);
    `);
  }

  /**
   * Install a performance observer that watches longtask timestamps for waitForCPUIdle.
   * @return {Promise<void>}
   */
  async registerPerformanceObserver() {
    const scriptStr = `(${pageFunctions.registerPerformanceObserverInPageString})()`;
    await this.evaluateScriptOnNewDocument(scriptStr);
  }

  /**
   * Use a RequestIdleCallback shim for tests run with simulated throttling, so that the deadline can be used without
   * a penalty
   * @param {LH.Config.Settings} settings
   * @return {Promise<void>}
   */
  async registerRequestIdleCallbackWrap(settings) {
    if (settings.throttlingMethod === 'simulate') {
      const scriptStr = `(${pageFunctions.wrapRequestIdleCallbackString})
        (${settings.throttling.cpuSlowdownMultiplier})`;
      await this.evaluateScriptOnNewDocument(scriptStr);
    }
  }

  /**
   * @param {Array<string>} urls URL patterns to block. Wildcards ('*') are allowed.
   * @return {Promise<void>}
   */
  blockUrlPatterns(urls) {
    return this.sendCommand('Network.setBlockedURLs', {urls})
      .catch(err => {
        // TODO(COMPAT): remove this handler once m59 hits stable
        if (!/wasn't found/.test(err.message)) {
          throw err;
        }
      });
  }

  /**
   * Dismiss JavaScript dialogs (alert, confirm, prompt), providing a
   * generic promptText in case the dialog is a prompt.
   * @return {Promise<void>}
   */
  async dismissJavaScriptDialogs() {
    this.on('Page.javascriptDialogOpening', data => {
      log.warn('Driver', `${data.type} dialog opened by the page automatically suppressed.`);

      this.sendCommand('Page.handleJavaScriptDialog', {
        accept: true,
        promptText: 'Lighthouse prompt response',
      }).catch(err => log.warn('Driver', err));
    });

    await this.sendCommand('Page.enable');
  }
}

module.exports = Driver;
module.exports.UIStrings = UIStrings;
