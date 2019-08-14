/**
 *
 * DataMiner Container
 *
 */
import { STORE_NAME as storeName } from './constants';
import dashboard from './dashboard';
import reducer, { rehydrateState, initialState } from './reducer';
import saga, { onAppInit as initSaga } from './saga';

export default {
	storeName,
	reducer,
	dashboard,
	initSaga,
	saga,
	initialState,
	rehydrateState,
};
