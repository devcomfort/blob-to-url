"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBlobURL = void 0;
var toBlobURL = function (_blob) {
    var _url = URL.createObjectURL(_blob);
    return {
        url: _url,
        revoke: function () { return URL.revokeObjectURL(_url); },
    };
};
exports.toBlobURL = toBlobURL;
exports.default = toBlobURL;
//# sourceMappingURL=blob-controller.js.map