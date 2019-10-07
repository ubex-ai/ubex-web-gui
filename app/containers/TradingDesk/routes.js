import TradingDeskHomePage from 'containers/TradingDesk/components/TradingDeskHomePage';
import AddCampaigns from 'containers/TradingDesk/components/CampaignForm';
import ListCreatives from 'containers/TradingDesk/components/CreativesList';
import CreativeForm from 'containers/TradingDesk/components/CreativeForm';
import CreateFromTemplate from 'containers/TradingDesk/components/CreativeForm/CreateFromTemplate';
import CampaignGroupsList from 'containers/TradingDesk/components/CampaignGroupsList/Loadable';
import CountersList from 'containers/TradingDesk/components/CountersList';
import CounterForm from 'containers/TradingDesk/components/CounterForm';
import CreativeBannerList from 'containers/TradingDesk/components/CreativeBannerList';
import Visitors from 'containers/TradingDesk/components/Reports/Visitors';
import Regions from 'containers/TradingDesk/components/Reports/Regions';
import Devices from 'containers/TradingDesk/components/Reports/Devices';
import Channel from 'containers/TradingDesk/components/Reports/Channel';
import FAQ from 'containers/TradingDesk/components/FAQ/FAQ';
import Developers from 'containers/TradingDesk/components/Developers';
import ActionLog from 'containers/TradingDesk/components/ActionLog';
import CreativeReport from 'containers/TradingDesk/components/CreativeReport';
import CampaignReport from 'containers/TradingDesk/components/CampaignReport';
import TrafficSources from 'containers/TradingDesk/components/TrafficSources';
import AdNetwork from 'containers/TradingDesk/components/AdNetwork';
import TestPage from 'containers/TradingDesk/components/TestPage';
import FilterList from 'containers/TradingDesk/components/FilterListPage';

const routes = [
	{ path: '#', name: 'advertising', type: 'navgroup' },
	{
		path: '/app/dashboard',
		name: 'dashboard',
		icon: 'fal fa-tachometer-alt',
		badge: '4',
		component: TradingDeskHomePage,
	},
	{
		path: '/app/campaigns/list',
		name: 'campaigns',
		icon: 'fal fa-bullhorn',
		component: CampaignGroupsList,
	},
	{
		path: '/app/campaigns/request/:request',
		name: 'fas fa-campaigns',
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
		path: '/app/campaign/:idCampaign/see',
		component: AddCampaigns,
		type: 'child',
	},
	{
		defaultPath: '/app/creatives/list/full',
		path: '/app/creatives/list/:add',
		name: 'listCreatives',
		component: ListCreatives,
		icon: 'fal fa-list-ul',
	},
	{
		defaultPath: '/app/filterList',
		path: '/app/filterList',
		name: 'filterList',
		component: FilterList,
		icon: 'fal fa-filter',
	},
	{
		path: '/app/creative/create/template',
		component: CreateFromTemplate,
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
		icon: 'fal fa-analytics',
		type: 'dropdown',
		child: [
			{ path: '/app/campaigns/report', name: 'campaigns-report', component: CampaignReport },
			{ path: '/app/creatives/report', name: 'creative-report', component: CreativeReport },
			{ path: '/app/traffic/sources', name: 'traffic-sources', component: TrafficSources },
			{ path: '/app/adNetwork', name: 'ad-networks', component: AdNetwork },
		],
	},
	{
		path: '/app/campaigns/reportByGroup/:groupId',
		component: CampaignReport,
		name: 'campaigns-report',
		type: 'child',
	},
	{
		path: '/app/campaigns/reportByFilter/:filter',
		component: CampaignReport,
		name: 'campaigns-report',
		type: 'child',
	},
	{
		path: '/app/creatives/reportByCampaign/:campaignId',
		component: CreativeReport,
		name: 'creative-report',
		type: 'child',
	},
	{
		path: '/app/creatives/reportByFilter/:filter',
		component: CreativeReport,
		name: 'creative-report',
		type: 'child',
	},
	{
		path: '#',
		name: 'traffic',
		type: 'navgroup',
	},
	{
		path: '/app/counters/list/',
		name: 'counters',
		icon: 'fal fa-server',
		component: CountersList,
	},
	{
		path: '#',
		name: 'statistics-counters',
		icon: 'fal fa-chart-bar',
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
		icon: 'fas fa-people-carry',
		component: CounterForm,
		type: 'child',
	},
	{
		path: '/app/counter/:id',
		name: 'editcounter',
		icon: 'fas fa-people-carry',
		component: CounterForm,
		type: 'child',
	},
	{
		path: '#',
		name: 'Options',
		type: 'navgroup',
	},
	{
		path: '/app/payment/history',
		name: 'payments',
		icon: 'fal fa-credit-card',
		component: History,
	},
	{ path: '/app/log', name: 'log', icon: 'fal fa-stream', component: ActionLog },
	{ path: '/app/partners', name: 'partners', icon: 'fal fa-handshake-alt', component: Developers },
	{ path: '/app/FAQ', name: 'faq', icon: 'fal fa-question-circle', component: FAQ },
	{ path: '/app/tree', name: 'testpage', icon: 'fas fa-question-circle', component: TestPage, type: 'child' },
];

export default routes;
