import { takeLatest, put, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getListRequestHandler, handleRequestListSaga } from 'utils/CollectionHelper/saga';
import userPageSaga, { fetchData as fetchUser } from 'containers/UserPage/saga';

import { formatCountriesList, formatArrayToMap, formatCategoriesList } from './hooks';
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
import activeContainerRig from '../ContainerManager';

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
		yield activeContainerRig.initSaga();
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
		success: formatArrayToMap,
	});
	yield handleRequestListSaga(LANGUAGE_COLLECTION_NAME);
	yield takeLatest(SET_DASHBOARD_ERROR, processError);
	yield userPageSaga();
}
