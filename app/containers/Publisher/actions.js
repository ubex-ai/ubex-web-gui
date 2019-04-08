/*
 *
 * Publisher actions
 *
 */
import { makeCRUDOnRoute, listActionCreator } from 'utils/CollectionHelper/actions';
import {
	SLOTS_COLLECTION_NAME,
	INVENTORY_COLLECTION_NAME,
	BANNERS_COLLECTION_NAME,
	AD_ATTRIBUTES_COLLECTION_NAME,
	POSITIONS_COLLECTION_NAME,
	USER_CATEGORIES_BLACKLIST_COLLECTION_NAME,
	DSP_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	SLOT_STATUS_ACTIVE,
	TOGGLE_SLOT_STATUS,
	SLOT_STATUS_PAUSE,
} from './constants';

const ApiUrl = API_URL;

export const slotCollectionActions = makeCRUDOnRoute('api/slot', SLOTS_COLLECTION_NAME);

export const inventoryCollectionActions = makeCRUDOnRoute('api/inventory', INVENTORY_COLLECTION_NAME);

export const getBanners = listActionCreator('api/banner', BANNERS_COLLECTION_NAME);
export const getPositions = listActionCreator('api/position', POSITIONS_COLLECTION_NAME);
export const getDSP = listActionCreator('api/dsp', DSP_COLLECTION_NAME);
export const getFAQ = listActionCreator('api/faq', FAQ_COLLECTION_NAME);
export const getAdAttributes = listActionCreator('api/attributes', AD_ATTRIBUTES_COLLECTION_NAME);
export const getUserCategoriesBlacklist = listActionCreator(
	'api/user-category-blacklist',
	USER_CATEGORIES_BLACKLIST_COLLECTION_NAME,
);

export const toggleSlotStatus = (id, status) => ({
	type: TOGGLE_SLOT_STATUS,
	payload: id,
	meta: {
		url: `${ApiUrl}/api/slot/${id}/${status === SLOT_STATUS_ACTIVE ? SLOT_STATUS_PAUSE : SLOT_STATUS_ACTIVE}/`,
	},
});
export const updateCharts = () => {};
