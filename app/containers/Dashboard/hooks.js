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
} from '../DataMiner/reducer/metricsMapReducer';
import { isoCodeConverterData } from '../DataMiner/Variables/countries';
const colors = ['#f00', '#9467bd', '#ff7f0e', '#2ca02c', 'rgb(230,25,75)', 'rgba(70,240,24)', 'rgb(245,130,49)'];
/*
 *
 * Dashboard hooks
 *
 */

export const formatCountriesList = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

export const formatArrayToMap = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

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
export const formatHomePageStats = rawList => {
	return {
		labels: rawList.labels ? rawList.labels.map(label => moment(label).format('DD-MM-YYYY')) : [],
		impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
		clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
		winrate: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
		spent: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
		CTR: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
		eCPM: rawList.totals.length && rawList.totals[5] ? rawList.totals[5] : [],
	};
};

export const formatTableHomePageStats = rawList => {
	return {
		winrate: rawList.totals.length ? rawList.totals[0] : [],
		spent: rawList.totals.length ? rawList.totals[1] : [],
		CTR: rawList.totals.length ? rawList.totals[2] : [],
		eCPM: rawList.totals.length ? rawList.totals[3] : [],
	};
};

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
				date: moment(labels[j]).format('YYYY-MM-DD'),
				impressions: entryData.metrics[0],
				clicks: entryData.metrics[1],
				winrate: entryData.metrics[2],
				spend: entryData.metrics[3],
				CTR: entryData.metrics[4],
				eCPM: entryData.metrics[5],
				labels: labels ? labels.map(label => moment(label).format('DD-MM-YYYY')) : [],
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
					date: moment(labels[i]).format('YYYY-MM-DD'),
					impressions: entryData.metrics[0][i],
					clicks: entryData.metrics[1][i],
					winrate: entryData.metrics[2][i],
					spend: entryData.metrics[3][i],
					CTR: entryData.metrics[4][i],
					eCPM: entryData.metrics[5][i],
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
					date: moment(labels[i]).format('YYYY-MM-DD'),
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
			countriesCounts[country.substring(0, country.length - 1)] = getCountRegions(i, entryData);
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

export const formatPublisherHomePageStats = rawList => {
	return {
		labels: rawList.labels ? rawList.labels.map(label => moment(label).format('DD-MM-YYYY')) : [],
		impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
		clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
		CTR: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
		fillrate: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
		eCPM: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
		revenue: rawList.totals.length && rawList.totals[5] ? rawList.totals[5] : [],
	};
};

export const formatTablePublisherHomePageStats = rawList => {
	return {
		impressions: rawList.totals.length && rawList.totals[0] ? rawList.totals[0] : [],
		clicks: rawList.totals.length && rawList.totals[1] ? rawList.totals[1] : [],
		CTR: rawList.totals.length && rawList.totals[2] ? rawList.totals[2] : [],
		fillrate: rawList.totals.length && rawList.totals[3] ? rawList.totals[3] : [],
		eCPM: rawList.totals.length && rawList.totals[4] ? rawList.totals[4] : [],
	};
};
