import CountersList from 'containers/DataMiner/components/CountersList';
import HomePage from 'containers/DataMiner/components/HomePage';
import AddCounter from 'containers/DataMiner/components/CounterForm';
import FaqPage from 'containers/DataMiner/components/FaqPage';
import CounterStats from 'containers/DataMiner/components/CounterStats';
import Visitors from 'containers/DataMiner/components/Reports/Visitors';
import Devices from 'containers/DataMiner/components/Reports/Devices';
import Regions from 'containers/DataMiner/components/Reports/Regions';
import ProfitabilityWorkers from 'containers/DataMiner/components/Reports/ProfitabilityWorkers';
import Channel from 'containers/DataMiner/components/Reports/Channel';
import Pay from 'containers/DataMiner/components/Payments/Pay';
import History from 'containers/DataMiner/components/Payments/History';

const dashRoutes = [
	{ path: '#', name: 'Main', type: 'navgroup' },
	{
		path: '/app/dashboard',
		name: 'dashboard',
		icon: 'tachometer-alt',
		badge: '4',
		component: HomePage,
	},
	{
		path: '/app/counters/list',
		name: 'counters',
		icon: 'server',
		component: CountersList,
	},
	{
		path: '/app/counter/add',
		name: 'addcounter',
		icon: 'people-carry',
		component: AddCounter,
		type: 'child',
	},
	{
		path: '/app/counter/:id',
		name: 'editcounter',
		icon: 'people-carry',
		component: AddCounter,
		type: 'child',
	},

	{
		path: '/app/counters/stats',
		name: 'counterstats',
		icon: 'people-carry',
		component: CounterStats,
		type: 'child',
	},
	{
		path: '#',
		name: 'reports',
		icon: 'flag',
		type: 'dropdown',
		child: [
			{
				path: '/app/reports/visitors',
				name: 'visitors',
				component: Visitors,
			},
			{
				path: '/app/reports/counters/profitability',
				name: 'profitCounters',
				component: ProfitabilityWorkers,
			},
			{ path: '/app/reports/regions', name: 'regions', component: Regions },
			{ path: '/app/reports/devices', name: 'devices', component: Devices },
			{ path: '/app/reports/channel', name: 'channel', component: Channel },
		],
	},
	{
		path: '#',
		name: 'payments',
		icon: 'credit-card',
		type: 'dropdown',
		child: [
			{
				path: '/app/payments/accountbalance',
				name: 'pay',
				component: Pay,
			},
			{
				path: '/app/payments/history',
				name: 'history',
				component: History,
			},
		],
	},
	{ path: '/app/faq', name: 'faq', icon: 'question-circle', component: FaqPage },
];

export default dashRoutes;
