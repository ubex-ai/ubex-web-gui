/*
 *
 * TradingDesk reducer
 *
 */

import moment from 'moment';
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
	collectionRehydrateState,
	collectionInitialState,
	collectionReducer,
	listRehydrateState,
	listInitialState,
	listReducer,
} from 'utils/CollectionHelper/reducers';
import { ActionTypes } from 'utils/UploadHelper/actions';
import {
	COUNTERS_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	CAMPAING_GROUPS_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	CREATIVES_COLLECTION_NAME,
	DEVICETYPE_COLLECTION_NAME,
	TYPEOS_COLLENCTION_NAME,
	BROWSERTYPE_COLLENCTION_NAME,
	AGEGROUP_COLLENCTION_NAME,
	GENDER_COLLENCTION_NAME,
	SSP_COLLENCTION_NAME,
	STRATEGY_COLLENCTION_NAME,
	PLACEMENTPOSITION_COLLENCTION_NAME,
	SET_CAMPAIGN_FILTER,
	SET_ADBLOCK,
	SET_CREATIVE_FILTER,
	PAY_LINK,
	SET_FAQ_FILTER,
	BUDGETDISTRIBUTION_COLLECTION_NAME, TRANSFER_MONEY,
	BALANCE_COLLECTION_NAME,
} from '../constants';

export const initialState = fromJS({
	creativeUploadingProgress: 0,
	creativeIsUploading: false,
	dates: {
		startDate: moment()
			.startOf('day')
			.subtract('7', 'day')
			.format('YYYY-MM-DD'),
		endDate: moment()
			.startOf('day')
			.format('YYYY-MM-DD'),
		period: 'week',
	},
	campaignGroupFilters: {
		searchWord: null,
		statusFilter: 'active',
		request: null,
	},
	creativeFilters: {
		searchWord: null,
		typeFilter: 'all',
	},
	adBlock: {
		display: true,
	},
	FAQFilter: {
		searchWord: null,
	},
})
	.merge(listInitialState(FAQ_COLLECTION_NAME))
	.merge(collectionInitialState(CAMPAINGS_COLLECTION_NAME))
	.merge(collectionInitialState(CREATIVES_COLLECTION_NAME))
	.merge(collectionInitialState(COUNTERS_COLLECTION_NAME))
	.merge(collectionInitialState(CAMPAING_GROUPS_COLLECTION_NAME))
	.merge(listInitialState(PLACEMENTPOSITION_COLLENCTION_NAME))
	.merge(listInitialState(STRATEGY_COLLENCTION_NAME))
	.merge(listInitialState(SSP_COLLENCTION_NAME))
	.merge(listInitialState(GENDER_COLLENCTION_NAME))
	.merge(listInitialState(AGEGROUP_COLLENCTION_NAME))
	.merge(listInitialState(DEVICETYPE_COLLECTION_NAME))
	.merge(listInitialState(TYPEOS_COLLENCTION_NAME))
	.merge(listInitialState(BROWSERTYPE_COLLENCTION_NAME))
	.merge(listInitialState(PAY_LINK))
	.merge(listInitialState(TRANSFER_MONEY))
	.merge(listInitialState(BALANCE_COLLECTION_NAME))
	.merge(listInitialState(BUDGETDISTRIBUTION_COLLECTION_NAME));

export const rehydrateState = {
	...listRehydrateState(FAQ_COLLECTION_NAME),
	...collectionRehydrateState(COUNTERS_COLLECTION_NAME),
	...collectionRehydrateState(CAMPAING_GROUPS_COLLECTION_NAME),
	...collectionRehydrateState(CAMPAINGS_COLLECTION_NAME),
	...collectionRehydrateState(CREATIVES_COLLECTION_NAME),
	...listRehydrateState(PLACEMENTPOSITION_COLLENCTION_NAME),
	...listRehydrateState(STRATEGY_COLLENCTION_NAME),
	...listRehydrateState(SSP_COLLENCTION_NAME),
	...listRehydrateState(GENDER_COLLENCTION_NAME),
	...listRehydrateState(AGEGROUP_COLLENCTION_NAME),
	...listRehydrateState(DEVICETYPE_COLLECTION_NAME),
	...listRehydrateState(TYPEOS_COLLENCTION_NAME),
	...listRehydrateState(BROWSERTYPE_COLLENCTION_NAME),
	...listRehydrateState(SET_CAMPAIGN_FILTER),
	...listRehydrateState(SET_CREATIVE_FILTER),
	...listRehydrateState(SET_ADBLOCK),
	...listRehydrateState(SET_FAQ_FILTER),
	...listRehydrateState(PAY_LINK),
	...listRehydrateState(TRANSFER_MONEY),
	...listRehydrateState(BUDGETDISTRIBUTION_COLLECTION_NAME),
	...listRehydrateState(BALANCE_COLLECTION_NAME),
};

export default handleActions(
	{
		...collectionReducer(COUNTERS_COLLECTION_NAME),
		...collectionReducer(CAMPAING_GROUPS_COLLECTION_NAME),
		...collectionReducer(CAMPAINGS_COLLECTION_NAME),
		...collectionReducer(CREATIVES_COLLECTION_NAME),
		...listReducer(FAQ_COLLECTION_NAME),
		...listReducer(PLACEMENTPOSITION_COLLENCTION_NAME),
		...listReducer(STRATEGY_COLLENCTION_NAME),
		...listReducer(SSP_COLLENCTION_NAME),
		...listReducer(GENDER_COLLENCTION_NAME),
		...listReducer(AGEGROUP_COLLENCTION_NAME),
		...listReducer(DEVICETYPE_COLLECTION_NAME),
		...listReducer(TYPEOS_COLLENCTION_NAME),
		...listReducer(BROWSERTYPE_COLLENCTION_NAME),
		...listReducer(PAY_LINK),
		...listReducer(TRANSFER_MONEY),
		...listReducer(BUDGETDISTRIBUTION_COLLECTION_NAME),
		...listReducer(BALANCE_COLLECTION_NAME),
		[ActionTypes.UPLOAD_REQUEST]: state => state.set('creativeIsUploading', true),
		[ActionTypes.UPLOAD_PROGRESS]: (state, { payload, meta }) => state.set('creativeUploadingProgress', payload),
		[ActionTypes.UPLOAD_SUCCESS]: (state, { payload, meta }) => state.set('creativeUploadingProgress', 0).set('creativeIsUploading', false),
		[ActionTypes.UPLOAD_FAILURE]: (state, { payload, meta }) => state.set('creativeUploadingProgress', 0).set('creativeIsUploading', false),
		[SET_CAMPAIGN_FILTER]: (state, { payload }) =>
			state.update('campaignGroupFilters', filter => filter.merge(payload)),
		[SET_CREATIVE_FILTER]: (state, { payload }) => state.update('creativeFilters', filter => filter.merge(payload)),
		[SET_ADBLOCK]: (state, { payload }) => state.update('adBlock', filter => filter.merge(payload)),
		[SET_FAQ_FILTER]: (state, { payload }) => state.update('FAQFilter', filter => filter.merge(payload)),
	},
	initialState,
);
