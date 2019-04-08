import PublisherHomePage from 'containers/Publisher/components/PublisherHomePage';
import InventoriesList from 'containers/Publisher/components/InventoriesList';
import InventoryForm from 'containers/Publisher/components/InventoryForm';
import SlotForm from 'containers/Publisher/components/SlotForm';
import History from 'containers/Publisher/components/Payments/History';
import Pay from 'containers/Publisher/components/Payments/Pay';
import FAQ from 'containers/Publisher/components/FAQ/FAQ';
import { INVENTORY_TYPES } from 'containers/Publisher/constants';

/*
import SlotsListMobile from 'containers/Publisher/components/SlotsListMobile';
import TopSites from './components/Reports/TopSites';
import Sex from './components/Reports/Sex';
import Devices from './components/Reports/Devices';
import Regions from './components/Reports/Regions';
import Profitability from './components/Reports/Profitability';
import Age from './components/Reports/Age';
import Format from './components/Reports/Format';
*/
const routes = [
	{ path: '#', name: 'Main', type: 'navgroup' },
	{
		path: '/app/dashboard',
		name: 'dashboard',
		icon: 'tachometer-alt',
		badge: '4',
		component: PublisherHomePage,
	},
	{
		path: '#',
		name: 'adUnits',
		icon: 'fas fa-newspaper',
		type: 'dropdown',
		child: [
			{
				path: '/app/inventory/:type/:inventoryId/slot/add',
				component: SlotForm,
				type: 'child',
			},
			{
				path: '/app/inventory/:inventoryId/slot/:slotId',
				component: SlotForm,
				type: 'child',
			},
			{
				path: '/app/inventory/:type/edit/:inventoryId',
				component: InventoryForm,
				type: 'child',
			},
			{
				path: '/app/inventory/:type/add',
				component: InventoryForm,
				type: 'child',
			},
			{
				path: '/app/inventory/:type',
				component: InventoriesList,
				type: 'child',
			},

			{
				path: '/app/inventory/web',
				name: 'sitesList',
			},
			{
				path: '/app/inventory/sdk',
				name: 'sdkList',
			},
			{
				path: '/#',
				name: 'videoADS',
				component: PublisherHomePage,
			},
			{
				path: '/#',
				name: 'socialADS',
				component: PublisherHomePage,
			},
			{
				path: '/#',
				name: 'cpaOFFERS',
				component: PublisherHomePage,
			},
		],
	},

	/*
	{
		path: '#',
		name: 'reports',
		icon: 'flag',
		type: 'dropdown',
		child: [
			{
				path: '/reports/topsites',
				name: 'topsites',
				component: TopSites,
			},
			{
				path: '/reports/sex',
				name: 'sex',
				component: Sex,
			},
			{
				path: '/reports/profitability',
				name: 'profitability',
				component: Profitability,
			},
			{ path: '/reports/regions', name: 'regions', component: Regions },
			{ path: '/reports/devices', name: 'devices', component: Devices },
			{ path: '/reports/age', name: 'age', component: Age },
			{ path: '/reports/format', name: 'format', component: Format },
		],
	}, */
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

	{ path: '/app/FAQ', name: 'faq', icon: 'question-circle', component: FAQ },
];

export default routes;
