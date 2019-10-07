/*
 * ShareModal Messages
 *
 * This contains all the text for the ShareModal component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.ShareModal';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the ShareModal component!',
	},
	email: {
		id: `${scope}.email`,
		defaultMessage: 'Email',
	},
	access: {
		id: `${scope}.access`,
		defaultMessage: 'Access',
	},
	comment: {
		id: `${scope}.comment`,
		defaultMessage: 'Comment',
	},
	shareRelated: {
		id: `${scope}.shareRelated`,
		defaultMessage: 'Share campaign creatives and filters',
	},
});
