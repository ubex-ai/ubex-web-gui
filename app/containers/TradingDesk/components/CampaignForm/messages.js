/*
 * CampaignForm Messages
 *
 * This contains all the text for the CampaignForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CampaignForm';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the CampaignForm component!',
	},
	addCampaignHeader: {
		id: `${scope}.addCampaignHeader`,
		defaultMessage: 'Add campaign',
	},
	editCampaignHeader: {
		id: `${scope}.editCampaignHeader`,
		defaultMessage: 'Edit campaign',
	},
	instructionsText: {
		id: `${scope}.inventoryForm.help.instructionsText`,
		defaultMessage:
			'<p>To start an advertising campaign, fill in all the form fields. If you want to achieve maximum efficiency, we recommend you fill it in as much detail as possible.</p>\n' +
			"<dt>Campaign Name</dt><dd>See the name of the campaign. For example: Children's toys 24-55, China.</dd>\n" +
			'<dt>Type of desired audience</dt><dd>Select a campaign type - Select a new audience or Retargeting - return your audience for repeat sales.</dd>\n' +
			'<dt>Advertising strategy</dt><dd>Select the type of advertising you are interested in depending on your goals.</dd>\n' +
			'<dt>24 hour display frequency</dt><dd>Specify how many times we can show your ad to one user. For example: 5.</dd>\n' +
			'<dt>Advertising time</dt><dd>Specify the date and time of the beginning and end of the advertising campaign. If you want to advertise did not stop leaving useful End of the show empty.</dd>\n' +
			'<dt>Budget and Daily Budget</dt><dd>Indicate how much you want to spend on an advertising campaign, total or per day. If there are no restrictions, leave the fields blank.</dd>' +
			'<dt>Views and Daily Views</dt><dd>Indicate how much you want your ad to show, total or per day. If there are no restrictions, leave the fields blank.</dd>\n' +
			'<dt>Show position</dt><dd>Specify where to show your banners. At the top of the page in the visible part or below on the second scroll screen. Choose "default" if you want the system to decide how it will be better.</dd>' +
			'<h2>Reports / Reports</h2>\n' +
			'<dt>Select counter</dt><dd>Specify which site will be launched advertising, it is necessary to accurately check the traffic and reduces the risk of fraud on the part of advertising networks. For example, if you start advertising for the site www.ubex.com, be sure to create and install a counter on it in the "Counters" section</dd>\n' +
			'<dt>Automatic stop of the advertising campaign when the site is unavailable.</dt><dd>Check the box if you want to disable ads when your site is unavailable. Our system checks the availability of your site every minute, if at some point it stops working, the system begins to monitor it even more actively. If the site does not resume within 3 minutes, we will stop advertising and save your budget.</dd>\n' +
			'<dt>Email</dt><dd>Specify e-mail where to send notifications when the site is unavailable. We recommend external mail created outside the advertised domain.</dd>\n' +
			'<dt>Add creative</dt><dd>Choose which creatives to show in this ad campaign. The number is not limited. If you have not yet loaded creatives into the system, skip this block and load banners after creating a campaign.</dd>\n' +
			'<h2>Targets</h2>\n' +
			'<dt>Geography</dt><dd>Specify which countries and cities are interesting for you to display ads.</dd>\n' +
			'<dt>Categories</dt><dd>on which sites show your ads. Leave blank if you cannot make a choice. The system will select your audience.</dd>' +
			'<dt>Temporary restrictions</dt><dd>specify at what time and what days of the week to show your ad.</dd>\n' +
			'<h2>Devices</h2>\n' +
			'<p>If you want to show ads, only to certain devices, operating systems or in certain browsers, specify the necessary campaign settings. If there are no restrictions, leave the fields blank.</p>' +
			'<h2>Audience</h2>\n' +
			'<p>Specify the age and gender of your audience. If you want to show ads for different age or sex audience, then we recommend creating a separate advertising campaign for each audience and adding the necessary creatives to it for the selected audience.</p>' +
			'<h2>Black list</h2>\n' +
			'<p>Specify which sites you do not allow to display ads. If there are no restrictions, leave the fields blank.</p>',
	},
	campaignName: {
		id: `${scope}.campaignName`,
		defaultMessage: 'Campaign name',
	},
	strategy: {
		id: `${scope}.strategy`,
		defaultMessage: 'Buying strategy',
	},
	startDate: {
		id: `${scope}.startDate`,
		defaultMessage: 'Start Date',
	},
	endDate: {
		id: `${scope}.endDate`,
		defaultMessage: 'End Date (optional)',
	},
	budget: {
		id: `${scope}.budget`,
		defaultMessage: 'Total Budget',
	},
	dailyBudget: {
		id: `${scope}.dailyBudget`,
		defaultMessage: 'Daily Budget Cap',
	},
	impressions: {
		id: `${scope}.impressions`,
		defaultMessage: 'Impressions',
	},
	dailyImpressions: {
		id: `${scope}.dailyImpressions`,
		defaultMessage: 'Daily Impressions Cap',
	},
	geo: {
		id: `${scope}.geo`,
		defaultMessage: 'Geography',
	},
	categories: {
		id: `${scope}.categories`,
		defaultMessage: 'Categories',
	},
	timeTargeting: {
		id: `${scope}.timeTargeting`,
		defaultMessage: 'Time targeting',
	},
	deviceType: {
		id: `${scope}.typeDevices`,
		defaultMessage: 'Devices',
	},
	osType: {
		id: `${scope}.OS`,
		defaultMessage: 'OS',
	},
	browserType: {
		id: `${scope}.browser`,
		defaultMessage: 'Browser',
	},
	SSP: {
		id: `${scope}.SSP`,
		defaultMessage: 'Block ad networks',
	},
	frequency: {
		id: `${scope}.frequency`,
		defaultMessage: 'Frequency in last 24 hours',
	},
	targetCounter: {
		id: `${scope}.targetCounter`,
		defaultMessage: 'Select target counter',
	},
	addEmail: {
		id: `${scope}.addEmail`,
		defaultMessage: 'Add more email',
	},
	emails: {
		id: `${scope}.emails`,
		defaultMessage: 'Email #{number}',
	},
	email: {
		id: `${scope}.email`,
		defaultMessage: 'Email (for notifications)',
	},
	timezone: {
		id: `${scope}.timezone`,
		defaultMessage: 'Timezone',
	},
	stopAdvertising: {
		id: `${scope}.stopAdvertising`,
		defaultMessage: 'Stop advertising if the site is not available for more than 3 minutes in a row.',
	},
	placement: {
		id: `${scope}.showPosition`,
		defaultMessage: 'Show position',
	},
	searchNewAudience: {
		id: `${scope}.searchNewAudience`,
		defaultMessage: 'Search new audience',
	},
	retargetingCampaign: {
		id: `${scope}.retargetingCampaign`,
		defaultMessage: 'Retargeting сampaign',
	},
	typeOfAudience: {
		id: `${scope}.typeOfAudience`,
		defaultMessage: 'Type of audience',
	},
	gender: {
		id: `${scope}.gender`,
		defaultMessage: 'Gender',
	},
	ageGroup: {
		id: `${scope}.age`,
		defaultMessage: 'Age',
	},
	man: {
		id: `${scope}.male`,
		defaultMessage: 'Man',
	},
	woman: {
		id: `${scope}.female`,
		defaultMessage: 'Woman',
	},
	devices: {
		id: `${scope}.devices`,
		defaultMessage: 'Placements',
	},
	audience: {
		id: `${scope}.audience`,
		defaultMessage: 'Audience',
	},
	target: {
		id: `${scope}.target`,
		defaultMessage: 'Target',
	},
	addCreative: {
		id: `${scope}.addCreative`,
		defaultMessage: 'Add creative',
	},
	reports: {
		id: `${scope}.reports`,
		defaultMessage: 'Reports',
	},
	blacklist: {
		id: `${scope}.blacklist`,
		defaultMessage: 'Blacklist',
	},
	whitelist: {
		id: `${scope}.whitelist`,
		defaultMessage: 'Whitelist',
	},
	mainInfo: {
		id: `${scope}.mainInfo`,
		defaultMessage: 'General settings',
	},
	textTotalBudget: {
		id: `${scope}.textTotalBudget`,
		defaultMessage: 'Minimal budget $100',
	},
	textDailyBudget: {
		id: `${scope}.textDailyBudget`,
		defaultMessage: 'If empty, then no limit.',
	},
	creatives: {
		id: `${scope}.creatives`,
		defaultMessage: 'Creatives',
	},
	error: {
		id: `${scope}.error`,
		defaultMessage: 'Error',
	},
	budgetDistribution: {
		id: `${scope}.budgetDistribution`,
		defaultMessage: 'Budget  distribution',
	},
	language: {
		id: `${scope}.language`,
		defaultMessage: 'Language',
	},
	directDeals: {
		id: `${scope}.directDeals`,
		defaultMessage: 'Direct deals',
	},
	domainList: {
		id: `${scope}.domainList`,
		defaultMessage: 'Domain List',
	},
	domainExample: {
		id: `${scope}.domainExample`,
		defaultMessage: 'Example: ubex.com, *.ubex.com, desk.ubex.com',
	},
	toModeration: {
		id: `${scope}.toModeration`,
		defaultMessage: 'To moderation',
	},
	seeCampaignHeader: {
		id: `${scope}.seeCampaignHeader`,
		defaultMessage: 'See campaign',
	},
	filter: {
		id: `${scope}.filter`,
		defaultMessage: 'Filter',
	},
	all: {
		id: `${scope}.all`,
		defaultMessage: 'All positions',
	},
	advertiserDomain: {
		id: `${scope}.advertiserDomain`,
		defaultMessage: 'Advertiser Domain',
	},
	advertiserDomainExample: {
		id: `${scope}.advertiserDomainExample`,
		defaultMessage: 'Example: ubex.com',
	},
	details: {
		id: `${scope}.campaignDetails`,
		defaultMessage: 'Details',
	},
	generalPopover: {
		id: `${scope}.generalPopover`,
		defaultMessage: 'General settings',
	},
	generalPopoverText: {
		id: `${scope}.generalPopoverText`,
		defaultMessage:
			'To start an advertising campaign, fill in all the form fields. If you want to squeeze maximum efficiency, we recommend you to input as much detail as possible.\n' +
			'\n' +
			'Campaign Name\n' +
			"Check the name of your newly creating campaign. For example: Children's toys 24-55, China.\n" +
			'Type of desired audience\n' +
			'Select a campaign type - Start engagement with new audience or roll out a retargeting campaign - reach out to your audience for repetitive sales.\n' +
			'Advertising strategy\n' +
			'Select the type of advertising you are interested in depending on your goals.\n' +
			'24 hour display frequency\n' +
			'Specify how many times we are eligible to display your ad to one user. For example: 5.\n' +
			'Advertising time\n' +
			'Specify the date and time of the beginning and end of the advertising campaign. If you wish the campaign not to stop running, leave the field "End Date" empty.\n' +
			'Budget and Daily Budget\n' +
			'Indicate how much you want to spend on an advertising campaign, total or per day. If there are no restrictions, leave the fields blank.\n' +
			'Views and Daily Views\n' +
			'Indicate how many impressions your ad should get, total or per day. If there are no restrictions, leave the fields blank.\n' +
			'Show position\n' +
			'Specify where to show your banners. At the top of the page in the visible part or below on the second scroll screen. Choose "default" if you want the system to decide how it will be better.',
	},
	allGenders: {
		id: `${scope}.allGenders`,
		defaultMessage: 'All genders',
	},
	allLanguages: {
		id: `${scope}.allLanguages`,
		defaultMessage: 'All languages',
	},
	allAges: {
		id: `${scope}.allAges`,
		defaultMessage: 'All ages',
	},
	allDevices: {
		id: `${scope}.allDevices`,
		defaultMessage: 'All devices',
	},
	allOS: {
		id: `${scope}.allOS`,
		defaultMessage: 'All OS',
	},
	allBrowsers: {
		id: `${scope}.allBrowsers`,
		defaultMessage: 'All browsers',
	},
	select: {
		id: `${scope}.select`,
		defaultMessage: 'Select',
	},
});
