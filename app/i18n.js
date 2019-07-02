/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const enLocaleData = require('react-intl/locale-data/en');
const ruLocaleData = require('react-intl/locale-data/ru');
const koLocaleData = require('react-intl/locale-data/ko');
const zhLocaleData = require('react-intl/locale-data/zh');
const ptLocaleData = require('react-intl/locale-data/pt');
const jaLocaleData = require('react-intl/locale-data/ja');
const deLocaleData = require('react-intl/locale-data/de');
const esLocaleData = require('react-intl/locale-data/es');
const frLocaleData = require('react-intl/locale-data/fr');
const viLocaleData = require('react-intl/locale-data/vi');
const hiLocaleData = require('react-intl/locale-data/hi');
const trLocaleData = require('react-intl/locale-data/tr');

const enTranslationMessages = require('./translations/en.json');
const ruTranslationMessages = require('./translations/ru.json');
const koTranslationMessages = require('./translations/ko.json');
const zhTranslationMessages = require('./translations/zh.json');
const ptTranslationMessages = require('./translations/pt.json');
const jaTranslationMessages = require('./translations/ja.json');
const deTranslationMessages = require('./translations/de.json');
const esTranslationMessages = require('./translations/es.json');
const frTranslationMessages = require('./translations/fr.json');
const viTranslationMessages = require('./translations/vi.json');
const hiTranslationMessages = require('./translations/hi.json');
const trTranslationMessages = require('./translations/tr.json');

addLocaleData(enLocaleData);
addLocaleData(ruLocaleData);
addLocaleData(koLocaleData);
addLocaleData(zhLocaleData);
addLocaleData(ptLocaleData);
addLocaleData(jaLocaleData);
addLocaleData(deLocaleData);
addLocaleData(esLocaleData);
addLocaleData(frLocaleData);
addLocaleData(viLocaleData);
addLocaleData(hiLocaleData);
addLocaleData(trLocaleData);

const DEFAULT_LOCALE = 'en';

// prettier-ignore
const appLocales = [
	'en',
	'pt',
	'ko',
	'zh',
	'ja',
	'ru',
	  'de',
	  'es',
	  'fr',
	  'vi',
	  'hi',
  'tr',
];

const formatTranslationMessages = (locale, messages) => {
	const defaultFormattedMessages =
		locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages) : {};
	const flattenFormattedMessages = (formattedMessages, key) => {
		const formattedMessage =
			!messages[key] && locale !== DEFAULT_LOCALE ? defaultFormattedMessages[key] : messages[key];
		return Object.assign(formattedMessages, { [key]: formattedMessage });
	};
	return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
	en: formatTranslationMessages('en', enTranslationMessages),
	ru: formatTranslationMessages('ru', ruTranslationMessages),
	ko: formatTranslationMessages('ko', koTranslationMessages),
	zh: formatTranslationMessages('zh', zhTranslationMessages),
	pt: formatTranslationMessages('pt', ptTranslationMessages),
	ja: formatTranslationMessages('ja', jaTranslationMessages),
	de: formatTranslationMessages('de', deTranslationMessages),
	es: formatTranslationMessages('es', esTranslationMessages),
	fr: formatTranslationMessages('fr', frTranslationMessages),
	vi: formatTranslationMessages('vi', viTranslationMessages),
	hi: formatTranslationMessages('hi', hiTranslationMessages),
  tr: formatTranslationMessages('tr', trTranslationMessages),
};

exports.appLocales = appLocales;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
