/**
 * Function: Converts a File or Blob object to a base64-encoded data uri.
 * @param blob
 * @returns
 */
export const toDataURI = (blob: File | Blob): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error("A Blob object could not be loaded."));
		reader.readAsDataURL(blob);
	});
