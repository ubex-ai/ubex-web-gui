import dataMinerReducer, { initialState as dataMiningIntialState } from '../reducer';
import { getEntryName } from '../reducer/metricsMapReducer';
describe('dataMinerReducer', () => {
	it('returns the initial state', () => {
		expect(dataMinerReducer(undefined, {})).toEqual(dataMiningIntialState);
	});
});

describe('getEntryName', () => {
	it('should return Unknown on empty data', () => {
		const data = {};

		const result = 'Unknown';

		expect(getEntryName(data)).toEqual(result);
	});
	it('should return Unknown on dimensions', () => {
		const data = {
			dimensions: [{}],
		};

		const result = 'Unknown';

		expect(getEntryName(data)).toEqual(result);
	});
	it('should return name', () => {
		const data = {
			dimensions: [{ name: 'user' }],
		};

		const result = 'user';

		expect(getEntryName(data)).toEqual(result);
	});
});
