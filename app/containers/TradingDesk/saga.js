import createToast from 'utils/toastHelper';
import { take, takeEvery, all, put, call, takeLatest } from 'redux-saga/effects';
import {
	getListRequestHandler,
	handleCollectionSaga,
	handleRequestListSaga,
	handleRequestListByDateSaga,
	handleRequestListByParamsSaga,
} from 'utils/CollectionHelper/saga';
import { handleRequestListStatsByParamsSaga } from 'utils/StatsHelper/saga';
import {
	APP_INIT_SUCCESS,
	countriesActions,
	timezonesActions,
	categoriesActions,
} from 'containers/Dashboard/constants';
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
	formatPaymentVariants,
	formatGroupStats,
	formatCardsCampaignReport,
	formatCountriesList,
	formatRegionsStatsTable,
	formatCounterDeviceStatsTable,
	formatCounterChannelStatsTable,
	formatCounterDeviceStats,
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
	REGIONS_COLLECTION_NAME,
	CITIES_COLLECTION_NAME,
	PAYMENT_VARIANTS,
	GROUPSHARING_COLLECTION_NAME,
	CREATIVESHARING_COLLECTION_NAME,
	ONLINE_COUNTERS_COLLECTION_NAME,
	COUNTERSHARING_COLLECTION_NAME,
	PUBLISHERS_CONFIG_COLLECTION_NAME,
	GROUPSTATS_COLLECTION_NAME,
	CAMPAIGNREPORT_CARDS_COLLECTION_NAME,
	FILTERS_COLLECTION_NAME,
	FILTERSHARING_COLLECTION_NAME,
	GET_ONLINE_COUNTERS_REQUEST,
	GET_ONLINE_COUNTERS_ERROR,
	GET_ONLINE_COUNTERS_SUCCESS,
	filterActions,
	CAMPAING_FORM_LOADING_START, ADSIZE_COLLECTION_NAME,
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
	getFilters,
} from './actions';
import request from '../../utils/request';
import getCookie from '../../utils/getCookie';
export function* onAppInit() {
	yield all([
		/* getListRequestHandler(getCountries(), countriesActions, {
			success: formatCountriesList,
		}), */
		getListRequestHandler(getTimezones(), timezonesActions, {
			success: formatTimezones,
		}),
		getListRequestHandler(getGroups(), groupsActions),
		getListRequestHandler(getFilters(), filterActions),
		getListRequestHandler(getBudgetDistribution(), budgetDistributionActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getBalance(), balanceActions, {
			success: formatBalance,
		}),
	]);
}

// Load after APP INIT
function* bgLoads() {
	yield all([
		getListRequestHandler(getCampaigns(), campaingsActions),
		getListRequestHandler(getDeviceType(), deviceTypeActions, {
			success: formatCategoriesList,
		}),
		getListRequestHandler(getCategories(), categoriesActions, {
			success: formatCategoriesList,
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

export function* getOnlineCounters({ payload }) {
	// eslint-disable-next-line no-undef
	const requestURL = `${API_URL}/api/online/${payload}`;
	const requestHeaders = {
		'Content-Type': 'application/json',
		'X-CSRFToken': getCookie('csrftoken'),
	};
	if (NODE_ENV !== 'production' && NODE_ENV !== 'stage') {
		requestHeaders['Test-User'] = 'test@test.test';
	}
	try {
		const response = yield call(request, requestURL, {
			method: 'GET',
			mode: 'no-cors',
			headers: requestHeaders,
		});
		yield put({ type: GET_ONLINE_COUNTERS_SUCCESS, payload: response.data, id: payload });
	} catch (error) {
		yield put({ type: GET_ONLINE_COUNTERS_ERROR, payload: error });
	}
}

export default function* tradingDeskSaga() {
	yield takeEvery(CAMPAING_FORM_LOADING_START, bgLoads);
	yield takeEvery(GET_ONLINE_COUNTERS_REQUEST, getOnlineCounters);
	yield handleCollectionSaga(PAY_LINK);
	yield handleCollectionSaga(PAYMENT_VARIANTS);
	yield handleRequestListSaga(BALANCE_COLLECTION_NAME, {
		success: formatBalance,
	});
	yield handleRequestListSaga(ADSIZE_COLLECTION_NAME);
	yield handleCollectionSaga(TRANSFER_MONEY);
	yield handleCollectionSaga(CONTACT_FORM);
	yield handleCollectionSaga(CREATIVES_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAING_GROUPS_COLLECTION_NAME);
	yield handleCollectionSaga(GROUPSHARING_COLLECTION_NAME);
	yield handleCollectionSaga(CREATIVESHARING_COLLECTION_NAME);
	yield handleCollectionSaga(COUNTERSHARING_COLLECTION_NAME);
	yield handleCollectionSaga(FILTERSHARING_COLLECTION_NAME);
	yield handleRequestListByParamsSaga(REGIONS_COLLECTION_NAME);
	yield handleRequestListByParamsSaga(CITIES_COLLECTION_NAME);
	yield handleCollectionSaga(CAMPAINGS_COLLECTION_NAME);
	yield handleCollectionSaga(FILTERS_COLLECTION_NAME);
	yield handleCollectionSaga(COUNTERS_COLLECTION_NAME);
	yield handleCollectionSaga(BANNERS_COLLECTION_NAME);
	yield handleRequestListSaga(ONLINE_COUNTERS_COLLECTION_NAME);
	yield handleRequestListSaga(PUBLISHERS_CONFIG_COLLECTION_NAME);
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
	yield handleRequestListStatsByParamsSaga(CAMPAIGNREPORT_CARDS_COLLECTION_NAME, {
		success: formatCardsCampaignReport,
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
		success: formatRegionsStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_DEVICES_COLLECTION_NAME, {
		success: formatCounterDeviceStats,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_DEVICES_TABLE_COLLECTION_NAME, {
		success: formatCounterDeviceStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_CHANNEL_COLLECTION_NAME, {
		success: formatCounterDeviceStats,
	});
	yield handleRequestListStatsByParamsSaga(COUNTER_CHANNEL_TABLE_COLLECTION_NAME, {
		success: formatCounterChannelStatsTable,
	});
	yield handleRequestListStatsByParamsSaga(GROUPSTATS_COLLECTION_NAME, {
		success: formatGroupStats,
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
