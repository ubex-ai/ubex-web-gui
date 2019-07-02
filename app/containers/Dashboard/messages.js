/*
 * DashboardInner Messages
 *
 * This contains all the text for the DashboardInner container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Dashboard';

export default defineMessages({
	revenuePerDay: {
		id: `${scope}.revenuePerDay`,
		defaultMessage: 'Revenue per day',
	},
	uniqVisitorsReward: {
		id: `${scope}.uniqVisitorsReward`,
		defaultMessage: 'Unique visitor reward',
	},
	unpaidBalance: {
		id: `${scope}.unpaidBalance`,
		defaultMessage: 'Unpaid balance',
	},
	averageProfitability: {
		id: `${scope}.averageProfitability`,
		defaultMessage: 'Average Profitability',
	},
	dataMiningHeader: {
		id: `${scope}.dataMiningHeader`,
		defaultMessage: 'Data mining dashboard',
	},
	workersOnline: {
		id: `${scope}.workersOnline`,
		defaultMessage: 'CounterForm on-line',
	},
	addWorker: {
		id: `${scope}.addWorker`,
		defaultMessage: 'Add worker',
	},
	nextPayout: {
		id: `${scope}.nextPayout`,
		defaultMessage: 'Next Payout',
	},
	profitability: {
		id: `${scope}.profitability`,
		defaultMessage: 'Profitability',
	},
	topWorkers: {
		id: `${scope}.topWorkers`,
		defaultMessage: 'Top workers',
	},
	visitorsStatistics: {
		id: `${scope}.visitorsStatistics`,
		defaultMessage: "Visitor's Statistics",
	},

});
