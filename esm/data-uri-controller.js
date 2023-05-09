var toDataURI = function (_blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { return resolve(reader.result); };
        reader.onerror = function () { return reject("A Blob object could not be loaded."); };
        reader.readAsDataURL(_blob);
    });
};
export default toDataURI;
export { toDataURI };
//# sourceMappingURL=data-uri-controller.js.map