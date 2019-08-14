import { takeLatest, put } from 'redux-saga/effects';
import {
	getListRequestHandler,
	handleCollectionSaga,
	handleRequestListSaga,
	restApiRequestHandler,
} from 'utils/CollectionHelper/saga';
import { getLanguages, getCategories, getCountries } from 'containers/Dashboard/actions';
import {
	languagesActions,
	categoriesActions,
	countriesActions,
} from 'containers/Dashboard/constants';
import {
	formatCategoriesList,
	formatFaqList,
	formatPublisherHomePageStats,
	formatTablePublisherHomePageStats,
} from 'containers/Dashboard/hooks';
import {
	getAdAttributes,
	getBanners,
	getPositions,
	getDSP,
	slotCollectionActions,
	inventoryCollectionActions,
	getUserCategoriesBlacklist,
} from './actions';
import {
	addAttributesActions,
	slotsActions,
	bannersActions,
	positionsActions,
	dspActions,
	inventoriesActions,
	userCategoriesBlacklistActions,
	TOGGLE_SLOT_STATUS,
	TOGGLE_SLOT_STATUS_ERROR,
	TOGGLE_SLOT_STATUS_SUCCESS,
	DSP_COLLECTION_NAME,
	SLOTS_COLLECTION_NAME,
	INVENTORY_COLLECTION_NAME,
	POSITIONS_COLLECTION_NAME,
	BANNERS_COLLECTION_NAME,
	AD_ATTRIBUTES_COLLECTION_NAME,
	USER_CATEGORIES_BLACKLIST_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	CONTACT_FORM,
	HOMEPAGESTATS_COLLECTION_NAME,
	TABLE_HOMEPAGESTATS_COLLECTION_NAME,
} from './constants';
import { handleRequestListStatsByParamsSaga } from '../../utils/StatsHelper/saga';

export function* onAppInit() {
	yield getListRequestHandler(getCountries(), countriesActions, {
		success: formatCategoriesList,
	}),
	yield getListRequestHandler(getLanguages(), languagesActions);
	yield getListRequestHandler(getBanners(), bannersActions);
	yield getListRequestHandler(getDSP(), dspActions);
	yield getListRequestHandler(getCategories(), categoriesActions, {
		success: formatCategoriesList,
	});
	yield getListRequestHandler(getPositions(), positionsActions);
	yield getListRequestHandler(getAdAttributes(), addAttributesActions);
	yield getListRequestHandler(getUserCategoriesBlacklist(), userCategoriesBlacklistActions);
	yield getListRequestHandler(slotCollectionActions.getCollection(), slotsActions.getCollection);
	yield getListRequestHandler(inventoryCollectionActions.getCollection(), inventoriesActions.getCollection);
}
export default function* publisherSaga() {
	yield handleCollectionSaga(SLOTS_COLLECTION_NAME);
	yield handleCollectionSaga(INVENTORY_COLLECTION_NAME);
	yield handleCollectionSaga(CONTACT_FORM);
	yield handleRequestListSaga(BANNERS_COLLECTION_NAME);
	yield handleRequestListSaga(AD_ATTRIBUTES_COLLECTION_NAME);
	yield handleRequestListSaga(POSITIONS_COLLECTION_NAME);
	yield handleRequestListSaga(DSP_COLLECTION_NAME);
	yield handleRequestListSaga(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME);
	yield handleRequestListStatsByParamsSaga(HOMEPAGESTATS_COLLECTION_NAME, {
		success: formatPublisherHomePageStats,
	});
	yield handleRequestListStatsByParamsSaga(TABLE_HOMEPAGESTATS_COLLECTION_NAME, {
		success: formatTablePublisherHomePageStats,
	});

	yield handleRequestListSaga(FAQ_COLLECTION_NAME, {
		success: formatFaqList,
	});

	yield takeLatest(TOGGLE_SLOT_STATUS, ({ payload, meta: { url } }) =>
		restApiRequestHandler({
			url,
			method: 'PUT',
			onSuccess: data =>
				put({
					type: TOGGLE_SLOT_STATUS_SUCCESS,
					payload: data,
					meta: { id: payload },
				}),
			onError: e =>
				put({
					type: TOGGLE_SLOT_STATUS_ERROR,
					payload: e,
					meta: { id: payload },
				}),
		}),
	);
}
