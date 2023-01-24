import { FileReader } from "blob-polyfill";
const toDataURI = (_blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(`A Blob object could not be loaded.`);
    reader.readAsDataURL(_blob);
});
export default toDataURI;
export { toDataURI };
//# sourceMappingURL=data-uri-controller.js.map