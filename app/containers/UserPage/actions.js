/*
 *
 * UserPage actions
 *
 */

import {
	DEFAULT_ACTION,
	FETCH_USER_REQUEST,
	UPDATE_USER_REQUEST,
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

export function updateData(data) {
	return {
		type: UPDATE_USER_REQUEST,
		payload: data,
	};
}
