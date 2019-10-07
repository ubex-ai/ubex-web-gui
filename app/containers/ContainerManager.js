/**
 * Container Manager
 */
import TradingDesk from 'containers/TradingDesk/index';
import DataMiner from 'containers/DataMiner/index';
import Publisher from 'containers/Publisher/index';

const DEV_CONTAINER = TradingDesk;

const getActiveContainer = () => {
	if (!(document && document.location && document.location.host)) {
		throw Error(`Unknown container environment: can't get location.host`);
	}
	// eslint-disable-next-line no-undef
	if (!NODE_ENV !== 'production' && NODE_ENV !== 'stage') {
		return DEV_CONTAINER;
	}
	switch (document.location.origin) {
		// eslint-disable-next-line no-undef
		case TRADING_DESK_URL:
			return TradingDesk;
		// eslint-disable-next-line no-undef
		case MINING_URL:
			return DataMiner;
		// eslint-disable-next-line no-undef
		case PUBLISHER_URL:
			return Publisher;
		default:
			throw Error(`Can't find container for address: ${document.location.origin}`);
	}
	// eslint-enable no-undef
};

const ActiveContainer = getActiveContainer();
export default ActiveContainer;
