import { call, put, take, takeEvery } from 'redux-saga/effects';
import { ActionTypes, uploadProgress, uploadSuccess, uploadFailure } from './actions';
import createUploadFileChannel from './createUploadFileChannel';
// Watch for an upload request and then
// defer to another saga to perform the actual upload
export function* uploadRequestWatcherSaga({ success, error }) {
	yield takeEvery(ActionTypes.UPLOAD_REQUEST, function*(action) {
		const formData = action.payload;
		const { path, resolve, reject } = action.meta;

		yield call(uploadFileSaga, formData, path, success, error, resolve, reject);
	});
}

// Upload the specified file
export function* uploadFileSaga(formData, path, success, error, resolve, reject) {
	const channel = yield call(createUploadFileChannel, formData, path);
	while (true) {
		const { progress = 0, err, response } = yield take(channel);
		if (err) {
			if (typeof reject === 'function') {
				reject(err);
			}
			yield put(uploadFailure(err, formData, path));
			if (typeof error === 'function') {
				yield put(error(err, formData, path));
			}
			return;
		}
		if (response) {
			if (typeof resolve === 'function') {
				resolve(response);
			}
			yield put(uploadSuccess(response, formData, path));
			if (typeof success === 'function') {
				yield put(success(response, formData, path));
			}
			return;
		}
		yield put(uploadProgress(progress, formData, path));
	}
}
