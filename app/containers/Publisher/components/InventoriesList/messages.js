/*
 * SlotsListDesktop Messages
 *
 * This contains all the text for the SlotsListDesktop component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.InventoriesList';

export default defineMessages({
	webInventoriesList: {
		id: `${scope}.webInventoriesList`,
		defaultMessage: 'Web inventories list',
	},
	sdkInventoriesList: {
		id: `${scope}.sdkInventoriesList`,
		defaultMessage: 'SDK inventories list',
	},
	addWebInventory: {
		id: `${scope}.addWebInventory`,
		defaultMessage: 'Add site',
	},
	addSdkInventory: {
		id: `${scope}.addSdkInventory`,
		defaultMessage: 'Add bundle',
	},
	onModeration: {
		id: `${scope}.onModeration`,
		defaultMessage:
			'Your site is moderating. Approximate waiting time is 5-6 hours. You can create advertising slots and customize on site.',
	},
	addSlot: {
		id: `${scope}.addSlot`,
		defaultMessage: 'Add slot',
	},
	remove: {
		id: `${scope}.remove`,
		defaultMessage: 'Are you sure you want to remove inventory?',
	},
	confirm: {
		id: `${scope}.confirm`,
		defaultMessage: 'Confirm',
	},
	code: {
		id: `${scope}.code`,
		defaultMessage: 'Code',
	},
});
