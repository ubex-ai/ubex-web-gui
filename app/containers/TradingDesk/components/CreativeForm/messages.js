/*
 * CreativeForm Messages
 *
 * This contains all the text for the CreativeForm component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreativeForm';

export default defineMessages({
	header: {
		id: `${scope}.header`,
		defaultMessage: 'This is the CreativeForm component!',
	},
	creativeName: {
		id: `${scope}.creativeName`,
		defaultMessage: 'Creative name',
	},
	addCreative: {
		id: `${scope}.addCreative`,
		defaultMessage: 'Add creative',
	},
	instructionsTextDisplay: {
		id: `${scope}.help.instructionsTextDisplay`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Add the name of the creative. For example, General product banners for Germany. </p>\n' +
			'<p>Select on your disk the desired images (banners) to be loaded into the system. You can download one ZIP archive with all banners.</p>' +
			'<p>AVAILABLE PACKAGE LOADING OF BANNERS.\n' +
			'SELECT .ZIP ARCHIVE WHICH WILL KEEP MANY PICTURES WITH BANNERS OR SEPARATE .ZIP ARCHIVES FOR HTML5</p>' +
			'<dt>Available formats</dt><dd>Available formats jpeg, png, gif, zip</dd>\n' +
			'<p>After downloading, add the banner size in the table and the link where the click on the banner will lead.\n' +
			'<br />If necessary, add a third-party counter code.</p>'+
			'<h3>For HTML5</h3>' +
			'<ul style="list-style-type: decimal">' +
			'<li>The banner must be a ZIP archive, inside which are all the files necessary for the banner to work.</li>' +
			'<li> The size of a single ZIP archive should not exceed 150Kb.\n' +
			'Restriction on the size of files inside the archive:\n' +
			'html, js, jpeg, png, gif - 600 Kb;\n' +
			'other file types - 600 Kb.\n' +
			'Restrictions are checked separately for each component of the banner.</li>' +
			'<li>The name of the main file should be index.html and it should be the only HTML file in the archive.</li>' +
			'</ul>',
	},
	instructionsTextNative: {
		id: `${scope}.help.instructionsTextHTML5`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>To create native advertising, fill in all the form fields.\n' +
			'Upload two pictures for the icon and the main image. The main image is required.<br />' +
			'You can download one ZIP archive with all banners, each banner in the general ZIP archive should be in a separate archive. The maximum size of the total archive is 100MB.</p>' +
			'<dt>Title</dt><dd>The title of the advertisement, a brief descriptive text associated with the advertised product or service. Maximum of 50 characters (required field).</dd>\n' +
			'<dt>Call to action</dt><dd>The text of the call to action, the inscription on the button with a link. For example, "Learn More" or "Download." Maximum of 20 characters.\n</dd>\n' +
			'<dt>Description</dt><dd>Write a description for your ad no longer than 99 characters (required field).</dd>\n' +
			'<dt>Additional description</dt><dd>Additional advertising text - pay attention to the fact that the user sees an advertisement (a required field), no longer than 25 characters (a mandatory field). For example, "With the support of our company."</dd>\n' +
			'<dt>Click URL</dt><dd>Enter the URL to which the user will be redirected after clicking on the ad.\n</dd>\n' +
			'<dt>Third party view tracking</dt><dd>Enter here the counter code of external tracking services.</dd>\n',

	},
	adSize: {
		id: `${scope}.adSize`,
		defaultMessage: 'Ad Size',
	},
	clickURL: {
		id: `${scope}.clickURL`,
		defaultMessage: 'Click URL',
	},
	tracking: {
		id: `${scope}.tracking`,
		defaultMessage: 'Third party view tracking',
	},
	preview: {
		id: `${scope}.preview`,
		defaultMessage: 'Preview',
	},
	requirements: {
		id: `${scope}.requirements`,
		defaultMessage: 'Requirements for HTML5 Banners',
	},
	requirementsText: {
		id: `${scope}.requirementsText`,
		defaultMessage:
			'<ul style="list-style-type: decimal">' +
			'<li>A separate banner should be a ZIP-archive, inside which are all the files necessary for the banner.</li>' +
			'<li>A separate ZIP archive should not exceed 150KB.\n' +
			'Restriction on the size of files inside the archive:\n' +
			'html, js, jpeg, png, gif, other file types - 600 Kb.\n' +
			'Restrictions are checked separately for each component of the banner.\n</li>' +
			'<li>It is necessary that all banner files are necessarily located in the same folder as the main HTML file. Those. There should not be additional folders for images or js-files.\n</li>' +
			'<li>The name of the main file should be index.html and it should be the only HTML file in the archive.</li>' +
			'<li>For the file name, it is permissible to use only the Latin alphabet, numbers and the underscore character.\n</li>' +
			'</ul>',
	},
	code: {
		id: `${scope}.code`,
		defaultMessage: 'Code',
	},
	cpm: {
		id: `${scope}.cpm`,
		defaultMessage: 'CPM',
	},
	instructionsTextVideo: {
		id: `${scope}.help.instructionsTextVideo`,
		defaultMessage:
			'<h2>Instructions</h2>\n' +
			'<p>Video requirements<br />' +
			'<ul style="list-style-type: decimal">' +
			'<li>The video weight should not exceed 10 MB.</li>' +
			'<li>The recommended video format is MP4.\n' +
			'Required video compression standard - H.264 video codec (full MPEG-4 Part 10 AVC / H.264 title)\n' +
			'For placement on the Google AdX channel, you need to download WEBM format in addition to MP4</li>' +
			'<li>The minimum recommended video length is 12 seconds.\n' +
			'The maximum recommended video length is 3 minutes.</li>' +
			'<li>Frame rate - 30 frames / sec.</li>' +
			'</ul>',
	},
	image: {
		id: `${scope}.image`,
		defaultMessage: 'Image',
	},
	html5: {
		id: `${scope}.html5`,
		defaultMessage: 'HTML5',
	},
	iconImage: {
		id: `${scope}.iconImage`,
		defaultMessage: 'Icon image',
	},
	mainImage: {
		id: `${scope}.mainImage`,
		defaultMessage: 'Main image',
	},

	title: {
		id: `${scope}.title`,
		defaultMessage: 'Title',
	},
	description: {
		id: `${scope}.description`,
		defaultMessage: 'Description',
	},
	callToAction: {
		id: `${scope}.callToAction`,
		defaultMessage: 'Call to action',
	},
	additionalDescription: {
		id: `${scope}.additionalDescription`,
		defaultMessage: 'Additional description',
	},
	thirdPartyViewTracking: {
		id: `${scope}.thirdPartyViewTracking`,
		defaultMessage: 'Third party view tracking',
	},
	selectType: {
		id: `${scope}.selectType`,
		defaultMessage: 'Select type',
	},
	selectedType: {
		id: `${scope}.selectedType`,
		defaultMessage: 'Selected type',
	},
	file: {
		id: `${scope}.file`,
		defaultMessage: 'Upload file',
	},
	adDetails: {
		id: `${scope}.adDetails`,
		defaultMessage: 'Ad details',
	},
	cpmType1: {
		id: `${scope}.cpmType1`,
		defaultMessage: 'Fixed',
	},
	cpmType2: {
		id: `${scope}.cpmType2`,
		defaultMessage: 'Max',
	},
	allow_as_html: {
		id: `${scope}.allow_as_html`,
		defaultMessage: 'Allow as HTML5 Banner',
	}
});
