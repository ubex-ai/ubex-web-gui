import { takeLatest, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getListRequestHandler, handleRequestListSaga } from 'utils/CollectionHelper/saga';
import { fetchData as fetchUser } from 'containers/UserPage/saga';
import { onAppInit as PublisherOnInit } from 'containers/Publisher/saga';
import { onAppInit as DataMinerOnInit } from 'containers/DataMiner/saga';
import { formatCountriesList, formatTimezonesList, formatCategoriesList } from './hooks';
import {
	categoriesActions,
	APP_INIT,
	APP_INIT_SUCCESS,
	APP_INIT_REJECT,
	SET_DASHBOARD_LOADING,
	SET_DASHBOARD_ERROR,
	CATEGORY_COLLECTION_NAME,
	COUNTRY_COLLECTION_NAME,
	LANGUAGE_COLLECTION_NAME,
	TIMEZONE_COLLECTION_NAME,
} from './constants';
import { getCategories } from './actions';


function* appInit() {
	const { timeout } = yield race({
		data: fetchAppInitData(),
		timeout: delay(32000),
	});
	if (timeout) {
		const error = new Error('Timeout error');
		yield put({ type: APP_INIT_REJECT, payload: error });
		yield put({ type: SET_DASHBOARD_LOADING, payload: false });
	}
}

function* fetchAppInitData() {
	try {
		yield getListRequestHandler(getCategories(), categoriesActions);
		yield fetchUser();
		if ((document.location.origin === MINING_URL && NODE_ENV === 'production') || NODE_ENV !== 'production') {
			yield DataMinerOnInit();
		}
		if (document.location.origin === PUBLISHER_URL && NODE_ENV === 'production') {
			yield PublisherOnInit();
		}
		yield put({ type: APP_INIT_SUCCESS });
	} catch (error) {
		yield put({ type: APP_INIT_REJECT, payload: error });
		yield put({ type: SET_DASHBOARD_LOADING, payload: false });
	}
}

function processError({ payload }) {
	if (NODE_ENV !== 'production') {
		console.error(payload);
	}
}
export default function* dashboardSaga() {
	yield takeLatest(APP_INIT, appInit);
	yield handleRequestListSaga(CATEGORY_COLLECTION_NAME, {
		success: formatCategoriesList,
	});
	yield handleRequestListSaga(COUNTRY_COLLECTION_NAME, {
		success: formatCountriesList,
	});
	yield handleRequestListSaga(TIMEZONE_COLLECTION_NAME, {
		success: formatTimezonesList,
	});
	yield handleRequestListSaga(LANGUAGE_COLLECTION_NAME);

	yield takeLatest(SET_DASHBOARD_ERROR, processError);
}
