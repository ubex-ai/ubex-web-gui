import { fromJS } from 'immutable';
import publisherReducer from '../reducer';

describe('publisherReducer', () => {
	it('returns the initial state', () => {
		expect(publisherReducer(undefined, {})).toEqual(fromJS({}));
	});
});
