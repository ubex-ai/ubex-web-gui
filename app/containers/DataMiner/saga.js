import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import request from 'utils/request';
import { getListRequestHandler, handleCollectionSaga, handleRequestListSaga } from 'utils/CollectionHelper/saga';
import makeCollectionActions from 'utils/CollectionHelper/constants';
import {
	getCountries,
	getTimezones,
	getCategories,
	setDashboardLoading,
	setDashboardError,
	setAppInitPercent,
	setAppInitMessage,
} from 'containers/Dashboard/actions';
import { countriesActions, timezonesActions, categoriesActions } from 'containers/Dashboard/constants';
import {
	formatCountriesList,
	formatArrayToMap,
	formatCategoriesList,
	formatFaqList,
} from 'containers/Dashboard/hooks';
import { selectCountersIds } from './selectors';
import {
	COUNTERS_COLLECTION_NAME,
	GET_METRICS_REQUEST,
	GET_METRICS_ERROR,
	GET_METRICS_SUCCESS,
	UPDATE_CHARTS_DATA_ERROR,
	UPDATE_CHARTS_DATA_REQUEST,
	UPDATE_CHARTS_DATA_SUCCESS,
	GET_ONLINE_COUNTERS_REQUEST,
	GET_ONLINE_COUNTERS_ERROR,
	GET_ONLINE_COUNTERS_SUCCESS,
	FAQ_COLLECTION_NAME,
} from './constants';
import {
	getTopChannel,
	getTopCounters,
	getTopDevices,
	getTopRegions,
	getDevicesMetrics,
	getChannelMetrics,
	getOnlineCounter,
} from './actions';

const apiUrl = API_URL;

const { getCollection } = makeCollectionActions('counters');

export function* getMetrics(action) {
	if (!action || !action.payload) {
		throw Error('getMetrics: Invalid payload format!', action);
	}
	const countersIds = yield select(selectCountersIds());
	let requestURL;
	if (
		action.meta.propName === 'topDevices' ||
		action.meta.propName === 'topChannel' ||
		action.meta.propName === 'topRegions'
	) {
		requestURL = `${STATISTIC_URL}/table`;
	} else {
		requestURL = `${STATISTIC_URL}/bydate`;
	}
	yield put(setDashboardLoading(true));
	try {
		const response = yield call(request, requestURL, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Server-Token 76ddc1c68e1e36bcc8a29bdc286d228d8833b3be',
			},
			params: {
				...action.payload,
				ids: countersIds.slice(0, 19).join(),
				metrics:
					typeof action.payload.metrics === 'object' && typeof action.payload.metrics.join === 'function'
						? action.payload.metrics.join()
						: action.payload.metrics,
			},
		});
		yield put({ type: GET_METRICS_SUCCESS, payload: response.data, meta: action.meta });
		yield put(setDashboardLoading(false));
	} catch (error) {
		yield put({ type: GET_METRICS_ERROR, payload: error });
		yield put(setDashboardError(error));
	}
}

export function* getOnlineCounters() {
	// eslint-disable-next-line no-undef
	const requestURL = `${apiUrl}/api/online/`;
	yield put(setDashboardLoading(true));
	try {
		const response = yield call(request, requestURL, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		yield put({ type: GET_ONLINE_COUNTERS_SUCCESS, payload: response.data });
		yield put(setDashboardLoading(false));
	} catch (error) {
		yield put({ type: GET_ONLINE_COUNTERS_ERROR, payload: error });
		yield put(setDashboardError(error));
	}
}

export function* onAppInit() {
	yield all([
		getListRequestHandler(getCountries(), countriesActions, {
			success: formatCountriesList,
		}),
		getListRequestHandler(getTimezones(), timezonesActions, {
			success: formatArrayToMap,
		}),
		getListRequestHandler(getCategories(), categoriesActions, {
			success: formatCategoriesList,
		}),
	]);
	yield put(setAppInitMessage('Loading: counters data'));
	yield getListRequestHandler(
		{ meta: { url: 'api/status' } },
		{
			success: getCollection.success,
			error: getCollection.error,
		},
	);
	yield put(setAppInitPercent(30));
	yield put(setAppInitMessage('Loading metrics'));
	yield getMetrics(getTopCounters());
	yield put(setAppInitMessage('Loading data by regions'));
	yield put(setAppInitPercent(40));
	yield getMetrics(getTopRegions());
	yield put(setAppInitMessage('Loading data by devices'));
	yield put(setAppInitPercent(50));
	yield getMetrics(getTopDevices());
	yield put(setAppInitPercent(60));
	yield getMetrics(getDevicesMetrics());
	yield put(setAppInitMessage('Loading data by channels'));
	yield put(setAppInitPercent(70));
	yield getMetrics(getTopChannel());
	yield put(setAppInitPercent(80));
	yield getMetrics(getChannelMetrics());
	yield put(setAppInitMessage('Loading counters data'));
	yield put(setAppInitPercent(90));
	yield getOnlineCounters(getOnlineCounter());
	yield put(setAppInitMessage('Loading complete'));
	yield put(setAppInitPercent(100));
}

export function* updateChartsData(action) {
	yield put(setDashboardLoading(true));
	try {
		yield all([
			getMetrics(getTopCounters(action.payload)),
			getMetrics(getTopRegions(action.payload)),
			getMetrics(getTopDevices(action.payload)),
			getMetrics(getTopChannel(action.payload)),
			getMetrics(getDevicesMetrics(action.payload)),
			getMetrics(getChannelMetrics(action.payload)),
		]);
		yield put({ type: UPDATE_CHARTS_DATA_SUCCESS });
		yield put(setDashboardLoading(false));
	} catch (error) {
		yield put({ type: UPDATE_CHARTS_DATA_ERROR, payload: error });
		yield put(setDashboardError(error));
	}
}

// Individual exports for testing
export default function* dataMinerSaga() {
	yield handleCollectionSaga(COUNTERS_COLLECTION_NAME);
	yield handleRequestListSaga(FAQ_COLLECTION_NAME, {
		success: formatFaqList,
	});
	yield takeLatest(GET_METRICS_REQUEST, getMetrics);
	yield takeLatest(UPDATE_CHARTS_DATA_REQUEST, updateChartsData);
	yield takeLatest(GET_ONLINE_COUNTERS_REQUEST, getOnlineCounters);
}
