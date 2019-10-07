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
import { Alert, Button, Col, Row, FormGroup, Label, Input, Spinner, InputGroupAddon, FormFeedback } from 'reactstrap';
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
	selectPublishersConfig,
} from 'containers/TradingDesk/selectors';
import { selectUserGUID } from 'containers/UserPage/selectors';
import {
	bannersCollectionActions,
	creativeCollectionActions,
	publisherConfig,
	getAdSize,
} from 'containers/TradingDesk/actions';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import createToast from 'utils/toastHelper';
import validateDomain from 'utils/validateDomain';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import _ from 'lodash';
import moment from 'moment';
import InputGroup from 'reactstrap/es/InputGroup';
import CodeMirror from 'react-codemirror';
import ModerationModal from 'components/ModerationModal';
import CustomInput from 'reactstrap/es/CustomInput';
import transliterate from 'utils/transliterate';
import CreativeShape from '../../shapes/Creative';
import CreativeFileTable from '../CreativeFileTable';
import messages from './messages';
import ChannelSelect from '../ChannelSelect';

/* eslint-disable react/prefer-stateless-function */

class CreativeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			previewModal: '',
			codeOther: null,
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
			codeMirror: false,
			continueEditing: false,
			optimalPrice: false,
			moderationText: null,
			generateUTM: false,
			permissions: true,
			previewName: null,
		};

		this.mainImage = 0;
		this.iconImage = 0;
		this.dropzone = null;
		this.timer = null;
		this.codeMirrorTouched = false;
		this.imageObject = {
			icon: null,
			image: null,
		};
		this.formRef = null;
		this.renderForm = this.renderForm.bind(this);
		this.fileChange = this.fileChange.bind(this);
		this.checkCode = this.checkCode.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
		this.updateCodeOther = this.updateCodeOther.bind(this);
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
			this.setState({ codeMirror: true });
			unsetActiveCreative();
		} else if (!activeCreative || activeCreative.id !== parseInt(id, 10)) {
			setActiveCreative(id);
		}

		if (id && !isNaN(parseInt(id, 10))) {
			this.props.getCreative(id);
		}

		if (activeCreative) {
			this.setInitialStateForEdit();
		}

		this.props.getPublishersConfig();
		if (!(this.props.adSize && this.props.adSize.length) && typeof this.props.getAdSize === 'function') {
			this.props.getAdSize();
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
		this.setState({ codeOther: '' });
		this.props.unsetActiveCreative();
	}

	setInitialStateForEdit(prevProps = {}) {
		const {
			activeCreative,
			match: {
				params: { id },
			},
		} = this.props;
		if (!activeCreative && prevProps.activeCreative) {
			// this.formRef.form.reset({});
		}

		if (!activeCreative || activeCreative === prevProps.activeCreative) {
			return;
		}

		if (this.getParamValue('type') === 'other') {
			this.setState(
				{
					codeOther: this.props.activeCreative.data.code && id ? this.props.activeCreative.data.code : null,
				},
				() => {
					this.setState({ codeMirror: true });
				},
			);
		}

		this.setState({
			permissions: !(
				this.props.activeCreative.sharing &&
				this.props.activeCreative.sharing.shared &&
				this.props.activeCreative.sharing.perm === 'read'
			),
		});
	}

	validate(formValues) {
		const type = this.getParamValue('type');
		const errors = {};
		errors.name = validateEmpty(formValues.name);
		errors.type = validateEmpty(formValues.type);
		errors.cpm_type = validateEmpty(formValues.cpm_type);
		errors.cpm = !formValues.cpm_optimal_price ? validateEmpty(formValues.cpm) : undefined;

		if (formValues.alt_text && formValues.alt_text.length > 100) {
			errors.alt_text = 'Maximum length 100 characters';
		}

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
			errors.click_url = validateDomain(formValues.click_url);
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
				cpm: values.cpm_optimal_price ? 0 : values.cpm,
				type: values.type || 'html5',
				cpm_type: parseInt(values.cpm_type, 10),
				alt_text: values.alt_text ? values.alt_text : null,
				ssp: {
					yandex: values.yandex,
				},
			},
			creative_type: this.getParamValue('type'),
		};
		delete result.data.yandex;
		if (this.getParamValue('type') !== 'display') {
			delete result.data.cpm_optimal_price;
		}
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
				if (!this.state.continueEditing) {
					this.props.history.push({ pathname: `/app/creatives/list/full` });
				}
			});
		} else {
			this.props.addCreative(result).then(() => {
				createToast('success', 'Creative successfully added!');
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
			html5: '/api/upload/html/',
			image: '/api/upload/img/',
			video: '/api/upload/video/',
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
		this.onSubmit(this.formRef.form.getState().values);
	}

	getImageLink(image) {
		const {
			activeCreative,
			match: {
				params: { id },
			},
		} = this.props;
		if (
			activeCreative &&
			!!activeCreative.banners.length &&
			!!activeCreative.banners[0].files.length &&
			this.getParamValue('type') === 'native'
		) {
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
					value={
						this.props.creativeUploadingProgress * 100 < 30
							? 30
							: this.props.creativeUploadingProgress * 100
					}
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
			.onUpload(formData, `${API_URL}/api/upload/native-img/`)
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
					value={
						(this.state.uploadedFileCount / this.state.totalFileCount) * 100 < 30
							? 30
							: (this.state.uploadedFileCount / this.state.totalFileCount) * 100
					}
					total={this.state.totalFileCount}
					uploaded={this.state.uploadedFileCount}
				/>
			);
		}
		const { djsConfig, componentConfig, eventHandlers } = this.getUploadConfig();
		return (
			<div>
				<FormGroup className="file_upload">
					{this.state.uploadError && <Alert color="danger">{this.state.uploadError}</Alert>}
					<Label for="exampleFile">
						<FormattedMessage {...messages.file} />
					</Label>
					<br />
					<div className="dropzone__area">
						<DropzoneComponent
							config={componentConfig}
							eventHandlers={eventHandlers}
							djsConfig={djsConfig}
						/>
					</div>
					<Button onClick={() => this.uploadBanner()} disabled={!this.state.filesDropped} color="info">
						{!this.props.creativeIsUploading ? (
							<FormattedMessage id="app.common.upload" />
						) : (
							<Spinner size="sm" />
						)}
					</Button>
				</FormGroup>
				<hr />
			</div>
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
			return;
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
								id: 'image',
								checked: activeBannerType === 'image' ? 'checked' : '',
								disabled: !this.state.permissions,
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
								id: 'html5',
								disabled: !this.state.permissions,
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
							inputProps={{
								disabled: !this.state.permissions,
							}}
							label={messages.title}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="description"
							inputProps={{
								disabled: !this.state.permissions,
							}}
							label={messages.description}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="call_to_action"
							inputProps={{
								disabled: !this.state.permissions,
							}}
							label={messages.callToAction}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="additional_description"
							inputProps={{
								disabled: !this.state.permissions,
							}}
							label={messages.additionalDescription}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="click_url"
							label={messages.clickURL}
							inputProps={{
								disabled: !this.state.permissions,
							}}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="third_party_tracking"
							label={messages.thirdPartyViewTracking}
							inputProps={{
								disabled: !this.state.permissions,
							}}
						/>
					</Col>
					<Col md={12}>
						<IntlFieldGroup
							name="allow_as_html5"
							inputProps={{
								type: 'checkbox',
								id: 'allow_as_html5',
								[values.allow_as_html5 ? 'checked' : false]: values.allow_as_html5,
								disabled: !this.state.permissions,
							}}
							label={messages.allow_as_html}
						/>
					</Col>
				</Row>
			</div>
		);
	}

	renderCPMSelect(values) {
		return (
			<Row>
				<Col md="12">
					<div className="inline-select-prepend table-input">
						<InputGroup>
							<IntlFieldGroup
								name="cpm_type"
								label={messages.cpm}
								inputProps={{
									type: 'select',
									options: [{ value: 1, label: 'Fixed' }, { value: 2, label: 'Max' }],
									disabled:
										!this.state.permissions ||
										values.cpm_optimal_price === 'undefined' ||
										values.cpm_optimal_price,
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
									min: '0',
									max: '1000000000',
									step: '0.1',
									disabled:
										!this.state.permissions ||
										values.cpm_optimal_price === 'undefined' ||
										values.cpm_optimal_price,
								}}
							/>
							<div className="cpm_optimal_price">
								<IntlFieldGroup
									name="cpm_optimal_price"
									label={messages.optimal_price}
									inputProps={{
										type: 'checkbox',
										id: 'cpm_optimal_price',
										[values.cpm_optimal_price ? 'checked' : false]: values.cpm_optimal_price,
										disabled: !this.state.permissions,
									}}
								/>
							</div>
						</InputGroup>
					</div>
				</Col>
			</Row>
		);
	}

	updateCodeOther(codeOther) {
		this.setState({ codeOther });
		this.codeMirrorTouched = true;
	}

	renderCustomCodeField(errors) {
		return (
			<div>
				<IntlFieldGroup
					inputProps={{
						type: 'select',
						options: this.props.adSize,
					}}
					name="ad_size"
					label={messages.adSize}
					required
				/>
				<FormGroup className="file_upload">
					<Label className="">
						<FormattedMessage {...messages.code} />
						<span style={{ color: '#f00' }}> *</span>
					</Label>
					{this.state.codeMirror && (
						<CodeMirror
							value={this.state.codeOther}
							onChange={this.updateCodeOther}
							options={{
								lineNumbers: true,
								mode: 'htmlembedded',
							}}
						/>
					)}
					{this.codeMirrorTouched && errors.code && (
						/* eslint-disable react/jsx-boolean-value */
						<FormFeedback invalid="true">{errors.code}</FormFeedback>
					)}
				</FormGroup>
				<IntlFieldGroup name="third_party_tracking" label={messages.tracking} />
			</div>
		);
	}

	renderForm({ handleSubmit, values, errors }) {
		// console.log(values);
		const {
			match: {
				params: { id },
			},
		} = this.props;
		const type = this.getParamValue('type');
		return (
			<form
				onSubmit={args => {
					handleSubmit(args);
					this.codeMirrorTouched = true;
				}}
			>
				{this.renderLoading()}
				{this.renderNameField()}
				{type === 'display' && this.renderSelectDisplayType()}
				{this.renderCPMSelect(values)}
				{type === 'display' && this.renderAltText()}
				{type === 'native' && this.renderNativeFields(values)}
				{type === 'other' && this.renderCustomCodeField(errors)}
				{type === 'native' && this.props.activeCreative && this.state.permissions ? (
					<div>
						<hr />
						{this.renderUploadPictureField()}
						<hr />
					</div>
				) : null}
				{(type === 'display' || type === 'video') && this.props.activeCreative && this.state.permissions ? (
					<div>
						<hr />
						{this.renderUploadField()}
					</div>
				) : null}
				{this.state.permissions ? (
					<div>
						{!this.props.activeCreative ||
						(this.props.activeCreative && !this.props.activeCreative.data) ? (
							<div className="submitFormBottom">
								<Button type="submit" color="success">
									{type !== 'other' ? (
										<FormattedMessage id="app.common.next" />
									) : (
										<FormattedMessage id="app.common.save" />
									)}
								</Button>
							</div>
						) : (
							<div className="submitFormBottom">
								<Button
									color="success"
									style={{
										maxHeight: '40px',
										top: '31px',
									}}
									onClick={() => {
										this.toggleForceEdit();
										this.setState({ continueEditing: false });
									}}
								>
									<FormattedMessage id="app.common.saveAndExit" />
								</Button>
								<Button
									color="info"
									style={{
										maxHeight: '40px',
										top: '31px',
										marginLeft: '10px',
									}}
									onClick={() => {
										this.setState({ continueEditing: true });
										this.toggleForceEdit();
									}}
								>
									<FormattedMessage id="app.common.save" />
								</Button>
							</div>
						)}
					</div>
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
					disabled: !this.state.permissions,
				}}
				required
			/>
		);
	}

	renderAltText() {
		return (
			<IntlFieldGroup
				name="alt_text"
				inputProps={{
					disabled: !this.state.permissions,
				}}
				label={messages.altText}
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

	changeURL(bannerId, values, type, banners) {
		console.log(values);
		const {
			match: {
				params: { id },
			},
		} = this.props;
		const banner = _.find(banners, ['id', bannerId]);
		let UTMString = `utm_source=ubex&utm_medium=cpm&utm_campaign=${id}&utm_content=${bannerId}&utm_term=${
			this.props.activeCreative && this.props.activeCreative.data && this.props.activeCreative.data.name
				? transliterate(this.props.activeCreative.data.name)
				: ''
		}&utmstat=us|ubex|cid|${id}|aid|${bannerId}|keyword|${
			this.props.activeCreative && this.props.activeCreative.data && this.props.activeCreative.data.name
				? transliterate(this.props.activeCreative.data.name)
				: ''
		}`;
		const tempObject = values;
		const pos = tempObject.callback_url.lastIndexOf('/');
		let str = tempObject.callback_url;
		UTMString = UTMString.replace(/ /g, '_');
		if (pos > 9 && str.indexOf(UTMString) === -1) {
			str = str.substring(0, pos);
		}
		if (this.state.generateUTM && str.indexOf(UTMString) === -1) {
			if (str.indexOf('?') !== -1) {
				str = `${str}&${UTMString}`;
			} else {
				str = `${str}/?${UTMString}`;
			}
		}

		this.props.changeBannerURL(bannerId, { callback_url: str }).then(() => {
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
		const {
			match: {
				params: { id },
			},
		} = this.props;
		if (!this.props.activeCreative || !this.props.activeCreative.banners) {
			return null;
		}
		const type = this.getParamValue('type');

		const uploadedBanners = this.props.activeCreative.banners.filter(banner => banner.aws_s3_location);

		return !this.isEditMode() && (type === 'display' || type === 'video') && uploadedBanners.length ? (
			<div className="adDetailsTable">
				{this.state.permissions ? (
					<div className="adDetailsTable__header">
						<h3>
							<FormattedMessage {...messages.bannerDetails} />
						</h3>
						<div className="checkbox-wrapper">
							<CustomInput
								id={id}
								type="checkbox"
								label={<span>Generate UTM tags</span>}
								checked={this.state.generateUTM}
								onClick={() =>
									this.setState({
										generateUTM: !this.state.generateUTM,
									})
								}
							/>
						</div>
					</div>
				) : null}
				<CreativeFileTable
					data={uploadedBanners}
					keyField="site"
					type={this.getActiveBannerType()}
					adSize={this.props.adSize}
					adSizeChange={(id, value) => this.changeAdSize(id, value)}
					onClickGetCode={(link, size, name) =>
						this.setState({ previewModal: link, previewSize: size, previewName: name })
					}
					onClickRemoveEntry={id => this.setState({ deletedSlot: id })}
					toggleEntryStatus={this.props.toggleSlotStatus}
					changeBannerURL={(id, values, typeAction) =>
						this.changeURL(id, values, typeAction, uploadedBanners)
					}
					removeBanner={id => this.removeBanner(id)}
					selectedImage={(id, image) => this.selectedBannerImage(id, image)}
					moderationError={moderationText => this.setState({ moderationText })}
					permissions={this.state.permissions}
				/>
			</div>
		) : null;
	}

	selectedBannerImage(id, image) {
		this.uploadBannerImage(id, image.target.files[0]);
	}

	uploadBannerImage(bannerId, image) {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.setState({
			uploadError: null,
		});
		const formData = new FormData();
		formData.append('banner_id', bannerId);
		formData.append('creative_id', id);
		formData.append('user_id', this.props.userId);
		formData.append(`file0`, image);

		this.props
			.onUpload(formData, `${API_URL}/api/upload/stub-img/`)
			.then(result => {
				this.props.getCreative(id);
				this.setState({
					fallBack: result.data && result.data.fallback ? result.data.fallback.upload_name : '',
				});
			})
			.catch(e => {
				if (e && e.error) {
					createToast('error', e.error);
				}
			});
	}

	render() {
		const type = this.getParamValue('type');
		const initValues = { cpm_type: 2, type: 'html5', cpm_optimal_price: false };
		const activeCounterCode =
			this.props.activeCreative &&
			(this.props.activeCreative !== null || this.props.activeCreative !== 'undefined') &&
			this.props.activeCreative.data &&
			!!Object.keys(this.props.activeCreative.data).length
				? this.props.activeCreative.data.code
				: null;
		const uploadedBanners =
			this.props.activeCreative && this.props.activeCreative.banners
				? this.props.activeCreative.banners.filter(banner => banner.aws_s3_location)
				: [];
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{!this.props.activeCreativeId ? (
									<FormattedMessage {...messages.addCreative} />
								) : (
									<FormattedMessage {...messages.editCreative} />
								)}
								{this.props.activeCreativeId && !isNaN(parseInt(this.props.activeCreativeId, 10)) ? (
									<span>{` #${this.props.activeCreativeId}`}</span>
								) : null}
							</h1>
							{this.props.activeCreative &&
								this.props.activeCreative.data &&
								this.props.activeCreative.data.created && (
									<span className="createdCampaign">
										Type: <span style={{ textTransform: 'capitalize' }}>{type}</span>
										{', '}
										{`Created at: ${moment(this.props.activeCreative.data.created).format(
											'DD-MM-YY HH:mm',
										)}`}
									</span>
								)}
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
										{this.props.activeCreative &&
										this.props.activeCreative.banners.length &&
										uploadedBanners.length &&
										this.props.publisherConfig &&
										this.props.publisherConfig.length ? (
											<div>
												<hr />
												<h3>
													<FormattedMessage {...messages.moderationChannel} />
												</h3>
												<ChannelSelect
													data={this.props.publisherConfig}
													creative={this.props.activeCreative}
													patchCreative={values =>
														this.props.patchCreative(this.props.activeCreative.id, values)
													}
													getCreatives={() => this.props.getCreatives()}
													permissions={this.state.permissions}
												/>
											</div>
										) : null}
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
					bannerName={this.state.previewName}
					size={this.state.previewSize}
					msg={this.state.previewModal}
					isOpen={this.state.previewModal}
					onCancel={() => this.setState({ previewModal: '', previewSize: null })}
				/>
				<ModerationModal
					isOpen={this.state.moderationText}
					title={messages.moderationTitle}
					onCancel={() => this.setState({ moderationText: null })}
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
	publisherConfig: selectPublishersConfig(),
});

function mapDispatchToProps(dispatch) {
	return {
		onUpload: (file, path) => makePromiseAction(dispatch, uploadRequest(file, path)),
		addCreative: values => makePromiseAction(dispatch, creativeCollectionActions.addEntry(values)),
		updateCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.updateEntry(id, values)),
		patchCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.patchEntry(id, values)),
		setActiveCreative: id => makePromiseAction(dispatch, creativeCollectionActions.setActiveEntry(id)),
		unsetActiveCreative: _ => dispatch(creativeCollectionActions.unsetActiveEntry()),
		getCreative: id => dispatch(creativeCollectionActions.getEntry(id)),
		getCreatives: () => dispatch(creativeCollectionActions.getCollection()),
		changeBannerURL: (id, values) => makePromiseAction(dispatch, bannersCollectionActions.patchEntry(id, values)),
		removeBanner: id => makePromiseAction(dispatch, bannersCollectionActions.removeEntry(id)),
		getPublishersConfig: () => dispatch(publisherConfig()),
		getAdSize: () => dispatch(getAdSize()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CreativeForm);
