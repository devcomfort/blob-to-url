var toBlobURL = function (_blob) {
    var _url = URL.createObjectURL(_blob);
    return {
        url: _url,
        revoke: function () { return URL.revokeObjectURL(_url); },
    };
};
export default toBlobURL;
export { toBlobURL };
//# sourceMappingURL=blob-controller.js.map