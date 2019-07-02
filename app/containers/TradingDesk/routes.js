import TradingDeskHomePage from 'containers/TradingDesk/components/TradingDeskHomePage';
import Pay from 'components/Payments/Pay';
import History from 'components/Payments/History';
import AddCampaigns from 'containers/TradingDesk/components/CampaignForm';
import ListCreatives from 'containers/TradingDesk/components/CreativesList';
import CreativeForm from 'containers/TradingDesk/components/CreativeForm';
import CampaignGroupsList from 'containers/TradingDesk/components/CampaignGroupsList/Loadable';
import CountersList from 'containers/TradingDesk/components/CountersList';
import CounterForm from 'containers/TradingDesk/components/CounterForm';
import CreativeBannerList from 'containers/TradingDesk/components/CreativeBannerList';
import Visitors from 'containers/TradingDesk/components/Reports/Visitors';
import ProfitabilityWorkers from 'containers/TradingDesk/components/Reports/ProfitabilityWorkers';
import Regions from 'containers/TradingDesk/components/Reports/Regions';
import Devices from 'containers/TradingDesk/components/Reports/Devices';
import Channel from 'containers/TradingDesk/components/Reports/Channel';
import FAQ from 'containers/TradingDesk/components/FAQ/FAQ';
import Developers from 'containers/TradingDesk/components/Developers';
import ActionLog from 'containers/TradingDesk/components/ActionLog';
import CreativeReport from 'containers/TradingDesk/components/CreativeReport';
import CampaignReport from 'containers/TradingDesk/components/CampaignReport';

const routes = [
	{ path: '#', name: 'advertising', type: 'navgroup' },
	{
		path: '/app/dashboard',
		name: 'dashboard',
		icon: 'tachometer-alt',
		badge: '4',
		component: TradingDeskHomePage,
	},
	{
		path: '/app/campaigns/list',
		name: 'campaigns',
		icon: 'bullhorn',
		component: CampaignGroupsList,
	},
	{
		path: '/app/campaigns/request/:request',
		name: 'campaigns',
		type: 'child',
		component: CampaignGroupsList,
	},
	{
		path: '/app/campaign/:idGroup/add',
		component: AddCampaigns,
		type: 'child',
	},
	{
		path: '/app/campaign/:idCampaign/edit',
		component: AddCampaigns,
		type: 'child',
	},
	{
		path: '/app/creatives/list',
		name: 'listCreatives',
		component: ListCreatives,
		icon: 'list',
	},
	{
		path: '/app/creative/:type/add',
		component: CreativeForm,
		type: 'child',
	},
	{
		path: '/app/creative/:type/:id',
		component: CreativeForm,
		type: 'child',
	},
	{
		path: '/app/creative-banners/:idCreative',
		component: CreativeBannerList,
		type: 'child',
	},
	{
		path: '#',
		name: 'reports',
		icon: 'chart-line',
		type: 'dropdown',
		child: [
			{ path: '/app/creatives/report', name: 'creative-report', component: CreativeReport },
			{ path: '/app/campaigns/report', name: 'campaigns-report', component: CampaignReport },
		],
	},
	{
		path: '#',
		name: 'traffic',
		type: 'navgroup',
	},
	{
		path: '/app/counters/list/',
		name: 'counters',
		icon: 'server',
		component: CountersList,
	},
	{
		path: '#',
		name: 'statistics-counters',
		icon: 'chart-line',
		type: 'dropdown',
		child: [
			{
				path: '/app/reports/visitors',
				name: 'visitors',
				component: Visitors,
			},
			{ path: '/app/reports/regions', name: 'regions', component: Regions },
			{ path: '/app/reports/devices', name: 'devices', component: Devices },
			{ path: '/app/reports/channel', name: 'channel', component: Channel },
		],
	},
	{
		path: '/app/counter/add',
		name: 'addcounter',
		icon: 'people-carry',
		component: CounterForm,
		type: 'child',
	},
	{
		path: '/app/counter/:id',
		name: 'editcounter',
		icon: 'people-carry',
		component: CounterForm,
		type: 'child',
	},
	{
		path: '#',
		name: 'Control',
		type: 'navgroup',
	},
	{
		path: '#',
		name: 'payments',
		icon: 'credit-card',
		type: 'dropdown',
		child: [
			{
				path: '/app/payments/history',
				name: 'history',
				component: History,
			},
			{
				path: '/app/payments/pay',
				name: 'pay',
				component: Pay,
			},
		],
	},
	{ path: '/app/log', name: 'log', icon: 'boxes', component: ActionLog },
	{ path: '/app/FAQ', name: 'faq', icon: 'question-circle', component: FAQ },
	{ path: '/app/developers', name: 'developers', icon: 'code', component: Developers },
];

export default routes;
