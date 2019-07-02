import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashboard state domain
 */

const selectDashboardDomain = state => state.get('dashboard', initialState);

/**
 * Other specific selectors
 */

export const makeSelectDashboard = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.toJS(),
	);
export const selectAppDidFetch = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('appDidFetch'),
	);

export const selectAppInitLoading = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('appInitLoading'),
	);

export const selectTimezones = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('timezones').toJS(),
	);
export const selectCountries = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('countries').toJS(),
	);

export const selectLanguages = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('languages').toJS(),
	);
export const selectCategories = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('categories').toJS(),
	);
export const selectDashboardLoading = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('dashboardLoading'),
	);

export const selectDashboardError = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('dashboardError'),
	);

export const selectAppInitMessage = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('appInitMessage'),
	);

export const selectAppInitPercent = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('appInitPercent'),
	);

export const selectAppInitError = () =>
	createSelector(
		selectDashboardDomain,
		substate => substate.get('appInitError'),
	);

export const selectUbexPopover = () =>
	createSelector(
		selectDashboardDomain,
		state => state.get('ubexPopover').toJS(),
	);

export default makeSelectDashboard;
