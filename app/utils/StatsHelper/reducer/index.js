import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';


import { makeStatsActions, makeCollectionActions } from '../constants';
import statsBehaviorReducer from './statsReducer';
import entryBehaviorReducer from './entryReducer';
import listBehaviorReducer from '../../CollectionHelper/reducers/listReducer';


export const statsCollectionRehydrateState = collection => ({
	[`${collection}Loading`]: false,
	[`${collection}Error`]: null,
	[`${collection}AddEntryLoading`]: false,
	[`${collection}AddEntryError`]: null,
	[`${collection}ActiveEntryId`]: null,
});

export const statsCollectionInitialState = collection =>
	fromJS({
		[collection]: [],
		...statsCollectionRehydrateState(collection),
	});

export const statsCollectionReducer = collection => {
	const actions = makeCollectionActions(collection);
	return {
		...entryBehaviorReducer(collection, actions),
		...statsBehaviorReducer(collection, actions),
	};
};


export const statsInitialState = collection =>
	fromJS({
		[collection]: [],
		...statsRehydrateState(collection),
	});

export const statsRehydrateState = collection => ({
	[`${collection}Loading`]: false,
	[`${collection}Error`]: null,
});

export const statsReducer = collection => {
	const actions = makeStatsActions(collection);
	return {
		...statsBehaviorReducer(collection, actions),
	};
};