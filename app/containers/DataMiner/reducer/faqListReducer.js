import { fromJS } from 'immutable';
import { GET_FAQ_REQUEST, GET_FAQ_SUCCESS, GET_FAQ_ERROR } from '../constants';

export const rehydrateState = {
	getFaqLoading: false,
	getFaqError: null,
};

export const initialState = fromJS({
	faq: {},
	...rehydrateState,
});

export default {
	[GET_FAQ_REQUEST]: state => state.set('getFaqLoading', true),
	[GET_FAQ_ERROR]: (state, { payload }) =>
		state.merge({
			getFaqLoading: false,
			getFaqError: payload,
		}),
	[GET_FAQ_SUCCESS]: (state, { payload }) =>
		state.merge({
			getFaqLoading: false,
			getFaqError: null,
			faq: payload,
		}),
};
