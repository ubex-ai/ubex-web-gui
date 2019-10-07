/*
 * CreativeCreator Messages
 *
 * This contains all the text for the CreativeCreator component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreativeCreator';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the CreativeCreator component!',
	},
	dummyLabel: {
		id: `${scope}.form.dummy`,
		defineMessages: 'Dummy label',
	},
	bgImage: {
		id: `${scope}.bgImage`,
		defaultMessage: 'Изображение',
	},
	mainTextColor: {
		id: `${scope}.mainTextColor`,
		defaultMessage: 'Цвет основного текста',
	},
	mainTextVal: {
		id: `${scope}.mainTextVal`,
		defaultMessage: 'Основной текст',
	},
	additionalTextColor: {
		id: `${scope}.additionalTextColor`,
		defaultMessage: 'Цвет дополнительного текста',
	},
	additionalTextVal: {
		id: `${scope}.additionalTextVal`,
		defaultMessage: 'Дополнительный текст',
	},
});
