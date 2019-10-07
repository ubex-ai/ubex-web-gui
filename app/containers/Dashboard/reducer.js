/*
 *
 * DashboardInner reducer
 *
 */

import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import { listRehydrateState, listInitialState, listReducer } from 'utils/CollectionHelper/reducers';

import {
	APP_INIT,
	APP_INIT_SUCCESS,
	APP_INIT_REJECT,
	SET_DASHBOARD_LOADING,
	SET_DASHBOARD_ERROR,
	APP_INIT_SET_MESSAGE,
	APP_INIT_SET_PERCENT,
	COUNTRY_COLLECTION_NAME,
	TIMEZONE_COLLECTION_NAME,
	CATEGORY_COLLECTION_NAME,
	LANGUAGE_COLLECTION_NAME,
	SET_UBEX_POPOVER,
	SET_LANGUAGE_LOADING,
	SET_PAYMENT_MODAL,
	CATEGORYV1_COLLECTION_NAME,
} from './constants';

const dashboardRehydrateState = {
	appDidFetch: false,
	appInitMessage: 'Loading',
	appInitPercent: 0,
	appInitLoading: false,
	appInitError: null,
	dashboardLoading: false,
	languageLoading: false,
	dashboardError: null,
	ubexPopover: {
		display: true,
	},
	paymentModal: {
		display: true,
	},
};
export const rehydrateState = {
	...dashboardRehydrateState,
	...listRehydrateState(COUNTRY_COLLECTION_NAME),
	...listRehydrateState(TIMEZONE_COLLECTION_NAME),
	...listRehydrateState(CATEGORY_COLLECTION_NAME),
	...listRehydrateState(CATEGORYV1_COLLECTION_NAME),
	...listRehydrateState(LANGUAGE_COLLECTION_NAME),
	...listRehydrateState(COUNTRY_COLLECTION_NAME),
	...listRehydrateState(SET_UBEX_POPOVER),
	...listRehydrateState(SET_PAYMENT_MODAL),
};

export const initialState = fromJS(dashboardRehydrateState)
	.merge(listInitialState(COUNTRY_COLLECTION_NAME))
	.merge(listInitialState(TIMEZONE_COLLECTION_NAME))
	.merge(listInitialState(CATEGORY_COLLECTION_NAME))
	.merge(listInitialState(CATEGORYV1_COLLECTION_NAME))
	.merge(listInitialState(LANGUAGE_COLLECTION_NAME));

const dashboardReducer = {
	[APP_INIT]: state => state.set('appInitLoading', true),
	[APP_INIT_SUCCESS]: state => state.merge({ appInitLoading: false, appDidFetch: true }),
	[APP_INIT_REJECT]: (state, { payload }) => state.merge({ appInitLoading: false, appInitError: payload }),
	[APP_INIT_SET_MESSAGE]: (state, { payload }) => state.set('appInitMessage', payload),
	[APP_INIT_SET_PERCENT]: (state, { payload }) => state.set('appInitPercent', payload),
	[SET_DASHBOARD_LOADING]: (state, { payload }) => state.set('dashboardLoading', payload),
	[SET_LANGUAGE_LOADING]: (state, { payload }) => state.set('languageLoading', payload),
	[SET_DASHBOARD_ERROR]: (state, { payload }) => state.merge({ dashboardError: payload, dashboardLoading: false }),
};

export default handleActions(
	{
		[SET_UBEX_POPOVER]: (state, { payload }) => state.update('ubexPopover', filter => filter.merge(payload)),
		[SET_PAYMENT_MODAL]: (state, { payload }) => state.update('paymentModal', filter => filter.merge(payload)),
		...dashboardReducer,
		...listReducer(COUNTRY_COLLECTION_NAME),
		...listReducer(TIMEZONE_COLLECTION_NAME),
		...listReducer(CATEGORY_COLLECTION_NAME),
		...listReducer(CATEGORYV1_COLLECTION_NAME),
		...listReducer(LANGUAGE_COLLECTION_NAME),
	},
	initialState,
);
