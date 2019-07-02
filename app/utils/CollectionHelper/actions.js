import makeCollectionActions, { makeListActions } from './constants';

/**
 * Return action creator to dispatch request for collection list
 * @param url
 * @param collection
 * @return {function} ActionCreator
 */
export const listActionCreator = (url, collection) => {
	const { request } = makeListActions(collection);
	return payload => ({
		type: request,
		payload,
		meta: { url },
	});
};

/**
 * Return all actions for working with collection, for independence call
 * @param collection
 * @return Map of ActionCreators
 */
export const collectionActionCreator = collection => {
	const actions = makeCollectionActions(collection);
	return {
		getCollection: url => ({
			type: actions.getCollection.request,
			meta: { url },
		}),
		getEntry: (url, id) => ({
			type: actions.getEntry.request,
			payload: { id: parseInt(id, 10) },
			meta: { url },
		}),
		addEntry: (url, values) => ({
			type: actions.addEntry.request,
			payload: values,
			meta: { url },
		}),
		updateEntry: (url, id, values) => ({
			type: actions.updateEntry.request,
			payload: { id: parseInt(id, 10), ...values },
			meta: { url, id: parseInt(id, 10) },
		}),
		patchEntry: (url, id, values) => ({
			type: actions.patchEntry.request,
			payload: { id: parseInt(id, 10), ...values },
			meta: { url, id: parseInt(id, 10) },
		}),
		removeEntry: (url, id) => ({
			type: actions.removeEntry.request,
			payload: { id: parseInt(id, 10) },
			meta: { url },
		}),
		setActiveEntry: id => ({
			type: actions.setActiveEntry,
			payload: parseInt(id, 10),
			meta: { id: parseInt(id, 10) },
		}),
		unsetActiveEntry: () => ({
			type: actions.unsetActiveEntry,
		}),
	};
};

export function makePromiseAction(dispatch, action) {
	return new Promise((resolve, reject) => {
		dispatch({
			...action,
			meta: {
				...action.meta,
				resolve,
				reject,
			},
		});
	});
}

export const makeCRUDOnRoute = (url, collection = url, readOnly = true) => {
	const actions = collectionActionCreator(collection);
	const readOnlyActions = {
		getCollection: () => actions.getCollection(url),
		getEntry: id => actions.getEntry(url, id),
		setActiveEntry: id => actions.setActiveEntry(id),
		unsetActiveEntry: () => actions.unsetActiveEntry(),
	};
	if (!readOnly) {
		return readOnlyActions;
	}
	return {
		...readOnlyActions,
		addEntry: values => actions.addEntry(url, values),
		updateEntry: (id, values) => actions.updateEntry(url, id, values),
		patchEntry: (id, values) => actions.patchEntry(url, id, values),
		removeEntry: id => actions.removeEntry(url, id),
	};
};
