/**
 * Collection helper
 * */
export const GET_COLLECTION_REQUEST = 'app/Dashboard/GET_COLLECTION_REQUEST';
export const GET_COLLECTION_ERROR = 'app/Dashboard/GET_COLLECTION_ERROR';
export const GET_COLLECTION_SUCCESS = 'app/Dashboard/GET_COLLECTION_SUCCESS';

export const GET_ENTRY_REQUEST = 'app/Dashboard/GET_ENTRY_REQUEST';
export const GET_ENTRY_ERROR = 'app/Dashboard/GET_ENTRY_ERROR';
export const GET_ENTRY_SUCCESS = 'app/Dashboard/GET_ENTRY_SUCCESS';

export const ADD_ENTRY_REQUEST = 'app/Dashboard/ADD_ENTRY_REQUEST';
export const ADD_ENTRY_ERROR = 'app/Dashboard/ADD_ENTRY_ERROR';
export const ADD_ENTRY_SUCCESS = 'app/Dashboard/ADD_ENTRY_SUCCESS';

export const UPDATE_ENTRY_REQUEST = 'app/Dashboard/UPDATE_ENTRY_REQUEST';
export const UPDATE_ENTRY_ERROR = 'app/Dashboard/UPDATE_ENTRY_ERROR';
export const UPDATE_ENTRY_SUCCESS = 'app/Dashboard/UPDATE_ENTRY_SUCCESS';

export const REMOVE_ENTRY_REQUEST = 'app/Dashboard/REMOVE_ENTRY_REQUEST';
export const REMOVE_ENTRY_ERROR = 'app/Dashboard/REMOVE_ENTRY_ERROR';
export const REMOVE_ENTRY_SUCCESS = 'app/Dashboard/REMOVE_ENTRY_SUCCESS';

export const SET_ACTIVE_ENTRY = 'app/Dashboard/SET_ACTIVE_ENTRY';

export const UNSET_ACTIVE_ENTRY = 'app/Dashboard/UNSET_ACTIVE_ENTRY';

export const makeSpecificActionNameForCollection = (action, collection) => `${action}/${collection}`;

export const makeAsyncActionsPack = ({ request, error, success }, collection) => ({
	request: makeSpecificActionNameForCollection(request, collection),
	error: makeSpecificActionNameForCollection(error, collection),
	success: makeSpecificActionNameForCollection(success, collection),
});

export const makeListActions = collection =>
	makeAsyncActionsPack(
		{
			request: GET_COLLECTION_REQUEST,
			error: GET_COLLECTION_ERROR,
			success: GET_COLLECTION_SUCCESS,
		},
		collection,
	);

const makeCollectionActions = collection => ({
	getCollection: makeAsyncActionsPack(
		{
			request: GET_COLLECTION_REQUEST,
			error: GET_COLLECTION_ERROR,
			success: GET_COLLECTION_SUCCESS,
		},
		collection,
	),
	getEntry: makeAsyncActionsPack(
		{
			request: GET_ENTRY_REQUEST,
			error: GET_ENTRY_ERROR,
			success: GET_ENTRY_SUCCESS,
		},
		collection,
	),
	addEntry: makeAsyncActionsPack(
		{
			request: ADD_ENTRY_REQUEST,
			error: ADD_ENTRY_ERROR,
			success: ADD_ENTRY_SUCCESS,
		},
		collection,
	),
	updateEntry: makeAsyncActionsPack(
		{
			request: UPDATE_ENTRY_REQUEST,
			error: UPDATE_ENTRY_ERROR,
			success: UPDATE_ENTRY_SUCCESS,
		},
		collection,
	),
	removeEntry: makeAsyncActionsPack(
		{
			request: REMOVE_ENTRY_REQUEST,
			error: REMOVE_ENTRY_ERROR,
			success: REMOVE_ENTRY_SUCCESS,
		},
		collection,
	),
	setActiveEntry: makeSpecificActionNameForCollection(SET_ACTIVE_ENTRY, collection),
	unsetActiveEntry: makeSpecificActionNameForCollection(UNSET_ACTIVE_ENTRY, collection),
});

export default makeCollectionActions;
