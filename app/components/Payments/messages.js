/*
 * DashboardInner Messages
 *
 * This contains all the text for the DashboardInner container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Payments';

export default defineMessages({
	accountbalance: {
		id: `${scope}.accountbalance`,
		defaultMessage: 'Account balance',
	},
	getBenefit: {
		id: `${scope}.pay.getBenefit`,
		defaultMessage: 'Benefits of paying with UBEX',
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
	depositamount: {
		id: `${scope}.depositamount`,
		defaultMessage: 'Enter the deposit amount',
	},
	amount: {
		id: `${scope}.amount`,
		defaultMessage: 'Amount',
	},
	pay: {
		id: `${scope}.pay`,
		defaultMessage: 'Deposit',
	},
	payattention: {
		id: `${scope}.payattention`,
		defaultMessage: 'Attention! The minimum amount of replenishment is $500.',
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
});
