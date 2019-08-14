/**
 *
 * CreativeForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DOMPurify from 'dompurify';
import { createStructuredSelector } from 'reselect';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { DropzoneComponent } from 'react-dropzone-component';
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';
import { Alert, Button, Col, Row, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { Form } from 'react-final-form';
import AppCard from 'components/AppCard';
import IntlFieldGroup from 'components/IntlFieldGroup';
import AppAlertError from 'components/AppAlertError';
import PreviewModal from 'components/PreviewModal';
import TableProgress from 'components/TableProgress';
import { uploadRequest } from 'utils/UploadHelper/actions';
import getGeneratedPageURL from 'utils/getBlob';
import validateEmpty from 'utils/validateEmpty';
import {
	creativesSelectors,
	creativeUploadingProgress,
	creativeIsUploading,
	selectAdSize,
	creativeStatusSelectors,
} from 'containers/TradingDesk/selectors';
import { selectUserGUID } from 'containers/UserPage/selectors';
import { bannersCollectionActions, creativeCollectionActions } from 'containers/TradingDesk/actions';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import createToast from 'utils/toastHelper';
import validateDomain from 'utils/validateDomain';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import _ from 'lodash';
import CreativeShape from '../../shapes/Creative';
import CreativeFileTable from '../CreativeFileTable';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */

class CreativeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			previewModal: '',
			codeOther: '',
			iconImage: '',
			mainImage: '',
			forceEdit: false,
			filesUploaded: false,
			filesDropped: false,
			filesImageDropped: false,
			filesImageUploaded: false,
			banners: [],
			totalFileCount: null,
			uploadedFileCount: null,
			uploadError: null,
		};

		this.mainImage = 0;
		this.iconImage = 0;
		this.dropzone = null;
		this.timer = null;
		this.imageObject = {
			icon: null,
			image: null,
		};
		this.formRef = null;
		this.renderForm = this.renderForm.bind(this);
		this.fileChange = this.fileChange.bind(this);
		this.checkCode = this.checkCode.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
	}

	componentDidMount() {
		const {
			activeCreative,
			setActiveCreative,
			unsetActiveCreative,
			match: {
				params: { id },
			},
		} = this.props;

		if (!id) {
			// this.formRef.form.reset({});
			unsetActiveCreative();
		} else if (!activeCreative || activeCreative.id !== parseInt(id, 10)) {
			setActiveCreative(id);
		}

		if (id) {
			this.props.getCreative(id);
		}

		if (activeCreative) {
			this.setInitialStateForEdit();
		}
	}

	componentDidUpdate(prevProps) {
		// Если было создание, нужно сделать редирект на редактирование
		if (
			!prevProps.activeCreative &&
			this.props.activeCreative &&
			this.props.location &&
			this.props.location.pathname === `/app/creative/${this.getParamValue('type')}/add`
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/creative/${this.getParamValue('type')}/${this.props.activeCreative.id}`);
			this.edit = true;
		}
		this.setInitialStateForEdit(prevProps);
	}

	isEditMode() {
		const { activeCreative } = this.props;
		if (!activeCreative) {
			return false;
		}
		if (activeCreative.banners && this.state.forceEdit) {
			return true;
		}
		// eslint-disable-next-line no-prototype-builtins
		return activeCreative.hasOwnProperty('data') && this.state.forceEdit;
	}

	componentWillUnmount() {
		// сброс значений формы
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
		window.clearTimeout(this.timer);
	}

	setInitialStateForEdit(prevProps = {}) {
		const { activeCreative } = this.props;
		if (!activeCreative && prevProps.activeCreative) {
			// this.formRef.form.reset({});
		}

		if (!activeCreative || activeCreative === prevProps.activeCreative) {
			return;
		}

		if (this.getParamValue('type') === 'other') {
			this.setState({ codeOther: this.props.activeCreative.data.code });
		}
	}

	validate(formValues) {
		const type = this.getParamValue('type');
		const errors = {};
		errors.name = validateEmpty(formValues.name);
		errors.type = validateEmpty(formValues.type);
		errors.cpm_type = validateEmpty(formValues.cpm_type);
		errors.cpm = validateEmpty(formValues.cpm);

		if (type === 'native') {
			errors.title = validateEmpty(formValues.title);
			if (!validateEmpty(formValues.title)) {
				if (!validateStringAndNumber(formValues.title)) {
					if (formValues.title.title > 25) {
						errors.title = 'Maximum number of characters 25';
					}
				} else {
					errors.title = validateStringAndNumber(formValues.title);
				}
			} else {
				errors.title = validateEmpty(formValues.title);
			}
			if (formValues.call_to_action && formValues.call_to_action.length > 20) {
				errors.call_to_action = 'Maximum number of characters 20';
			} else {
				errors.call_to_action = validateStringAndNumber(formValues.call_to_action);
			}
			errors.click_url = validateEmpty(formValues.click_url);
			if (!validateEmpty(formValues.description)) {
				if (!validateStringAndNumber(formValues.description)) {
					if (formValues.description.length > 90) {
						errors.description = 'Maximum number of characters 90';
					}
				} else {
					errors.description = validateStringAndNumber(formValues.description);
				}
			} else {
				errors.description = validateEmpty(formValues.description);
			}
			errors.additional_description = validateStringAndNumber(formValues.additional_description);
		}

		if (type === 'other') {
			errors.ad_size = validateEmpty(formValues.ad_size);
			errors.code = validateEmpty(this.state.codeOther);
		}
		return errors;
	}

	onSubmit(values) {
		console.log('submited values', values);
		const result = {
			data: {
				...values,
				type: values.type || 'html5',
				cpm_type: parseInt(values.cpm_type, 10),
			},
			creative_type: this.getParamValue('type'),
		};
		if (
			this.getParamValue('type') === 'native' ||
			this.getParamValue('type') === 'video' ||
			this.getParamValue('type') === 'other'
		) {
			delete result.data.type;
		}
		if (this.getParamValue('type') === 'other') {
			result.data.code = this.state.codeOther;
		}
		if (this.props.activeCreativeId) {
			this.props.updateCreative(this.props.activeCreativeId, result).then(() => {
				createToast('success', 'Creative successfully updated!');
				if (this.getParamValue('type') === 'other') {
					this.props.history.push({ pathname: `/app/creatives/list` });
				}
			});
		} else {
			this.props.addCreative(result).then(() => {
				createToast('success', 'Creative successfully added!');
				if (this.getParamValue('type') === 'other') {
					this.props.history.push({ pathname: `/app/creatives/list` });
				}
			});
		}
	}

	getParamValue(paramName) {
		const {
			match: { params },
		} = this.props;
		return params[paramName];
	}

	checkCode(e) {
		this.setState({ codeOther: e.target.value });
	}

	uploadBanner() {
		const {
			files,
			options: { url },
		} = this.dropzone;
		const { activeCreative, onUpload, userId } = this.props;
		this.setState({
			uploadError: null,
		});
		const formData = new FormData();
		formData.append('creative_id', activeCreative.id);
		formData.append('user_id', userId);
		for (let i = 0; i < files.length; i++) {
			formData.append(`file${i + 1}`, files[i]);
		}
		onUpload(formData, url)
			.then(result => {
				this.getUploadFiles(result);
				this.setState({
					filesDropped: false,
					totalFileCount: result.length,
					uploadedFileCount: 0,
				});
			})
			.catch(e => {
				this.setState({
					uploadError: e.error,
					filesDropped: false,
				});
			});
	}

	getUploadFiles(uploadFiles) {
		const {
			activeCreative,
			getCreative,
			match: {
				params: { id },
			},
		} = this.props;
		const totalUploaded = uploadFiles.length;
		const uploadedToS3 = activeCreative.banners.filter(
			banner => uploadFiles.some(uploadedBanner => uploadedBanner.id === banner.id) && banner.aws_s3_location,
		).length;

		this.setState({
			totalFileCount: totalUploaded,
			uploadedFileCount: uploadedToS3,
		});

		if (uploadedToS3 !== totalUploaded) {
			getCreative(id);
			this.timer = setTimeout(() => {
				this.getUploadFiles(uploadFiles);
			}, 2000);
		} else {
			clearTimeout(this.timer);
		}
	}

	getActiveBannerType() {
		const type = this.getParamValue('type');
		if (this.formRef && this.formRef.form) {
			const { values } = this.formRef.form.getState();
			if (values && values.type) {
				return values.type;
			}
		}

		if (this.props.activeCreative && this.props.activeCreative.data && this.props.activeCreative.data.type) {
			return this.props.activeCreative.data.type;
		}

		if (type === 'video') {
			return '';
		}

		return 'html5';
	}

	getActiveCpmType() {
		if (this.props.activeCreative && this.props.activeCreative.data) {
			return this.props.activeCreative.data.cpm_type;
		}
		return null;
	}

	getUploadUrl() {
		const activeBannerType = this.getActiveBannerType();
		const type = this.getParamValue('type');
		const urls = {
			html5: '/api/upload/html',
			image: '/api/upload/img',
			video: '/api/upload/video',
		};
		return `${API_URL}${urls[activeBannerType || type]}`;
	}

	getUploadConfig() {
		const activeBannerType = this.getActiveBannerType();
		const type = this.getParamValue('type');

		const acceptedFiles = {
			displayimage: 'image/jpeg,image/png,image/gif,application/zip, application/x-zip-compressed',
			displayhtml5: 'application/zip, application/x-zip-compressed',
			native: 'application/zip, application/x-zip-compressed',
			video: 'video/mp4, video/webm',
		};

		const iconFiletypes = {
			display: ['.jpg', '.png', '.gif', '.zip'],
			native: ['.zip'],
			video: ['.mp4'],
			image: ['.jpg', '.png', '.gif', '.zip'],
			html5: ['.zip'],
		};

		const fileSizes = {
			video: 10,
			image: 50,
			html5: 50,
		};
		return {
			djsConfig: {
				addRemoveLinks: true,
				autoProcessQueue: false,
				acceptedFiles: acceptedFiles[`${type}${activeBannerType}`],
				dictDefaultMessage: 'Drag and drop an file here or click',
				maxFiles: 25,
				maxFilesize: fileSizes[activeBannerType || type],
				dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
			},
			componentConfig: {
				autoProcessQueue: false,
				iconFiletypes: iconFiletypes[activeBannerType || type],
				showFiletypeIcon: true,
				postUrl: this.getUploadUrl(),
			},
			eventHandlers: {
				init: dz => (this.dropzone = dz),
				addedfile: file =>
					this.setState({
						filesDropped: true,
					}),
			},
		};
	}

	toggleForceEdit() {
		if (this.state.forceEdit) {
			try {
				this.onSubmit(this.formRef.form.getState().values);
			} catch (e) {
				console.error(e);
			}
		}
		this.setState({
			forceEdit: !this.state.forceEdit,
		});
	}

	getImageLink(image) {
		const {
			activeCreative,
			match: {
				params: { id },
			},
		} = this.props;
		if (activeCreative && !!activeCreative.banners.length && !!activeCreative.banners[0].files.length && this.getParamValue('type') === 'native') {
			const link = _.find(activeCreative.banners[0].files, item => item.file_location.indexOf(image) !== -1);
			return link.aws_s3_location;
		}
		return false;
	}

	removeImages() {
		const {
			activeCreative,
			match: {
				params: { id },
			},
		} = this.props;
		this.removeBanner(activeCreative.banners[0].id).then(() => {
			this.props.getCreative(id);
		});
	}

	refresh() {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.props.getCreative(id);
	}

	changeAdSize(bannerId, value) {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.props.changeBannerURL(bannerId, { ad_size: parseInt(value, 10) }).then(() => {
			createToast('success', 'Banner Ad size successfully changed!');
			this.props.getCreative(id);
		});
	}

	renderUploadPictureField() {
		if (!this.props.activeCreative || !this.props.activeCreative.data || this.state.forceEdit) {
			return null;
		}
		if (this.props.creativeIsUploading) {
			return (
				<TableProgress
					value={this.props.creativeUploadingProgress * 100}
					total={this.dropzone && this.dropzone.files ? this.dropzone.files.length : 0}
					uploaded={this.props.activeCreative.banners.length}
				/>
			);
		}
		const { iconImage, mainImage } = this.state;
		const {
			activeCreative,
			match: {
				params: { id },
			},
		} = this.props;
		return (
			<Row className="form-group">
				<Col md={12}>{this.state.uploadError && <Alert color="danger">{this.state.uploadError}</Alert>}</Col>
				<Col md={6}>
					<FormattedMessage {...messages.iconImage} />
					<br />
					{this.getImageLink('icon') && (
						<img src={this.getImageLink('icon')} style={{ maxWidth: '200px' }} alt="icon" />
					)}
					{this.getImageLink('icon') === null && <Spinner />}
					{this.getImageLink('icon') === false && (
						<div className="file_upload btn btn-md btn-primary">
							Select
							<input type="file" name="iconImage" accept="image/*" onChange={this.fileChange} />
						</div>
					)}
					<div className="display-inline button-margin-left-10">{iconImage}</div>
				</Col>
				<Col md={6}>
					<FormattedMessage {...messages.mainImage} /> <span style={{ color: '#f00' }}>*</span>
					<br />
					{this.getImageLink('image') && (
						<img src={this.getImageLink('image')} style={{ maxWidth: '200px' }} alt="image" />
					)}
					{this.getImageLink('image') === null && <Spinner />}
					{this.getImageLink('image') === false && (
						<div className="file_upload btn btn-md btn-primary">
							Select
							<input type="file" name="mainImage" accept="image/*" onChange={this.fileChange} />
						</div>
					)}
					<div className="display-inline button-margin-left-10">{mainImage}</div>
				</Col>
				{!activeCreative.banners.length ? (
					<Col className="mt-2">
						<Button
							onClick={() => this.uploadImage()}
							disabled={!this.state.filesImageDropped}
							color="info"
						>
							<FormattedMessage id="app.common.submit" />
						</Button>
					</Col>
				) : (
					<Col className="mt-2">
						<Button onClick={() => this.removeImages()} color="danger" className="mt-3">
							Remove all images
						</Button>
					</Col>
				)}
			</Row>
		);
	}

	fileChange(e) {
		const { imageObject } = this;
		if (e.target.name === 'mainImage') {
			this.setState({ [e.target.name]: e.target.files[0].name, filesImageDropped: true });
			imageObject.image = e.target.files[0];
		} else {
			this.setState({ [e.target.name]: e.target.files[0].name });
			imageObject.icon = e.target.files[0];
		}
	}

	uploadImage() {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		const formData = new FormData();
		this.setState({
			iconImage: '',
			mainImage: '',
			uploadError: null,
		});
		formData.append('creative_id', this.props.activeCreative.id);
		formData.append('user_id', this.props.userId);
		formData.append('image', this.imageObject.image);
		formData.append('icon', this.imageObject.icon);
		const vm = this;
		this.props
			.onUpload(formData, `${API_URL}/api/upload/native-img`)
			.then(() => {
				this.setState({ filesImageDropped: false });
				this.timer = setTimeout(() => {
					if (vm.getImageLink('image') === null || vm.getImageLink('icon') === null) {
						vm.props.getCreative(id);
					}
				}, 3000);
			})
			.catch(e => {
				this.setState({
					uploadError: e.error,
				});
			});
	}

	renderUploadField() {
		if (!this.props.activeCreative || !this.props.activeCreative.data || this.state.forceEdit) {
			return null;
		}

		if (this.state.uploadedFileCount !== this.state.totalFileCount) {
			return (
				<TableProgress
					value={(this.state.uploadedFileCount / this.state.totalFileCount) * 100}
					total={this.state.totalFileCount}
					uploaded={this.state.uploadedFileCount}
				/>
			);
		}
		const { djsConfig, componentConfig, eventHandlers } = this.getUploadConfig();
		return (
			<FormGroup className="file_upload">
				{this.state.uploadError && <Alert color="danger">{this.state.uploadError}</Alert>}
				<Label for="exampleFile">
					<FormattedMessage {...messages.file} />
				</Label>
				<br />
				<div className="dropzone__area">
					<DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} />
				</div>
				<Button onClick={() => this.uploadBanner()} disabled={!this.state.filesDropped} color="info">
					{!this.props.creativeIsUploading ? <FormattedMessage id="app.common.submit" /> : <Spinner size="sm"/>}
				</Button>
			</FormGroup>
		);
	}

	renderLoading() {
		if ((this.props.activeCampaign && this.props.activeCampaign.loading) || this.props.activeCampaignLoading) {
			return (
				<Alert color="light">
					<FormattedMessage id="app.common.loading" />
				</Alert>
			);
		}
		return null;
	}

	renderError() {
		if (this.props.addCreativeError && this.props.activeCreative && this.props.activeCreative.error) {
			return <AppAlertError message={this.props.activeCreative.error.message} />;
		}
		if (this.props.addCreativeError) {
			return <AppAlertError message={this.props.addCreativeError.message} />;
		}
		return null;
	}

	renderSelectDisplayType() {
		if (this.props.activeCreative && this.props.activeCreative.data) {
			return (
				<div>
					<Row>
						<Col md={12}>
							<Label for="exampleFile">
								<FormattedMessage {...messages.selectedType} />: {this.props.activeCreative.data.type}
							</Label>
						</Col>
					</Row>
				</div>
			);
		}
		const activeBannerType = this.getActiveBannerType();
		return (
			<div>
				<Row>
					<Col md={12}>
						<Label for="exampleFile">
							<FormattedMessage {...messages.selectType} />
						</Label>
					</Col>
					<Col md={2} xs={6} className="radio-mb-0">
						<IntlFieldGroup
							inputProps={{
								type: 'radio',
								value: 'image',
								checked: activeBannerType === 'image' ? 'checked' : '',
							}}
							name="type"
							label={messages.image}
						/>
					</Col>
					<Col md={2} xs={6} className="radio-mb-0">
						<IntlFieldGroup
							inputProps={{
								type: 'radio',
								value: 'html5',
								checked: activeBannerType === 'html5' ? 'checked' : '',
							}}
							name="type"
							label={messages.html5}
						/>
					</Col>
					<hr />
				</Row>
				<hr />
			</div>
		);
	}

	renderNativeFields(values) {
		return (
			<div>
				<hr />
				<Row>
					<Col md={6}>
						<IntlFieldGroup
							name="title"
							label={messages.title}
							required
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="description"
							label={messages.description}
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="call_to_action"
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							label={messages.callToAction}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="additional_description"
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							label={messages.additionalDescription}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="click_url"
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							label={messages.clickURL}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="third_party_tracking"
							inputProps={{
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							label={messages.thirdPartyViewTracking}
						/>
					</Col>
					<Col md={12}>
						<IntlFieldGroup
							name="allow_as_html5"
							inputProps={{
								type: 'checkbox',
								[values.allow_as_html5 ? 'checked' : false]: values.allow_as_html5,
								disabled:
									!this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							}}
							label={messages.allow_as_html}
						/>
					</Col>
				</Row>
			</div>
		);
	}

	renderCPMSelect() {
		return (
			<div className="inline-select-prepend">
				<IntlFieldGroup
					name="cpm_type"
					label={messages.cpm}
					inputProps={{
						type: 'select',
						options: [{ value: 1, label: 'Fixed' }, { value: 2, label: 'Max' }],
						disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
					}}
					disableDefault
					required
				/>
				<IntlFieldGroup
					name="cpm"
					label={messages.cpm}
					inputProps={{
						placeholder: '$',
						type: 'number',
						disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
					}}
				/>
			</div>
		);
	}

	renderCustomCodeField() {
		return (
			<div>
				<IntlFieldGroup
					inputProps={{
						type: 'select',
						options: this.props.adSize,
						disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
					}}
					name="ad_size"
					label={messages.adSize}
					required
				/>
				<FormGroup className="file_upload">
					<IntlFieldGroup
						inputProps={{
							type: 'textarea',
							disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
							rows: 15,
							onChange: e => {
								this.setState({ codeOther: e.target.value });
							},
							value: this.state.codeOther,
						}}
						name="code"
						label={messages.code}
						required
					/>
				</FormGroup>
				<IntlFieldGroup
					name="third_party_tracking"
					label={messages.tracking}
					inputProps={{
						disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
					}}
				/>
			</div>
		);
	}

	renderForm({ handleSubmit, values }) {
		// console.log(values);
		const {
			match: {
				params: { id },
			},
		} = this.props;
		const type = this.getParamValue('type');
		return (
			<form onSubmit={args => handleSubmit(args)}>
				{this.renderError()}
				{this.renderLoading()}
				{this.renderNameField()}
				{type === 'display' && this.renderSelectDisplayType()}
				{this.renderCPMSelect()}
				{type === 'native' && this.renderNativeFields(values)}
				{type === 'other' && this.renderCustomCodeField()}
				{this.renderEditBtn()}
				{type === 'native' && this.props.activeCreative ? (
					<div>
						<hr />
						{this.renderUploadPictureField()}
						<hr />
					</div>
				) : null}
				{(type === 'display' || type === 'video') && this.props.activeCreative ? (
					<div>
						<hr />
						{this.renderUploadField()}
						<hr />
					</div>
				) : null}
				{!this.props.activeCreative || (this.props.activeCreative && !this.props.activeCreative.data) ? (
					<Button type="submit" color="success">
						<FormattedMessage id="app.common.next" />
					</Button>
				) : null}
			</form>
		);
	}

	renderNameField() {
		return (
			<IntlFieldGroup
				name="name"
				label={messages.creativeName}
				inputProps={{
					disabled: !this.isEditMode() && this.props.activeCreative && this.props.activeCreative.data,
				}}
				required
			/>
		);
	}

	renderEditBtn() {
		if (!this.props.activeCreative) {
			return false;
		}
		return (
			<Button onClick={this.toggleForceEdit.bind(this)} className="btn-sm mb-2 mt-2" color="info">
				<FormattedMessage id={this.state.forceEdit ? 'app.common.save' : 'app.common.edit'} />
			</Button>
		);
	}

	changeURL(bannerId, values, type) {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.props.changeBannerURL(bannerId, values).then(() => {
			createToast('success', `${type} for Banner #${bannerId} successfully changed!`);
			this.props.getCreative(id);
		});
	}

	removeBanner(bannerId) {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.props.removeBanner(bannerId).then(() => {
			createToast('success', `Banner #${bannerId} successfully removed!`);
			this.props.getCreative(id);
		});
	}

	renderCreativeFilesTable() {
		if (!this.props.activeCreative || !this.props.activeCreative.banners) {
			return null;
		}
		const type = this.getParamValue('type');

		const uploadedBanners = this.props.activeCreative.banners.filter(banner => banner.aws_s3_location);

		return !this.isEditMode() && (type === 'display' || type === 'video') && uploadedBanners.length ? (
			<div>
				<h3>
					<FormattedMessage {...messages.adDetails} />
				</h3>
				<CreativeFileTable
					type={this.getParamValue('type')}
					data={uploadedBanners}
					keyField="site"
					adSize={this.props.adSize}
					adSizeChange={(id, value) => this.changeAdSize(id, value)}
					onClickGetCode={link => this.setState({ previewModal: link })}
					onClickRemoveEntry={id => this.setState({ deletedSlot: id })}
					toggleEntryStatus={this.props.toggleSlotStatus}
					changeBannerURL={(id, values, typeAction) => this.changeURL(id, values, typeAction)}
					removeBanner={id => this.removeBanner(id)}
				/>
			</div>
		) : null;
	}

	render() {
		const type = this.getParamValue('type');
		const initValues = { cpm_type: 2, type: 'html5' };
		const activeCounterCode =
			this.props.activeCreative &&
			(this.props.activeCreative !== null || this.props.activeCreative !== 'undefined') &&
			this.props.activeCreative.data &&
			!!Object.keys(this.props.activeCreative.data).length
				? this.props.activeCreative.data.code
				: null;
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								<FormattedMessage {...messages.addCreative} /> {type}
							</h1>
						</div>
					</header>
					<Row>
						<Col sm={12} lg={12} md={12} xs={12}>
							<AppCard>
								<Row>
									<Col sm={12} lg={8} md={8} xs={12}>
										<Form
											validate={formValues => this.validate(formValues)}
											initialValues={
												(this.props.activeCreative !== null ||
													this.props.activeCreative !== 'undefined') &&
												this.props.activeCreative &&
												this.props.activeCreative.data !== null
													? this.props.activeCreative.data
													: initValues
											}
											onSubmit={values => this.onSubmit(values)}
											ref={c => (this.formRef = c)}
											render={this.renderForm}
										/>
										{this.renderCreativeFilesTable()}
									</Col>
									<Col lg={4}>
										{type === 'display' && (
											<FormattedHTMLMessage {...messages.instructionsTextDisplay} />
										)}
										{type === 'native' && (
											<FormattedHTMLMessage {...messages.instructionsTextNative} />
										)}
										{type === 'video' && (
											<FormattedHTMLMessage {...messages.instructionsTextVideo} />
										)}
										{type === 'other' && (
											<div style={{ height: '100%' }}>
												<h2>Preview</h2>
												<iframe
													frameBorder="0"
													style={{ height: '86%', border: '1px solid #e1e1e1' }}
													id="iframe"
													src={getGeneratedPageURL(
														DOMPurify.sanitize(this.state.codeOther || activeCounterCode),
													)}
												/>
											</div>
										)}
									</Col>
								</Row>
							</AppCard>
						</Col>
					</Row>
				</Col>
				<PreviewModal
					title={messages.preview}
					type={this.getParamValue('type')}
					additionalType={this.getActiveBannerType()}
					msg={this.state.previewModal}
					isOpen={this.state.previewModal}
					onCancel={() => this.setState({ previewModal: '' })}
				/>
			</Row>
		);
	}
}

CreativeForm.propTypes = {
	addCreative: PropTypes.func.isRequired,
	getCreative: PropTypes.func.isRequired,
	setActiveCreative: PropTypes.func.isRequired,
	unsetActiveCreative: PropTypes.func.isRequired,
	activeCreative: PropTypes.shape(CreativeShape),
	activeCreativeId: PropTypes.number,
	addCreativeLoading: PropTypes.bool,
	addCreativeError: PropTypes.object,
	userId: PropTypes.string,
};
const mapStateToProps = createStructuredSelector({
	userId: selectUserGUID(),
	creativeIsUploading: creativeIsUploading(),
	creativeUploadingProgress: creativeUploadingProgress(),
	activeCreativeId: creativesSelectors.activeEntryId(),
	activeCreative: creativesSelectors.activeEntry(),
	addCreativeLoading: creativesSelectors.addEntryLoading(),
	addCreativeError: creativesSelectors.addEntryError(),
	adSize: selectAdSize(),
});

function mapDispatchToProps(dispatch) {
	return {
		onUpload: (file, path) => makePromiseAction(dispatch, uploadRequest(file, path)),
		addCreative: values => makePromiseAction(dispatch, creativeCollectionActions.addEntry(values)),
		updateCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.updateEntry(id, values)),
		setActiveCreative: id => makePromiseAction(dispatch, creativeCollectionActions.setActiveEntry(id)),
		unsetActiveCreative: _ => dispatch(creativeCollectionActions.unsetActiveEntry()),
		getCreative: id => dispatch(creativeCollectionActions.getEntry(id)),
		changeBannerURL: (id, values) => makePromiseAction(dispatch, bannersCollectionActions.patchEntry(id, values)),
		removeBanner: id => makePromiseAction(dispatch, bannersCollectionActions.removeEntry(id)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CreativeForm);
