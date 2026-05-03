/**
 * Creates a browser-cached URL for a File or Blob.
 * @param blob - The File or Blob to convert to a URL
 * @returns An object containing the generated URL and its revocation method
 * @example
 * const imageBlob = new Blob([imageData], { type: 'image/png' });
 * const blobRef = toBlobURL(imageBlob);
 *
 * document.getElementById('preview').src = blobRef.url;
 * blobRef.revoke(); // Clean up when done
 */
export const toBlobURL = (blob: File | Blob) => {
	const url = URL.createObjectURL(blob);

	return {
		url,
		/** Releases the browser resources associated with the URL */
		revoke: () => URL.revokeObjectURL(url),
	};
};
