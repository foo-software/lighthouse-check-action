"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
let chalk;
if (((_a = process.env) === null || _a === void 0 ? void 0 : _a.LISTR_DISABLE_COLOR) !== '1' && chalk_1.default.supportsColor) {
    chalk = new chalk_1.default.Instance();
}
else {
    chalk = new chalk_1.default.Instance({ level: 0 });
}
exports.default = chalk;
//# sourceMappingURL=chalk.js.map