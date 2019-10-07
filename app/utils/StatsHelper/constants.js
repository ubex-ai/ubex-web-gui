/*
 *
 * StatsHelper constants
 *
 */

import {
	ADD_ENTRY_ERROR,
	ADD_ENTRY_REQUEST,
	ADD_ENTRY_SUCCESS,
	GET_COLLECTION_ERROR,
	GET_COLLECTION_REQUEST,
	GET_COLLECTION_SUCCESS,
	GET_ENTRY_ERROR,
	GET_ENTRY_REQUEST,
	GET_ENTRY_SUCCESS,
	makeAsyncActionsPack, makeSpecificActionNameForCollection,
	PATCH_ENTRY_ERROR,
	PATCH_ENTRY_REQUEST,
	PATCH_ENTRY_SUCCESS,
	REMOVE_ENTRY_ERROR,
	REMOVE_ENTRY_REQUEST,
	REMOVE_ENTRY_SUCCESS, SET_ACTIVE_ENTRY, UNSET_ACTIVE_ENTRY,
	UPDATE_ENTRY_ERROR,
	UPDATE_ENTRY_REQUEST,
	UPDATE_ENTRY_SUCCESS,
} from '../CollectionHelper/constants';

export const DEFAULT_ACTION = 'app/StatsHelper/DEFAULT_ACTION';

export const GET_STATS_REQUEST = 'app/Dashboard/GET_STATS_REQUEST';
export const GET_STATS_ERROR = 'app/Dashboard/GET_STATS_ERROR';
export const GET_STATS_SUCCESS = 'app/Dashboard/GET_STATS_SUCCESS';

export const makeStatsActions = collection =>
	makeAsyncActionsPack(
		{
			request: GET_STATS_REQUEST,
			error: GET_STATS_ERROR,
			success: GET_STATS_SUCCESS,
		},
		collection,
	);

export const makeCollectionActions = collection => ({
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
	patchEntry: makeAsyncActionsPack(
		{
			request: PATCH_ENTRY_REQUEST,
			error: PATCH_ENTRY_ERROR,
			success: PATCH_ENTRY_SUCCESS,
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