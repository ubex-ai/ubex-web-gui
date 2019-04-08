import saga from './saga';
import reducer, { collectionRehydrateState, collectionInitialState } from './reducers';
import selectors from './selectors';
import * as actions from './actions';
import * as constants from './constants';

export default {
	selectors,
	saga,
	reducer,
	actions,
	constants,
	collectionRehydrateState,
	collectionInitialState,
};
