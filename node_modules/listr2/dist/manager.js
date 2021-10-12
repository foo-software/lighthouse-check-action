"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const listr_1 = require("./listr");
class Manager {
    constructor(options) {
        this.options = options;
        this.err = [];
        this.tasks = [];
    }
    set ctx(ctx) {
        this.options.ctx = ctx;
    }
    add(tasks, options) {
        options = { ...this.options, ...options };
        this.tasks = [...this.tasks, this.indent(tasks, options)];
    }
    async runAll(options) {
        options = { ...this.options, ...options };
        const ctx = await this.run(this.tasks, options);
        this.tasks = [];
        return ctx;
    }
    newListr(tasks, options) {
        return new listr_1.Listr(tasks, options);
    }
    indent(tasks, options, taskOptions) {
        options = { ...this.options, ...options };
        let newTask;
        if (typeof tasks === 'function') {
            newTask = {
                ...taskOptions,
                task: (ctx) => this.newListr(tasks(ctx), options)
            };
        }
        else {
            newTask = {
                ...taskOptions,
                task: () => this.newListr(tasks, options)
            };
        }
        return newTask;
    }
    async run(tasks, options) {
        options = { ...this.options, ...options };
        const task = this.newListr(tasks, options);
        const ctx = await task.run();
        this.err = [];
        this.err = [...this.err, ...task.err];
        return ctx;
    }
    getRuntime(pipetime) {
        return `${Math.round(Date.now() - pipetime) / 1000}s`;
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map