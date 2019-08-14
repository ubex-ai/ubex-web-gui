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
import { statsInitialState, statsRehydrateState, statsReducer } from 'utils/StatsHelper/reducer';
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
	BUDGETDISTRIBUTION_COLLECTION_NAME,
	TRANSFER_MONEY,
	BALANCE_COLLECTION_NAME,
	PAYMENTHISTORY_COLLECTION_NAME,
	SET_CHARTS_DATES,
	BANNERS_COLLECTION_NAME,
	ADSIZE_COLLECTION_NAME,
	LANGUAGE_COLLECTION_NAME,
	SET_PAGINATION_ITEMS_COUNT,
	CONTACT_FORM,
	VISITORS_COLLECTION_NAME,
	CAMPAIGNREPORT_COLLECTION_NAME,
	HOMEPAGESTATS_COLLECTION_NAME,
	TABLE_HOMEPAGESTATS_COLLECTION_NAME,
	CAMPAIGNREPORT_TABLE_COLLECTION_NAME,
	CREATIVEREPORT_COLLECTION_NAME,
	CREATIVEREPORT_TABLE_COLLECTION_NAME,
	COUNTER_VISITORS_COLLECTION_NAME,
	COUNTER_VISITORS_TABLE_COLLECTION_NAME,
	COUNTER_REGIONS_COLLECTION_NAME,
	COUNTER_REGIONS_TABLE_COLLECTION_NAME,
	COUNTER_DEVICES_COLLECTION_NAME,
	COUNTER_DEVICES_TABLE_COLLECTION_NAME,
	COUNTER_CHANNEL_COLLECTION_NAME,
	COUNTER_CHANNEL_TABLE_COLLECTION_NAME,
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
	paginationItemsCount: {
		creativesCount: 10,
		campaignGroupsCount: 10,
	},
})
	.merge(listInitialState(FAQ_COLLECTION_NAME))
	.merge(collectionInitialState(CAMPAINGS_COLLECTION_NAME))
	.merge(collectionInitialState(CREATIVES_COLLECTION_NAME))
	.merge(collectionInitialState(COUNTERS_COLLECTION_NAME))
	.merge(collectionInitialState(CAMPAING_GROUPS_COLLECTION_NAME))
	.merge(collectionInitialState(BANNERS_COLLECTION_NAME))
	.merge(listInitialState(PLACEMENTPOSITION_COLLENCTION_NAME))
	.merge(listInitialState(STRATEGY_COLLENCTION_NAME))
	.merge(listInitialState(SSP_COLLENCTION_NAME))
	.merge(listInitialState(GENDER_COLLENCTION_NAME))
	.merge(listInitialState(AGEGROUP_COLLENCTION_NAME))
	.merge(listInitialState(LANGUAGE_COLLECTION_NAME))
	.merge(listInitialState(DEVICETYPE_COLLECTION_NAME))
	.merge(listInitialState(TYPEOS_COLLENCTION_NAME))
	.merge(listInitialState(BROWSERTYPE_COLLENCTION_NAME))
	.merge(listInitialState(PAY_LINK))
	.merge(listInitialState(TRANSFER_MONEY))
	.merge(listInitialState(CONTACT_FORM))
	.merge(listInitialState(BALANCE_COLLECTION_NAME))
	.merge(listInitialState(BUDGETDISTRIBUTION_COLLECTION_NAME))
	.merge(listInitialState(PAYMENTHISTORY_COLLECTION_NAME))
	.merge(listInitialState(ADSIZE_COLLECTION_NAME))
	.merge(statsInitialState(VISITORS_COLLECTION_NAME))
	.merge(statsInitialState(CAMPAIGNREPORT_COLLECTION_NAME))
	.merge(statsInitialState(HOMEPAGESTATS_COLLECTION_NAME))
	.merge(statsInitialState(TABLE_HOMEPAGESTATS_COLLECTION_NAME))
	.merge(statsInitialState(CAMPAIGNREPORT_TABLE_COLLECTION_NAME))
	.merge(statsInitialState(CREATIVEREPORT_COLLECTION_NAME))
	.merge(statsInitialState(CREATIVEREPORT_TABLE_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_VISITORS_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_VISITORS_TABLE_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_REGIONS_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_REGIONS_TABLE_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_DEVICES_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_DEVICES_TABLE_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_CHANNEL_COLLECTION_NAME))
	.merge(statsInitialState(COUNTER_CHANNEL_TABLE_COLLECTION_NAME));

export const rehydrateState = {
	...listRehydrateState(FAQ_COLLECTION_NAME),
	...collectionRehydrateState(COUNTERS_COLLECTION_NAME),
	...collectionRehydrateState(CAMPAING_GROUPS_COLLECTION_NAME),
	...collectionRehydrateState(CAMPAINGS_COLLECTION_NAME),
	...collectionRehydrateState(CREATIVES_COLLECTION_NAME),
	...collectionRehydrateState(BANNERS_COLLECTION_NAME),
	...listRehydrateState(PLACEMENTPOSITION_COLLENCTION_NAME),
	...listRehydrateState(STRATEGY_COLLENCTION_NAME),
	...listRehydrateState(SSP_COLLENCTION_NAME),
	...listRehydrateState(GENDER_COLLENCTION_NAME),
	...listRehydrateState(AGEGROUP_COLLENCTION_NAME),
	...listRehydrateState(LANGUAGE_COLLECTION_NAME),
	...listRehydrateState(DEVICETYPE_COLLECTION_NAME),
	...listRehydrateState(TYPEOS_COLLENCTION_NAME),
	...listRehydrateState(BROWSERTYPE_COLLENCTION_NAME),
	...listRehydrateState(SET_CAMPAIGN_FILTER),
	...listRehydrateState(SET_CREATIVE_FILTER),
	...listRehydrateState(SET_ADBLOCK),
	...listRehydrateState(SET_FAQ_FILTER),
	...listRehydrateState(PAY_LINK),
	...listRehydrateState(SET_PAGINATION_ITEMS_COUNT),
	...listRehydrateState(TRANSFER_MONEY),
	...listRehydrateState(CONTACT_FORM),
	...listRehydrateState(BUDGETDISTRIBUTION_COLLECTION_NAME),
	...listRehydrateState(BALANCE_COLLECTION_NAME),
	...listRehydrateState(PAYMENTHISTORY_COLLECTION_NAME),
	...listRehydrateState(ADSIZE_COLLECTION_NAME),
	...statsRehydrateState(VISITORS_COLLECTION_NAME),
	...statsRehydrateState(CAMPAIGNREPORT_COLLECTION_NAME),
	...statsRehydrateState(HOMEPAGESTATS_COLLECTION_NAME),
	...statsRehydrateState(TABLE_HOMEPAGESTATS_COLLECTION_NAME),
	...statsRehydrateState(CAMPAIGNREPORT_TABLE_COLLECTION_NAME),
	...statsRehydrateState(CREATIVEREPORT_COLLECTION_NAME),
	...statsRehydrateState(CREATIVEREPORT_TABLE_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_VISITORS_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_VISITORS_TABLE_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_REGIONS_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_REGIONS_TABLE_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_DEVICES_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_DEVICES_TABLE_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_CHANNEL_COLLECTION_NAME),
	...statsRehydrateState(COUNTER_CHANNEL_TABLE_COLLECTION_NAME),
};

export default handleActions(
	{
		...collectionReducer(COUNTERS_COLLECTION_NAME),
		...collectionReducer(CAMPAING_GROUPS_COLLECTION_NAME),
		...collectionReducer(CAMPAINGS_COLLECTION_NAME),
		...collectionReducer(CREATIVES_COLLECTION_NAME),
		...collectionReducer(BANNERS_COLLECTION_NAME),
		...listReducer(FAQ_COLLECTION_NAME),
		...listReducer(PLACEMENTPOSITION_COLLENCTION_NAME),
		...listReducer(STRATEGY_COLLENCTION_NAME),
		...listReducer(SSP_COLLENCTION_NAME),
		...listReducer(GENDER_COLLENCTION_NAME),
		...listReducer(AGEGROUP_COLLENCTION_NAME),
		...listReducer(LANGUAGE_COLLECTION_NAME),
		...listReducer(DEVICETYPE_COLLECTION_NAME),
		...listReducer(TYPEOS_COLLENCTION_NAME),
		...listReducer(BROWSERTYPE_COLLENCTION_NAME),
		...listReducer(PAY_LINK),
		...listReducer(TRANSFER_MONEY),
		...listReducer(CONTACT_FORM),
		...listReducer(BUDGETDISTRIBUTION_COLLECTION_NAME),
		...listReducer(BALANCE_COLLECTION_NAME),
		...listReducer(PAYMENTHISTORY_COLLECTION_NAME),
		...listReducer(ADSIZE_COLLECTION_NAME),
		...statsReducer(VISITORS_COLLECTION_NAME),
		...statsReducer(CAMPAIGNREPORT_COLLECTION_NAME),
		...statsReducer(HOMEPAGESTATS_COLLECTION_NAME),
		...statsReducer(TABLE_HOMEPAGESTATS_COLLECTION_NAME),
		...statsReducer(CAMPAIGNREPORT_TABLE_COLLECTION_NAME),
		...statsReducer(CREATIVEREPORT_COLLECTION_NAME),
		...statsReducer(CREATIVEREPORT_TABLE_COLLECTION_NAME),
		...statsReducer(COUNTER_VISITORS_COLLECTION_NAME),
		...statsReducer(COUNTER_VISITORS_TABLE_COLLECTION_NAME),
		...statsReducer(COUNTER_REGIONS_COLLECTION_NAME),
		...statsReducer(COUNTER_REGIONS_TABLE_COLLECTION_NAME),
		...statsReducer(COUNTER_DEVICES_COLLECTION_NAME),
		...statsReducer(COUNTER_DEVICES_TABLE_COLLECTION_NAME),
		...statsReducer(COUNTER_CHANNEL_COLLECTION_NAME),
		...statsReducer(COUNTER_CHANNEL_TABLE_COLLECTION_NAME),
		[ActionTypes.UPLOAD_REQUEST]: state => state.set('creativeIsUploading', true),
		[ActionTypes.UPLOAD_PROGRESS]: (state, { payload }) => state.set('creativeUploadingProgress', payload),
		[ActionTypes.UPLOAD_SUCCESS]: state =>
			state.set('creativeUploadingProgress', 0).set('creativeIsUploading', false),
		[ActionTypes.UPLOAD_FAILURE]: state =>
			state.set('creativeUploadingProgress', 0).set('creativeIsUploading', false),
		[SET_CAMPAIGN_FILTER]: (state, { payload }) =>
			state.update('campaignGroupFilters', filter => filter.merge(payload)),
		[SET_CREATIVE_FILTER]: (state, { payload }) => state.update('creativeFilters', filter => filter.merge(payload)),
		[SET_ADBLOCK]: (state, { payload }) => state.update('adBlock', filter => filter.merge(payload)),
		[SET_FAQ_FILTER]: (state, { payload }) => state.update('FAQFilter', filter => filter.merge(payload)),
		[SET_CHARTS_DATES]: (state, { payload }) => state.update('dates', filter => filter.merge(payload)),
		[SET_PAGINATION_ITEMS_COUNT]: (state, { payload }) =>
			state.update('paginationItemsCount', filter => filter.merge(payload)),
	},
	initialState,
);
