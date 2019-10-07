import { fromJS } from 'immutable';
import { combineActions } from 'redux-actions';
/**
 * Entry reducers
 */

export const onRequestEntry = collection => (state, { payload: { id } }) =>
	updateEntryById(collection)(state, { payload: { id, loading: true, error: null } });

export const onErrorEntry = collection => (state, { payload, meta: { id } }) =>
	!id ? state : updateEntryById(collection)(state, { payload: { id, loading: false, error: payload } });

export const onSuccessEntry = collection => (state, { payload: { id, ...payload } }) =>
	updateEntryById(collection)(state, { payload: { ...payload, id, loading: false, error: null } });

export const updateEntryById = collection => (state, { payload: { id, ...payload } }) => {
	if (!id) {
		return state;
	}
	return state.update(
		collection,
		entries =>
			!state.get(collection).find(entry => entry.get('id') === id)
				? entries.push(fromJS({ id, ...payload }))
				: entries.map(entry => (entry.get('id') !== id ? entry : entry.merge(payload))),
	);
};

export default (collection, actions) => ({
	// Request behavior
	[combineActions(
		actions.getEntry.request,
		actions.updateEntry.request,
		actions.patchEntry.request,
		actions.removeEntry.request,
	)]: onRequestEntry(collection),

	// Error behavior
	[combineActions(
		actions.getEntry.error,
		actions.updateEntry.error,
		actions.patchEntry.error,
		actions.removeEntry.error,
	)]: onErrorEntry(collection),

	// Success behavior
	[combineActions(actions.getEntry.success, actions.updateEntry.success, actions.patchEntry.success)]: onSuccessEntry(
		collection,
	),
});
