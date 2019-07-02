/*
 *
 * TradingDesk constants
 *
 */

import { makeListActions, makeCollectionActions } from 'utils/CollectionHelper/constants';

export const DEFAULT_ACTION = 'app/TradingDesk/DEFAULT_ACTION';
export const UPLOAD_CREATIVE_REQUEST = 'app/TradingDesk/UPLOAD_CREATIVE_REQUEST';
export const UPLOAD_CREATIVE_STOP = 'app/TradingDesk/UPLOAD_CREATIVE_STOP';
export const UPLOAD_CREATIVE_ERROR = 'app/TradingDesk/UPLOAD_CREATIVE_ERROR';
export const UPLOAD_CREATIVE_SUCCESS = 'app/TradingDesk/UPLOAD_CREATIVE_SUCCESS';
export const COUNTERS_COLLECTION_NAME = 'counters';
export const FAQ_COLLECTION_NAME = 'faq';
export const CREATIVES_COLLECTION_NAME = 'creatives';
export const CAMPAINGS_COLLECTION_NAME = 'campaings';
export const CAMPAING_GROUPS_COLLECTION_NAME = 'campaingGroups';
export const DEVICETYPE_COLLECTION_NAME = 'device-type';
export const TYPEOS_COLLENCTION_NAME = 'os-type';
export const BROWSERTYPE_COLLENCTION_NAME = 'browser-type';
export const AGEGROUP_COLLENCTION_NAME = 'age-group';
export const GENDER_COLLENCTION_NAME = 'gender';
export const SSP_COLLENCTION_NAME = 'SSP';
export const STRATEGY_COLLENCTION_NAME = 'strategy';
export const PLACEMENTPOSITION_COLLENCTION_NAME = 'placement';
export const SET_CAMPAIGN_FILTER = 'campaignGroupFilters';
export const SET_ADBLOCK = 'adBlock';
export const SET_CREATIVE_FILTER = 'creativeFilters';
export const SET_FAQ_FILTER = 'FAQFilter';
export const PAY_LINK = 'payLink';
export const BUDGETDISTRIBUTION_COLLECTION_NAME = 'budget-distribution';
export const TRANSFER_MONEY = 'transfer-money';
export const BALANCE_COLLECTION_NAME = 'balance';

export const countersActions = makeListActions(COUNTERS_COLLECTION_NAME);
export const deviceTypeActions = makeListActions(DEVICETYPE_COLLECTION_NAME);
export const typeOSActions = makeListActions(TYPEOS_COLLENCTION_NAME);
export const browserTypeActions = makeListActions(BROWSERTYPE_COLLENCTION_NAME);
export const ageGroupActions = makeListActions(AGEGROUP_COLLENCTION_NAME);
export const genderActions = makeListActions(GENDER_COLLENCTION_NAME);
export const sspActions = makeListActions(SSP_COLLENCTION_NAME);
export const strategyActions = makeListActions(STRATEGY_COLLENCTION_NAME);
export const placementPoisionActions = makeListActions(PLACEMENTPOSITION_COLLENCTION_NAME);
export const creativesActions = makeListActions(CREATIVES_COLLECTION_NAME);
export const budgetDistributionActions = makeListActions(BUDGETDISTRIBUTION_COLLECTION_NAME);
export const balanceActions = makeListActions(BALANCE_COLLECTION_NAME);


export const campaingsActions = makeCollectionActions(CAMPAINGS_COLLECTION_NAME);