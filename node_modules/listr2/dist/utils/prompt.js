"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrompt = void 0;
const listr_interface_1 = require("../interfaces/listr.interface");
const task_wrapper_1 = require("../lib/task-wrapper");
async function createPrompt(options, settings) {
    let cancelCallback;
    if (settings === null || settings === void 0 ? void 0 : settings.cancelCallback) {
        cancelCallback = settings.cancelCallback;
    }
    else {
        cancelCallback = defaultCancelCallback;
    }
    if (!Array.isArray(options)) {
        options = [{ ...options, name: 'default' }];
    }
    else if (options.length === 1) {
        options = options.reduce((o, option) => {
            return [...o, Object.assign(option, { name: 'default' })];
        }, []);
    }
    options = options.reduce((o, option) => {
        var _a;
        return [...o, Object.assign(option, { stdout: (_a = settings === null || settings === void 0 ? void 0 : settings.stdout) !== null && _a !== void 0 ? _a : this.stdout(), onCancel: cancelCallback.bind(this, settings) })];
    }, []);
    let enquirer;
    if (settings === null || settings === void 0 ? void 0 : settings.enquirer) {
        enquirer = settings.enquirer;
    }
    else {
        try {
            enquirer = (await Promise.resolve().then(() => __importStar(require('enquirer')))).default;
        }
        catch (e) {
            this.task.prompt = new listr_interface_1.PromptError('Enquirer is a peer dependency that must be installed seperately.');
            throw new Error(e);
        }
    }
    const response = (await enquirer.prompt(options));
    if (options.length === 1) {
        return response.default;
    }
    else {
        return response;
    }
}
exports.createPrompt = createPrompt;
function defaultCancelCallback(settings) {
    const errorMsg = 'Cancelled prompt.';
    if ((settings === null || settings === void 0 ? void 0 : settings.error) === true) {
        throw new Error(errorMsg);
    }
    else if (this instanceof task_wrapper_1.TaskWrapper) {
        this.task.prompt = new listr_interface_1.PromptError(errorMsg);
    }
    else {
        return errorMsg;
    }
}
//# sourceMappingURL=prompt.js.map