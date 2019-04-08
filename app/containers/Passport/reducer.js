/*
 *
 * Passport reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, LOGIN, SIGNUP, RESTORE_PASSWORD } from './constants';

export const initialState = fromJS({
	token: null,
	username: null,
});

function passportReducer(state = initialState, action) {
	switch (action.type) {
		case DEFAULT_ACTION:
			return state;
		default:
			return state;
	}
}

export default passportReducer;
