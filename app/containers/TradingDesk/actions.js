/*
 *
 * TradingDesk actions
 *
 */

import { collectionActionCreator, listActionCreator, makeCRUDOnRoute } from 'utils/CollectionHelper/actions';
import {
	DEFAULT_ACTION,
	COUNTERS_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	CREATIVES_COLLECTION_NAME,
	BROWSERTYPE_COLLENCTION_NAME,
	DEVICETYPE_COLLECTION_NAME,
	TYPEOS_COLLENCTION_NAME,
	CAMPAING_GROUPS_COLLECTION_NAME,
	AGEGROUP_COLLENCTION_NAME,
	GENDER_COLLENCTION_NAME,
	STRATEGY_COLLENCTION_NAME,
	PLACEMENTPOSITION_COLLENCTION_NAME,
	SET_CAMPAIGN_FILTER,
	SET_ADBLOCK,
	SET_CREATIVE_FILTER,
	SET_FAQ_FILTER,
	PAY_LINK,
	BUDGETDISTRIBUTION_COLLECTION_NAME,
	TRANSFER_MONEY,
	BALANCE_COLLECTION_NAME,
} from './constants';

export function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

/**
 * Campaings
 */
export const campaingCollectionActions = makeCRUDOnRoute(`api/campaign`, CAMPAINGS_COLLECTION_NAME);
export const creativeCollectionActions = makeCRUDOnRoute(`api/creative`, CREATIVES_COLLECTION_NAME);
export const groupCollectionActions = makeCRUDOnRoute('api/campaign-group', CAMPAING_GROUPS_COLLECTION_NAME);

/**
 * Counters action creator
 */
export const countersCollectionActions = collectionActionCreator(COUNTERS_COLLECTION_NAME);

/**
 * Get list of counters from server
 */
export function getCounters() {
	return countersCollectionActions.getCollection('api/counter');
}

/**
 * Get data of one counter
 * @param {number} id
 */
export function getCounter(id) {
	return countersCollectionActions.getEntry('api/counter', id);
}

/**
 * Send data from form to server
 * @param {Object} values
 */
export function addCounter(values) {
	return countersCollectionActions.addEntry('api/counter', values);
}

/**
 * Send data from form to server
 * @param {number} id
 * @param {Object} values
 */
export function updateCounter(id, values) {
	return countersCollectionActions.updateEntry('api/counter', id, values);
}

/**
 * removeCounter
 * @param id
 * @return {*}
 */
export function removeCounter(id) {
	return countersCollectionActions.removeEntry('api/counter', id);
}

/**
 * setActiveCounter
 * @param id
 * @return {*}
 */
export function setActiveCounter(id) {
	return countersCollectionActions.setActiveEntry(id);
}

/**
 * unsetActiveCounter
 * @return {*}
 */
export function unsetActiveCounter() {
	return countersCollectionActions.unsetActiveEntry();
}

/**
 * Get data for FAQ
 */
export const getFAQ = listActionCreator('api/faq', FAQ_COLLECTION_NAME);

/**
 * Get data for campaign form
 */
export const getDeviceType = listActionCreator('api/device-type', DEVICETYPE_COLLECTION_NAME);
export const getBudgetDistribution = listActionCreator(
	'api/campaign-budget-allocation',
	BUDGETDISTRIBUTION_COLLECTION_NAME,
);
export const getTypeOS = listActionCreator('api/os', TYPEOS_COLLENCTION_NAME);
export const getBrowserType = listActionCreator('api/browser', BROWSERTYPE_COLLENCTION_NAME);
export const getAgeGroup = listActionCreator('api/age-group', AGEGROUP_COLLENCTION_NAME);
export const getGender = listActionCreator('api/gender', GENDER_COLLENCTION_NAME);
export const getSSP = listActionCreator('api/ssp', GENDER_COLLENCTION_NAME);
export const getStrategy = listActionCreator('api/campaign-strategy', STRATEGY_COLLENCTION_NAME);
export const getPlacementPosition = listActionCreator('api/placement-position', PLACEMENTPOSITION_COLLENCTION_NAME);
export const getCreatives = listActionCreator('api/creative', CREATIVES_COLLECTION_NAME);
export const getGroups = listActionCreator('api/campaign-group', CAMPAING_GROUPS_COLLECTION_NAME);
export const getPayLink = makeCRUDOnRoute('api/payment', PAY_LINK);
export const transferMoneyGroup = makeCRUDOnRoute('api/transfer-money', TRANSFER_MONEY);
export const getBalance = listActionCreator('api/balance', BALANCE_COLLECTION_NAME);

export function setFilterCampaigns(filter) {
	return {
		type: SET_CAMPAIGN_FILTER,
		payload: filter,
	};
}

export function setFilterCreatives(filter) {
	return {
		type: SET_CREATIVE_FILTER,
		payload: filter,
	};
}

export function setFilterFAQ(filter) {
	return {
		type: SET_FAQ_FILTER,
		payload: filter,
	};
}

export function setAdBlock(filter) {
	return {
		type: SET_ADBLOCK,
		payload: filter,
	};
}
