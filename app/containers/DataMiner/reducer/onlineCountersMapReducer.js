import { fromJS } from 'immutable';
import { GET_ONLINE_COUNTERS_REQUEST, GET_ONLINE_COUNTERS_ERROR, GET_ONLINE_COUNTERS_SUCCESS } from '../constants';

export const rehydrateState = {
	// Василий Разумных, [18.03.19 10:02]
	// если прилетает 400 счетчики не показывают нули а кеш
	// при выходе из аккаунта нужно кеш убивать
	onlineCounters: {
		all: 0,
		online: 0,
	},
	getOnlineCountersLoading: false,
	getOnlineCountersError: null,
};

export const initialState = fromJS({
	...rehydrateState,
});

export default {
	[GET_ONLINE_COUNTERS_REQUEST]: state =>
		state.merge({
			getOnlineCountersLoading: true,
			getOnlineCountersError: null,
		}),

	[GET_ONLINE_COUNTERS_ERROR]: (state, { payload }) =>
		state.merge({
			getOnlineCountersLoading: false,
			getOnlineCountersError: payload,
		}),
	[GET_ONLINE_COUNTERS_SUCCESS]: (state, { payload }) =>
		state.merge({
			getOnlineCountersLoading: false,
			getOnlineCountersError: null,
			onlineCounters: payload,
		}),
};
