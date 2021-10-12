"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderer = void 0;
const default_renderer_1 = require("../renderer/default.renderer");
const silent_renderer_1 = require("../renderer/silent.renderer");
const verbose_renderer_1 = require("../renderer/verbose.renderer");
const renderers = {
    default: default_renderer_1.DefaultRenderer,
    verbose: verbose_renderer_1.VerboseRenderer,
    silent: silent_renderer_1.SilentRenderer
};
function isRendererSupported(renderer) {
    return process.stdout.isTTY === true || renderer.nonTTY === true;
}
function getRendererClass(renderer) {
    if (typeof renderer === 'string') {
        return renderers[renderer] || renderers.default;
    }
    return typeof renderer === 'function' ? renderer : renderers.default;
}
function getRenderer(renderer, fallbackRenderer, fallbackCondition, silentCondition) {
    let returnValue;
    let ret = getRendererClass(renderer);
    returnValue = { renderer: ret, nonTTY: false };
    let evaluateSilent;
    if (typeof silentCondition === 'function') {
        evaluateSilent = silentCondition();
    }
    else {
        evaluateSilent = silentCondition;
    }
    let evaluateFallback;
    if (typeof fallbackCondition === 'function') {
        evaluateFallback = fallbackCondition();
    }
    else {
        evaluateFallback = fallbackCondition;
    }
    if (evaluateSilent) {
        ret = getRendererClass('silent');
        returnValue = { renderer: ret, nonTTY: true };
    }
    else if (!isRendererSupported(ret) || evaluateFallback) {
        ret = getRendererClass(fallbackRenderer);
        returnValue = { renderer: ret, nonTTY: true };
    }
    return returnValue;
}
exports.getRenderer = getRenderer;
//# sourceMappingURL=renderer.js.map