import { takeLatest, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import * as actions from './constants';
import { selectToken } from '../Passport/selectors';

export function* fetchData() {
	// eslint-disable-next-line no-undef
	const requestURL = `${API_URL}/api/userinfo/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'GET',
			headers: {
				Authorization: `Token ${select(selectToken)}`,
				'Content-Type': 'application/json',
			},
		});
		yield put({ type: actions.FETCH_USER_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({ type: actions.FETCH_USER_REJECT, error });
	}
}

export function* updateData(action) {
	// eslint-disable-next-line no-undef
	const requestURL = `${API_URL}/api/userinfo/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'POST',
			headers: {
				Authorization: `Token ${select(selectToken)}`,
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: JSON.stringify(action.payload),
		});
		yield put({ type: actions.UPDATE_USER_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({ type: actions.UPDATE_USER_REJECT, error });
	}
}

export default function* userPageSaga() {
	yield takeLatest(actions.FETCH_USER_REQUEST, fetchData);
	yield takeLatest(actions.UPDATE_USER_REQUEST, updateData);
}
