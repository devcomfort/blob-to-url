"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBlobURL = void 0;
const toBlobURL = (_blob) => {
    const _url = URL.createObjectURL(_blob);
    return {
        url: _url,
        revoke: () => URL.revokeObjectURL(_url),
    };
};
exports.toBlobURL = toBlobURL;
exports.default = toBlobURL;
//# sourceMappingURL=blob-controller.js.map