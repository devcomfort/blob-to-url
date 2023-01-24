import type { File, Blob } from "blob-polyfill";
declare const toBlobURL: (_blob: File | Blob) => {
    url: string;
    revoke: () => void;
};
export default toBlobURL;
export { toBlobURL };
//# sourceMappingURL=blob-controller.d.ts.map