import { fromJS } from 'immutable';
import tradingDeskReducer from '../reducer';

describe('tradingDeskReducer', () => {
	it('returns the initial state', () => {
		expect(tradingDeskReducer(undefined, {})).toEqual(fromJS({}));
	});
});
