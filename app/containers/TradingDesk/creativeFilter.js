import _ from 'lodash';
export const findIn = (field, name) => {
	const searchQuery = name
		.toString()
		.trim()
		.toLowerCase();
	return typeof field === 'string'
		? field
		.trim()
		.toLowerCase()
		.indexOf(searchQuery) !== -1
		: null;
};
export function searchByWord(list, word) {
	return list.filter(item => findIn(item && item.data ? item.data.name : '', word));
}

function searchByWordAnywere({ creatives }, word) {
	return searchByWord(creatives, word);
}

export function searchByTypeCreative({ creatives }, type) {
	return creatives.filter(creative => (type === 'all' ? creative : creative.creative_type === type));
}

export default function creativeFilter(data, { searchWord, typeFilter }) {
	if(!searchWord) {
		return searchByTypeCreative(data, typeFilter);
	}
	return searchByWordAnywere(
		{ creatives: searchByTypeCreative(data, typeFilter) },
		searchWord,
	);
}
