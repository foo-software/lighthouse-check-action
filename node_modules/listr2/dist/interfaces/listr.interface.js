"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptError = exports.ListrError = void 0;
class ListrError extends Error {
    constructor(message, errors, context) {
        super(message);
        this.message = message;
        this.errors = errors;
        this.context = context;
        this.name = 'ListrError';
    }
}
exports.ListrError = ListrError;
class PromptError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PromptError';
    }
}
exports.PromptError = PromptError;
//# sourceMappingURL=listr.interface.js.map