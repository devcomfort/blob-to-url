/**
 * Function : Returns a browser-cached url address.
 * Saves a File or Blob of data in your browser and returns a url to the cached data.
 * @param _blob
 * @returns
 */
const toBlobURL = (_blob: File | Blob) => {
  const _url = URL.createObjectURL(_blob);
  return {
    url: _url,
    /** Cancel an allocation. */
    revoke: () => URL.revokeObjectURL(_url),
  };
};

export default toBlobURL;
export { toBlobURL };
