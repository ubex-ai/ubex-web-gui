/*
 * AddInventoryForm Messages
 *
 * This contains all the text for the AddInventoryForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.InventoryForm';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the InventoryForm component!',
	},
	siteName: {
		id: `${scope}.siteName`,
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
		id: `${scope}.inventoryForm.domain`,
		defaultMessage: 'Domain',
	},
	bundleId: {
		id: `${scope}.inventoryForm.bundleId`,
		defaultMessage: 'Bundle ID',
	},
	domainAlias: {
		id: `${scope}.inventoryForm.domainAlias`,
		defaultMessage: 'Domain alias #{number}',
	},
	blockedDomainAlias: {
		id: `${scope}.inventoryForm.blockedDomainAlias`,
		defaultMessage: 'Blocked domain alias #{number}',
	},
	addSubDomain: {
		id: `${scope}.inventoryForm.addSubDomain`,
		defaultMessage: 'Add subdomain',
	},
	addAlias: {
		id: `${scope}.inventoryForm.addAlias`,
		defaultMessage: 'Add alias',
	},
	categories: {
		id: `${scope}.inventoryForm.categories`,
		defaultMessage: 'Categories',
	},
	addDomain: {
		id: `${scope}.inventoryForm.addDomain`,
		defaultMessage: 'Add domain',
	},
	language: {
		id: `${scope}.inventoryForm.language`,
		defaultMessage: 'Language',
	},
	inventory_id: {
		id: `${scope}.inventoryForm.inventory_id`,
		defaultMessage: 'Domain or bundle id',
	},
	inventory_id_site: {
		id: `${scope}.inventoryForm.inventory_id_site`,
		defaultMessage: 'Domain',
	},
	inventory_id_sdk: {
		id: `${scope}.inventoryForm.inventory_id_sdk`,
		defaultMessage: 'Bundle id',
	},
	blockedCategories: {
		id: `${scope}.inventoryForm.blockedCategories`,
		defaultMessage: 'Blocked categories',
	},
	blockedDSP: {
		id: `${scope}.inventoryForm.blockedDSP`,
		defaultMessage: 'Blocked DSP',
	},
	instructionsText: {
		id: `${scope}.inventoryForm.help.instructionsText`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Add site.\n' +
			'Fill in all fields of the form.</p>\n' +
			"<dt>Site name</dt><dd>the name of your site in a convenient form. For example, the site about children's toys.</dd>\n" +
			'<dt>Domain</dt><dd>the domain of your site. For example, https://ubex.com</dd>\n' +
			'<dt>Aliases</dt><dd>if you have more than one domain, specify here all the domains of this site, so that we show ads on these resources.</dd>\n' +
			'<dt>Language</dt><dd>specify the main language of the site.</dd>\n' +
			'<h2>Black list</h2>\n' +
			'<p>If you do not want for any reason to display ads from certain sources or specific topics, please indicate your desire in the form below.</p>\n' +
			'<dt>Block categories</dt><dd>choose which categories of ads should not be shown on your site.</dd>\n' +
			'<dt>Blocked networks</dt><dd>Choose which ad networks will not be allowed to appear on your site.</dd>',
	},
	editSiteHeader: {
		id: `${scope}.editSiteHeader`,
		defaultMessage: 'Edit site',
	},
	addSiteHeader: {
		id: `${scope}.addSiteHeader`,
		defaultMessage: 'Add site',
	},
	platforms: {
		id: `${scope}.platforms`,
		defaultMessage: 'Mobile platform',
	},
	instructionsTextBundle: {
		id: `${scope}.inventoryForm.help.instructionsTextBundle`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Add site.\n' +
			'Fill in all fields of the form.</p>\n' +
			"<dt>Site name</dt><dd>the name of your site in a convenient form. For example, the site about children's toys.</dd>\n" +
			'<dt>Bundle ID</dt><dd>the Bundle ID of your App. For example, com.ubex.application</dd>\n' +
			'<dt>Language</dt><dd>specify the main language of the site.</dd>\n' +
			'<h2>Black list</h2>\n' +
			'<p>If you do not want for any reason to display ads from certain sources or specific topics, please indicate your desire in the form below.</p>\n' +
			'<dt>Block categories</dt><dd>choose which categories of ads should not be shown on your site.</dd>\n' +
			'<dt>Blocked networks</dt><dd>Choose which ad networks will not be allowed to appear on your site.</dd>',
	},
	addBundleHeader: {
		id: `${scope}.addBundleHeader`,
		defaultMessage: 'Add bundle',
	},
});
