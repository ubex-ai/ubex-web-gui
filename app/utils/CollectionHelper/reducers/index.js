import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';

import listBehaviorReducer from './listReducer';
import entryBehaviorReducer from './entryReducer';

import makeCollectionActions from '../constants';

export const collectionRehydrateState = collection => ({
	[`${collection}Loading`]: false,
	[`${collection}Error`]: null,
	[`${collection}AddEntryLoading`]: false,
	[`${collection}AddEntryError`]: null,
	[`${collection}ActiveEntryId`]: null,
});

export const collectionInitialState = collection =>
	fromJS({
		[collection]: [],
		...collectionRehydrateState(collection),
	});

export const collectionReducer = collection => {
	const actions = makeCollectionActions(collection);
	return {
		...entryBehaviorReducer(collection, actions),
		...listBehaviorReducer(collection, actions),
	};
};

export const listInitialState = collection =>
	fromJS({
		[collection]: [],
		...listRehydrateState(collection),
	});

export const listRehydrateState = collection => ({
	[`${collection}Loading`]: false,
	[`${collection}Error`]: null,
});

export const listReducer = collection => {
	const actions = makeCollectionActions(collection);
	return {
		...listBehaviorReducer(collection, actions),
	};
};
