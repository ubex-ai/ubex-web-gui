import { fromJS } from 'immutable';
import { GET_ONLINE_COUNTERS_REQUEST, GET_ONLINE_COUNTERS_ERROR, GET_ONLINE_COUNTERS_SUCCESS } from '../constants';

export const rehydrateState = {
	getOnlineCountersLoading: false,
	getOnlineCountersError: null,
};

export const initialState = fromJS({
	onlineCounters: {
		all: 0,
		online: 0,
	},
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
