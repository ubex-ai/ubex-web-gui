/*
 *
 * UserPage actions
 *
 */

import {
	DEFAULT_ACTION,
	FETCH_USER_REQUEST,
	FETCH_USER_SUCCESS,
	FETCH_USER_REJECT,
	UPDATE_USER_REQUEST,
	UPDATE_USER_SUCCESS,
	UPDATE_USER_REJECT,
} from './constants';

export function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

export function fetchData() {
	return {
		type: FETCH_USER_REQUEST,
	};
}

export function updateData() {
	return {
		type: UPDATE_USER_REQUEST,
	};
}
