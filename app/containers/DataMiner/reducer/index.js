/*
 *
 * DataMiner reducer
 *
 */

import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
	collectionRehydrateState,
	collectionInitialState,
	collectionReducer,
	listInitialState,
	listRehydrateState,
	listReducer,
} from 'utils/CollectionHelper/reducers';
import metricsMapReducer, {
	initialState as metricsMapState,
	rehydrateState as metricsMapRehydrateState,
} from './metricsMapReducer';

import faqListReducer, {
	initialState as faqListState,
	rehydrateState as faqListRehydrateState,
} from './faqListReducer';

import onlineCountersMapReducer, {
	initialState as onlineCountersMapState,
	rehydrateState as onlineCountersRehydrateState,
} from './onlineCountersMapReducer';
import { FAQ_COLLECTION_NAME, COUNTERS_COLLECTION_NAME } from '../constants';

export const initialState = fromJS({})
	.merge(collectionInitialState(COUNTERS_COLLECTION_NAME))
	.merge(listInitialState(FAQ_COLLECTION_NAME))
	.merge(metricsMapState)
	.merge(faqListState)
	.merge(onlineCountersMapState);

export const rehydrateState = {
	...collectionRehydrateState(COUNTERS_COLLECTION_NAME),
	...listRehydrateState(FAQ_COLLECTION_NAME),
	...faqListRehydrateState,
	...onlineCountersRehydrateState,
	...metricsMapRehydrateState,
};

export default handleActions(
	{
		...collectionReducer(COUNTERS_COLLECTION_NAME),
		...listReducer(FAQ_COLLECTION_NAME),
		...onlineCountersMapReducer,
		...metricsMapReducer,
		...faqListReducer,
	},
	initialState,
);
