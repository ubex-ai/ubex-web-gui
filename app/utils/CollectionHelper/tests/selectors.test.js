import { fromJS } from 'immutable';
import makeCollectionSelectors, { selectCollectionList } from '../selectors';

describe('selectCollectionList', () => {
	it('should generate right selectors', () => {
		const domainSelector = () =>
			fromJS({
				counters: [
					{
						foo: 'bar',
					},
				],
			});

		const result = [
			{
				foo: 'bar',
			},
		];

		expect(selectCollectionList(domainSelector)('counters')()).toEqual(result);
	});
});

describe('makeCollectionSelectors', () => {
	const domainSelector = () =>
		fromJS({
			counters: [{ id: 3, name: 'test counter' }],
			[`countersActiveEntryId`]: 3,
		});

	it('should return active netry', () => {
		const result = { id: 3, name: 'test counter' };

		expect(makeCollectionSelectors(domainSelector, 'counters').activeEntry()()).toEqual(result);
	});
});
