import { call, put, takeEvery, all } from 'redux-saga/effects';
import request from 'utils/request';
import getCookie from 'utils/getCookie';
import { setDashboardLoading, setDashboardError } from 'containers/Dashboard/actions';
import { collectionActionCreator } from './actions';
import makeCollectionActions from './constants';

// API_URL from webpack config
// eslint-disable-next-line no-undef
const ApiUrl = API_URL;

/**
 * Common request handler
 * @param url
 * @param onSuccess
 * @param onError
 * @param body
 * @param method
 * @param isAuth
 * @param headers
 * @param handleDashboard
 * @param hooks
 * @param promise
 */
export function* restApiRequestHandler({
	url,
	onSuccess,
	onError,
	body = null,
	method = 'GET',
	isAuth = true,
	headers = {},
	handleDashboard = true,
	hooks = {},
	promise,
}) {
	// todo: вынести setDashboardLoading
	if (handleDashboard) {
		yield put(setDashboardLoading(true));
	}
	try {
		const requestHeaders = {
			'Content-Type': 'application/json',
			...headers,
		};
		if (isAuth) {
			requestHeaders['X-CSRFToken'] = getCookie('csrftoken');
		}
		if(NODE_ENV !== 'production') {
			requestHeaders['Test-User'] = 'test@test.test';
		}
		const response = yield call(request, url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'Test-User': 'test@test.test',
				...requestHeaders,
			},
			data: body ? JSON.stringify(body) : null,
		});
		const data = response && response.data ? response.data : null;
		if (handleDashboard) {
			yield put(setDashboardLoading(false));
		}
		yield onSuccess(typeof hooks.success !== 'function' ? data : hooks.success(data));
		if (promise && typeof promise.resolve === 'function') {
			promise.resolve(typeof hooks.success !== 'function' ? data : hooks.success(data));
		}
	} catch (e) {
		const error = typeof hooks.error !== 'function' ? e : hooks.error(e);
		yield onError(error);
		if (promise && typeof promise.reject === 'function') {
			promise.reject(error);
		}
		if (handleDashboard) {
			yield put(setDashboardError(error));
		}
	}
}

/**
 * Fetch collection list
 * @param url
 * @param success
 * @param resolve
 * @param reject
 * @param error
 * @param hooks
 */
export function* getListRequestHandler({ meta: { url, resolve, reject } }, { success, error }, hooks = {}) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/`,
		onSuccess: data => put({ type: success, payload: data }),
		onError: e => put({ type: error, payload: e }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * Fetch collection entry
 * @param id
 * @param url
 * @param success
 * @param resolve
 * @param reject
 * @param error
 * @param hooks
 */
export function* getEntryRequestHandler(
	{ payload: { id, resolve, reject }, meta: { url } },
	{ success, error },
	hooks = {},
) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/${id}/`,
		onSuccess: data => put({ type: success, payload: data, meta: { id } }),
		onError: e => put({ type: error, payload: e, meta: { id } }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * Post new entry to server
 * @param payload
 * @param url
 * @param success
 * @param resolve
 * @param reject
 * @param error
 * @param hooks
 */
export function* addEntryRequestHandler({ payload, meta: { url, resolve, reject } }, { success, error }, hooks = {}) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/`,
		method: 'POST',
		body: payload,
		isAuth: true,
		onSuccess: ({ id, ...data }) => put({ type: success, payload: { id, ...data }, meta: { id } }),
		onError: e => put({ type: error, payload: e }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * Update entry on server
 * @param id
 * @param payload
 * @param url
 * @param resolve
 * @param reject
 * @param success
 * @param resolve
 * @param reject
 * @param error
 * @param hooks
 */
export function* updateEntryRequestHandler(
	{ payload, meta: { id, url, resolve, reject } },
	{ success, error },
	hooks = {},
) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/${id}/`,
		method: 'PUT',
		body: payload,
		isAuth: true,
		onSuccess: data => put({ type: success, payload: { id, ...data }, meta: { id } }),
		onError: e => put({ type: error, payload: e, meta: { id } }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * Patch entry on server
 * @param id
 * @param payload
 * @param url
 * @param success
 * @param error
 * @param hooks
 * @param resolve
 * @param reject
 */
export function* patchEntryRequestHandler(
	{ payload, meta: { id, url, resolve, reject } },
	{ success, error },
	hooks = {},
) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/${id}/`,
		method: 'PATCH',
		body: payload,
		isAuth: true,
		onSuccess: data => put({ type: success, payload: { id, ...data }, meta: { id } }),
		onError: e => put({ type: error, payload: e, meta: { id } }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * Post request to remove entry
 * @param id
 * @param url
 * @param success
 * @param error
 * @param hooks
 * @param resolve
 * @param reject
 */
export function* removeEntryRequestHandler(
	{ payload: { id }, meta: { url, resolve, reject } },
	{ success, error },
	hooks = {},
) {
	yield restApiRequestHandler({
		url: `${ApiUrl}/${url}/${id}/`,
		method: 'DELETE',
		isAuth: true,
		onSuccess: _ => put({ type: success, payload: { id }, meta: { id } }),
		onError: e => put({ type: error, payload: e, meta: { id } }),
		hooks,
		promise: {
			resolve,
			reject,
		},
	});
}

/**
 * generate sagas for collection
 * @param getCollection
 * @param getEntry
 * @param addEntry
 * @param updateEntry
 * @param patchEntry
 * @param removeEntry
 * @param hooks
 * @param fullCRUD
 * @return {*}
 */
export const collectionSagaHandlers = (
	{ getCollection, getEntry, addEntry, updateEntry, patchEntry, removeEntry },
	hooks = {},
	fullCRUD = true,
) => {
	const getRequests = {
		getCollection: takeEvery(getCollection.request, action => getListRequestHandler(action, getCollection)),
		getEntry: takeEvery(getEntry.request, action => getEntryRequestHandler(action, getEntry)),
	};
	if (!fullCRUD) {
		return getRequests;
	}
	return {
		...getRequests,
		addEntry: takeEvery(addEntry.request, action => addEntryRequestHandler(action, addEntry, hooks.addEntry)),
		updateEntry: takeEvery(updateEntry.request, action =>
			updateEntryRequestHandler(action, updateEntry, hooks.updateEntry),
		),
		patchEntry: takeEvery(patchEntry.request, action =>
			patchEntryRequestHandler(action, patchEntry, hooks.patchEntry),
		),
		removeEntry: takeEvery(removeEntry.request, action =>
			removeEntryRequestHandler(action, removeEntry, hooks.removeEntry),
		),
	};
};

/**
 * handle full crud or read only sagas for collection
 * @param collection
 * @param hooks
 * @param setActiveOnAdd
 * @return {AllEffect|GenericAllEffect<T>}
 */
export const handleCollectionSaga = (collection, hooks, setActiveOnAdd = true) => {
	const sagas = collectionSagaHandlers(makeCollectionActions(collection), hooks, true);
	const sagasArray = Object.keys(sagas).map(sagaKey => sagas[sagaKey]);
	if (setActiveOnAdd) {
		sagasArray.push(handleSetActiveOnAddEntry(collection));
	}
	return all(sagasArray);
};

export const handleSetActiveOnAddEntry = collection => {
	const { addEntry } = makeCollectionActions(collection);
	const { setActiveEntry } = collectionActionCreator(collection);
	return takeEvery(addEntry.success, ({ payload: { id } }) => put(setActiveEntry(id)));
};

/**
 * handle get list request for simple list with hook support
 * @param collection
 * @param hooks
 */
export const handleRequestListSaga = (collection, hooks) => {
	const { getCollection } = makeCollectionActions(collection);
	return takeEvery(getCollection.request, action => getListRequestHandler(action, getCollection, hooks));
};
