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
	SET_UBEX_POPOVER,
	SET_LANGUAGE_LOADING,
	SET_PAYMENT_MODAL,
} from './constants';
import { SET_ADBLOCK } from '../TradingDesk/constants';

export const getCategories = listActionCreator('api/category', CATEGORY_COLLECTION_NAME);
export const getCategoriesV1 = listActionCreator('api/categoryV1', CATEGORY_COLLECTION_NAME);
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

export function setLanguageLoading(value) {
	return {
		type: SET_LANGUAGE_LOADING,
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

export function setUbexPopover(filter) {
	return {
		type: SET_UBEX_POPOVER,
		payload: filter,
	};
}

export function setPaymentModal(filter) {
	return {
		type: SET_PAYMENT_MODAL,
		payload: filter,
	};
}

export const resetDashboardError = () => setDashboardError(null);
