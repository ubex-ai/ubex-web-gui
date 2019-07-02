/*
 * Developers Messages
 *
 * This contains all the text for the Developers component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Developers';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'Developers',
	},
	company: {
		id: `${scope}.company`,
		defaultMessage: 'Company',
	},
	region: {
		id: `${scope}.region`,
		defaultMessage: 'Region',
	},
	email: {
		id: `${scope}.email`,
		defaultMessage: 'Email',
	},
	phone: {
		id: `${scope}.phone`,
		defaultMessage: 'Phone number',
	},
	sspWelcome: {
		id: `${scope}.sspWelcome`,
		defaultMessage: 'SSP welcome to UBEX!',
	},
	developersText: {
		id: `${scope}.developersText`,
		defaultMessage: 'The Ubex project invites all SSP networks around the world to join the revolutionary\n' +
			'programmatic advertising platform and cooperate on profitable terms as never before.\n' +
			'<br />\n' +
			'<br />\n' +
			'The Ubex platform is a decentralized advertising exchange working on the blockchain with\n' +
			'the application of programmatic algorithms aimed at providing intermediary-free\n' +
			'advertising placement on a variety of online channels with unprecedented targeting\n' +
			'accuracy through the use of AI and neural networks. Ubex welcomes all SSP networks to\n' +
			'join the platform and take advantage of its unique product offering.\n' +
			'<br />\n' +
			'<br /> More detailed information on integration and step-by-step instructions can be\n' +
			'found in manual.\n' +
			'<br />\n' +
			'<br />',
	},
	downloadManual: {
		id: `${scope}.downloadManual`,
		defaultMessage: 'Download manual',
	},
	openPlatform: {
		id: `${scope}.openPlatform`,
		defaultMessage: 'Open platform',
	},
	targeting: {
		id: `${scope}.targeting`,
		defaultMessage: 'Targeting for any tasks',
	},
	makeMoney: {
		id: `${scope}.makeMoney`,
		defaultMessage: 'Make money together',
	},
	contactUs: {
		id: `${scope}.contactUs`,
		defaultMessage: 'Contact Us',
	},
});
