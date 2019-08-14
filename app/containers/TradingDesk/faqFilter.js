/**
 * Faq Filters
 */
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
	if(word){
		let result = [];
		Object.keys(list).map((key, i) => {
			result[key] = {
				...list[key],
				qa: list[key].qa.filter(item => findIn(item.question, word) || findIn(item.answer, word)),
			};
		});
		return result;
	} else {
		return list;
	}
}

function searchByWordAnywere(data, word) {
	return searchByWord(data, word);
}

export default function faqFilter(data, { searchWord }) {
	return searchByWordAnywere(data, searchWord);
}
