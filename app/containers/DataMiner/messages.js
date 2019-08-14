/*
 * DataMiner Messages
 *
 * This contains all the text for the DataMiner container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.DataMiner';

export default defineMessages({
	siteName: {
		id: `${scope}.counterForm.siteName`,
		defaultMessage: 'Site name',
	},
	addSubDomain: {
		id: `${scope}.counterForm.addSubDomain`,
		defaultMessage: 'Add subdomain',
	},
	addAlias: {
		id: `${scope}.counterForm.addAlias`,
		defaultMessage: 'Add alias',
	},
	faqHeader: {
		id: `${scope}.counterForm.faqHeader`,
		defaultMessage: 'FAQ',
	},
	counterCode: {
		id: `${scope}.counterForm.counterCode`,
		defaultMessage: 'Counter code',
	},
	counterDescription: {
		id: `${scope}.counterForm.counterDescription`,
		defaultMessage: `Copy and paste the code into the HTML template of your website. The code should be allocated in between of the
		<pre><code>&lt;head&gt;&lt;/head&gt;</code></pre>
		and
		<pre><code>&lt;body&gt;&lt;/body&gt;</code></pre>
		tags.
Set the code as close to the top of the page as possible so that it gets loaded withing the shortest time period.  In case of using Google Tag Manager, create a new Custom HTML tag and put our counter code snippet into it. Don't forget to check the "All pages" trigger.`,
	},
	domain: {
		id: `${scope}.counterForm.domain`,
		defaultMessage: 'Domain',
	},
	domainAlias: {
		id: `${scope}.counterForm.domainAlias`,
		defaultMessage: 'Domain alias #{number}',
	},
	region: {
		id: `${scope}.counterForm.region`,
		defaultMessage: 'Region',
	},
	timezone: {
		id: `${scope}.counterForm.timezone`,
		defaultMessage: 'Timezone',
	},
	category: {
		id: `${scope}.counterForm.category`,
		defaultMessage: 'Category',
	},
	categories: {
		id: `${scope}.counterForm.categories`,
		defaultMessage: 'Categories',
	},
	agreement: {
		id: `${scope}.counterForm.agreement`,
		defaultMessage: 'Accept data from all subdomains',
	},
	agreement2: {
		id: `${scope}.counterForm.agreement2`,
		defaultMessage:
			'I accept <a href="https://static.ubex.io/legal/agreement.pdf" target="_blank">Terms of Use</a> and <a href="https://static.ubex.io/legal/policy.pdf" target="_blank">Privacy Policy</a> of the service',
	},
	agreement3: {
		id: `${scope}.counterForm.agreement3`,
		defaultMessage:
			'I wish Ubex to keep IP address of my website or mobile app visitors anonymized (applicable for the websites dealing with EU and Switzerland citizens)',
	},
	DataMiningHeader: {
		id: `${scope}.DataMiningHeader`,
		defaultMessage: 'Data Mining Dashboard',
	},
	AddCounterHeader: {
		id: `${scope}.AddCounterHeader`,
		defaultMessage: 'Add counter',
	},
	EditCounterHeader: {
		id: `${scope}.EditCounterHeader`,
		defaultMessage: 'Edit counter',
	},
	revenueThisDay: {
		id: `${scope}.revenueThisDay`,
		defaultMessage: 'Revenue per day',
	},
	uniqVisitorsReward: {
		id: `${scope}.uniqVisitorsReward`,
		defaultMessage: 'Unique visitor reward',
	},
	countersListHeader: {
		id: `${scope}.countersListHeader`,
		defaultMessage: 'Counter list',
	},
	uniqueVisitors: {
		id: `${scope}.uniqueVisitors`,
		defaultMessage: 'Unique visitors',
	},
	unpaidBalance: {
		id: `${scope}.unpaidBalance`,
		defaultMessage: 'Unpaid balance',
	},
	averageRevenue: {
		id: `${scope}.averageRevenue`,
		defaultMessage: 'Average revenue',
	},
	dataMiningHeader: {
		id: `${scope}.dataMiningHeader`,
		defaultMessage: 'Data mining dashboard',
	},
	countersOnline: {
		id: `${scope}.countersOnline`,
		defaultMessage: 'Counters on-line',
	},
	addCounter: {
		id: `${scope}.addCounter`,
		defaultMessage: 'Add counter',
	},
	counterHeader: {
		id: `${scope}.counterHeader`,
		defaultMessage: 'Counter list',
	},
	nextPayout: {
		id: `${scope}.nextPayout`,
		defaultMessage: 'Next Payout',
	},
	revenue: {
		id: `${scope}.revenue`,
		defaultMessage: 'Revenue',
	},
	topCounters: {
		id: `${scope}.topCounters`,
		defaultMessage: 'Top counters',
	},
	visitorsStatistics: {
		id: `${scope}.visitorsStatistics`,
		defaultMessage: "Visitor's Statistics",
	},
	accountbalance: {
		id: `${scope}.accountbalance`,
		defaultMessage: 'Account balance',
	},
	visitors: {
		id: `${scope}.visitors`,
		defaultMessage: 'Visitors',
	},
	regions: {
		id: `${scope}.regions`,
		defaultMessage: 'Regions',
	},
	devices: {
		id: `${scope}.devices`,
		defaultMessage: 'Devices',
	},
	channel: {
		id: `${scope}.channel`,
		defaultMessage: 'Channel',
	},
	profitCounters: {
		id: `${scope}.profitCounters`,
		defaultMessage: 'Profitability counters',
	},
	warning: {
		id: `${scope}.warning`,
		defaultMessage: 'Warning',
	},
	warningtext: {
		id: `${scope}.warningtext`,
		defaultMessage: 'Warning: data mining platform is running in test mode',
	},
	depositamount: {
		id: `${scope}.depositamount`,
		defaultMessage: 'Enter the deposit amount',
	},
	pay: {
		id: `${scope}.pay`,
		defaultMessage: 'Pay',
	},
	amount: {
		id: `${scope}.amount`,
		defaultMessage: 'Amount',
	},
	payattention: {
		id: `${scope}.payattention`,
		defaultMessage: 'Attention! The minimum amount of replenishment is $ 500.',
	},
	payannotation: {
		id: `${scope}.payannotation`,
		defaultMessage: "To deposit funds to the advertiser's personal account balance:",
	},
	payannotation1: {
		id: `${scope}.payannotation1`,
		defaultMessage: 'Choose a convenient payment method',
	},
	payannotation2: {
		id: `${scope}.payannotation2`,
		defaultMessage: 'Enter the amount to replenish and click on Pay',
	},
	payannotation3: {
		id: `${scope}.payannotation3`,
		defaultMessage: 'Follow the system prompts for payment',
	},
	day: {
		id: `${scope}.day`,
		defaultMessage: 'day',
	},
	paymentsHistory: {
		id: `${scope}.paymentsHistory`,
		defaultMessage: 'Payments history',
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
	visitorsPopover: {
		id: `${scope}.popover.visitorsPopover`,
		defaultMessage: 'Visitors',
	},
	visitorsPopoverText: {
		id: `${scope}.popover.visitorsPopoverText`,
		defaultMessage: 'The number of visitors to your site for the selected period of time..',
	},
	profitabilityPopover: {
		id: `${scope}.popover.profitabilityPopover`,
		defaultMessage: 'Revenue',
	},
	profitabilityPopoverText: {
		id: `${scope}.popover.profitabilityPopoverText`,
		defaultMessage: 'Your daily profitability relative to the selected filter.',
	},
	unpaidBalancePopover: {
		id: `${scope}.popover.unpaidBalancePopover`,
		defaultMessage: 'Unpaid balance',
	},
	unpaidBalancePopoverText: {
		id: `${scope}.popover.unpaidBalancePopoverText`,
		defaultMessage: 'Amount of unpaid tokens on your balance.',
	},
	averageProfitabilityPopover: {
		id: `${scope}.popover.averageProfitabilityPopover`,
		defaultMessage: 'Average profitability',
	},
	averageProfitabilityPopoverText: {
		id: `${scope}.popover.averageProfitabilityPopoverText`,
		defaultMessage: 'The average reward for the selected time period.',
	},
	channelPopover: {
		id: `${scope}.popover.channelPopover`,
		defaultMessage: 'Channel',
	},
	channelPopoverText: {
		id: `${scope}.popover.channelPopoverText`,
		defaultMessage: 'The graph shows from which channels the traffic comes to you and how much of it is paid.',
	},
	topCountersPopover: {
		id: `${scope}.popover.topCountersPopover`,
		defaultMessage: 'Top counters',
	},
	topCountersPopoverText: {
		id: `${scope}.popover.topCountersPopoverText`,
		defaultMessage: 'The most popular sites in yield terms for the selected period of time.',
	},
	visitorsCountriesPopover: {
		id: `${scope}.popover.visitorsCountriesPopover`,
		defaultMessage: "Visitor's Statistics",
	},
	visitorsCountriesPopoverText: {
		id: `${scope}.popover.visitorsCountriesPopoverText`,
		defaultMessage: 'Your visitors by country.',
	},
	devicesPopover: {
		id: `${scope}.popover.devicesPopover`,
		defaultMessage: 'Devices (Reward)',
	},
	devicesPopoverText: {
		id: `${scope}.popover.devicesPopoverText`,
		defaultMessage: 'The most profitable devices.',
	},
	nextPayoutPopover: {
		id: `${scope}.popover.nextPayoutPopover`,
		defaultMessage: 'Next Payout',
	},
	nextPayoutPopoverText: {
		id: `${scope}.popover.nextPayoutPopoverText`,
		defaultMessage: 'The date of the next payment of funds accumulated on the balance of the data miner.',
	},
	onlineCountersPopover: {
		id: `${scope}.popover.onlineCountersPopover`,
		defaultMessage: 'Counters online',
	},
	onlineCountersPopoverText: {
		id: `${scope}.popover.onlineCountersPopoverText`,
		defaultMessage: 'Shows how many sites have been added to the system and from how many counters we have received data over the last 3 hours',
	},
	makeFirstCounter: {
		id: `${scope}.makeFirstCounter`,
		defaultMessage: 'Create your first counter',
	},
	code: {
		id: `${scope}.code`,
		defaultMessage: 'Code',
	},
	getBenefit: {
		id: `${scope}.pay.getBenefit`,
		defaultMessage: 'Get the benefit by paying UBEX',
	},
	bonus5: {
		id: `${scope}.pay.bonus5`,
		defaultMessage: 'Bonus 5% on ad impressions',
	},
	noCommission: {
		id: `${scope}.pay.noCommission`,
		defaultMessage: 'No commission',
	},
	crossBorderPayments: {
		id: `${scope}.pay.crossBorderPayments`,
		defaultMessage: 'Cross-Border Payments',
	},
	deferredPayment: {
		id: `${scope}.pay.deferredPayment`,
		defaultMessage: 'Deferred payment',
	},
	remove: {
		id: `${scope}.remove`,
		defaultMessage: 'Remove?',
	},
	counterId: {
		id: `${scope}.Table.counterId`,
		defaultMessage: 'Counter ID',
	},
	createdAt: {
		id: `${scope}.Table.createdAt`,
		defaultMessage: 'Created At',
	},
	visitorsTable: {
		id: `${scope}.Table.visitorsTable`,
		defaultMessage: 'Visitors',
	},
	paidPercent: {
		id: `${scope}.Table.paidPercent`,
		defaultMessage: 'Paid %',
	},
	status: {
		id: `${scope}.Table.status`,
		defaultMessage: 'Status',
	},
	name: {
		id: `${scope}.Table.name`,
		defaultMessage: 'Name',
	},
	paidVisitors: {
		id: `${scope}.Table.paidVisitors`,
		defaultMessage: 'Paid visitors',
	},
	rewardVisitors: {
		id: `${scope}.Table.rewardVisitors`,
		defaultMessage: 'Reward visitors',
	},
	counter: {
		id: `${scope}.Table.counter`,
		defaultMessage: 'Counter',
	},
	date: {
		id: `${scope}.Table.date`,
		defaultMessage: 'Date',
	},
	channels: {
		id: `${scope}.Table.channels`,
		defaultMessage: 'Channel',
	},
	attentionCounter: {
		id: `${scope}.attentionCounter`,
		defaultMessage:
			'<strong>ATTENTION!</strong>' +
			" <span>Please add only websites that considered valid according to the Publisher's Agreement. The websites that break accepted policies will not pass moderation and application will be revoked.</span>",
	},
	balanceDollar: {
		id: `${scope}.balanceDollar`,
		defaultMessage: 'Balance Dollar USA',
	},
	availableToken: {
		id: `${scope}.availableToken`,
		defaultMessage: 'Available UBEX tokens',
	},
	seeContractCode: {
		id: `${scope}.seeContractCode`,
		defaultMessage: 'See our contract code',
	},
	paymentContract: {
		id: `${scope}.paymentContract`,
		defaultMessage: 'Your payments in contract',
	},
	time: {
		id: `${scope}.TablePayment.time`,
		defaultMessage: 'Time',
	},
	method: {
		id: `${scope}.TablePayment.method`,
		defaultMessage: 'Method',
	},
	amountTablePayment: {
		id: `${scope}.TablePayment.amountTablePayment`,
		defaultMessage: 'Amount',
	},
});
