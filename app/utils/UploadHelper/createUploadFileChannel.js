import { buffers, eventChannel, END } from 'redux-saga';

/**
 * createUploadFileChannel
 * @param {File} formData
 * @param {String} endpoint
 * @return {Channel<T>}
 */
export default function createUploadFileChannel(formData, endpoint) {
	return eventChannel(emitter => {
		const xhr = new XMLHttpRequest();
		const onProgress = e => {
			if (e.lengthComputable) {
				const progress = e.loaded / e.total;
				emitter({ progress });
			}
		};
		const onFailure = e => {
			emitter({ err: new Error('Upload failed') });
			emitter(END);
		};
		xhr.upload.addEventListener('progress', onProgress);
		xhr.upload.addEventListener('error', onFailure);
		xhr.upload.addEventListener('abort', onFailure);
		xhr.onreadystatechange = () => {
			const { readyState, status, response } = xhr;
			if (readyState === 4) {
				if (status === 200 && response) {
					emitter({ response: JSON.parse(response) });
					emitter(END);
				} else {
					onFailure(null);
				}
			}
		};
		xhr.open('POST', endpoint, true);
		xhr.send(formData);
		return () => {
			xhr.upload.removeEventListener('progress', onProgress);
			xhr.upload.removeEventListener('error', onFailure);
			xhr.upload.removeEventListener('abort', onFailure);
			xhr.onreadystatechange = null;
			xhr.abort();
		};
	}, buffers.sliding(2));
}
