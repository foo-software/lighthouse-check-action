"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const figures_1 = __importDefault(require("figures"));
const logger_constants_1 = require("./logger.constants");
const chalk_1 = __importDefault(require("./chalk"));
class Logger {
    constructor(options) {
        this.options = options;
    }
    fail(message) {
        message = this.parseMessage(logger_constants_1.logLevels.fail, message);
        console.error(message);
    }
    skip(message) {
        message = this.parseMessage(logger_constants_1.logLevels.skip, message);
        console.info(message);
    }
    success(message) {
        message = this.parseMessage(logger_constants_1.logLevels.success, message);
        console.log(message);
    }
    data(message) {
        message = this.parseMessage(logger_constants_1.logLevels.data, message);
        console.info(message);
    }
    start(message) {
        message = this.parseMessage(logger_constants_1.logLevels.start, message);
        console.log(message);
    }
    title(message) {
        message = this.parseMessage(logger_constants_1.logLevels.title, message);
        console.info(message);
    }
    parseMessage(level, message) {
        let multiLineMessage;
        try {
            multiLineMessage = message.split('\n');
        }
        catch {
            multiLineMessage = [message];
        }
        multiLineMessage = multiLineMessage.map((msg) => {
            return this.logColoring({
                level,
                message: msg
            });
        });
        message = multiLineMessage.join('\n');
        return message;
    }
    logColoring({ level, message }) {
        var _a, _b, _c, _d, _e, _f;
        let icon;
        let coloring = (input) => {
            return input;
        };
        switch (level) {
            case logger_constants_1.logLevels.fail:
                if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.useIcons) {
                    coloring = chalk_1.default.red;
                    icon = figures_1.default.main.cross;
                }
                else {
                    icon = '[FAILED]';
                }
                break;
            case logger_constants_1.logLevels.skip:
                if ((_b = this.options) === null || _b === void 0 ? void 0 : _b.useIcons) {
                    coloring = chalk_1.default.yellow;
                    icon = figures_1.default.main.arrowDown;
                }
                else {
                    icon = '[SKIPPED]';
                }
                break;
            case logger_constants_1.logLevels.success:
                if ((_c = this.options) === null || _c === void 0 ? void 0 : _c.useIcons) {
                    coloring = chalk_1.default.green;
                    icon = figures_1.default.main.tick;
                }
                else {
                    icon = '[SUCCESS]';
                }
                break;
            case logger_constants_1.logLevels.data:
                if ((_d = this.options) === null || _d === void 0 ? void 0 : _d.useIcons) {
                    icon = figures_1.default.main.arrowRight;
                }
                else {
                    icon = '[DATA]';
                }
                break;
            case logger_constants_1.logLevels.start:
                if ((_e = this.options) === null || _e === void 0 ? void 0 : _e.useIcons) {
                    icon = figures_1.default.main.pointer;
                }
                else {
                    icon = '[STARTED]';
                }
                break;
            case logger_constants_1.logLevels.title:
                if ((_f = this.options) === null || _f === void 0 ? void 0 : _f.useIcons) {
                    icon = figures_1.default.main.checkboxOn;
                }
                else {
                    icon = '[TITLE]';
                }
                break;
        }
        return coloring(`${icon} ${message}`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map