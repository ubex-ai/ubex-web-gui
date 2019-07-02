/*
 * Publisher Messages
 *
 * This contains all the text for the Publisher container.
 */

import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';

export const scope = 'app.containers.Publisher';

export default defineMessages({
	revenuePerDay: {
		id: `${scope}.revenuePerDay`,
		defaultMessage: 'Revenue per day',
	},
	uniqVisitorsReward: {
		id: `${scope}.uniqVisitorsReward`,
		defaultMessage: 'Unique visitor reward',
	},
	fillrate: {
		id: `${scope}.fillrate`,
		defaultMessage: 'Fill rate',
	},
	averageProfitability: {
		id: `${scope}.averageProfitability`,
		defaultMessage: 'Average Profitability',
	},
	PublisherHeader: {
		id: `${scope}.PublisherHeader`,
		defaultMessage: 'Ubex Ad Network',
	},
	impressions: {
		id: `${scope}.impressions`,
		defaultMessage: 'Impressions',
	},
	addSlot: {
		id: `${scope}.addSlot`,
		defaultMessage: 'Add slot',
	},
	counterHeader: {
		id: `${scope}.counterHeader`,
		defaultMessage: 'Counter list',
	},
	clicksCount: {
		id: `${scope}.clicksCount`,
		defaultMessage: 'Clicks count',
	},
	CTR: {
		id: `${scope}.CTR`,
		defaultMessage: 'CTR',
	},
	CPC: {
		id: `${scope}.CPC`,
		defaultMessage: 'CPC',
	},
	RPM: {
		id: `${scope}.RPM`,
		defaultMessage: 'RPM',
	},
	eCPM: {
		id: `${scope}.eCPM`,
		defaultMessage: 'eCPM',
	},
	nextPayout: {
		id: `${scope}.nextPayout`,
		defaultMessage: 'Next Payout',
	},
	profitability: {
		id: `${scope}.profitability`,
		defaultMessage: 'Revenue',
	},
	topInventory: {
		id: `${scope}.topInventory`,
		defaultMessage: 'Top inventory',
	},
	listInventory: {
		id: `${scope}.listInventory`,
		defaultMessage: 'Top List inventory',
	},
	visitorsStatistics: {
		id: `${scope}.visitorsStatistics`,
		defaultMessage: "Visitor's Statistics",
	},
	sex: {
		id: `${scope}.sex`,
		defaultMessage: 'Sex',
	},
	age: {
		id: `${scope}.age`,
		defaultMessage: 'Age',
	},
	format: {
		id: `${scope}.format`,
		defaultMessage: 'Size',
	},
	day: {
		id: `${scope}.day`,
		defaultMessage: 'day',
	},
	paymentsHistory: {
		id: `${scope}.paymentsHistory`,
		defaultMessage: 'paymentsHistory',
	},
	week: {
		id: `${scope}.week`,
		defaultMessage: 'week',
	},
	month: {
		id: `${scope}.month`,
		defaultMessage: 'month',
	},
	year: {
		id: `${scope}.year`,
		defaultMessage: 'year',
	},
	warning: {
		id: `${scope}.warning`,
		defaultMessage: 'Warning',
	},
	warningText: {
		id: `${scope}.warningText`,
		defaultMessage: 'Publisher platform is running in test mode.',
	},
	faqHeader: {
		id: `${scope}.counterForm.faqHeader`,
		defaultMessage: 'FAQ',
	},
	impressionsPopover: {
		id: `${scope}.popover.impressionsPopover`,
		defaultMessage: 'Impressions',
	},
	impressionsPopoverText: {
		id: `${scope}.popover.impressionsPopoverText`,
		defaultMessage: 'How many times have shown advertisements in your inventory.',
	},
	CTRPopover: {
		id: `${scope}.popover.CTRPopover`,
		defaultMessage: 'CTR',
	},
	CTRPopoverText: {
		id: `${scope}.popover.CTRPopoverText`,
		defaultMessage: 'LIKE NOW',
	},
	fillratePopover: {
		id: `${scope}.popover.fillratePopover`,
		defaultMessage: 'Fill Rate',
	},
	fillratePopoverText: {
		id: `${scope}.popover.fillratePopoverText`,
		defaultMessage: 'How many % of the ads we were able to provide you with the total number of your requests.',
	},
	eCPMPopover: {
		id: `${scope}.popover.eCPMPopover`,
		defaultMessage: 'eCPM',
	},
	eCPMPopoverText: {
		id: `${scope}.popover.eCPMPopoverText`,
		defaultMessage: 'CPM is the effective price that an advertiser pays for every 1000 views of his ad.',
	},
	RPMPopover: {
		id: `${scope}.popover.RPMPopover`,
		defaultMessage: 'RPM',
	},
	RPMPopoverText: {
		id: `${scope}.popover.RPMPopoverText`,
		defaultMessage: "RPM - Publisher's income for every 1000 views.",
	},
	topInventoryPopover: {
		id: `${scope}.popover.topInventoryPopover`,
		defaultMessage: 'Top inventory',
	},
	topInventoryPopoverText: {
		id: `${scope}.popover.topInventoryPopoverText`,
		defaultMessage: 'Ranking your inventory. The most profitable.',
	},
	profitabilityPopover: {
		id: `${scope}.popover.profitabilityPopover`,
		defaultMessage: 'Revenue',
	},
	profitabilityPopoverText: {
		id: `${scope}.popover.profitabilityPopoverText`,
		defaultMessage: 'Your daily profitability relative to the selected filter.',
	},
	sexPopover: {
		id: `${scope}.popover.sexPopover`,
		defaultMessage: 'Sex (Reward)',
	},
	sexPopoverText: {
		id: `${scope}.popover.sexPopoverText`,
		defaultMessage: 'The ratio of the sexes that bring you the greatest income.',
	},
	agePopover: {
		id: `${scope}.popover.agePopover`,
		defaultMessage: 'Age (Reward)',
	},
	agePopoverText: {
		id: `${scope}.popover.agePopoverText`,
		defaultMessage: 'The most profitable age of your visitor.',
	},
	formatPopover: {
		id: `${scope}.popover.formatPopover`,
		defaultMessage: 'Size (Reward)',
	},
	formatPopoverText: {
		id: `${scope}.popover.formatPopoverText`,
		defaultMessage: 'The most profitable banner sizes.',
	},
	clicksCountPopover: {
		id: `${scope}.popover.clicksCountPopover`,
		defaultMessage: 'Clicks count',
	},
	clicksCountPopoverText: {
		id: `${scope}.popover.clicksCountPopoverText`,
		defaultMessage: 'How many times clicked on advertising in your inventory.',
	},
	addNew: {
		id: `${scope}.addNew`,
		defaultMessage: 'Add new',
	},
	devicesPopover: {
		id: `${scope}.popover.devicesPopover`,
		defaultMessage: 'Devices (Reward)',
	},
	devicesPopoverText: {
		id: `${scope}.popover.devicesPopoverText`,
		defaultMessage: 'The most profitable devices.',
	},
	reward: {
		id: `${scope}.reward`,
		defaultMessage: '(Reward)',
	},
	topRegionsPopover: {
		id: `${scope}.popover.topRegionsPopover`,
		defaultMessage: 'Top regions',
	},
	topRegionsPopoverText: {
		id: `${scope}.popover.topRegionsPopoverText`,
		defaultMessage: 'The most profitable regions.',
	},
	topRegions: {
		id: `${scope}.topRegions`,
		defaultMessage: 'Top regions',
	},
});
