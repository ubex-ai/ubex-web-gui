/*
 *
 * TradingDesk actions
 *
 */

import {
	collectionActionCreator,
	listActionCreator,
	makeCRUDOnRoute,
	listByDateActionCreator,
	listByParamsActionCreator,
} from 'utils/CollectionHelper/actions';
import { listStatsByParamsActionCreator } from 'utils/StatsHelper/actions';
import {
	DEFAULT_ACTION,
	COUNTERS_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	CREATIVES_COLLECTION_NAME,
	BROWSERTYPE_COLLENCTION_NAME,
	DEVICETYPE_COLLECTION_NAME,
	TYPEOS_COLLENCTION_NAME,
	CAMPAING_GROUPS_COLLECTION_NAME,
	AGEGROUP_COLLENCTION_NAME,
	GENDER_COLLENCTION_NAME,
	STRATEGY_COLLENCTION_NAME,
	PLACEMENTPOSITION_COLLENCTION_NAME,
	SET_CAMPAIGN_FILTER,
	SET_ADBLOCK,
	SET_CREATIVE_FILTER,
	SET_FAQ_FILTER,
	PAY_LINK,
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
	SET_OPENED_GROUP,
	REGIONS_COLLECTION_NAME,
	CITIES_COLLECTION_NAME,
	SET_OPENED_FORMCARD,
	PAYMENT_VARIANTS,
	GROUPSHARING_COLLECTION_NAME,
	CREATIVESHARING_COLLECTION_NAME,
	ONLINE_COUNTERS_COLLECTION_NAME,
	COUNTERSHARING_COLLECTION_NAME,
	PUBLISHERS_CONFIG_COLLECTION_NAME,
	GROUPSTATS_COLLECTION_NAME,
	CAMPAIGNREPORT_CARDS_COLLECTION_NAME,
	FILTERS_COLLECTION_NAME,
	FILTERSHARING_COLLECTION_NAME,
	GET_ONLINE_COUNTERS_REQUEST,
	SET_ACTIVE_COUNTER_STATS,
	SET_ACTIVE_CAMPAIGN_STATS,
	CAMPAING_FORM_LOADING_START,
	SET_FAVORITE_GROUP,
	SET_FAVORITE_CREATIVE,
	SET_FAVORITE_FILTER,
} from './constants';

export function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

/**
 * Campaings
 */
export const campaingCollectionActions = makeCRUDOnRoute(`api/campaign`, CAMPAINGS_COLLECTION_NAME);
export const creativeCollectionActions = makeCRUDOnRoute(`api/creative`, CREATIVES_COLLECTION_NAME);
export const groupCollectionActions = makeCRUDOnRoute('api/campaign-group', CAMPAING_GROUPS_COLLECTION_NAME);
export const bannersCollectionActions = makeCRUDOnRoute('api/banner', BANNERS_COLLECTION_NAME);
export const filtersCollectionActions = makeCRUDOnRoute('api/filter', FILTERS_COLLECTION_NAME);

/**
 * Counters action creator
 */
export const countersCollectionActions = collectionActionCreator(COUNTERS_COLLECTION_NAME);

/**
 * Get list of counters from server
 */
export function getCounters() {
	return countersCollectionActions.getCollection('api/counter');
}

/**
 * Get data of one counter
 * @param {number} id
 */
export function getCounter(id) {
	return countersCollectionActions.getEntry('api/counter', id);
}

/**
 * Send data from form to server
 * @param {Object} values
 */
export function addCounter(values) {
	return countersCollectionActions.addEntry('api/counter', values);
}

/**
 * Send data from form to server
 * @param {number} id
 * @param {Object} values
 */
export function updateCounter(id, values) {
	return countersCollectionActions.updateEntry('api/counter', id, values);
}

/**
 * removeCounter
 * @param id
 * @return {*}
 */
export function removeCounter(id) {
	return countersCollectionActions.removeEntry('api/counter', id);
}

/**
 * setActiveCounter
 * @param id
 * @return {*}
 */
export function setActiveCounter(id) {
	return countersCollectionActions.setActiveEntry(id);
}

/**
 * unsetActiveCounter
 * @return {*}
 */
export function unsetActiveCounter() {
	return countersCollectionActions.unsetActiveEntry();
}

/**
 * Get data for FAQ
 */
export const getFAQ = listActionCreator('api/faq', FAQ_COLLECTION_NAME);

/**
 * Get data for campaign form
 */
export const getDeviceType = listActionCreator('api/device-type', DEVICETYPE_COLLECTION_NAME);
export const getBudgetDistribution = listActionCreator(
	'api/campaign-budget-allocation',
	BUDGETDISTRIBUTION_COLLECTION_NAME,
);
export const getTypeOS = listActionCreator('api/os', TYPEOS_COLLENCTION_NAME);
export const getBrowserType = listActionCreator('api/browser', BROWSERTYPE_COLLENCTION_NAME);
export const getAgeGroup = listActionCreator('api/age-group', AGEGROUP_COLLENCTION_NAME);
export const getGender = listActionCreator('api/gender', GENDER_COLLENCTION_NAME);
export const getSSP = listActionCreator('api/ssp', GENDER_COLLENCTION_NAME);
export const getStrategy = listActionCreator('api/campaign-strategy', STRATEGY_COLLENCTION_NAME);
export const getPlacementPosition = listActionCreator('api/placement-position', PLACEMENTPOSITION_COLLENCTION_NAME);
export const getCreatives = listActionCreator('api/creative', CREATIVES_COLLECTION_NAME);
export const getGroups = listActionCreator('api/campaign-group', CAMPAING_GROUPS_COLLECTION_NAME);
export const getCampaigns = listActionCreator('api/campaign', CAMPAINGS_COLLECTION_NAME);
export const getFilters = listActionCreator('api/filter', FILTERS_COLLECTION_NAME);
export const getPayLink = makeCRUDOnRoute('api/paypal/payment', PAY_LINK);
export const transferMoneyGroup = makeCRUDOnRoute('api/payment/campaign-group/transfer-money', TRANSFER_MONEY);
export const getBalance = listActionCreator('billing/balance', BALANCE_COLLECTION_NAME);
export const getAdSize = listActionCreator('api/banner-size', ADSIZE_COLLECTION_NAME);
export const getLanguages = listActionCreator('api/language', LANGUAGE_COLLECTION_NAME);
export const getRegions = payload => listByParamsActionCreator(`api/country`, REGIONS_COLLECTION_NAME, payload);
export const getCities = payload => listByParamsActionCreator(`api/country`, CITIES_COLLECTION_NAME, payload);
export const contactForm = makeCRUDOnRoute('api/sendmail', CONTACT_FORM);
export const getPaymentHistory = payload =>
	listByDateActionCreator('api/payment/history', PAYMENTHISTORY_COLLECTION_NAME, payload);
export const balanceCollectionActions = makeCRUDOnRoute('billing/balance', BALANCE_COLLECTION_NAME);
export const paymentCollectionActions = makeCRUDOnRoute('billing/payment_methods', PAYMENT_VARIANTS);
export const groupSharingCollectionActions = makeCRUDOnRoute('api/group-sharing', GROUPSHARING_COLLECTION_NAME);
export const creativeSharingCollectionActions = makeCRUDOnRoute(
	'api/creative-sharing',
	CREATIVESHARING_COLLECTION_NAME,
);
export const filterSharingCollectionActions = makeCRUDOnRoute('api/filter-sharing', FILTERSHARING_COLLECTION_NAME);
export const counterSharingCollectionActions = makeCRUDOnRoute('api/counter-sharing', COUNTERSHARING_COLLECTION_NAME);
// export const getOnlineCounters = listActionCreator('api/online', ONLINE_COUNTERS_COLLECTION_NAME);
export const publisherConfig = listActionCreator('api/banner/publishers', PUBLISHERS_CONFIG_COLLECTION_NAME);
/**
 * Update data for chart
 */

export function updateHistory(params, { startDate, endDate }) {
	return dispatch => {
		dispatch(setChartsDates({ startDate, endDate }));
		dispatch(getPaymentHistory({ start_date: startDate, end_date: endDate }));
	};
}

/**
 * Set dates range for charts stats
 * @param {Object} dates
 *  * @param dates.startDate Start date for metrics data.
 *  * @param dates.endDate End date for metrics data.
 *  * @param dates.label
 */
export function setChartsDates(dates) {
	return {
		type: SET_CHARTS_DATES,
		payload: dates,
	};
}

export function setFilterCampaigns(filter) {
	return {
		type: SET_CAMPAIGN_FILTER,
		payload: filter,
	};
}

export function setFilterCreatives(filter) {
	return {
		type: SET_CREATIVE_FILTER,
		payload: filter,
	};
}

export function setFilterFAQ(filter) {
	return {
		type: SET_FAQ_FILTER,
		payload: filter,
	};
}

export function setAdBlock(filter) {
	return {
		type: SET_ADBLOCK,
		payload: filter,
	};
}

export function setPaginationItemsCount(items) {
	return {
		type: SET_PAGINATION_ITEMS_COUNT,
		payload: items,
	};
}

export function setOpenedGroup(id) {
	return {
		type: SET_OPENED_GROUP,
		payload: id,
	};
}

export function setOpenedFormCards(id) {
	return {
		type: SET_OPENED_FORMCARD,
		payload: id,
	};
}

export const getVisitors = payload => listStatsByParamsActionCreator('bydate', VISITORS_COLLECTION_NAME, payload);

export const getCampaignReport = payload =>
	listStatsByParamsActionCreator('desk/bydate', CAMPAIGNREPORT_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		dimensions: 'campaign',
	});

export const getCampaignReportTable = payload =>
	listStatsByParamsActionCreator('desk/bydate', CAMPAIGNREPORT_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		group: 'day',
		dimensions: 'campaign',
	});

export const getCampaignReportCards = payload =>
	listStatsByParamsActionCreator('desk/table', CAMPAIGNREPORT_CARDS_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		group: null,
		// dimensions: null,
	});

export const getHomePageStats = payload =>
	listStatsByParamsActionCreator('desk/bydate', HOMEPAGESTATS_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		group: 'day',
		// dimensions: 'campaign_group',
	});

export const getTableStatsHomePage = payload =>
	listStatsByParamsActionCreator('desk/table', TABLE_HOMEPAGESTATS_COLLECTION_NAME, {
		...payload,
		metrics: 'winrate,spent,ctr,ecpm,cpc,impressions,clicks',
		group: null,
		// dimensions: null,
	});

export const getCreativeReport = payload =>
	listStatsByParamsActionCreator('desk/bydate', CREATIVEREPORT_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		group: 'day',
		dimensions: 'creative',
	});

export const getCreativeReportTable = payload =>
	listStatsByParamsActionCreator('desk/bydate', CREATIVEREPORT_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,winrate,spent,ctr,ecpm,cpc',
		group: 'day',
		dimensions: 'creative',
	});

export const getCounterVisitors = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_VISITORS_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'ids',
	});

export const getCounterVisitorsTable = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_VISITORS_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'ids',
	});

export const getCounterRegions = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_REGIONS_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'country_iso',
	});

export const getCounterRegionsTable = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_REGIONS_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'country_iso',
	});

export const getCounterDevices = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_DEVICES_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'device_category',
	});

export const getCounterDevicesTable = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_DEVICES_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'device_category',
	});

export const getCounterChannel = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_CHANNEL_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'channel',
	});

export const getCounterChannelTable = payload =>
	listStatsByParamsActionCreator('counter/bydate', COUNTER_CHANNEL_TABLE_COLLECTION_NAME, {
		...payload,
		metrics: 'visitors,paid_visitors',
		group: 'day',
		dimensions: 'channel',
	});

export const getGroupStats = payload =>
	listStatsByParamsActionCreator('desk/table', GROUPSTATS_COLLECTION_NAME, {
		...payload,
		metrics: 'impressions,clicks,ctr,spent,cpc',
		dimensions: 'campaign',
	});

export function getOnlineCounter(id) {
	return {
		type: GET_ONLINE_COUNTERS_REQUEST,
		payload: id,
	};
}

export function setActiveCounterStats(id) {
	return {
		type: SET_ACTIVE_COUNTER_STATS,
		payload: id,
	};
}

export function setActiveCampaignStats(id) {
	return {
		type: SET_ACTIVE_CAMPAIGN_STATS,
		payload: id,
	};
}

export function campaingFormLoadingStart() {
	return {
		type: CAMPAING_FORM_LOADING_START,
	};
}

export function setFavoriteGroup(group) {
	return {
		type: SET_FAVORITE_GROUP,
		payload: group,
	};
}

export function setFavoriteCreative(creative) {
	return {
		type: SET_FAVORITE_CREATIVE,
		payload: creative,
	};
}

export function setFavoriteFilter(filters) {
	return {
		type: SET_FAVORITE_FILTER,
		payload: filters,
	};
}
