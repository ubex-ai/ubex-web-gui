/*
 *
 * DataMiner actions
 *
 */

import moment from 'moment';
import { collectionActionCreator, listActionCreator, makeCRUDOnRoute } from 'utils/CollectionHelper/actions';
import {
	SET_CHARTS_DATES,
	GET_METRICS_REQUEST,
	UPDATE_CHARTS_DATA_REQUEST,
	GET_ONLINE_COUNTERS_REQUEST,
	FAQ_COLLECTION_NAME,
	COUNTERS_COLLECTION_NAME,
} from './constants';

/**
 * Counters action creator
 */
export const countersCollectionActions = collectionActionCreator(COUNTERS_COLLECTION_NAME);

/**
 * Get list of counters from server
 */
export function getCounters() {
	return countersCollectionActions.getCollection('api/status');
}

/**
 * Get data of one counter
 * @param {number} id
 */
export function getCounter(id) {
	return countersCollectionActions.getEntry('api/miner', id);
}

/**
 * Send data from form to server
 * @param {Object} values
 */
export function addCounter(values) {
	return countersCollectionActions.addEntry('api/miner', values);
}

/**
 * Send data from form to server
 * @param {number} id
 * @param {Object} values
 */
export function updateCounter(id, values) {
	return countersCollectionActions.updateEntry('api/miner', id, values);
}

/**
 * removeCounter
 * @param id
 * @return {*}
 */
export function removeCounter(id) {
	return countersCollectionActions.removeEntry('api/miner', id);
}

/**
 * Get data for FAQ
 */
export const getFaq = listActionCreator('api/faq', FAQ_COLLECTION_NAME);

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
 * Update data for chart
 */

export function updateCharts(params, dates) {
	return dispatch => {
		dispatch(setChartsDates(dates));
		dispatch({
			type: UPDATE_CHARTS_DATA_REQUEST,
			payload: params,
		});
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
/**
 * Get data for Metrics base fire starter action
 *  @param {Object} payload
 *  * @param payload.start_date Start date for metrics data.
 *  * @param payload.end_date End date for metrics data.
 *  * @param payload.group Group data by day, week, month, year.
 *  * @param payload.metrics Metrics by visitors and paid_visitors.
 *  @param {Object} meta
 *  * @param {string} meta.propName Meta data for reducer
 */
export function getMetrics(payload, meta = {}) {
	return {
		type: GET_METRICS_REQUEST,
		payload,
		meta,
	};
}

/**
 *
 * @param {string} group
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} metrics
 * @param {Object} params
 * @param {{propName: string}} meta
 * @returns {{payload, meta, type}}
 */
export function getTotal(
	{
		group = 'day',
		startDate = moment()
			.subtract('day', 6)
			.format('YYYY-MM-DD'),
		endDate = moment().format('YYYY-MM-DD'),
		metrics = 'visitors',
		...params
	},
	meta,
) {
	return getMetrics(
		{
			start_date: startDate,
			end_date: endDate,
			group,
			metrics,
			...params,
		},
		meta,
	);
}

// График Top counters
export function getTopCounters(params) {
	return getTotal(
		{ dimensions: 'ids', group: 'day', metrics: ['visitors', 'paid_visitors'], ...params },
		{ propName: 'topCounters' },
	);
}

// График Devices
export function getTopRegions(params) {
	return getTotal({ dimensions: 'country_iso', metrics: ['paid_visitors'], ...params }, { propName: 'topRegions' });
}

// График Devices
export function getTopDevices(params) {
	return getTotal(
		{ dimensions: 'device_category', group: 'day', metrics: ['paid_visitors'], ...params },
		{ propName: 'topDevices' },
	);
}

// График Channel
export function getTopChannel(params) {
	return getTotal(
		{ dimensions: 'channel', group: 'day', metrics: ['paid_visitors'], ...params },
		{ propName: 'topChannel' },
	);
}

// Таблица Devices
export function getDevicesMetrics(params) {
	return getTotal(
		{ dimensions: 'device_category', group: 'day', metrics: ['visitors', 'paid_visitors'], ...params },
		{ propName: 'toTableDevices' },
	);
}

// Таблица Channel
export function getChannelMetrics(params) {
	return getTotal(
		{ dimensions: 'channel', group: 'day', metrics: ['visitors', 'paid_visitors'], ...params },
		{ propName: 'toTableChannels' },
	);
}

/**
 * Get data for Online counter
 */
export function getOnlineCounter() {
	return {
		type: GET_ONLINE_COUNTERS_REQUEST,
	};
}
