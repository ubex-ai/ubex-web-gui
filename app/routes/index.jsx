import DataMinerDashboard from 'containers/DataMiner';
import PublisherDashboard from 'containers/Publisher';
import BlankPage from 'containers/NotFoundPage/Loadable';

const getDashboardForDomain = () => {
	if (!(document && document.location && document.location.host)) {
		return null;
	}
	try {
		switch (document.location.origin) {
			// eslint-disable-next-line no-undef
			case PUBLISHER_URL:
				return PublisherDashboard;
			// eslint-disable-next-line no-undef
			case MINING_URL:
				return DataMinerDashboard;
			default:
				return DataMinerDashboard;
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Domain error!', e);
		return null;
	}
};

const indexRoutes = [
	{ path: '/403', name: '403', component: BlankPage },
	{ path: '/404', name: '404', component: BlankPage },
	{ path: '/405', name: '405', component: BlankPage },
	{ path: '/408', name: '408', component: BlankPage },
	{ path: '/500', name: '500', component: BlankPage },
	{ path: '/503', name: '503', component: BlankPage },
	{ path: '/offline', name: 'Offline', component: BlankPage },
	{ path: '/', name: 'Home', component: getDashboardForDomain() },
];

export default indexRoutes;
