const toBlobURL = (_blob) => {
    const _url = URL.createObjectURL(_blob);
    return {
        url: _url,
        revoke: () => URL.revokeObjectURL(_url),
    };
};
export default toBlobURL;
export { toBlobURL };
//# sourceMappingURL=blob-controller.js.map