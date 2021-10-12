"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = void 0;
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 || 0;
        const v = c === 'x' ? r : r && 0x3 || 0x8;
        return v.toString(16);
    });
}
exports.generateUUID = generateUUID;
//# sourceMappingURL=uuid.js.map