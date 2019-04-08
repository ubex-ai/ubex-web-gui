import moment from 'moment';
import { fromJS } from 'immutable';
import { isoCodeConverterData } from '../Variables/countries';
import { GET_METRICS_ERROR, GET_METRICS_REQUEST, GET_METRICS_SUCCESS, SET_CHARTS_DATES } from '../constants';

export const rehydrateState = fromJS({
	getMetricsLoading: false,
	getMetricsError: null,
});

export const initialState = fromJS({
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
	metrics: {
		topCounters: {},
		topRegions: {},
		topDevices: {},
		topVisitors: {},
		topChannel: {},
		topProfitability: {},
		toTableChannels: [],
		devicesMetrics: [],
		toTableProfitability: [],
		toTableDevices: [],
		toTableTopCounters: [],
	},
	...rehydrateState,
});

export default {
	[SET_CHARTS_DATES]: (state, { payload }) => state.update('dates', dates => dates.merge(payload)),
	[GET_METRICS_REQUEST]: state => state.set('getMetricsLoading', true),
	[GET_METRICS_ERROR]: (state, { payload }) =>
		state.merge({
			getMetricsLoading: false,
			getMetricsError: payload,
		}),
	[GET_METRICS_SUCCESS]: (state, { payload, meta: { propName } }) => {
		if (!propName) {
			return state;
		}
		state = state
			.merge({
				getMetricsLoading: false,
				getMetricsError: null,
			})
			.updateIn(['metrics', propName], metrics => formatMetricsForCharts(state, payload, propName));
		if (propName === 'topCounters') {
			state = state.update('metrics', metrics =>
				metrics.merge({
					topVisitors: formatForTopVisitors(payload),
					topProfitability: formatForTopProfitability(payload),
					toTableTopCounters: toTableBase(payload, 'toTableTopCounters'),
					toTableProfitability: toTableBase(payload, 'toTableProfitability'),
				}),
			);
		}
		if (propName === 'topDevices') {
			state = state.update('metrics', metrics =>
				metrics.merge({
					devicesMetrics: toTableBase(payload, 'toTableDevices'),
				}),
			);
		}
		if (propName === 'topChannel') {
			state = state.update('metrics', metrics =>
				metrics.merge({
					toTableChannels: toTableBase(payload, 'toTableChannels'),
				}),
			);
		}
		return state;
	},
};

export function formatMetricsForCharts(state, data, propName) {
	switch (propName) {
		case 'topCounters':
			return formatForTopCounters(data, state.get('counters').toJS());
		case 'topDevices':
			return formatForTopDevices(data);
		case 'topChannel':
			return formatForTopChannel(data);
		case 'topRegions':
			return formatForTopRegions(data);
		default:
			return toTableBase(data, propName);
	}
}

const colors = ['#f00', '#9467bd', '#ff7f0e', '#2ca02c', 'rgb(230,25,75)', 'rgba(70,240,24)', 'rgb(245,130,49)'];
// check number in array
function isNumber(element) {
	return element instanceof Number || typeof element === 'number';
}
export const getEntryName = ({ dimensions = [] }) =>
	dimensions[0] && dimensions[0].name ? dimensions[0].name : 'Unknown';
export const getPaidUBEX = (i, totals) =>
	totals && totals.length !== 0 && totals[1].length !== 0 && totals[1][i] !== 0 ? totals[1][i] * 0.25 : 0;
export const getPaidUBEXObject = (i, { metrics }) =>
	metrics && metrics.length !== 0 && metrics[1].length !== 0 && metrics[1][i] !== 0 ? metrics[1][i] * 0.25 : 0;
export const getVisitors = (i, totals) => (totals.length !== 0 && totals[0].length !== 0 ? totals[0][i] : 0);
export const getPaidVisitors = (i, totals) => (totals.length !== 0 && totals[1].length !== 0 ? totals[1][i] : 0);
export const getFormatData = (i, labels) =>
	labels.length !== 0 && labels[i] && moment(labels[i]).isValid() ? moment(labels[i]).format('YY-MM-DD') : 'Unknown';
export const getAverage = arrayVisitors =>
	arrayVisitors && arrayVisitors.length && arrayVisitors.every(isNumber)
		? arrayVisitors.reduce((a, b) => a + b) / arrayVisitors.length
		: 0;
export const getTotal = ({ metrics = [] }) =>
	metrics && metrics.length && metrics[1].length && metrics[1].every(isNumber)
		? metrics[1].reduce((a, b) => a + b)
		: 0;

export const getCounterName = ({ dimensions = [] }, data) =>
	dimensions[0] && dimensions[0].name ? getName(dimensions[0].name, data) : 'Unknown';

export const getCount = (i, { metrics = [] }) =>
	metrics.length && metrics[0].length && metrics[0].every(isNumber) && metrics[0][i] ? metrics[0][i] : 0;

export const getCountRegions = (i, { metrics = [] }) =>
	metrics.length && metrics[0].length && metrics[0].every(isNumber) && metrics[0] ? metrics[0] : 0;

export const getPaidUsers = (i, { metrics = [] }) =>
	metrics.length && metrics[1].length && metrics[1].every(isNumber) && metrics[1][i] ? metrics[1][i] : 0;
export const getPaidPercent = (i, { metrics = [] }) =>
	metrics.length &&
	metrics[0].length &&
	metrics[1].length &&
	metrics[0].every(isNumber) &&
	metrics[1].every(isNumber) &&
	metrics[0][i] &&
	metrics[1][i] &&
	metrics[0][i] !== 0 &&
	metrics[1][i] !== 0
		? parseInt((metrics[1][i] * 100) / metrics[0][i], 10)
		: 0;

export function toTableBase({ data = [], labels = [] }, type = 'toTableDevices') {
	const arrayTable = [];
	if (!data || !data.length || !labels || !labels.length) {
		return arrayTable;
	}
	for (let j = 0; j < data.length; j++) {
		for (let i = 0; i < labels.length; i++) {
			const entryData = data[j];
			const label = {
				name: getEntryName(entryData),
				date: moment(labels[i]).format('YYYY-MM-DD'),
				count: getCount(i, entryData),
				paidusers: getPaidUsers(i, entryData),
				paidpercent: getPaidPercent(i, entryData),
			};
			if (type === 'toTable' || type === 'toTableProfitability') {
				label.txid = 'SOON';
			}
			if (type === 'toTableProfitability') {
				label.paidUBEX = getPaidUBEXObject(i, entryData);
				delete label.paidpercent;
			}

			arrayTable.push(label);
		}
	}
	return arrayTable;
}

export function formatForTopRegions({ data }) {
	let countriesColors = {};
	let countriesCounts = {};

	if (!data || !data.length) {
		return countriesColors;
	}
	for (let i = 0; i < (data.length > 5 ? 5 : data.length); i++) {
		const entryData = data[i];
		const country = getEntryName(entryData);
		countriesColors[country.substring(0, country.length - 1)] = colors[i];
		countriesCounts[country.substring(0, country.length - 1)] = getCountRegions(i, entryData);
	}

	countriesColors = convertDataToTwoLetterIsoCode(countriesColors);
	countriesCounts = convertDataToTwoLetterIsoCode(countriesCounts);
	return { countriesColors, countriesCounts };
}

function convertDataToTwoLetterIsoCode(datamapsData) {
	const converted = {};
	for (const data in datamapsData) {
		if (datamapsData.hasOwnProperty(data)) {
			converted[isoCodeConverterData[data] ? isoCodeConverterData[data] : 'Unknown'] = datamapsData[data];
		}
	}

	return converted;
}

export function formatForTopDevices({ data }) {
	const arrayChart = [];
	const arrayLabels = [];

	if (!data || !data.length) {
		return arrayChart;
	}

	for (let i = 0; i < data.length; i++) {
		const entryData = data[i];
		arrayLabels.push(getEntryName(entryData));
		arrayChart.push(data[i].metrics.length ? data[i].metrics[0][0] : 0);
	}
	return { arrayChart, arrayLabels };
}

export function formatForTopChannel({ data }) {
	const arrayChart = [];
	const arrayLabels = [];

	if (!data || !data.length) {
		return arrayChart;
	}

	for (let i = 0; i < data.length; i++) {
		const entryData = data[i];
		arrayLabels.push(getEntryName(entryData));
		arrayChart.push(data[i].metrics.length ? data[i].metrics[0][0] : 0);
	}
	return { arrayChart, arrayLabels };
}

export function formatForTopProfitability({ totals, labels }) {
	const arrayChart = [];
	const arrayLabels = [];
	const arrayPaidVisitors = [];

	if (!totals || !totals.length || !labels || !labels.length) {
		return arrayChart;
	}

	for (let i = 0; i < totals[1].length; i++) {
		arrayPaidVisitors.push(getPaidUBEX(i, totals));
		arrayLabels.push(getFormatData(i, labels));
	}

	const average = Number(getAverage(arrayPaidVisitors)).toFixed(0);
	arrayChart[0] = arrayPaidVisitors;

	return { arrayChart, arrayLabels, average };
}

export function formatForTopVisitors({ totals, labels }) {
	const arrayChart = [];
	const arrayLabels = [];
	const arrayVisitors = [];
	const arrayPaidVisitors = [];

	if (!totals || !totals.length || !labels || !labels.length) {
		return arrayChart;
	}

	for (let i = 0; i < totals[0].length; i++) {
		arrayVisitors.push(getVisitors(i, totals));
		arrayPaidVisitors.push(getPaidVisitors(i, totals));
		arrayLabels.push(getFormatData(i, labels));
	}

	arrayChart[0] = arrayVisitors;
	arrayChart[1] = arrayPaidVisitors;

	return { arrayChart, arrayLabels };
}

export function formatForTopCounters({ data }, counters) {
	const arrayChart = [];
	const arrayLabels = [];

	if (!data || !data.length || !counters || !counters.length) {
		return arrayChart;
	}
	for (let i = 0; i < data.length; i++) {
		const entryData = data[i];
		arrayChart.push(getTotal(entryData));
		arrayLabels.push(getCounterName(entryData, counters));
	}
	return { arrayChart, arrayLabels };
}

export function getName(id, counters) {
	if (!id || !counters) {
		return 'Unknown';
	}
	let nameCounter;
	for (let i = 0; i < counters.length; i++) {
		if (counters[i].counter === id) {
			nameCounter = counters[i].name;
			return nameCounter;
		}
		nameCounter = id;
	}
	return nameCounter;
}
