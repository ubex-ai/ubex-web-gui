/*
 * TradingDesk Messages
 *
 * This contains all the text for the TradingDesk container.
 */

import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';

export const scope = 'app.containers.TradingDesk';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the TradingDesk container!',
	},
	remove: {
		id: `${scope}.remove`,
		defaultMessage: 'Remove?',
	},
	warning: {
		id: `${scope}.warning`,
		defaultMessage: 'Warning',
	},
	warningText: {
		id: `${scope}.warningText`,
		defaultMessage: 'Trading Desk platform is running in test mode.',
	},
	TradingDeskHeader: {
		id: `${scope}.TradingDeskHeader`,
		defaultMessage: 'Trading Desk Dashboard',
	},
	impressionsAndClicks: {
		id: `${scope}.impressionsAndClicks`,
		defaultMessage: 'Impressions / Clicks',
	},
	eCPM: {
		id: `${scope}.eCPM`,
		defaultMessage: 'eCPM',
	},
	amountSpent: {
		id: `${scope}.amountSpent`,
		defaultMessage: 'Amount spent',
	},
	winrate: {
		id: `${scope}.winrate`,
		defaultMessage: 'Win Rate',
	},
	spend: {
		id: `${scope}.spend`,
		defaultMessage: 'Spend',
	},
	adCampaigns: {
		id: `${scope}.adCampaigns`,
		defaultMessage: 'adCampaigns',
	},
	addCampaigns: {
		id: `${scope}.addCampaigns`,
		defaultMessage: 'Add',
	},
	adCampaignsPopover: {
		id: `${scope}.adCampaignsPopover`,
		defaultMessage: 'adCampaignsPopover',
	},
	adCampaignsPopoverText: {
		id: `${scope}.adCampaignsPopoverText`,
		defaultMessage: 'adCampaignsPopoverText',
	},
	enoughMoney: {
		id: `${scope}.enoughMoney`,
		defaultMessage: 'enoughMoney',
	},
	addMoney: {
		id: `${scope}.addMoney`,
		defaultMessage: 'Add money',
	},
	enoughMoneyPopover: {
		id: `${scope}.enoughMoneyPopover`,
		defaultMessage: 'enoughMoneyPopover',
	},
	enoughMoneyPopoverText: {
		id: `${scope}.enoughMoneyPopoverText`,
		defaultMessage: 'enoughMoneyPopoverText',
	},
	top5campaigns: {
		id: `${scope}.top5campaigns`,
		defaultMessage: 'Top-5 Campaigns',
	},
	age: {
		id: `${scope}.age`,
		defaultMessage: 'Age',
	},
	gender: {
		id: `${scope}.gender`,
		defaultMessage: 'Gender',
	},
	top5adstype: {
		id: `${scope}.top5adstype`,
		defaultMessage: 'Top-5 ADs Type',
	},
	devices: {
		id: `${scope}.devices`,
		defaultMessage: 'Devices',
	},
	channel: {
		id: `${scope}.channel`,
		defaultMessage: 'Channel',
	},
	listCreativesHeader: {
		id: `${scope}.listCreativesHeader`,
		defaultMessage: 'Creative list',
	},
	addCreative: {
		id: `${scope}.addCreative`,
		defaultMessage: 'Add',
	},
	createCreative: {
		id: `${scope}.createCreative`,
		defaultMessage: 'Create',
	},
	createFirstCreative: {
		id: `${scope}.createFirstCreative`,
		defaultMessage: 'Create first creative',
	},
	groupsNotFound: {
		id: `${scope}.groupsNotFound`,
		defaultMessage: 'Groups not found',
	},
	onModeration: {
		id: `${scope}.onModeration`,
		defaultMessage: 'Your creatove is moderating. Approximate waiting time is 5-6 hours.',
	},
	listCampaignsHeader: {
		id: `${scope}.listCampaignsHeader`,
		defaultMessage: 'List campaigns',
	},
	addCampaign: {
		id: `${scope}.addCampaign`,
		defaultMessage: 'Add campaign',
	},
	addGroup: {
		id: `${scope}.addGroup`,
		defaultMessage: 'Add group',
	},
	groupName: {
		id: `${scope}.name`,
		defaultMessage: 'Group name',
	},
	topUp: {
		id: `${scope}.topUp`,
		defaultMessage: 'Top Up Balance',
	},
	topUpText: {
		id: `${scope}.topUpText`,
		defaultMessage: 'Specify the amount to top up the balance of the advertising group from your account',
	},
	CTR: {
		id: `${scope}.CTR`,
		defaultMessage: 'CTR',
	},
	listCreativeBanners: {
		id: `${scope}.listCreativeBanners`,
		defaultMessage: 'Creative preview',
	},
	faqHeader: {
		id: `${scope}.faqHeader`,
		defaultMessage: 'FAQ',
	},
	actionLogHeader: {
		id: `${scope}.actionLogHeader`,
		defaultMessage: 'Action Log',
	},
	addCreativeToCampaign: {
		id: `${scope}.addCreativeToCampaign`,
		defaultMessage: 'Add creative to campaign',
	},
	selectCreatives: {
		id: `${scope}.selectCreatives`,
		defaultMessage: 'Select creatives',
	},
	creative: {
		id: `${scope}.creative`,
		defaultMessage: 'Creative',
	},
	creativeReports: {
		id: `${scope}.creativeReports`,
		defaultMessage: 'Creative report',
	},
	campaignReports: {
		id: `${scope}.campaignReports`,
		defaultMessage: 'Campaign report',
	},
	preview: {
		id: `${scope}.preview`,
		defaultMessage: 'Preview',
	},
	impressionsAndClicksPopover: {
		id: `${scope}.popover.impressionsAndClicksPopover`,
		defaultMessage: 'Impressions & Clicks',
	},
	impressionsAndClicksPopoverText: {
		id: `${scope}.popover.impressionsAndClicksPopoverText`,
		defaultMessage:
			'The graph shows the number of impressions and clicks on your advertising campaigns from the accounts of the selected filter.',
	},
	amountSpentPopover: {
		id: `${scope}.popover.amountSpentPopover`,
		defaultMessage: 'Amount spent',
	},
	amountSpentPopoverText: {
		id: `${scope}.popover.amountSpentPopoverText`,
		defaultMessage: 'Your expenses for advertising campaigns by day from the accounts of the selected filter',
	},
	top5campaignsPopover: {
		id: `${scope}.popover.top5campaignsPopover`,
		defaultMessage: 'Top-5 Campaigns',
	},
	top5campaignsPopoverText: {
		id: `${scope}.popover.top5campaignsPopoverText`,
		defaultMessage: 'The most effective advertising campaigns among the running.',
	},
	top5adstypePopover: {
		id: `${scope}.popover.top5adstypePopover`,
		defaultMessage: 'Top-5 ADs Type',
	},
	top5adstypePopoverText: {
		id: `${scope}.popover.top5adstypePopoverText`,
		defaultMessage: 'The most effective creatives among the running advertising campaigns.',
	},
	genderPopover: {
		id: `${scope}.popover.genderPopover`,
		defaultMessage: 'Gender',
	},
	genderPopoverText: {
		id: `${scope}.popover.genderPopoverText`,
		defaultMessage: 'The ratio of men and women in your audience.',
	},
	agePopover: {
		id: `${scope}.popover.agePopover`,
		defaultMessage: 'Age',
	},
	agePopoverText: {
		id: `${scope}.popover.agePopoverText`,
		defaultMessage: 'The age of your audience is advertising campaigns.',
	},
	winratePopover: {
		id: `${scope}.popover.winratePopover`,
		defaultMessage: 'Win Rate',
	},
	winratePopoverText: {
		id: `${scope}.popover.winratePopoverText`,
		defaultMessage: 'Number of impressions won divided by the number of requests that were made rate.',
	},
	spendPopover: {
		id: `${scope}.popover.spendPopover`,
		defaultMessage: 'Spend',
	},
	spendPopoverText: {
		id: `${scope}.popover.spendPopoverText`,
		defaultMessage: 'Your advertising costs for the selected filter.',
	},
	CTRPopover: {
		id: `${scope}.popover.CTRPopover`,
		defaultMessage: 'CTR',
	},
	CTRPopoverText: {
		id: `${scope}.popover.CTRPopoverText`,
		defaultMessage:
			'Click-through rate is an indicator of the effectiveness of a media campaign. The percentage of clicks on an ad to\n' +
			'their hits on the sites.',
	},
	eCPMPopover: {
		id: `${scope}.popover.eCPMPopover`,
		defaultMessage: 'eCPM',
	},
	eCPMPopoverText: {
		id: `${scope}.popover.eCPMPopoverText`,
		defaultMessage: 'The effective price per 1000 impressions of your ad.',
	},
	devicesPopover: {
		id: `${scope}.popover.devicesPopover`,
		defaultMessage: 'Devices',
	},
	devicesPopoverText: {
		id: `${scope}.popover.devicesPopoverText`,
		defaultMessage: 'The most profitable devices.',
	},
	channelPopover: {
		id: `${scope}.popover.channelPopover`,
		defaultMessage: 'Channel',
	},
	channelPopoverText: {
		id: `${scope}.popover.channelPopoverText`,
		defaultMessage: 'The graph shows from which channels the traffic comes to you and how much of it is paid.',
	},
	adBlock: {
		id: `${scope}.adBlock`,
		defaultMessage: 'For normal operation of the interface, we recommend disabling the Adblock plugin',
	},
	editGroup: {
		id: `${scope}.editGroup`,
		defaultMessage: 'Edit group',
	},
	shareGroup: {
		id: `${scope}.shareGroup`,
		defaultMessage: 'Share group',
	},
	exportCSV: {
		id: `${scope}.exportCSV`,
		defaultMessage: 'Export CSV',
	},
	statistics: {
		id: `${scope}.statistics`,
		defaultMessage: 'Statistics',
	},
	archiveGroup: {
		id: `${scope}.archiveGroup`,
		defaultMessage: 'Archive group',
	},
	removeGroup: {
		id: `${scope}.removeGroup`,
		defaultMessage: 'Remove group',
	},
	impressions: {
		id: `${scope}.impressions`,
		defaultMessage: 'Impres.',
	},
	clicks: {
		id: `${scope}.clicks`,
		defaultMessage: 'Clicks',
	},
	dataSeries: {
		id: `${scope}.dataSeries`,
		defaultMessage: 'Data series',
	},
	unselectAll: {
		id: `${scope}.unselectAll`,
		defaultMessage: 'Unselect all',
	},
	selectAll: {
		id: `${scope}.selectAll`,
		defaultMessage: 'Select all',
	},
	from: {
		id: `${scope}.from`,
		defaultMessage: 'from',
	},
	to: {
		id: `${scope}.to`,
		defaultMessage: 'to',
	},
	banners: {
		id: `${scope}.banners`,
		defaultMessage: 'Banners',
	},
	type: {
		id: `${scope}.type`,
		defaultMessage: 'Type',
	},
	addedTo: {
		id: `${scope}.addedTo`,
		defaultMessage: 'Added to',
	},
	toCampaigns: {
		id: `${scope}.toCampaigns`,
		defaultMessage: 'campaigns',
	},
	name: {
		id: `${scope}.campaignTable.name`,
		defaultMessage: 'Name',
	},
	details: {
		id: `${scope}.campaignTable.details`,
		defaultMessage: 'Details',
	},
	status: {
		id: `${scope}.campaignTable.status`,
		defaultMessage: 'Status',
	},
	dateStartEnd: {
		id: `${scope}.campaignTable.dateStartEnd`,
		defaultMessage: 'Date Start / End',
	},
	spentBudget: {
		id: `${scope}.campaignTable.spendBudget`,
		defaultMessage: 'Spent / Budget',
	},
	spentDailyCap: {
		id: `${scope}.campaignTable.spentDailyCap`,
		defaultMessage: 'Spent / Daily Сap',
	},
	creatives: {
		id: `${scope}.campaignTable.creatives`,
		defaultMessage: 'Creatives',
	},
	all: {
		id: `${scope}.all`,
		defaultMessage: 'All',
	},
	active: {
		id: `${scope}.active`,
		defaultMessage: 'Active',
	},
	archive: {
		id: `${scope}.archive`,
		defaultMessage: 'Archive',
	},
	allTypes: {
		id: `${scope}.allTypes`,
		defaultMessage: 'All types',
	},
	campaigns: {
		id: `${scope}.campaigns`,
		defaultMessage: 'Campaigns',
	},
	file: {
		id: `${scope}.file`,
		defaultMessage: 'File',
	},
	adSize: {
		id: `${scope}.adSize`,
		defaultMessage: 'Ad size',
	},
	settings: {
		id: `${scope}.settings`,
		defaultMessage: 'Settings',
	},
	startDate: {
		id: `${scope}.startDate`,
		defaultMessage: 'Start date',
	},
	endDate: {
		id: `${scope}.endDate`,
		defaultMessage: 'End date',
	},
	format: {
		id: `${scope}.format`,
		defaultMessage: 'Format',
	},
	otherTracking: {
		id: `${scope}.otherTracking`,
		defaultMessage: 'Other tracking',
	},
	filename: {
		id: `${scope}.filename`,
		defaultMessage: 'Filename',
	},
	quality: {
		id: `${scope}.quality`,
		defaultMessage: 'Quality',
	},
	aspectRatio: {
		id: `${scope}.aspectRatio`,
		defaultMessage: 'Aspect ratio',
	},
	videoLength: {
		id: `${scope}.videoLength`,
		defaultMessage: 'Video length',
	},
	mime: {
		id: `${scope}.mime`,
		defaultMessage: 'MIME types',
	},
	protocol: {
		id: `${scope}.protocol`,
		defaultMessage: 'Protocol',
	},
	date: {
		id: `${scope}.date`,
		defaultMessage: 'Date',
	},
	editCreative: {
		id: `${scope}.editCreative`,
		defaultMessage: 'Edit creative',
	},
	shareCreative: {
		id: `${scope}.shareCreative`,
		defaultMessage: 'Share creative',
	},
	removeCreative: {
		id: `${scope}.removeCreative`,
		defaultMessage: 'Remove creative',
	},
	selectCreativeType: {
		id: `${scope}.selectCreativeType`,
		defaultMessage: 'Select creative type',
	},
	user: {
		id: `${scope}.user`,
		defaultMessage: 'User',
	},
	action: {
		id: `${scope}.action`,
		defaultMessage: 'Action',
	},
	running: {
		id: `${scope}.running`,
		defaultMessage: 'Running',
	},
	waiting: {
		id: `${scope}.waiting`,
		defaultMessage: 'Waiting',
	},
	stopped: {
		id: `${scope}.stopped`,
		defaultMessage: 'Stopped',
	},
	search: {
		id: `${scope}.search`,
		defaultMessage: 'Search',
	},
	blacklist: {
		id: `${scope}.blacklist`,
		defaultMessage: 'Blacklist',
	},
	clickURL: {
		id: `${scope}.clickURL`,
		defaultMessage: 'Click URL',
	},
	walletConnectorTitle: {
		id: `${scope}.walletConnectorTitle`,
		defaultMessage: 'Unlock Wallet',
	},
	walletConnectorText: {
		id: `${scope}.walletConnectorText`,
		defaultMessage:
			"Ubex supports the application of decentralized funds storage technologies in full and adheres to the principles of decentralization. UBEX does not have access to its users' private keys or their funds. The personal account of every user displays the status of their personal wallet.",
	},
	addressError: {
		id: `${scope}.addressError`,
		defaultMessage: 'Address error!',
	},
	yourAddress: {
		id: `${scope}.yourAddress`,
		defaultMessage: 'Your address:',
	},
	yourBalance: {
		id: `${scope}.yourBalance`,
		defaultMessage: 'Your balance: ',
	},
	activeGroup: {
		id: `${scope}.activeGroup`,
		defaultMessage: 'Active group',
	},
	campaignsCount: {
		id: `${scope}.campaignsCount`,
		defaultMessage: 'Campaigns',
	},
	clear: {
		id: `${scope}.clear`,
		defaultMessage: 'clear',
	},
	noCreatives: {
		id: `${scope}.noCreatives`,
		defaultMessage: 'No creatives',
	},
	topUpCampaign: {
		id: `${scope}.TopUpModal.topUpCampaign`,
		defaultMessage: 'Top Up campaign group balance',
	},
	transactionCompleted: {
		id: `${scope}.TopUpModal.transactionCompleted`,
		defaultMessage: 'Transaction completed',
	},
	selectTopUpAccount: {
		id: `${scope}.TopUpModal.selectTopUpAccount`,
		defaultMessage: 'Select an account to debit funds to replenish advertising campaigns',
	},
	attachYourWallet: {
		id: `${scope}.TopUpModal.attachYourWallet`,
		defaultMessage: 'Attach your wallet',
	},
	topUpAccountBalance: {
		id: `${scope}.TopUpModal.topUpAccountBalance`,
		defaultMessage: 'Top up account balance',
	},
	available: {
		id: `${scope}.TopUpModal.available`,
		defaultMessage: 'Available',
	},
	created: {
		id: `${scope}.created`,
		defaultMessage: 'Created',
	},
	creativeName: {
		id: `${scope}.creativeName`,
		defaultMessage: 'Creative name',
	},
	advertiser: {
		id: `${scope}.ChannelSelect.advertiser`,
		defaultMessage: 'Advertiser',
	},
	category: {
		id: `${scope}.ChannelSelect.category`,
		defaultMessage: 'Category',
	},
	brand: {
		id: `${scope}.ChannelSelect.brand`,
		defaultMessage: 'Brand',
	},
	geo: {
		id: `${scope}.ChannelSelect.geo`,
		defaultMessage: 'Geography',
	},
	legal: {
		id: `${scope}.ChannelSelect.legal`,
		defaultMessage: 'Legal information',
	},
	patchGroup: {
		id: `${scope}.patchGroup`,
		defaultMessage: 'Edit group',
	},
	backfill: {
		id: `${scope}.backfill`,
		defaultMessage: 'Backfill (options)',
	},
	toModeration: {
		id: `${scope}.toModeration`,
		defaultMessage: 'To moderation',
	},
	filterList: {
		id: `${scope}.filterList`,
		defaultMessage: 'Filter list',
	},
	createBlackList: {
		id: `${scope}.createBlackList`,
		defaultMessage: 'Create first filter',
	},
	addBlackList: {
		id: `${scope}.addBlackList`,
		defaultMessage: 'Add filter',
	},
	editBlackList: {
		id: `${scope}.editBlackList`,
		defaultMessage: 'Edit filter',
	},
	shareBlackList: {
		id: `${scope}.shareBlackList`,
		defaultMessage: 'Share filter',
	},
	removeBlackList: {
		id: `${scope}.removeBlackList`,
		defaultMessage: 'Remove filter',
	},
	filterName: {
		id: `${scope}.filterName`,
		defaultMessage: 'Filter name',
	},
	addFilter: {
		id: `${scope}.addFilter`,
		defaultMessage: 'Add filter',
	},
	editFilter: {
		id: `${scope}.editFilter`,
		defaultMessage: 'Edit filter',
	},
	shareFilter: {
		id: `${scope}.shareFilter`,
		defaultMessage: 'Share filter',
	},
	listingSemicolon: {
		id: `${scope}.listingSemicolon`,
		defaultMessage: 'For listing, specify a semicolon',
	},
	previewCreative: {
		id: `${scope}.previewCreative`,
		defaultMessage: 'Creative preview',
	},
	hasWalletText: {
		id: `${scope}.hasWalletText`,
		defaultMessage:
			'Your wallet is attached, replenish the balance of the advertising group in the ',
	},
	listOfCampaigns: {
		id: `${scope}.listOfCampaigns`,
		defaultMessage: 'list of campaigns',
	},
	CPC: {
		id: `${scope}.CPC`,
		defaultMessage: 'CPC',
	},
	CPCPopover: {
		id: `${scope}.CPCPopover`,
		defaultMessage: 'CPC (cost per click)',
	},
	CPCPopoverText: {
		id: `${scope}.CPCPopoverText`,
		defaultMessage: 'CPC (cost per click) is the cost per click, the amount that the advertiser pays to the context system for a click on an ad made by the user.',
	},
	moderationTitle: {
		id: `${scope}.moderationTitle`,
		defaultMessage: 'Moderation status',
	},
});
