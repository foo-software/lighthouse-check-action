"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listr = void 0;
const p_map_1 = __importDefault(require("p-map"));
const rxjs_1 = require("rxjs");
const listr_interface_1 = require("./interfaces/listr.interface");
const state_constants_1 = require("./interfaces/state.constants");
const task_1 = require("./lib/task");
const task_wrapper_1 = require("./lib/task-wrapper");
const renderer_1 = require("./utils/renderer");
class Listr {
    constructor(task, options) {
        var _a, _b, _c;
        this.task = task;
        this.options = options;
        this.tasks = [];
        this.err = [];
        this.renderHook$ = new rxjs_1.Subject();
        this.options = Object.assign({
            concurrent: false,
            renderer: 'default',
            nonTTYRenderer: 'verbose',
            exitOnError: true,
            registerSignalListeners: true
        }, options);
        this.concurrency = 1;
        if (this.options.concurrent === true) {
            this.concurrency = Infinity;
        }
        else if (typeof this.options.concurrent === 'number') {
            this.concurrency = this.options.concurrent;
        }
        const renderer = renderer_1.getRenderer(this.options.renderer, this.options.nonTTYRenderer, (_a = this.options) === null || _a === void 0 ? void 0 : _a.rendererFallback, (_b = this.options) === null || _b === void 0 ? void 0 : _b.rendererSilent);
        this.rendererClass = renderer.renderer;
        if (!renderer.nonTTY) {
            this.rendererClassOptions = this.options.rendererOptions;
        }
        else {
            this.rendererClassOptions = this.options.nonTTYRendererOptions;
        }
        this.add(task || []);
        if (this.options.registerSignalListeners) {
            process
                .on('SIGINT', async () => {
                await Promise.all(this.tasks.map(async (task) => {
                    if (task.isPending()) {
                        task.state$ = state_constants_1.stateConstants.FAILED;
                    }
                }));
                this.renderer.end(new Error('Interrupted.'));
                process.exit(127);
            })
                .setMaxListeners(0);
        }
        if ((_c = this.options) === null || _c === void 0 ? void 0 : _c.disableColor) {
            process.env.LISTR_DISABLE_COLOR = '1';
        }
    }
    add(task) {
        const tasks = Array.isArray(task) ? task : [task];
        tasks.forEach((task) => {
            this.tasks.push(new task_1.Task(this, task, this.options, { ...this.rendererClassOptions, ...task.options }));
        });
    }
    async run(context) {
        var _a;
        if (!this.renderer) {
            this.renderer = new this.rendererClass(this.tasks, this.rendererClassOptions, this.renderHook$);
        }
        this.renderer.render();
        context = context || ((_a = this.options) === null || _a === void 0 ? void 0 : _a.ctx) || Object.create({});
        const errors = [];
        await this.checkAll(context);
        try {
            await p_map_1.default(this.tasks, async (task) => {
                await this.checkAll(context);
                return this.runTask(task, context, errors);
            }, { concurrency: this.concurrency });
            this.renderer.end();
        }
        catch (error) {
            this.err.push(new listr_interface_1.ListrError(error, [error], context));
            if (this.options.exitOnError !== false) {
                this.renderer.end(error);
                throw error;
            }
        }
        finally {
            if (errors.length > 0) {
                this.err.push(new listr_interface_1.ListrError('Task failed without crashing.', errors, context));
            }
        }
        return context;
    }
    checkAll(context) {
        return Promise.all(this.tasks.map((task) => {
            task.check(context);
        }));
    }
    runTask(task, context, errors) {
        if (!task.isEnabled()) {
            return Promise.resolve();
        }
        return new task_wrapper_1.TaskWrapper(task, errors, this.options).run(context);
    }
}
exports.Listr = Listr;
//# sourceMappingURL=listr.js.map