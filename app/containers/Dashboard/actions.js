/*
 *
 * DashboardInner actions
 *
 */
import { listActionCreator } from 'utils/CollectionHelper/actions';
import {
	DEFAULT_ACTION,
	APP_INIT,
	SET_DASHBOARD_LOADING,
	SET_DASHBOARD_ERROR,
	APP_INIT_SET_MESSAGE,
	APP_INIT_SET_PERCENT,
	CATEGORY_COLLECTION_NAME,
	COUNTRY_COLLECTION_NAME,
	TIMEZONE_COLLECTION_NAME,
	LANGUAGE_COLLECTION_NAME,
} from './constants';

export const getCategories = listActionCreator('api/category', CATEGORY_COLLECTION_NAME);
export const getCountries = listActionCreator('api/country', COUNTRY_COLLECTION_NAME);
export const getTimezones = listActionCreator('api/timezone', TIMEZONE_COLLECTION_NAME);
export const getLanguages = listActionCreator('api/language', LANGUAGE_COLLECTION_NAME);

export default function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

export function appInit() {
	return {
		type: APP_INIT,
	};
}

export function setAppInitMessage(value) {
	return {
		type: APP_INIT_SET_MESSAGE,
		payload: value,
	};
}

export function setAppInitPercent(value) {
	return {
		type: APP_INIT_SET_PERCENT,
		payload: value,
	};
}

export function setDashboardLoading(value) {
	return {
		type: SET_DASHBOARD_LOADING,
		payload: value,
	};
}
export const resetDashboardLoading = () => setDashboardLoading(false);

export function setDashboardError(value) {
	return {
		type: SET_DASHBOARD_ERROR,
		payload: value,
	};
}

export const resetDashboardError = () => setDashboardError(null);
