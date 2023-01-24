import { Blob, FileReader } from "blob-polyfill";

type DataURI = string;

/**
 * Function: Converts a File or Blob object to a base64-encoded data uri.
 * @param _blob
 * @returns
 */
const toDataURI = (_blob: File | Blob): Promise<DataURI> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as DataURI);
    reader.onerror = () => reject(`A Blob object could not be loaded.`);
    reader.readAsDataURL(_blob);
  });

export default toDataURI;
export { toDataURI };
