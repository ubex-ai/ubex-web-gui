/*
 *
 * UserPage actions
 *
 */

import { USER_LOGOUT, UPDATE_USER_REQUEST } from './constants';

export function updateData(data) {
	return {
		type: UPDATE_USER_REQUEST,
		payload: data,
	};
}

export function logout() {
	return {
		type: USER_LOGOUT,
	};
}
