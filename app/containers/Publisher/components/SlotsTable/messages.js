/*
 * SlotsTable Messages
 *
 * This contains all the text for the SlotsTable component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SlotsTable';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the SlotsTable component!',
	},
	name: {
		id: `${scope}.name`,
		defaultMessage: 'Name',
	},
	price: {
		id: `${scope}.price`,
		defaultMessage: 'Price',
	},
	size: {
		id: `${scope}.size`,
		defaultMessage: 'Size',
	},
	details: {
		id: `${scope}.details`,
		defaultMessage: 'Details',
	},
	status: {
		id: `${scope}.status`,
		defaultMessage: 'Statius',
	},
	priceCPM: {
		id: `${scope}.priceCPM`,
		defaultMessage: 'Price (CPM)',
	},
	dateOfChange: {
		id: `${scope}.dateOfChange`,
		defaultMessage: 'Date of change',
	},
	settings: {
		id: `${scope}.settings`,
		defaultMessage: 'Settings',
	},
});
