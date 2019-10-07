import { createSelector } from 'reselect';
import makeCollectionSelectors, { makeListSelectors } from 'utils/CollectionHelper/selectors';
import { initialState } from './reducer';
import {
	STORE_NAME,
	FAQ_COLLECTION_NAME,
	CREATIVES_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	CAMPAING_GROUPS_COLLECTION_NAME,
	HOMEPAGESTATS_COLLECTION_NAME,
	PAYMENT_VARIANTS,
	GROUPSHARING_COLLECTION_NAME,
	CREATIVESHARING_COLLECTION_NAME,
	COUNTERSHARING_COLLECTION_NAME,
	GROUPSTATS_COLLECTION_NAME,
	FILTERS_COLLECTION_NAME,
} from './constants';
import campaignFilter from './campaignFilter';
import creativeFilter from './creativeFilter';
import faqFilter from './faqFilter';

/**
 * Direct selector to the tradingDesk state domain
 */
const selectTradingDeskDomain = state => state.get(STORE_NAME, initialState);

/**
 * Other specific selectors
 */
export const creativesSelectors = makeCollectionSelectors(selectTradingDeskDomain, CREATIVES_COLLECTION_NAME);
export const campaingsSelectors = makeCollectionSelectors(selectTradingDeskDomain, CAMPAINGS_COLLECTION_NAME);
export const campaingGroupSelectors = makeCollectionSelectors(selectTradingDeskDomain, CAMPAING_GROUPS_COLLECTION_NAME);
export const filtersSelectors = makeCollectionSelectors(selectTradingDeskDomain, FILTERS_COLLECTION_NAME);
export const creativeSharingSelectors = makeCollectionSelectors(
	selectTradingDeskDomain,
	CREATIVESHARING_COLLECTION_NAME,
);
export const counterSharingSelectors = makeCollectionSelectors(selectTradingDeskDomain, COUNTERSHARING_COLLECTION_NAME);

export const selectCampaignsIds = () =>
	createSelector(
		campaingsSelectors.collectionList(),
		campaigns => campaigns.map(campaign => campaign.id).sort((a, b) => a - b),
	);

export const selectGroupsIds = () =>
	createSelector(
		campaingGroupSelectors.collectionList(),
		groups =>
			groups
				.filter(f => f.status === 'active')
				.map(group => group.id)
				.sort((a, b) => a - b),
	);
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

export const selectFavoriteGroups = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('favoriteGroups').toJS(),
	);

export const filteringGroups = () =>
	createSelector(
		[
			campaingGroupSelectors.collectionList(),
			campaingsSelectors.collectionList(),
			creativesSelectors.collectionList(),
			selectGroupFilters(),
			selectFavoriteGroups(),
		],
		(listGroups, listCampaigns, listCreatives, groupFilters, favorites) =>
			campaignFilter(
				{ groups: listGroups, campaigns: listCampaigns, creatives: listCreatives },
				groupFilters,
				favorites,
			),
	);

export const selectFavoriteCreatives = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('favoriteCreatives').toJS(),
	);

export const filteringCreatives = () =>
	createSelector(
		[creativesSelectors.collectionList(), selectCreativeFilters(), selectFavoriteCreatives()],
		(listCreatives, creativeFilters, favorites) =>
			creativeFilter({ creatives: listCreatives }, creativeFilters, favorites),
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
		counters => counters.map(counter => counter.counter),
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

export const selectOpenedGroup = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('openedGroup').toJS(),
	);

export const selectOpenedFormCards = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('openedFormCards').toJS(),
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

export const selectPaymentVariants = makeCollectionSelectors(selectTradingDeskDomain, PAYMENT_VARIANTS);

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

export const selectPaymentHistory = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('payment-history').toJS(),
	);

export const selectAdSize = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('adsize').toJS(),
	);

export const selectLanguages = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('languages').toJS(),
	);

export const selectPaginationCounts = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('paginationItemsCount').toJS(),
	);

export const selectCampaignReport = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaign-report').toJS(),
	);

export const selectHomePageStats = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('homepage-stats').toJS(),
	);

export const selectHomePageStatsError = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('homepage-statsError'),
	);

export const selectHomePageStatsLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('homepage-statsLoading'),
	);

export const selectTableHomePageStats = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('table-homepage-stats').toJS(),
	);

export const selectTableHomePageStatsLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('table-homepage-statsLoading'),
	);

export const selectCampaignReportTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaign-report-table').toJS(),
	);

export const selectCampaignReportLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaign-reportLoading'),
	);

export const selectCampaignReportTableLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaign-report-tableLoading'),
	);

export const selectCampaignReportCards = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('campaign-report-cards').toJS(),
	);

export const selectCreativeReport = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creative-report').toJS(),
	);

export const selectCreativeReportLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creative-reportLoading'),
	);

export const selectCreativeReportTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('creative-report-table').toJS(),
	);

export const selectCounterVisitors = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-visitors').toJS(),
	);

export const selectCounterVisitorsTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-visitors-table').toJS(),
	);

export const selectCounterRegions = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-regions').toJS(),
	);

export const selectCounterRegionsTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-regions-table').toJS(),
	);

export const selectCounterDevices = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-devices').toJS(),
	);

export const selectCounterDevicesTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-devices-table').toJS(),
	);

export const selectCounterChannel = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-channel').toJS(),
	);

export const selectCounterChannelTable = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('counter-channel-table').toJS(),
	);

export const selectGroupStats = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('groupStats').toJS(),
	);

export const selectGroupStatsLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('groupStatsLoading'),
	);

export const selectCounterOnline = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('onlineCounters').toJS(),
	);

export const selectCounterOnlineLoading = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('onlineCountersLoading'),
	);

export const selectActiveCounterStats = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('activeCounterStats'),
	);

export const selectActiveCampaignStats = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('activeCampaignStats'),
	);

export const selectRegions = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('regions').toJS(),
	);

export const selectCities = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('cities').toJS(),
	);
export const selectPublishersConfig = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('publishersConfig').toJS(),
	);

export const selectFavoriteFilters = () =>
	createSelector(
		selectTradingDeskDomain,
		state => state.get('favoriteFilters').toJS(),
	);

export const filteringFilters = () =>
	createSelector(
		[filtersSelectors.collectionList(), selectFavoriteFilters()],
		(listFilters, favorites) =>
			listFilters
				.sort((a, b) => b.id - a.id)
				.sort((a, b) => {
					if (favorites.includes(a.id)) {
						return -1;
					}
					if (favorites.includes(b.id)) {
						return 1;
					}
					return 0;
				}),
	);

export default makeSelectTradingDesk;
export { selectTradingDeskDomain };
