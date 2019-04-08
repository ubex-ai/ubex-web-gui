import { createSelector } from 'reselect';
import { feature } from 'topojson-client';
import makeCollectionSelectors, { makeListSelectors } from 'utils/CollectionHelper/selectors';
import { initialState } from './reducer';
import { FAQ_COLLECTION_NAME } from './constants';
/**
 * Direct selector to the dataMiner state domain
 */
export const selectDataMinerDomain = state => !state ? {} : state.get('dataMiner', initialState);

/**
 * Other specific selectors
 */

/**
 * Default selector used by HomePage
 */

const makeSelectDataMiner = () =>
	createSelector(
		selectDataMinerDomain,
		substate => substate.toJS(),
	);

/**
 * Counters
 */
export const countersSelectors = makeCollectionSelectors(selectDataMinerDomain, 'counters');


export const faqSelectors = makeListSelectors(selectDataMinerDomain, FAQ_COLLECTION_NAME);

export const selectCountersProp = propName =>
	createSelector(
		countersSelectors.collectionList(),
		counters => counters.map(counter => counter[propName]),
	);

export const selectCountersIds = () =>
	createSelector(
		selectCountersProp('counter'),
		counter => counter,
	);

export const selectOnlineCounters = () =>
	createSelector(
		selectDataMinerDomain,
		state => state.get('onlineCounters').toJS(),
	);

/**
 * Metrics
 */
export const getMetricsLoading = () =>
	createSelector(
		selectDataMinerDomain,
		substate => substate.get('getMetricsLoading'),
	);

export const getMetricsError = () =>
	createSelector(
		selectDataMinerDomain,
		substate => substate.get('getMetricsError'),
	);

export const selectMetrics = () =>
	createSelector(
		selectDataMinerDomain,
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
export const selectRelativeTodayMetric = propName =>
	createSelector(
		[selectMetricByName(propName)],
		({ arrayChart }) =>
			arrayChart && arrayChart.length && arrayChart[0].length > 0
				? {
						today: arrayChart[0][arrayChart[0].length - 1],
						yesterday: arrayChart[0][arrayChart[0].length - 2],
				  }
				: 0,
	);

export const selectRatio = propName =>
	createSelector(
		[selectRelativeTodayMetric(propName)],
		selectRelativeTodayMetric => {
			const { today, yesterday } = selectRelativeTodayMetric;
			if (today === 0 && yesterday === 0) {
				return 0;
			}
			if (today === 0) {
				return -100;
			}
			if (yesterday === 0) {
				return 100;
			}
			if (today > yesterday) {
				return ((today - yesterday) / yesterday) * 100;
			}
			if (today < yesterday) {
				return -((yesterday - today) / yesterday) * 100;
			}
			return 0;
		},
	);

export const selectChartsDates = () =>
	createSelector(
		selectDataMinerDomain,
		state => state.get('dates').toJS(),
	);


export default makeSelectDataMiner;
