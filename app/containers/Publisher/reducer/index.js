/*
 *
 * Publisher reducer
 *
 */

import moment from 'moment';
import { fromJS } from 'immutable';
import { handleActions } from 'redux-actions';
import {
	collectionRehydrateState,
	collectionInitialState,
	collectionReducer,
	listRehydrateState,
	listInitialState,
	listReducer,
} from 'utils/CollectionHelper/reducers';
import {
	INVENTORY_COLLECTION_NAME,
	SLOTS_COLLECTION_NAME,
	BANNERS_COLLECTION_NAME,
	POSITIONS_COLLECTION_NAME,
	DSP_COLLECTION_NAME,
	AD_ATTRIBUTES_COLLECTION_NAME,
	USER_CATEGORIES_BLACKLIST_COLLECTION_NAME,
	FAQ_COLLECTION_NAME,
} from '../constants';

/*
Andrey Belov, [21.03.19 17:59]
api/user-category-blacklist  - общие для пользователя
inventory.category_blacklist - общие для сайта (при создании сюда подтягивай общие пользователя при создании)
slot.category_blacklist - подтягивай от инвентаря
 */

export const initialState = fromJS({
	dates: {
		startDate: moment()
			.startOf('day')
			.subtract('7', 'day')
			.format('YYYY-MM-DD'),
		endDate: moment()
			.startOf('day')
			.format('YYYY-MM-DD'),
		period: 'week',
	},
})
	.merge(collectionInitialState(SLOTS_COLLECTION_NAME))
	.merge(collectionInitialState(INVENTORY_COLLECTION_NAME))
	.merge(listInitialState(BANNERS_COLLECTION_NAME))
	.merge(listInitialState(POSITIONS_COLLECTION_NAME))
	.merge(listInitialState(AD_ATTRIBUTES_COLLECTION_NAME))
	.merge(listInitialState(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME))
	.merge(listInitialState(DSP_COLLECTION_NAME))
	.merge(listInitialState(FAQ_COLLECTION_NAME));

export const rehydrateState = {
	...collectionRehydrateState(SLOTS_COLLECTION_NAME),
	...collectionRehydrateState(INVENTORY_COLLECTION_NAME),
	...listRehydrateState(BANNERS_COLLECTION_NAME),
	...listRehydrateState(POSITIONS_COLLECTION_NAME),
	...listRehydrateState(AD_ATTRIBUTES_COLLECTION_NAME),
	...listRehydrateState(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME),
	...listRehydrateState(DSP_COLLECTION_NAME),
	...listRehydrateState(FAQ_COLLECTION_NAME),
};

export default handleActions(
	{
		...collectionReducer(SLOTS_COLLECTION_NAME),
		...collectionReducer(INVENTORY_COLLECTION_NAME),
		...listReducer(BANNERS_COLLECTION_NAME),
		...listReducer(POSITIONS_COLLECTION_NAME),
		...listReducer(AD_ATTRIBUTES_COLLECTION_NAME),
		...listReducer(USER_CATEGORIES_BLACKLIST_COLLECTION_NAME),
		...listReducer(DSP_COLLECTION_NAME),
		...listReducer(FAQ_COLLECTION_NAME),
	},
	initialState,
);
