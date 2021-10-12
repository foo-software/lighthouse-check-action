"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SilentRenderer = void 0;
class SilentRenderer {
    constructor(tasks, options) {
        this.tasks = tasks;
        this.options = options;
    }
    render() { }
    end() { }
}
exports.SilentRenderer = SilentRenderer;
SilentRenderer.nonTTY = true;
//# sourceMappingURL=silent.renderer.js.map