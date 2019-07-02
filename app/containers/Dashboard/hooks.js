/*
 *
 * Dashboard hooks
 *
 */

export const formatCountriesList = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

export const formatArrayToMap = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

export const formatCategoriesList = rawList => rawList.map(item => ({ id: item.id, label: item.name, value: item.id }));

export const formatFaqList = results => Object.keys(results).map(k => ({ id: k, ...results[k] }));

export const formatTimezones = rawList => rawList.map(item => ({ label: item.name, value: item.id, offset: item.offset }));

export const formatBalance = rawList => {
	const array = new Array(1);
	array[0] = rawList;
	return array;
};