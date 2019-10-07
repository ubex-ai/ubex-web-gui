import { fromJS } from 'immutable';
import { updateEntryById } from 'utils/CollectionHelper/reducers/entryReducer';
import _ from 'lodash';
/**
 *  List reducers
 */

export const onRequestList = collection => state =>
	state.merge({
		[`${collection}Loading`]: true,
		[`${collection}Error`]: null,
	});

export const onErrorList = collection => (state, { payload }) =>
	state.merge({
		[`${collection}Loading`]: false,
		[`${collection}Error`]: payload,
	});

export const onSuccessList = collection => (state, { payload }) =>
	addEntryWithId(collection)(state, payload).merge({
		[`${collection}Loading`]: false,
		[`${collection}Error`]: null,
	});

export const addEntryWithId = collection => (state, payload) => {
	if (collection === 'groupStats' && payload.length) {
		return state.update(collection, entries => addOrUpdateListEntryById(entries, { payload }));
	}
	if (collection === 'groupStats' && payload.length === 0) {
		return state;
	}
	return state.update(collection, list => fromJS(payload));
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

export default (collection, actions) => ({
	// List behavior
	[actions.request]: onRequestList(collection),
	[actions.error]: onErrorList(collection),
	[actions.success]: onSuccessList(collection),
});
