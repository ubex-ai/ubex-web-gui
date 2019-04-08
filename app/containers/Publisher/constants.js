/*
 *
 * Publisher constants
 *
 */
import makeCollectionActions, { makeListActions } from 'utils/CollectionHelper/constants';
export const DEFAULT_ACTION = 'app/Publisher/DEFAULT_ACTION';
export const TOGGLE_SLOT_STATUS = 'app/Publisher/TOGGLE_SLOT_STATUS';
export const TOGGLE_SLOT_STATUS_ERROR = 'app/Publisher/TOGGLE_SLOT_STATUS_ERROR';
export const TOGGLE_SLOT_STATUS_SUCCESS = 'app/Publisher/TOGGLE_SLOT_STATUS_SUCCESS';

export const INVENTORY_COLLECTION_NAME = 'inventories';
export const SLOTS_COLLECTION_NAME = 'slots';

export const BANNERS_COLLECTION_NAME = 'banners';
export const AD_ATTRIBUTES_COLLECTION_NAME = 'adAttributes';
export const USER_CATEGORIES_BLACKLIST_COLLECTION_NAME = 'userCategoryBlacklist';
export const POSITIONS_COLLECTION_NAME = 'positions';
export const DSP_COLLECTION_NAME = 'dsp';
export const FAQ_COLLECTION_NAME = 'faq';
export const SLOT_STATUS_ACTIVE = 'activate';
export const SLOT_STATUS_PAUSE = 'pause';

// Collections
export const inventoriesActions = makeCollectionActions(INVENTORY_COLLECTION_NAME);
export const slotsActions = makeCollectionActions(SLOTS_COLLECTION_NAME);

// Lists
export const addAttributesActions = makeListActions(AD_ATTRIBUTES_COLLECTION_NAME);
export const userCategoriesBlacklistActions = makeListActions(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME);
export const bannersActions = makeListActions(BANNERS_COLLECTION_NAME);
export const positionsActions = makeListActions(POSITIONS_COLLECTION_NAME);
export const dspActions = makeListActions(DSP_COLLECTION_NAME);

export const INVENTORY_TYPES = {
	android: 'android',
	ios: 'ios',
	web: 'web',
};

export const INVENTORY_STATUSES = {
	active: 'active',
	disabled: 'disabled',
	moderation: 'moderation',
	declined: 'declined',
};
