import { createSelector } from 'reselect';
import makeCollectionSelectors, { makeListSelectors } from 'utils/CollectionHelper/selectors';
import { initialState } from './reducer';
import {
	STORE_NAME,
	BANNERS_COLLECTION_NAME,
	INVENTORY_COLLECTION_NAME,
	SLOTS_COLLECTION_NAME,
	AD_ATTRIBUTES_COLLECTION_NAME,
	POSITIONS_COLLECTION_NAME,
	USER_CATEGORIES_BLACKLIST_COLLECTION_NAME,
	DSP_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
} from './constants';

/**
 * Direct selector to the publisher state domain
 */
export const selectPublisherDomain = state => state.get(STORE_NAME, initialState);

/**
 * Default selector used by Publisher
 */
const makeSelectPublisher = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.toJS(),
	);

export const inventoriesSelectors = makeCollectionSelectors(selectPublisherDomain, INVENTORY_COLLECTION_NAME);
export const slotsSelectors = makeCollectionSelectors(selectPublisherDomain, SLOTS_COLLECTION_NAME);

export const faqSelectors = makeListSelectors(selectPublisherDomain, FAQ_COLLECTION_NAME);

export const selectUserCategoriesBlacklist = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME).toJS(),
	);

export const selectBanners = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(BANNERS_COLLECTION_NAME).toJS(),
	);

export const selectDSP = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(DSP_COLLECTION_NAME).toJS(),
	);

export const selectPositions = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(POSITIONS_COLLECTION_NAME).toJS(),
	);

export const selectAdvertAttributes = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(AD_ATTRIBUTES_COLLECTION_NAME).toJS(),
	);

export const selectUserCategoryBlacklist = () =>
	createSelector(
		selectPublisherDomain,
		substate => substate.get(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME).toJS(),
	);

export const selectChartsDates = () =>
	createSelector(
		selectPublisherDomain,
		state => state.get('dates').toJS(),
	);

const slotsToTableFormat = slots =>
	slots.map(s => ({
		...s,
		ubx: s.code,
		code: 'get code',
		status: s.status,
		floor_price_cpm: s.optimal_floor_price ? 'Optimal Price' : s.floor_price_cpm,
		summary: `${s.banner ? s.banner.width : 0}x${s.banner ? s.banner.height : 0}`,
	}));

export const selectActiveInventorySlots = () =>
	createSelector(
		[inventoriesSelectors.activeEntryId(), slotsSelectors.collectionList()],
		(inventory, slots) => slots.filter(s => s.inventory === inventory),
	);

export const selectActiveInventorySlotsTableFormat = () =>
	createSelector(
		selectActiveInventorySlots(),
		slotsToTableFormat,
	);

export const selectSlotsTableFormat = () =>
	createSelector(
		slotsSelectors.collectionList(),
		slotsToTableFormat,
	);

export const selectInventoriesByType = () => {};

export const selectInventroiesWeb = () => {};
export const selectInventroiesSdk = () => {};

export default makeSelectPublisher;
