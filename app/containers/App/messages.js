/*
 * App Messages
 *
 * This contains common the texts for the App.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.common';
export const sidebarScope = 'app.sidebar';
export const languageScope = 'app.language';

export default defineMessages({
	profile: {
		id: `app.navbar.profile`,
		defaultMessage: 'Profile',
	},
	logout: {
		id: `app.navbar.logout`,
		defaultMessage: 'Logout',
	},
	en: {
		id: `${languageScope}.en`,
		defaultMessage: 'English',
	},
	ru: {
		id: `${languageScope}.ru`,
		defaultMessage: 'Russian',
	},
	ko: {
		id: `${languageScope}.ko`,
		defaultMessage: 'Korean',
	},
	zh: {
		id: `${languageScope}.zh`,
		defaultMessage: 'Chinese',
	},
	save: {
		id: `${scope}.save`,
		defaultMessage: 'Save',
	},
	alltime: {
		id: `${scope}.alltime`,
		defaultMessage: 'All time',
	},
	close: {
		id: `${scope}.close`,
		defaultMessage: 'Close',
	},
	confirm: {
		id: `${scope}.confirm`,
		defaultMessage: 'Confirm',
	},
	week: {
		id: `${scope}.week`,
		defaultMessage: 'Week',
	},
	year: {
		id: `${scope}.year`,
		defaultMessage: 'Year',
	},
	month: {
		id: `${scope}.month`,
		defaultMessage: 'Month',
	},
	order: {
		id: `${scope}.order`,
		defaultMessage: 'Order',
	},
	cancel: {
		id: `${scope}.cancel`,
		defaultMessage: 'Cancel',
	},
	nextPaymentDate: {
		id: `${scope}.nextPaymentDate`,
		defaultMessage: 'The next payment date',
	},
	howMuchWithdraw: {
		id: `${scope}.howMuchWithdraw`,
		defaultMessage: 'How much do you want to withdraw?',
	},
	datePayment: {
		id: `${scope}.datePayment`,
		defaultMessage: 'Fri, 31 may 2019',
	},
	loading: {
		id: `${scope}.loading`,
		defaultMessage: 'Loading',
	},
	copied: {
		id: `${scope}.copied`,
		defaultMessage: 'Copied',
	},
	copy: {
		id: `${scope}.copy`,
		defaultMessage: 'Copy',
	},
	remove: {
		id: `${scope}.remove`,
		defaultMessage: 'Remove',
	},
	error: {
		id: `${scope}.error`,
		defaultMessage: 'Error',
	},
	today: {
		id: `${scope}.today`,
		defaultMessage: 'Today',
	},
	lastweek: {
		id: `${scope}.lastweek`,
		defaultMessage: 'Last week',
	},
	visitors: {
		id: `${scope}.visitors`,
		defaultMessage: 'TopSites',
	},
	orderPayment: {
		id: `${scope}.orderPayment`,
		defaultMessage: 'Order payment',
	},
	lastmonth: {
		id: `${scope}.lastmonth`,
		defaultMessage: 'Last Month',
	},
	devices: {
		id: `${scope}.devices`,
		defaultMessage: 'Devices',
	},
	submit: {
		id: `${scope}.submit`,
		defaultMessage: 'Submit',
	},
	addNew: {
		id: `${scope}.addNew`,
		defaultMessage: 'Add new',
	},
	add: {
		id: `${scope}.add`,
		defaultMessage: 'Add',
	},
	OrderPaymentSideBar: {
		id: `${sidebarScope}.orderPayment`,
		defaultMessage: 'Order payment',
	},
	dashboard: {
		id: `${sidebarScope}.dashboard`,
		defaultMessage: 'Dashboard',
	},
	counters: {
		id: `${sidebarScope}.counters`,
		defaultMessage: 'Counters',
	},
	addcounter: {
		id: `${sidebarScope}.addcounter`,
		defaultMessage: 'Add counter',
	},
	user: {
		id: `${sidebarScope}.user`,
		defaultMessage: 'User',
	},
	counterstats: {
		id: `${sidebarScope}.counterstats`,
		defaultMessage: 'Counter Stats',
	},
	reports: {
		id: `${sidebarScope}.reports`,
		defaultMessage: 'Reports',
	},
	reportsVisitors: {
		id: `${sidebarScope}.reports.visitors`,
		defaultMessage: 'TopSites',
	},
	reportsUniqueVisitors: {
		id: `${sidebarScope}.reports.uniqueVisitors`,
		defaultMessage: 'Unique visitors',
	},
	reportsProfitCounters: {
		id: `${sidebarScope}.reports.profitCounters`,
		defaultMessage: 'Profitability AddCounter',
	},
	reportsRegions: {
		id: `${sidebarScope}.reports.regions`,
		defaultMessage: 'Regions',
	},
	reportsDevices: {
		id: `${sidebarScope}.reports.devices`,
		defaultMessage: 'Devices',
	},
	reportsChannel: {
		id: `${sidebarScope}.reports.channel`,
		defaultMessage: 'Age',
	},
	payments: {
		id: `${sidebarScope}.payments`,
		defaultMessage: 'Payments',
	},
	paymentsHistory: {
		id: `${sidebarScope}.payments.history`,
		defaultMessage: 'History',
	},
	pay: {
		id: `${sidebarScope}.payments.pay`,
		defaultMessage: 'Pay',
	},
	settings: {
		id: `${sidebarScope}.settings`,
		defaultMessage: 'Settings',
	},
	faq: {
		id: `${sidebarScope}.faq`,
		defaultMessage: 'FAQ',
	},
	sitesList: {
		id: `${sidebarScope}.adUnits.sitesList`,
		defaultMessage: 'Display (Web)',
	},
	sdkList: {
		id: `${sidebarScope}.adUnits.sdkList`,
		defaultMessage: 'Display (App)',
	},
	videoADS: {
		id: `${sidebarScope}.adUnits.videoADS`,
		defaultMessage: 'Video (Soon)',
	},
	socialADS: {
		id: `${sidebarScope}.adUnits.socialADS`,
		defaultMessage: 'Native (Soon)',
	},
	cpaOFFERS: {
		id: `${sidebarScope}.adUnits.cpaOFFERS`,
		defaultMessage: 'CPA (Soon)',
	},
	addUnits: {
		id: `${sidebarScope}.adUnits`,
		defaultMessage: 'Inventory',
	},
});
