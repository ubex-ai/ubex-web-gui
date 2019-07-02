/*
 *
 * Dashboard constants
 *
 */
import { makeListActions } from 'utils/CollectionHelper/constants';

export const DEFAULT_ACTION = 'app/Dashboard/DEFAULT_ACTION';

export const APP_INIT = 'app/Dashboard/APP_INIT';
export const APP_INIT_SET_MESSAGE = 'app/Dashboard/APP_INIT_SET_MESSAGE';
export const APP_INIT_SET_PERCENT = 'app/Dashboard/APP_INIT_SET_PERCENT';
export const APP_INIT_SUCCESS = 'app/Dashboard/APP_INIT_SUCCESS';
export const APP_INIT_REJECT = 'app/Dashboard/APP_INIT_REJECT';

export const SET_DASHBOARD_ERROR = 'app/Dashboard/SET_DASHBOARD_ERROR';
export const SET_DASHBOARD_LOADING = 'app/Dashboard/SET_DASHBOARD_LOADING';

export const COUNTRY_COLLECTION_NAME = 'countries';
export const TIMEZONE_COLLECTION_NAME = 'timezones';
export const CATEGORY_COLLECTION_NAME = 'categories';
export const LANGUAGE_COLLECTION_NAME = 'languages';
export const SET_UBEX_POPOVER = 'ubexPopover';

export const countriesActions = makeListActions(COUNTRY_COLLECTION_NAME);
export const timezonesActions = makeListActions(TIMEZONE_COLLECTION_NAME);
export const categoriesActions = makeListActions(CATEGORY_COLLECTION_NAME);
export const languagesActions = makeListActions(LANGUAGE_COLLECTION_NAME);
