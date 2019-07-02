import { createSelector } from 'reselect';
import makeCollectionSelectors, { makeListSelectors } from 'utils/CollectionHelper/selectors';
import { initialState } from './reducer';
import {
	FAQ_COLLECTION_NAME,
	CREATIVES_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	CAMPAING_GROUPS_COLLECTION_NAME,
	PAY_LINK,
} from './constants';
import campaignFilter from './campaignFilter';
import creativeFilter from './creativeFilter';
import faqFilter from './faqFilter';
/**
 * Direct selector to the tradingDesk state domain
 */

const selectTradingDeskDomain = state => state.get('tradingDesk', initialState);

/**
 * Other specific selectors
 */
export const creativesSelectors = makeCollectionSelectors(selectTradingDeskDomain, CREATIVES_COLLECTION_NAME);
export const campaingsSelectors = makeCollectionSelectors(selectTradingDeskDomain, CAMPAINGS_COLLECTION_NAME);
export const campaingGroupSelectors = makeCollectionSelectors(selectTradingDeskDomain, CAMPAING_GROUPS_COLLECTION_NAME);
export const creativeUploadingProgress = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creativeUploadingProgress'),
	);
export const creativeIsUploading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creativeIsUploading'),
	);

/**
 * Default selector used by TradingDesk
 */

export const selectCampaignGroups = propName =>
	createSelector(
		campaingGroupSelectors.collectionList(),
		groups => groups.filter(group => (propName === 'all' ? group : group.status === propName)),
	);

export const selectGroupFilters = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaignGroupFilters').toJS(),
	);

export const selectCreativeFilters = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creativeFilters').toJS(),
	);

export const selectAdBlock = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('adBlock').toJS(),
	);

export const filteringGroups = () =>
	createSelector(
		[
			campaingGroupSelectors.collectionList(),
			campaingsSelectors.collectionList(),
			creativesSelectors.collectionList(),
			selectGroupFilters(),
		],
		(listGroups, listCampaigns, listCreatives, groupFilters) =>
			campaignFilter({ groups: listGroups, campaigns: listCampaigns, creatives: listCreatives }, groupFilters),
	);

export const filteringCreatives = () =>
	createSelector(
		[creativesSelectors.collectionList(), selectCreativeFilters()],
		(listCreatives, creativeFilters) => creativeFilter({ creatives: listCreatives }, creativeFilters),
	);
const makeSelectTradingDesk = () =>
	createSelector(
		selectTradingDeskDomain,
		substate => substate.toJS(),
	);

export const selectChartsDates = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('dates').toJS(),
	);

/**
 * Counters
 */
export const countersSelectors = makeCollectionSelectors(selectTradingDeskDomain, 'counters');

export const selectCountersProp = propName =>
	createSelector(
		countersSelectors.collectionList(),
		counters => counters.map(counter => counter[propName]),
	);
export const selectCountersIds = () =>
	createSelector(
		countersSelectors.collectionList(),
		counters => counters.map(counter => counter.id),
	);

export const selectCountersIdsAndNames = () =>
	createSelector(
		countersSelectors.collectionList(),
		counters => counters.map(counter => ({ id: counter.id, name: counter.name })),
	);

export const selectMetrics = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('metrics').toJS(),
	);

export const selectMetricByName = propName =>
	createSelector(
		selectMetrics(),
		metrics => metrics[propName],
	);

export const totalUsers = (propName = 'topCounters') =>
	createSelector(
		selectMetricByName(propName),
		metric => {
			if (!metric.arrayChart) {
				return 0;
			}
			return metric.arrayChart[0].reduce((accumulator, currentValue) => accumulator + currentValue);
		},
	);

export const calculateProfitability = (propName = 'topProfitability') =>
	createSelector(
		selectMetricByName(propName),
		({ arrayChart = [] }) => (arrayChart && arrayChart[0] ? arrayChart[0].map(item => (250 / 1000) * item) : []),
	);

export const selectAverage = (propName = 'topProfitability') =>
	createSelector(
		[calculateProfitability(propName), totalUsers(propName)],
		(profitability, paidUsers) => (profitability.length > 0 ? paidUsers / profitability.length : 0),
	);

export const selectRevenue = (propName = 'topProfitability') =>
	createSelector(
		[selectMetricByName(propName)],
		({ arrayChart = [] }) =>
			arrayChart.length && arrayChart[0].length > 0 ? arrayChart[0][arrayChart[0].length - 1] : 0,
	);

/**
 * Faq
 */
export const faqSelectors = makeListSelectors(selectTradingDeskDomain, FAQ_COLLECTION_NAME);

export const selectFAQFilter = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('FAQFilter').toJS(),
	);
export const searchFAQ = () =>
	createSelector(
		[faqSelectors.collectionList(), selectFAQFilter()],
		(faqList, faqFilters) => faqFilter(faqList, faqFilters),
	);

export const selectDeviceType = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('device-type').toJS(),
	);

export const selectTypeOS = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('os-type').toJS(),
	);

export const selectBrowserType = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('browser-type').toJS(),
	);

export const selectAgeGroup = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('age-group').toJS(),
	);

export const selectGender = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('gender').toJS(),
	);

export const selectSSP = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('SSP').toJS(),
	);

export const selectStrategy = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('strategy').toJS(),
	);
export const selectPlacement = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('placement').toJS(),
	);

export const selectPayLink = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('payLink').toJS(),
	);

export const selectBudgetDistribution = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('budget-distribution').toJS(),
	);

export const selectBalance = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('balance').toJS(),
	);

export default makeSelectTradingDesk;
export { selectTradingDeskDomain };
