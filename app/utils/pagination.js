import _ from 'lodash';
export default function getPaginatedItems(items, page, pageSize) {
	const pg = page || 1;

	const pgSize = pageSize || 10;

	const offset = (pg - 1) * pgSize;

	const pagedItems = _.drop(items, offset).slice(0, pgSize);
	return {
		page: pg,
		pageSize: pgSize,
		total: items.length,
		total_pages: Math.ceil(items.length / pgSize),
		data: pagedItems,
	};
}
