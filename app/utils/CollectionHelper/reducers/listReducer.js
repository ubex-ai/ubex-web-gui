import { fromJS } from 'immutable';

/**
 *  List reducers
 */

export const setActiveEntry = collection => (state, { payload }) => state.set(`${collection}ActiveEntryId`, payload);
export const unsetActiveEntry = collection => state => state.set(`${collection}ActiveEntryId`, null);

export const addEntryRequest = collection => state =>
	state.merge({
		[`${collection}AddEntryLoading`]: true,
		[`${collection}AddEntryError`]: null,
	});

export const addEntryError = collection => (state, { payload }) =>
	state.merge({
		[`${collection}AddEntryLoading`]: false,
		[`${collection}AddEntryError`]: payload,
	});

export const addEntrySuccess = collection => (state, action) =>
	addEntryWithId(collection)(state, action).merge({
		[`${collection}AddEntryLoading`]: false,
		[`${collection}AddEntryError`]: null,
	});

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
	state
		.merge({
			[`${collection}Loading`]: false,
			[`${collection}Error`]: null,
		})
		.update(collection, list =>
			fromJS(
				payload.map(entryFromServer => {
					const updatedEntry = list.find(c => c.get('id') === entryFromServer.id);
					return !updatedEntry ? fromJS(entryFromServer) : updatedEntry.merge(fromJS(entryFromServer));
				}),
			),
		);

export const addEntryWithId = collection => (state, { payload: { id, ...payload } }) =>
	state.update(collection, entries => entries.push(fromJS({ id, ...payload })));

export const removeEntryById = collection => (state, { payload: { id } }) =>
	state.update(collection, entries => entries.filter(entry => entry.get('id') !== id));

export default (collection, actions) => ({
	// List behavior
	[actions.getCollection.request]: onRequestList(collection),
	[actions.getCollection.error]: onErrorList(collection),
	[actions.getCollection.success]: onSuccessList(collection),
	[actions.removeEntry.success]: removeEntryById(collection),
	[actions.addEntry.request]: addEntryRequest(collection),
	[actions.addEntry.error]: addEntryError(collection),
	[actions.addEntry.success]: addEntrySuccess(collection),
	[actions.setActiveEntry]: setActiveEntry(collection),
	[actions.unsetActiveEntry]: unsetActiveEntry(collection),
});
