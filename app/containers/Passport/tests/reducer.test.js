import { fromJS } from 'immutable';
import passportReducer from '../reducer';

describe('passportReducer', () => {
	it('returns the initial state', () => {
		expect(passportReducer(undefined, {})).toEqual(fromJS({}));
	});
});
