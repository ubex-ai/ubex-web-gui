/*
 * BankTransferModal Messages
 *
 * This contains all the text for the BankTransferModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.BankTransferModal';

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
		defaultMessage: 'Attention! The minimum amount of replenishment is $10.',
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
	selectPayment: {
		id: `${scope}.selectPayment`,
		defaultMessage: 'Select payment',
	},
	cards: {
		id: `${scope}.cards`,
		defaultMessage: 'Credit card',
	},
	crypto: {
		id: `${scope}.crypto`,
		defaultMessage: 'Cryptocurrency',
	},
	createInvoice: {
		id: `${scope}.createInvoice`,
		defaultMessage: 'Create invoice',
	},
	email: {
		id: `${scope}.email`,
		defaultMessage: 'Email',
	},
	phone: {
		id: `${scope}.phone`,
		defaultMessage: 'Phone number',
	},
	companyName: {
		id: `${scope}.companyName`,
		defaultMessage: 'Company name',
	},
	directorName: {
		id: `${scope}.directorName`,
		defaultMessage: 'Local Director Name of the Customer',
	},
	residenceAddress: {
		id: `${scope}.residenceAddress`,
		defaultMessage: 'Residence Address of the Customer’s Director',
	},
	zip: {
		id: `${scope}.zip`,
		defaultMessage: 'ZIP',
	},
	city: {
		id: `${scope}.city`,
		defaultMessage: 'City',
	},
	countries: {
		id: `${scope}.countries`,
		defaultMessage: 'Country',
	},
});
