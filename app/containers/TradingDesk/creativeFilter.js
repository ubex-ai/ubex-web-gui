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

export function searchByTypeCreative({ creatives }, type, favorites) {
	return creatives
		.filter(creative => (type === 'all' ? creative : creative.creative_type === type))
		.sort((a, b) => b.id - a.id)
		.sort((a, b) => {
			if (favorites.includes(a.id)) {
				return -1;
			}
			if (favorites.includes(b.id)) {
				return 1;
			}
			return 0;
		});
}

export default function creativeFilter(data, { searchWord, typeFilter }, favorites) {
	if (!searchWord) {
		return searchByTypeCreative(data, typeFilter, favorites);
	}
	return searchByWordAnywere({ creatives: searchByTypeCreative(data, typeFilter, favorites) }, searchWord);
}
