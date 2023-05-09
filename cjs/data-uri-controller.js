"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDataURI = void 0;
var toDataURI = function (_blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { return resolve(reader.result); };
        reader.onerror = function () { return reject("A Blob object could not be loaded."); };
        reader.readAsDataURL(_blob);
    });
};
exports.toDataURI = toDataURI;
exports.default = toDataURI;
//# sourceMappingURL=data-uri-controller.js.map