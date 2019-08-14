/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'connected-react-router/immutable';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import createReducer from './reducers';
import rehidrateState from './rehydrateState';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
	// Create the store with two middlewares
	// 1. sagaMiddleware: Makes redux-sagas work
	// 2. routerMiddleware: Syncs the location/URL path to the state
	const middlewares = [sagaMiddleware, routerMiddleware(history), thunk];

	if (process.env.NODE_ENV !== 'production') {
		const logger = createLogger({
			stateTransformer: state => (typeof state.toJS === 'function' ? state.toJS() : state),
		});
		middlewares.push(logger);
	}

	const enhancers = [applyMiddleware(...middlewares)];

	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	/* eslint-disable no-underscore-dangle, indent */
	const composeEnhancers =
		process.env.NODE_ENV !== 'production' &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
			: compose;
	/* eslint-enable */

	function transformState(state, { payload: { _root }, meta }) {
		if (!_root || !_root.entries || !_root.entries.length) {
			return state;
		}

		const newState = {};
		_root.entries.forEach(entry => {
			newState[entry[0]] = entry[1];
		});
		return fromJS(meta).merge(state.merge(newState));
	}

	const store = autoRehydrate({
		log: process.env.NODE_ENV !== 'production',
		stateReconciler: (state, inboundState) =>
			transformState(state, { payload: inboundState, meta: rehidrateState }),
	})(createStore)(createReducer(), fromJS(initialState), composeEnhancers(...enhancers));

	// Extensions
	store.runSaga = sagaMiddleware.run;
	store.injectedReducers = {}; // Reducer registry
	store.injectedSagas = {}; // Saga registry

	// Make reducers hot reloadable, see http://mxs.is/googmo
	/* istanbul ignore next */
	if (module.hot) {
		module.hot.accept('./reducers', () => {
			store.replaceReducer(createReducer(store.injectedReducers));
		});
	}

	const persistConfig = {};
	// TODO: сделать очистку localStorage каждые 5-7 дней
	const loadStore = callback => persistStore(store, persistConfig, callback);

	return { store, loadStore };
}
