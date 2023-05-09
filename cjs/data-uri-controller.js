"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDataURI = void 0;
const toDataURI = (_blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(`A Blob object could not be loaded.`);
    reader.readAsDataURL(_blob);
});
exports.toDataURI = toDataURI;
exports.default = toDataURI;
//# sourceMappingURL=data-uri-controller.js.map