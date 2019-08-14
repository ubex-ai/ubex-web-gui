/*
 * DashboardInner Messages
 *
 * This contains all the text for the DashboardInner container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.common';

export default defineMessages({
	week: {
		id: `${scope}.week`,
		defaultMessage: 'Week',
	},
	month: {
		id: `${scope}.month`,
		defaultMessage: 'Month',
	},
	year: {
		id: `${scope}.year`,
		defaultMessage: 'Year',
	},
	alltime: {
		id: `${scope}.alltime`,
		defaultMessage: 'All time',
	},
	or: {
		id: `${scope}.or`,
		defaultMessage: 'or',
	},
	allGroups: {
		id: `${scope}.allGroups`,
		defaultMessage: 'All groups',
	},
	allCounters: {
		id: `${scope}.allCounters`,
		defaultMessage: 'All counters',
	},
	allInventories: {
		id: `${scope}.allInventories`,
		defaultMessage: 'All inventories',
	},
	allCampaigns: {
		id: `${scope}.allCampaigns`,
		defaultMessage: 'All campaigns',
	},
});
