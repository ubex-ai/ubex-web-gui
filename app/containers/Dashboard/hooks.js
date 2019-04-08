/*
 *
 * Dashboard hooks
 *
 */

export const formatCountriesList = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

export const formatTimezonesList = rawList => rawList.map(item => ({ label: item.name, value: item.id }));

export const formatCategoriesList = rawList => rawList.map(item => ({ id: item.id, label: item.name, value: item.id }));

export const formatFaqList = results => Object.keys(results).map(k => ({ id: k, ...results[k] }));
