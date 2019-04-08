/*
 * AddInventoryForm Messages
 *
 * This contains all the text for the AddSlotForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SlotForm';

export default defineMessages({
	codeHeader: {
		id: `${scope}.code`,
		defaultMessage: 'Slot code',
	},
	optimal_floor_price: {
		id: `${scope}.optimal_floor_price`,
		defaultMessage: 'Optimal Floor Price',
	},
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the SlotForm component!',
	},
	siteName: {
		id: `${scope}.counterForm.name`,
		defaultMessage: 'Name',
	},
	mainDomain: {
		id: `${scope}.mainDomain`,
		defaultMessage: 'Domain #1',
	},
	blockedDomain: {
		id: `${scope}.blockedDomain`,
		defaultMessage: 'Blocked Domain #1',
	},
	domain: {
		id: `${scope}.counterForm.domain`,
		defaultMessage: 'Domain',
	},
	domainAlias: {
		id: `${scope}.counterForm.domainAlias`,
		defaultMessage: 'Domain alias #{number}',
	},
	addSubDomain: {
		id: `${scope}.counterForm.addSubDomain`,
		defaultMessage: 'Add subdomain',
	},
	addAlias: {
		id: `${scope}.counterForm.addAlias`,
		defaultMessage: 'Add alias',
	},
	categories: {
		id: `${scope}.counterForm.categories`,
		defaultMessage: 'Categories',
	},
	addDomain: {
		id: `${scope}.counterForm.addDomain`,
		defaultMessage: 'Add domain',
	},
	position: {
		id: `${scope}.counterForm.position`,
		defaultMessage: 'Position',
	},
	devices: {
		id: `${scope}.counterForm.sizdeviceses`,
		defaultMessage: 'Devices',
	},
	sizes: {
		id: `${scope}.counterForm.sizes`,
		defaultMessage: 'Sizes',
	},
	width: {
		id: `${scope}.counterForm.width`,
		defaultMessage: 'Width',
	},
	height: {
		id: `${scope}.counterForm.height`,
		defaultMessage: 'Height',
	},
	floor_price_cpm: {
		id: `${scope}.counterForm.floor_price_cpm`,
		defaultMessage: 'Floor Price (CPM)',
	},
	country: {
		id: `${scope}.counterForm.country`,
		defaultMessage: 'Country for display',
	},
	BPA: {
		id: `${scope}.counterForm.BPA`,
		defaultMessage: 'Blocked placement atrritube',
	},
	back_fill: {
		id: `${scope}.counterForm.backfill`,
		defaultMessage: 'Back fill (optional)',
	},
	not_exact_size: {
		id: `${scope}.counterForm.not_exact_size`,
		defaultMessage: 'Serve All Acceptable',
	},
	blockedCategory: {
		id: `${scope}.counterForm.blockedCategory`,
		defaultMessage: 'Blocked category',
	},
	PC: {
		id: `${scope}.counterForm.PC`,
		defaultMessage: 'PC',
	},
	mobile: {
		id: `${scope}.counterForm.mobile`,
		defaultMessage: 'Mobile',
	},
	tablet: {
		id: `${scope}.counterForm.tablet`,
		defaultMessage: 'Tablet',
	},
	editSlotHeader: {
		id: `${scope}.counterForm.editSlotHeader`,
		defaultMessage: 'Edit slot',
	},
	addSlotHeader: {
		id: `${scope}.counterForm.addSlotHeader`,
		defaultMessage: 'Add Web slot',
	},
	blackList: {
		id: `${scope}.counterForm.blackList`,
		defaultMessage: 'Black list',
	},
	instructionsText: {
		id: `${scope}.counterForm.help.instructionsText`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Creating a slot.\n' +
			'To create an advertising slot for your site. fill out the form below.</p>\n' +
			'<dt>Slot name</dt><dd>the name of your slot in a convenient form. For example, banner 728 in footer.</dd>\n' +
			'<dt>Devices</dt><dd>specify for which types of devices you would like to show it. If you want to show ads in adaptive interfaces, you need to create a separate slot for each type of device.</dd>\n' +
			'<dt>Position</dt><dd>specify where your slot will be.</dd>\n' +
			'<dt>Size</dt><dd>select from the list the option of the size of advertising space. If you allow us to show ads of a different size in this slot (no problems with layout). Check the "Show different ad formats" box and specify the maximum slot parameters.</dd>\n' +
			'<dt>Floor Price (CPM)</dt><dd>set the minimum CPM manually or let us dynamically determine the optimal minimum price for the placement by setting the corresponding checkbox "Show at the best price"</dd>\n' +
			'<dt>Back fill</dt><dd>tag is an optional tag that can be used if the placement is not filled. We can display your tag from this field there.</dd>\n' +
			'<h2>Black list</h2>\n' +
			'<p>If you do not want for any reason to display ads from certain sources or specific topics, please indicate your desire in the form below.</p>\n' +
			'<dt>Block categories</dt><dd>select which categories of ads should not be shown in this slot.</dd>\n' +
			'<dt>Blocked attributes</dt><dd>which attributes do not show in your slot.</dd>',
	},
	instructionsTextBundle: {
		id: `${scope}.counterForm.help.instructionsTextBundle`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Creating a slot.\n' +
			'To create an advertising slot for your site. fill out the form below.</p>\n' +
			'<dt>Slot name</dt><dd>the name of your slot in a convenient form. For example, banner 728 in footer.</dd>\n' +
			'<dt>Position</dt><dd>specify where your slot will be.</dd>\n' +
			'<dt>Size</dt><dd>select from the list the option of the size of advertising space. If you allow us to show ads of a different size in this slot (no problems with layout). Check the "Show different ad formats" box and specify the maximum slot parameters.</dd>\n' +
			'<dt>Floor Price (CPM)</dt><dd>set the minimum CPM manually or let us dynamically determine the optimal minimum price for the placement by setting the corresponding checkbox "Show at the best price"</dd>\n' +
			'<dt>Back fill</dt><dd>tag is an optional tag that can be used if the placement is not filled. We can display your tag from this field there.</dd>\n' +
			'<h2>Black list</h2>\n' +
			'<p>If you do not want for any reason to display ads from certain sources or specific topics, please indicate your desire in the form below.</p>\n' +
			'<dt>Block categories</dt><dd>select which categories of ads should not be shown in this slot.</dd>\n' +
			'<dt>Blocked attributes</dt><dd>which attributes do not show in your slot.</dd>',
	},
	addMobileSlotHeader: {
		id: `${scope}.counterForm.addMobileSlotHeader`,
		defaultMessage: 'Add Mobile slot',
	},
});
