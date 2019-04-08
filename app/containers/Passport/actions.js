/*
 *
 * Passport actions
 *
 */

import {
	DEFAULT_ACTION,
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_ERROR,
	SIGNUP,
	SIGNUP_SUCCESS,
	SIGNUP_ERROR,
	RESTORE_PASSWORD,
	RESTORE_PASSWORD_SUCCESS,
	RESTORE_PASSWORD_ERROR,
} from './constants';

export function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

export function login(username, password) {
	return {
		type: LOGIN,
		payload: {
			username,
			password,
		},
	};
}

export function signup(username, password) {
	return {
		type: SIGNUP,
		payload: {
			username,
			password,
		},
	};
}

export function restorePassword(username) {
	return {
		type: RESTORE_PASSWORD,
		payload: {
			username,
		},
	};
}
