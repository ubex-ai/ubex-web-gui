/*
 *
 * UserPage reducer
 *
 */

import { fromJS } from 'immutable';
import { DEFAULT_ACTION, FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_REJECT } from './constants';

export const rehydrateState = {
	loading: false,
	error: null,
};

export const initialState = fromJS({
	data: {},
	...rehydrateState,
});

function userPageReducer(state = initialState, action) {
	switch (action.type) {
		case DEFAULT_ACTION:
			return state;
		case FETCH_USER_REQUEST:
			return state.set('loading', true);
		case FETCH_USER_SUCCESS:
			return state.merge({
				loading: false,
				data: action.payload,
			});
		case FETCH_USER_REJECT:
			return state.merge({
				loading: false,
				error: action.payload,
			});
		default:
			return state;
	}
}

export default userPageReducer;
