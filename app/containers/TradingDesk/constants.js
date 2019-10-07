/*
 *
 * TradingDesk constants
 *
 */

import { makeListActions } from 'utils/CollectionHelper/constants';

export const STORE_NAME = 'TradingDesk';
export const DEFAULT_ACTION = 'app/TradingDesk/DEFAULT_ACTION';

/** Collections * */
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
export const BUDGETDISTRIBUTION_COLLECTION_NAME = 'budget-distribution';
export const TRANSFER_MONEY = 'transfer-money';
export const BALANCE_COLLECTION_NAME = 'balance';
export const PAYMENTHISTORY_COLLECTION_NAME = 'payment-history';
export const SET_CHARTS_DATES = 'app/TradingDesk/SET_CHARTS_DATES';
export const BANNERS_COLLECTION_NAME = 'banners';
export const ADSIZE_COLLECTION_NAME = 'adsize';
export const LANGUAGE_COLLECTION_NAME = 'languages';
export const SET_PAGINATION_ITEMS_COUNT = 'pagination-items-count';
export const VISITORS_COLLECTION_NAME = 'visitors';
export const CAMPAIGNREPORT_COLLECTION_NAME = 'campaign-report';
export const CAMPAIGNREPORT_TABLE_COLLECTION_NAME = 'campaign-report-table';
export const HOMEPAGESTATS_COLLECTION_NAME = 'homepage-stats';
export const TABLE_HOMEPAGESTATS_COLLECTION_NAME = 'table-homepage-stats';
export const CREATIVEREPORT_COLLECTION_NAME = 'creative-report';
export const CREATIVEREPORT_TABLE_COLLECTION_NAME = 'creative-report-table';
export const COUNTER_VISITORS_COLLECTION_NAME = 'counter-visitors';
export const COUNTER_VISITORS_TABLE_COLLECTION_NAME = 'counter-visitors-table';
export const COUNTER_REGIONS_COLLECTION_NAME = 'counter-regions';
export const COUNTER_REGIONS_TABLE_COLLECTION_NAME = 'counter-regions-table';
export const COUNTER_DEVICES_COLLECTION_NAME = 'counter-devices';
export const COUNTER_DEVICES_TABLE_COLLECTION_NAME = 'counter-devices-table';
export const COUNTER_CHANNEL_COLLECTION_NAME = 'counter-channel';
export const COUNTER_CHANNEL_TABLE_COLLECTION_NAME = 'counter-channel-table';
export const REGIONS_COLLECTION_NAME = 'regions';
export const CITIES_COLLECTION_NAME = 'cities';
export const ONLINE_COUNTERS_COLLECTION_NAME = 'onlineCounters';
export const PUBLISHERS_CONFIG_COLLECTION_NAME = 'publishersConfig';
export const GROUPSTATS_COLLECTION_NAME = 'groupStats';
export const CAMPAIGNREPORT_CARDS_COLLECTION_NAME = 'campaign-report-cards';
export const FILTERS_COLLECTION_NAME = 'filters';

/** Others * */
export const SET_CAMPAIGN_FILTER = 'campaignGroupFilters';
export const SET_ADBLOCK = 'adBlock';
export const SET_CREATIVE_FILTER = 'creativeFilters';
export const SET_FAQ_FILTER = 'FAQFilter';
export const PAY_LINK = 'payLink';
export const PAYMENT_VARIANTS = 'paymentVariants';
export const CONTACT_FORM = 'contact-form';
export const SET_OPENED_GROUP = 'openedGroup';
export const SET_OPENED_FORMCARD = 'openedFormCards';
export const SET_ACTIVE_COUNTER_STATS = 'activeCounterStats';
export const SET_ACTIVE_CAMPAIGN_STATS = 'activeCampaignStats';
export const SET_FAVORITE_GROUP = 'favoriteGroups';
export const SET_FAVORITE_CREATIVE = 'favoriteCreatives';
export const SET_FAVORITE_FILTER = 'favoriteFilters';

/** Sharing * */

export const GROUPSHARING_COLLECTION_NAME = 'groupSharing';
export const CREATIVESHARING_COLLECTION_NAME = 'creativeSharing';
export const COUNTERSHARING_COLLECTION_NAME = 'counterSharing';
export const FILTERSHARING_COLLECTION_NAME = 'filterSharing';

/** List generated constants * */
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
export const adSizeActions = makeListActions(ADSIZE_COLLECTION_NAME);
export const languageActions = makeListActions(LANGUAGE_COLLECTION_NAME);
export const campaingsActions = makeListActions(CAMPAINGS_COLLECTION_NAME);
export const groupsActions = makeListActions(CAMPAING_GROUPS_COLLECTION_NAME);
export const filterActions = makeListActions(FILTERS_COLLECTION_NAME);

export const GET_ONLINE_COUNTERS_REQUEST = 'app/TradingDesk/GET_ONLINE_COUNTERS_REQUEST';
export const GET_ONLINE_COUNTERS_ERROR = 'app/TradingDesk/GET_ONLINE_COUNTERS_ERROR';
export const GET_ONLINE_COUNTERS_SUCCESS = 'app/TradingDesk/GET_ONLINE_COUNTERS_SUCCESS';

export const CAMPAING_FORM_LOADING_START = 'app/TradingDesk/CAMPAING_FORM_LOADING_START';
