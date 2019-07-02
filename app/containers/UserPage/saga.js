import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';
import * as actions from './constants';
import { selectToken } from '../Passport/selectors';
import getCookie from '../../utils/getCookie';

const requestHeaders = {
	'Content-Type': 'application/json',
	'X-CSRFToken': getCookie('csrftoken'),
};


if(NODE_ENV !== 'production') {
	requestHeaders['Test-User'] = 'test@test.test';
}

export function* fetchData() {
	// eslint-disable-next-line no-undef
	const requestURL = `${API_URL}/api/userinfo/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'GET',
			headers: requestHeaders,
		});
		yield put({ type: actions.FETCH_USER_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({ type: actions.FETCH_USER_REJECT, error });
	}
}

export function* setWalletHash(action) {
	// eslint-disable-next-line no-undef
	const requestURL = `${API_URL}/api/set-wallet-hash/ `;
	try {
		const response = yield call(request, requestURL, {
			method: 'POST',
			headers: requestHeaders,
			data: action.payload,
		});
		yield put({ type: actions.UPDATE_USER_SUCCESS, payload: response.data });
	} catch (error) {
		yield put({ type: actions.UPDATE_USER_REJECT, error });
	}
}

export default function* userPageSaga() {
	yield takeLatest(actions.FETCH_USER_REQUEST, fetchData);
	yield takeLatest(actions.UPDATE_USER_REQUEST, setWalletHash);
}
