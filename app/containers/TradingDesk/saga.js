import createToast from 'utils/toastHelper';
import { put, take, takeEvery, all } from 'redux-saga/effects';
import { getListRequestHandler, handleCollectionSaga, handleRequestListSaga } from 'utils/CollectionHelper/saga';
import { countriesActions, timezonesActions, categoriesActions } from 'containers/Dashboard/constants';
import { getCountries, getTimezones, getCategories } from 'containers/Dashboard/actions';
import { formatArrayToMap, formatCategoriesList, formatFaqList, formatTimezones, formatBalance } from 'containers/Dashboard/hooks';
import { uploadRequestWatcherSaga } from 'utils/UploadHelper/sagas';
import { ActionTypes } from 'utils/UploadHelper/actions';
import {
	COUNTERS_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
	deviceTypeActions,
	browserTypeActions,
	typeOSActions,
	CAMPAING_GROUPS_COLLECTION_NAME,
	ageGroupActions,
	genderActions,
	sspActions,
	strategyActions,
	countersActions,
	CREATIVES_COLLECTION_NAME,
	CAMPAINGS_COLLECTION_NAME,
	placementPoisionActions,
	creativesActions,
	campaingsActions,
	PAY_LINK,
	budgetDistributionActions,
	TRANSFER_MONEY,
	balanceActions,
} from './constants';
import {
	getDeviceType,
	getTypeOS,
	getBrowserType,
	getAgeGroup,
	getGender,
	getSSP,
	getStrategy,
	getCounters,
	getPlacementPosition,
	getCreatives,
	getBudgetDistribution,
	creativeCollectionActions,
	getBalance,
} from './actions';
export function* onAppInit() {
	yield all([
		getListRequestHandler(getCountries(), countriesActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getTimezones(), timezonesActions, {
			success: formatTimezones,
		}),
		getListRequestHandler(getCategories(), categoriesActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getDeviceType(), deviceTypeActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getBudgetDistribution(), budgetDistributionActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getTypeOS(), typeOSActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getBrowserType(), browserTypeActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getAgeGroup(), ageGroupActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getGender(), genderActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getSSP(), sspActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getStrategy(), strategyActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getCounters(), countersActions),
		getListRequestHandler(getCreatives(), creativesActions),
		getListRequestHandler(getPlacementPosition(), placementPoisionActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getBalance(), balanceActions, {
			success: formatBalance,
		}),
	]);
}

export default function* tradingDeskSaga() {
	yield handleCollectionSaga(PAY_LINK);
	yield handleCollectionSaga(TRANSFER_MONEY);
	yield handleCollectionSaga(CREATIVES_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAING_GROUPS_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAINGS_COLLECTION_NAME);
	yield handleCollectionSaga(COUNTERS_COLLECTION_NAME);
	yield handleRequestListSaga(FAQ_COLLECTION_NAME, {
		success: formatFaqList,
	});
	yield uploadRequestWatcherSaga({
		success: (response, formData, path) => {
			if (response && response.length) {
				return creativeCollectionActions.getEntry(response[0].creative_id);
			}
		},
	});
	yield take(campaingsActions.addEntry.onSuccessUploaded, () =>
		createToast('success', 'Campaign successfully added!'),
	);
	yield take(campaingsActions.updateEntry.onSuccessUploaded, () =>
		createToast('success', 'Campaign successfully updated!'),
	);
}
