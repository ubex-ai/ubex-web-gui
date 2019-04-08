import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import * as actions from './constants';

export function* login(action) {
	// eslint-disable-next-line no-undef
	const requestURL = `${PASSPORT_URL}/login/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: JSON.stringify(action.payload),
		});
		yield put({ type: actions.LOGIN_SUCCESS, response });
	} catch (error) {
		yield put({ type: actions.LOGIN_ERROR, error });
	}
}

export function* signup(action) {
	// eslint-disable-next-line no-undef
	const requestURL = `${PASSPORT_URL}/register/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: JSON.stringify(action.payload),
		});
		yield put({ type: actions.SIGNUP_SUCCESS, response });
	} catch (error) {
		yield put({ type: actions.SIGNUP_ERROR, error });
	}
}

export function* restorePassword(action) {
	// eslint-disable-next-line no-undef
	const requestURL = `${PASSPORT_URL}/restore/`;
	try {
		const response = yield call(request, requestURL, {
			method: 'POST',
			mode: 'no-cors',
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			},
			body: JSON.stringify(action.payload),
		});
		yield put({ type: actions.RESTORE_PASSWORD_SUCCESS, response });
	} catch (error) {
		yield put({ type: actions.RESTORE_PASSWORD_ERROR, error });
	}
}

export default function* passportSaga() {
	// See example in https://github.com/react-boilerplate/react-boilerplate/blob/master/app/containers/HomePage/saga.js
	yield takeLatest(actions.LOGIN, login);
	yield takeLatest(actions.SIGNUP, signup);
	yield takeLatest(actions.RESTORE_PASSWORD, restorePassword);
}
