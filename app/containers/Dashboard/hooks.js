import moment from 'moment';
import {
	getCount,
	getCountRegions,
	getEntryName,
	getFormatData,
	getPaidPercent,
	getPaidUBEXObject,
	getPaidUsers,
	getPaidVisitors,
	getVisitors,
	toTableBase,
} from '../DataMiner/reducer/metricsMapReducer';
import { isoCodeConverterData } from '../DataMiner/Variables/countries';
const colors = ['#716aca', '#22b9ff', '#f4516c', '#34bfa3', '#03a9f4', 'rgb(255, 184, 34)', '#f44336'];
/*
 *
 * Dashboard hooks
 *
 */

export const formatCountriesList = rawList =>
	rawList.map(item => ({ uniq: item.code3, label: item.name, value: item.id, ...item }));

export const formatArrayToMap = rawList => rawList.map(item => ({ id: item.id, label: item.name, value: item.id }));

export const formatCategoriesList = rawList => rawList.map(item => ({ id: item.id, label: item.name, value: item.id }));

export const formatFaqList = results => Object.keys(results).map(k => ({ id: k, ...results[k] }));

export const formatTimezones = rawList =>
	rawList.map(item => ({ label: item.name, value: item.id, offset: item.offset }));

export const formatBalance = results => Object.keys(results).map(k => ({ id: 1, amount: results.amount }));

export const formatAdSize = rawList =>
	rawList.map(item => ({
		label: item.label,
		value: item.id,
		width: item.width,
		height: item.height,
		ssp: item.ssp,
		tag: item.tag,
	}));
export const formatHomePageStats = rawList => ({
	labels: rawList.labels ? rawList.labels.map(label => moment(label).format('DD.MM.YY')) : [],
	impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
	clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
	winrate: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
	spent: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
	CTR: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
	eCPM: rawList.totals.length && rawList.totals[5] ? rawList.totals[5] : [],
	CPC: rawList.totals.length && rawList.totals[6] ? rawList.totals[6] : [],
});

export const formatTableHomePageStats = rawList => ({
	winrate: rawList.totals.length ? rawList.totals[0] : [],
	spent: rawList.totals.length ? rawList.totals[1] : [],
	CTR: rawList.totals.length ? rawList.totals[2] : [],
	eCPM: rawList.totals.length ? rawList.totals[3] : [],
	CPC: rawList.totals.length ? rawList.totals[4] : [],
	impressions: rawList.totals.length && rawList.totals[5] ? rawList.totals[5] : [],
	clicks: rawList.totals.length && rawList.totals[6] ? rawList.totals[6] : [],
});

export const formatCampaignReport = ({ data = [], labels = [] }) => {
	const arrayTable = [];
	if (!data || !data.length || !labels || !labels.length) {
		return arrayTable;
	}
	for (let j = 0; j < (data.length > 50 ? 50 : data.length); j++) {
		const entryData = data[j];
		if (entryData.dimensions.length) {
			const label = {
				id: parseInt(getEntryName(entryData), 10),
				name: getEntryName(entryData),
				date: moment(labels[j]).format('DD.MM.YY'),
				impressions: entryData.metrics[0],
				clicks: entryData.metrics[1],
				winrate: entryData.metrics[2],
				spend: entryData.metrics[3],
				CTR: entryData.metrics[4],
				eCPM: entryData.metrics[5],
				CPC: entryData.metrics[6],
				labels: labels ? labels.map(label => moment(label).format('DD.MM.YY')) : [],
			};
			arrayTable.push(label);
		}
	}
	return arrayTable;
};

export const formatTableCampaignReport = ({ data = [], labels = [] }) => {
	const arrayTable = [];
	if (!data || !data.length || !labels || !labels.length) {
		return arrayTable;
	}
	for (let j = 0; j < (data.length > 50 ? 50 : data.length); j++) {
		for (let i = 0; i < labels.length; i++) {
			const entryData = data[j];
			if (entryData.dimensions.length) {
				const label = {
					name: getEntryName(entryData),
					date: labels[i],
					impressions: entryData.metrics[0][i],
					clicks: entryData.metrics[1][i],
					winrate: entryData.metrics[2][i],
					spend: entryData.metrics[3][i],
					CTR: entryData.metrics[4][i],
					eCPM: entryData.metrics[5][i],
					CPC: entryData.metrics[6][i],
				};
				arrayTable.push(label);
			}
		}
	}
	return arrayTable;
};

export const formatCounterStats = ({ data, totals, labels }) => {
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
};

export const formatCounterDeviceStats1 = ({ data, totals, labels }) => {
	console.log(data);
	const arrayChart = [];
	const arrayLabels = [];
	const arrayVisitors = [];
	const arrayPaidVisitors = [];

	if (!totals || !totals.length || !labels || !labels.length) {
		return arrayChart;
	}

	for (let i = 0; i < totals[0].length; i++) {
		const entryData = data[i];
		arrayVisitors.push(getVisitors(i, totals));
		arrayPaidVisitors.push(getPaidVisitors(i, totals));
		arrayLabels.push(getFormatData(i, labels));
	}

	arrayChart[0] = arrayVisitors;
	arrayChart[1] = arrayPaidVisitors;

	return { arrayChart, arrayLabels };
};

export const formatCounterDeviceStats = ({ data, totals, labels }) => {
	let arrayChart = [];
	let arrayLabels = [];
	const arrayVisitors = [];
	const arrayDimensions = [];
	const arrayPaidVisitors = [];

	if (!totals || !totals.length || !labels || !labels.length) {
		return arrayChart;
	}

	for (let i = 0; i < data.length; i++) {
		const entryData = data[i];
		arrayDimensions.push(getEntryName(entryData));
		arrayVisitors.push(entryData.metrics.length ? entryData.metrics[0] : 0);
		arrayLabels = labels.map(label => moment(label).format('DD.MM.YY'));
	}

	arrayChart = arrayVisitors;


	return { arrayChart, arrayLabels, arrayDimensions };
};

export const formatCounterStatsTable = ({ data = [], labels = [] }) => {
	const arrayTable = [];
	if (!data || !data.length || !labels || !labels.length) {
		return arrayTable;
	}
	for (let j = 0; j < data.length; j++) {
		for (let i = 0; i < labels.length; i++) {
			const entryData = data[j];
			if (entryData.dimensions.length) {
				const label = {
					name: getEntryName(entryData),
					date: moment(labels[i]).format('DD.MM.YY'),
					count: getCount(i, entryData),
					paidusers: getPaidUsers(i, entryData),
					paidpercent: getPaidPercent(i, entryData),
				};

				arrayTable.push(label);
			}
		}
	}
	return arrayTable;
};

export const formatRegionsStatsTable = ({ data = [], labels = [] }) => {
	const arrayTable = [];
	if (!data || !data.length || !labels || !labels.length) {
		return arrayTable;
	}
	for (let j = 0; j < data.length; j++) {
		for (let i = 0; i < labels.length; i++) {
			const entryData = data[j];
			if (entryData.dimensions.length) {
				const label = {
					name: getEntryName(entryData),
					date: moment(labels[i]).format('DD.MM.YY'),
					count: getCount(i, entryData),
					paidusers: getPaidUsers(i, entryData),
					paidpercent: getPaidPercent(i, entryData),
				};

				arrayTable.push(label);
			}
		}
	}
	return arrayTable;
};

export const formatCounterDeviceStatsTable = payload => toTableBase(payload, 'toTableDevices');

export const formatCounterChannelStatsTable = payload => toTableBase(payload, 'toTableChannels');

function arraySum(array) {
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

export const formatForTopRegions = ({ data }) => {
	let countriesColors = {};
	let countriesCounts = {};

	if (!data || !data.length) {
		return countriesColors;
	}

	for (let i = 0; i < (data.length > 5 ? 5 : data.length); i++) {
		const entryData = data[i];
		if (entryData.dimensions.length) {
			const country = getEntryName(entryData);
			countriesColors[country.substring(0, country.length - 1)] = colors[i];
			countriesCounts[country.substring(0, country.length - 1)] = arraySum(getCountRegions(i, entryData));
		}
	}

	countriesColors = convertDataToTwoLetterIsoCode(countriesColors);
	countriesCounts = convertDataToTwoLetterIsoCode(countriesCounts);
	return { countriesColors, countriesCounts };
};

function convertDataToTwoLetterIsoCode(datamapsData) {
	const converted = {};
	for (const data in datamapsData) {
		if (datamapsData.hasOwnProperty(data)) {
			converted[isoCodeConverterData[data] ? isoCodeConverterData[data] : 'Unknown'] = datamapsData[data];
		}
	}

	return converted;
}

export const formatPublisherHomePageStats = rawList => ({
	labels: rawList.labels ? rawList.labels.map(label => moment(label).format('DD.MM.YY')) : [],
	impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
	clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
	CTR: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
	fillrate: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
	eCPM: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
	revenue: rawList.totals.length && rawList.totals[5] ? rawList.totals[5] : [],
});

export const formatTablePublisherHomePageStats = rawList => ({
	impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
	clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
	CTR: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
	fillrate: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
	eCPM: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
});

export const formatPaymentVariants = rawList => (rawList.payment_methods ? rawList.payment_methods : []);

export const formatGroupStats = ({ data = [], labels = [] }) => {
	const arrayTable = [];
	if (!data || !data.length) {
		return arrayTable;
	}
	for (let j = 0; j < (data.length > 50 ? 50 : data.length); j++) {
		const entryData = data[j];
		for (let i = 0; i < entryData.dimensions.length; i++) {
			if (entryData.dimensions.length) {
				const label = {
					id: parseInt(getEntryName(entryData), 10),
					impressions: entryData.metrics[0][i],
					clicks: entryData.metrics[1][i],
					CTR: entryData.metrics[2][i],
					spent: entryData.metrics[3][i],
					CPC: entryData.metrics[4][i],
				};
				arrayTable.push(label);
			}
		}
	}
	return arrayTable;
};

export const formatCardsCampaignReport = rawList => ({
	impressions: rawList.totals.length ? rawList.totals[0] : [],
	clicks: rawList.totals.length ? rawList.totals[1] : [],
	winrate: rawList.totals.length ? rawList.totals[2] : [],
	spent: rawList.totals.length ? rawList.totals[3] : [],
	CTR: rawList.totals.length ? rawList.totals[4] : [],
	eCPM: rawList.totals.length ? rawList.totals[5] : [],
});
