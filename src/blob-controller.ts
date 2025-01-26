/**
 * Creates a browser-cached URL for a File or Blob.
 * @param _blob - The File or Blob to convert to a URL
 * @returns An object containing the generated URL and its revocation method
 * @example
 * const imageBlob = new Blob([imageData], { type: 'image/png' });
 * const blobRef = toBlobURL(imageBlob);
 *
 * document.getElementById('preview').src = blobRef.url;
 * blobRef.revoke(); // Clean up when done
 */
export const toBlobURL = (_blob: File | Blob) => {
	const _url = URL.createObjectURL(_blob);

	return {
		url: _url,
		/** Releases the browser resources associated with the URL */
		revoke: () => URL.revokeObjectURL(_url),
	};
};
