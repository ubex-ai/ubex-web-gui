import { rehydrateState as userPageRehydrateState } from 'containers/UserPage/reducer';
import { rehydrateState as dashboardRehydrateState } from 'containers/Dashboard/reducer';
import { rehydrateState as dataMinerRehydrateState } from 'containers/DataMiner/reducer';
import { rehydrateState as publisherRehydrateState } from 'containers/Publisher/reducer';
import { rehydrateState as tradingDeskRehydrateState } from 'containers/TradingDesk/reducer';

const appRehydrateState = {
	user: userPageRehydrateState,
	dashboard: dashboardRehydrateState,
};

if (document.location.origin === PUBLISHER_URL && NODE_ENV === 'production') {
	appRehydrateState.publisher = publisherRehydrateState;
}

if (document.location.origin === MINING_URL && NODE_ENV === 'production') {
	appRehydrateState.dataMiner = dataMinerRehydrateState;
}

if ((document.location.origin === TRADING_DESK_URL && NODE_ENV === 'production') || NODE_ENV !== 'production') {
	appRehydrateState.tradingdDesk = tradingDeskRehydrateState;
}

export default appRehydrateState;
