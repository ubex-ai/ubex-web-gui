export const ActionTypes = {
	UPLOAD_REQUEST: 'UploadHelper.UPLOAD_REQUEST',
	UPLOAD_PROGRESS: 'UploadHelper.UPLOAD_PROGRESS',
	UPLOAD_SUCCESS: 'UploadHelper.UPLOAD_SUCCESS',
	UPLOAD_FAILURE: 'UploadHelper.UPLOAD_FAILURE',
};

export const uploadRequest = (formData, path) => ({
	type: ActionTypes.UPLOAD_REQUEST,
	payload: formData,
	meta: { path },
});

export const uploadProgress = (progress, formData, path) => ({
	type: ActionTypes.UPLOAD_PROGRESS,
	payload: progress,
	meta: { formData, path },
});

export const uploadSuccess = (response, formData, path) => ({
	type: ActionTypes.UPLOAD_SUCCESS,
	payload: response,
	meta: { formData, path },
});

export const uploadFailure = (err, formData, path) => ({
	type: ActionTypes.UPLOAD_FAILURE,
	payload: err,
	error: true,
	meta: { formData, path },
});
