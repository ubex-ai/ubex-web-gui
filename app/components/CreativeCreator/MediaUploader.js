import React from 'react';
import PropTypes from 'prop-types';
import { DropzoneComponent } from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

const fileTypes = {
	image: {
		mime: 'image/jpeg,image/png,image/gif',
		icons: ['.jpg', '.png', '.gif', '.zip'],
		size: 5,
	},
	zip: {
		mime: 'application/zip, application/x-zip-compressed',
		icons: ['.jpg', '.png', '.gif', '.zip'],
		size: 10,
	},
	video: {
		mime: 'video/mp4, video/webm',
		icons: ['.mp4'],
		size: 50,
	},
};

const MediaUploader = ({ type = 'image', maxFiles = 1, eventHandlers, postUrl, config, djsConfig }) => (
	<div className="dropzone__area">
		<DropzoneComponent
			eventHandlers={eventHandlers}
			config={{
				autoProcessQueue: false,
				iconFiletypes: fileTypes[type].icons,
				showFiletypeIcon: true,
				postUrl: postUrl ? `${API_URL}${postUrl}` : 'no-url',
				...config,
			}}
			djsConfig={{
				addRemoveLinks: true,
				autoProcessQueue: false,
				acceptedFiles: fileTypes[type].mime,
				dictDefaultMessage: 'Drag and drop an file here or click',
				maxFiles,
				maxFilesize: fileTypes[type].size,
				dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
				...djsConfig,
			}}
		/>
	</div>
);

MediaUploader.propTypes = {
	type: PropTypes.oneOf(['image', 'zip', 'video']).isRequired,
	maxFiles: PropTypes.number,
	postUrl: PropTypes.string,
	eventHandlers: PropTypes.shape({
		init: PropTypes.func,
		addedfile: PropTypes.func,
	}),
	djsConfig: PropTypes.object,
	config: PropTypes.object,
};

export default MediaUploader;
