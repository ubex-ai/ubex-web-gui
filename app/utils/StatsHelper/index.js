import saga from './saga';
import reducer, { statsInitialState, statsRehydrateState, statsReducer } from './reducer';
import selectors from './selectors';
import * as actions from './actions';
import * as constants from './constants';

export default {
	selectors,
	saga,
	reducer,
	actions,
	constants,
	statsInitialState,
	statsRehydrateState,
	statsReducer,
};
