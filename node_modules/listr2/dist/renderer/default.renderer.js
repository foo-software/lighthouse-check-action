"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRenderer = void 0;
const cli_truncate_1 = __importDefault(require("cli-truncate"));
const figures_1 = __importDefault(require("figures"));
const indent_string_1 = __importDefault(require("indent-string"));
const log_update_1 = __importDefault(require("log-update"));
const chalk_1 = __importDefault(require("../utils/chalk"));
class DefaultRenderer {
    constructor(tasks, options, renderHook$) {
        this.tasks = tasks;
        this.options = options;
        this.renderHook$ = renderHook$;
        this.bottomBar = {};
        this.spinner = process.platform === 'win32' && !process.env.WT_SESSION ? ['-', '\\', '|', '/'] : ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.spinnerPosition = 0;
        this.options = { ...DefaultRenderer.rendererOptions, ...this.options };
    }
    getTaskOptions(task) {
        return { ...DefaultRenderer.rendererTaskOptions, ...task.rendererTaskOptions };
    }
    isBottomBar(task) {
        const bottomBar = this.getTaskOptions(task).bottomBar;
        return typeof bottomBar === 'number' && bottomBar !== 0 || typeof bottomBar === 'boolean' && bottomBar !== false;
    }
    hasPersistentOutput(task) {
        return this.getTaskOptions(task).persistentOutput === true;
    }
    hasTimer(task) {
        return this.getTaskOptions(task).showTimer === true;
    }
    getTaskTime(task) {
        const seconds = Math.floor(task.message.duration / 1000);
        const minutes = Math.floor(seconds / 60);
        let parsedTime;
        if (seconds === 0 && minutes === 0) {
            parsedTime = `0.${Math.floor(task.message.duration / 100)}s`;
        }
        if (seconds > 0) {
            parsedTime = `${seconds % 60}s`;
        }
        if (minutes > 0) {
            parsedTime = `${minutes}m${parsedTime}`;
        }
        return chalk_1.default.dim(`[${parsedTime}]`);
    }
    render() {
        var _a;
        if (this.id) {
            return;
        }
        const updateRender = () => log_update_1.default(this.multiLineRenderer(this.tasks), this.renderBottomBar(), this.renderPrompt());
        if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.lazy)) {
            this.id = setInterval(() => {
                this.spinnerPosition = ++this.spinnerPosition % this.spinner.length;
                updateRender();
            }, 100);
        }
        this.renderHook$.subscribe(() => {
            updateRender();
        });
    }
    end() {
        clearInterval(this.id);
        if (this.id) {
            this.id = undefined;
        }
        log_update_1.default(this.multiLineRenderer(this.tasks), this.renderBottomBar());
        if (this.options.clearOutput) {
            log_update_1.default.clear();
        }
        else {
            log_update_1.default.done();
        }
    }
    multiLineRenderer(tasks, level = 0) {
        let output = [];
        for (const task of tasks) {
            if (task.isEnabled()) {
                if (task.hasTitle()) {
                    if (!(tasks.some((task) => task.hasFailed()) && !task.hasFailed() && task.options.exitOnError !== false && !(task.isCompleted() || task.isSkipped()))) {
                        output = [...output, this.formatString(task.title, this.getSymbol(task), level)];
                    }
                    else {
                        output = [...output, this.formatString(task.title, chalk_1.default.red(figures_1.default.main.squareSmallFilled), level)];
                    }
                    if (task.isSkipped() && this.options.collapseSkips) {
                        task.title = !task.message.skip ? `${task.cleanTitle} ` : `${task.message.skip} ` + chalk_1.default.dim('[SKIPPED]');
                    }
                    else if (task.isSkipped() && this.options.collapseSkips === false) {
                        output = [...output, ...this.dumpData(task, level, 'skip')];
                    }
                }
                if (task === null || task === void 0 ? void 0 : task.output) {
                    if (task.isPending() && task.isPrompt()) {
                        this.promptBar = task.output;
                    }
                    else if (this.isBottomBar(task) || !task.hasTitle()) {
                        const data = this.dumpData(task, -1);
                        if (!this.bottomBar[task.id]) {
                            this.bottomBar[task.id] = {};
                            this.bottomBar[task.id].data = [];
                            const bottomBar = this.getTaskOptions(task).bottomBar;
                            if (typeof bottomBar === 'boolean') {
                                this.bottomBar[task.id].items = 1;
                            }
                            else {
                                this.bottomBar[task.id].items = bottomBar;
                            }
                        }
                        if (!(data === null || data === void 0 ? void 0 : data.some((element) => this.bottomBar[task.id].data.includes(element))) && !task.isSkipped()) {
                            this.bottomBar[task.id].data = [...this.bottomBar[task.id].data, ...data];
                        }
                    }
                    else if (task.isPending() || this.hasPersistentOutput(task)) {
                        output = [...output, ...this.dumpData(task, level)];
                    }
                }
                if (this.options.showSubtasks !== false &&
                    task.hasSubtasks() &&
                    (task.isPending() ||
                        task.hasFailed() ||
                        task.isCompleted() && !task.hasTitle() ||
                        task.isCompleted() && this.options.collapse === false && !task.subtasks.some((subtask) => subtask.rendererOptions.collapse === true) ||
                        task.subtasks.some((subtask) => subtask.rendererOptions.collapse === false) ||
                        task.subtasks.some((subtask) => subtask.hasFailed()))) {
                    const subtaskLevel = !task.hasTitle() ? level : level + 1;
                    const subtaskRender = this.multiLineRenderer(task.subtasks, subtaskLevel);
                    if ((subtaskRender === null || subtaskRender === void 0 ? void 0 : subtaskRender.trim()) !== '' && !task.subtasks.every((subtask) => !subtask.hasTitle())) {
                        output = [...output, subtaskRender];
                    }
                }
                if (task.isCompleted() || task.hasFailed() || task.isSkipped()) {
                    this.promptBar = null;
                    if (!this.hasPersistentOutput(task)) {
                        delete this.bottomBar[task.id];
                    }
                    if (task.isCompleted() && task.hasTitle() && (this.options.showTimer || this.hasTimer(task))) {
                        task.title = `${task === null || task === void 0 ? void 0 : task.cleanTitle} ${this.getTaskTime(task)}`;
                    }
                }
            }
        }
        if (output.length > 0) {
            return output.join('\n');
        }
        else {
            return;
        }
    }
    renderBottomBar() {
        if (Object.keys(this.bottomBar).length > 0) {
            this.bottomBar = Object.keys(this.bottomBar).reduce((o, key) => {
                if (!(o === null || o === void 0 ? void 0 : o[key])) {
                    o[key] = {};
                }
                o[key] = this.bottomBar[key];
                this.bottomBar[key].data = this.bottomBar[key].data.slice(-this.bottomBar[key].items);
                o[key].data = this.bottomBar[key].data;
                return o;
            }, {});
            const returnRender = Object.values(this.bottomBar).reduce((o, value) => o = [...o, ...value.data], []);
            return ['\n', ...returnRender].join('\n');
        }
    }
    renderPrompt() {
        if (this.promptBar) {
            return `\n\n${this.promptBar}`;
        }
    }
    dumpData(task, level, source = 'output') {
        const output = [];
        let data;
        switch (source) {
            case 'output':
                data = task.output;
                break;
            case 'skip':
                data = task.message.skip;
                break;
            case 'error':
                data = task.message.error;
                break;
        }
        if (typeof data === 'string') {
            data
                .split('\n')
                .filter(Boolean)
                .forEach((line, i) => {
                const icon = i === 0 ? this.getSymbol(task, true) : ' ';
                output.push(this.formatString(line, icon, level + 1));
            });
        }
        return output;
    }
    formatString(string, icon, level) {
        var _a;
        return `${cli_truncate_1.default(indent_string_1.default(`${icon} ${string}`, level * this.options.indentation), (_a = process.stdout.columns) !== null && _a !== void 0 ? _a : 80)}`;
    }
    getSymbol(task, data = false) {
        var _a;
        if (task.isPending() && !data) {
            return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.lazy) || this.options.showSubtasks !== false && task.hasSubtasks() && !task.subtasks.every((subtask) => !subtask.hasTitle())
                ? chalk_1.default.yellow(figures_1.default.main.pointer)
                : chalk_1.default.yellowBright(this.spinner[this.spinnerPosition]);
        }
        if (task.isCompleted() && !data) {
            if (task.hasSubtasks() && task.subtasks.some((subtask) => subtask.hasFailed())) {
                return chalk_1.default.yellow(figures_1.default.main.warning);
            }
            return chalk_1.default.green(figures_1.default.main.tick);
        }
        if (task.hasFailed() && !data) {
            return task.hasSubtasks() ? chalk_1.default.red(figures_1.default.main.pointer) : chalk_1.default.red(figures_1.default.main.cross);
        }
        if (task.isSkipped() && !data && this.options.collapseSkips === false) {
            return chalk_1.default.yellow(figures_1.default.main.warning);
        }
        else if (task.isSkipped() && (data || this.options.collapseSkips)) {
            return chalk_1.default.yellow(figures_1.default.main.arrowDown);
        }
        if (!data) {
            return chalk_1.default.dim(figures_1.default.main.squareSmallFilled);
        }
        else {
            return figures_1.default.main.pointerSmall;
        }
    }
}
exports.DefaultRenderer = DefaultRenderer;
DefaultRenderer.nonTTY = false;
DefaultRenderer.rendererOptions = {
    indentation: 2,
    clearOutput: false,
    showSubtasks: true,
    collapse: true,
    collapseSkips: true,
    lazy: false,
    showTimer: false
};
//# sourceMappingURL=default.renderer.js.map