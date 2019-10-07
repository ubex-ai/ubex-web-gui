import { fromJS } from 'immutable';
import { GET_ONLINE_COUNTERS_REQUEST, GET_ONLINE_COUNTERS_ERROR, GET_ONLINE_COUNTERS_SUCCESS } from '../constants';

export const rehydrateState = {
	// Василий Разумных, [18.03.19 10:02]
	// если прилетает 400 счетчики не показывают нули а кеш
	// при выходе из аккаунта нужно кеш убивать
	onlineCounters: [],
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
	[GET_ONLINE_COUNTERS_SUCCESS]: (state, { payload, id }) => {
		const array = [{ id, ...payload }];
		return state
			.merge({
				getOnlineCountersLoading: false,
				getOnlineCountersError: null,
			})
			.update('onlineCounters', entries => addOrUpdateListEntryById(entries, { payload: array }));
	},
};

const addOrUpdateListEntryById = (list, { payload }) => {
	payload.forEach(p => {
		const l = list.findIndex(l => l.get('id') === p.id);
		if (l >= 0) {
			list = list.update(l, val => fromJS(p));
		} else {
			list = list.push(fromJS(p));
		}
	});
	return list.sortBy(l => l.id);
};
