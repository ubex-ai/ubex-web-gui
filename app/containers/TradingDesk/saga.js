import createToast from 'utils/toastHelper';
import { take, takeEvery, all } from 'redux-saga/effects';
import {
	getListRequestHandler,
	handleCollectionSaga,
	handleRequestListSaga,
	handleRequestListByDateSaga,
} from 'utils/CollectionHelper/saga';
import { handleRequestListStatsByParamsSaga } from 'utils/StatsHelper/saga';
import { APP_INIT_SUCCESS, countriesActions, timezonesActions, categoriesActions } from 'containers/Dashboard/constants';
import { getCountries, getTimezones, getCategories } from 'containers/Dashboard/actions';
import {
	formatArrayToMap,
	formatCategoriesList,
	formatFaqList,
	formatTimezones,
	formatBalance,
	formatAdSize,
	formatHomePageStats,
	formatTableHomePageStats,
	formatCampaignReport,
	formatTableCampaignReport,
	formatCounterStats,
	formatCounterStatsTable,
	formatForTopRegions,
} from 'containers/Dashboard/hooks';
import { uploadRequestWatcherSaga } from 'utils/UploadHelper/sagas';

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
	BALANCE_COLLECTION_NAME,
	balanceActions,
	PAYMENTHISTORY_COLLECTION_NAME,
	BANNERS_COLLECTION_NAME,
	adSizeActions,
	languageActions,
	CONTACT_FORM,
	VISITORS_COLLECTION_NAME,
	CAMPAIGNREPORT_COLLECTION_NAME,
	HOMEPAGESTATS_COLLECTION_NAME,
	TABLE_HOMEPAGESTATS_COLLECTION_NAME,
	CAMPAIGNREPORT_TABLE_COLLECTION_NAME,
	groupsActions,
	CREATIVEREPORT_COLLECTION_NAME,
	CREATIVEREPORT_TABLE_COLLECTION_NAME,
	COUNTER_VISITORS_COLLECTION_NAME,
	COUNTER_VISITORS_TABLE_COLLECTION_NAME,
	COUNTER_REGIONS_COLLECTION_NAME,
	COUNTER_REGIONS_TABLE_COLLECTION_NAME,
	COUNTER_DEVICES_COLLECTION_NAME,
	COUNTER_DEVICES_TABLE_COLLECTION_NAME,
	COUNTER_CHANNEL_COLLECTION_NAME,
	COUNTER_CHANNEL_TABLE_COLLECTION_NAME,
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
	getAdSize,
	getLanguages,
	getCampaigns,
	getGroups,
} from './actions';
export function* onAppInit() {
	yield all([
		getListRequestHandler(getCountries(), countriesActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getTimezones(), timezonesActions, {
			success: formatTimezones,
		}),
		getListRequestHandler(getGroups(), groupsActions),
	]);
}

// Load after APP INIT
function* bgLoads() {
	yield all([
		getListRequestHandler(getCampaigns(), campaingsActions),
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
		getListRequestHandler(getAdSize(), adSizeActions, {
			success: formatAdSize,
		}),
		getListRequestHandler(getBalance(), balanceActions, {
			success: formatBalance,
		}),
		getListRequestHandler(getLanguages(), languageActions, {
			success: formatCategoriesList,
		}),
	]);
}

export default function* tradingDeskSaga() {
	yield takeEvery(APP_INIT_SUCCESS, bgLoads);

	yield handleCollectionSaga(PAY_LINK);
	yield handleRequestListSaga(BALANCE_COLLECTION_NAME, {
		success: formatBalance,
	});
	yield handleCollectionSaga(TRANSFER_MONEY);
	yield handleCollectionSaga(CONTACT_FORM);
	yield handleCollectionSaga(CREATIVES_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAING_GROUPS_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAINGS_COLLECTION_NAME);
	yield handleCollectionSaga(COUNTERS_COLLECTION_NAME);
	yield handleCollectionSaga(BANNERS_COLLECTION_NAME);
	yield handleRequestListSaga(FAQ_COLLECTION_NAME, {
		success: formatFaqList,
	});
	yield handleRequestListByDateSaga(PAYMENTHISTORY_COLLECTION_NAME);
	yield handleRequestListStatsByParamsSaga(VISITORS_COLLECTION_NAME);
	yield handleRequestListStatsByParamsSaga(CAMPAIGNREPORT_COLLECTION_NAME, {
		success: formatCampaignReport,
	});
	yield handleRequestListStatsByParamsSaga(HOMEPAGESTATS_COLLECTION_NAME, {
		success: formatHomePageStats,
	});
	yield handleRequestListStatsByParamsSaga(TABLE_HOMEPAGESTATS_COLLECTION_NAME, {
		success: formatTableHomePageStats,
	});
	yield handleRequestListStatsByParamsSaga(CAMPAIGNREPORT_TABLE_COLLECTION_NAME, {
		success: formatTableCampaignReport,
	});
	yield handleRequestListStatsByParamsSaga(CREATIVEREPORT_COLLECTION_NAME, {
		success: formatCampaignReport,
	});
	yield handleRequestListStatsByParamsSaga(CREATIVEREPORT_TABLE_COLLECTION_NAME, {
		success: formatTableCampaignReport,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_VISITORS_COLLECTION_NAME, {
		success: formatCounterStats,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_VISITORS_TABLE_COLLECTION_NAME, {
		success: formatCounterStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_REGIONS_COLLECTION_NAME, {
		success: formatForTopRegions,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_REGIONS_TABLE_COLLECTION_NAME, {
		success: formatCounterStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_DEVICES_COLLECTION_NAME, {
		success: formatCounterStats,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_DEVICES_TABLE_COLLECTION_NAME, {
		success: formatCounterStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_CHANNEL_COLLECTION_NAME, {
		success: formatCounterStats,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_CHANNEL_TABLE_COLLECTION_NAME, {
		success: formatCounterStatsTable,
	});
	yield uploadRequestWatcherSaga({
		success: response => {
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
