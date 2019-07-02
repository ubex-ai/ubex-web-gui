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
import { Alert, Button, Col, Row, FormGroup, Label, Input } from 'reactstrap';
import { Form } from 'react-final-form';
import AppCard from 'components/AppCard';
import IntlFieldGroup from 'components/IntlFieldGroup';
import AppAlertError from 'components/AppAlertError';
import PreviewModal from 'components/PreviewModal';
import TableProgress from 'components/TableProgress';
import { uploadRequest } from 'utils/UploadHelper/actions';
import getGeneratedPageURL from 'utils/getBlob';
import validateEmpty from 'utils/validateEmpty';
import { creativesSelectors, creativeUploadingProgress, creativeIsUploading } from 'containers/TradingDesk/selectors';
import { selectUserGUID } from 'containers/UserPage/selectors';
import { creativeCollectionActions } from 'containers/TradingDesk/actions';
import messages from './messages';
import CreativeFileTable from '../CreativeFileTable';
import CreativeShape from '../../shapes/Creative';

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
			banners: [],
		};

		this.dropzone = null;
		this.formRef = null;
		this.renderForm = this.renderForm.bind(this);
		this.fileChange = this.fileChange.bind(this);
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
	}

	setInitialStateForEdit(prevProps = {}) {
		const { activeCreative } = this.props;
		if (!activeCreative && prevProps.activeCreative) {
			this.formRef.form.reset({});
		}

		if (!activeCreative || activeCreative === prevProps.activeCreative) {
		}
	}

	validate(formValues) {
		const errors = {};
		errors.name = validateEmpty(formValues.name);
		errors.type = validateEmpty(formValues.type);
		errors.cpm_type = validateEmpty(formValues.cpm_type);
		errors.cpm = validateEmpty(formValues.cpm);
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
		if (this.props.activeCreativeId) {
			this.props.updateCreative(this.props.activeCreativeId, result);
		} else {
			this.props.addCreative(result);
		}
	}

	getParamValue(paramName) {
		const {
			match: { params },
		} = this.props;

		return params[paramName];
	}

	fileChange(e) {
		this.setState({ [e.target.name]: e.target.files[0].name });
	}

	checkCode(e) {
		this.setState({ codeOther: e.target.value });
	}

	uploadBanner() {
		const {
			files,
			options: { url },
		} = this.dropzone;
		const formData = new FormData();
		formData.append('creative_id', this.props.activeCreative.id);
		formData.append('user_id', this.props.userId);
		formData.append('file1', files[0]);
		this.props.onUpload(formData, url);
		this.setState({
			filesDropped: false,
		});
	}

	getActiveBannerType() {
		if (this.formRef && this.formRef.form) {
			const { values } = this.formRef.form.getState();
			if (values && values.type) {
				return values.type;
			}
		}

		if (this.props.activeCreative && this.props.activeCreative.data && this.props.activeCreative.data.type) {
			return this.props.activeCreative.data.type;
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
		const urls = {
			html5: '/api/upload/html',
			image: '/api/upload/img',
		};
		return `${API_URL}${urls[activeBannerType]}`;
	}

	getUploadConfig() {
		const activeBannerType = this.getActiveBannerType();
		const type = this.getParamValue('type');
		const acceptedFiles = {
			displayimage: 'image/jpeg,image/png,image/gif',
			displayhtml5: 'application/zip',
			native: 'application/zip',
			video: 'video/mp4',
		};

		const iconFiletypes = {
			display: ['.jpg', '.png', '.gif', '.zip'],
			native: ['.zip'],
			video: ['.mp4'],
			image: ['.jpg', '.png', '.gif'],
			html5: ['.zip'],
		};
		return {
			djsConfig: {
				addRemoveLinks: true,
				autoProcessQueue: false,
				acceptedFiles: acceptedFiles[`${type}${activeBannerType}`],
				dictDefaultMessage: 'Drag and drop an file here or click',
			},
			componentConfig: {
				autoProcessQueue: false,
				iconFiletypes: iconFiletypes[activeBannerType],
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

	renderUploadField() {
		if (!this.props.activeCreative || !this.props.activeCreative.data || this.state.forceEdit) {
			return null;
		}
		if (this.props.creativeIsUploading) {
			return <TableProgress value={this.props.creativeUploadingProgress * 100} />;
		}
		const { djsConfig, componentConfig, eventHandlers } = this.getUploadConfig();

		return (
			<FormGroup className="file_upload">
				<Label for="exampleFile">
					<FormattedMessage {...messages.file} />
				</Label>
				<br />
				<div className="dropzone__area">
					<DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={djsConfig} />
				</div>
				<Button onClick={() => this.uploadBanner()} disabled={!this.state.filesDropped} color="info">
					<FormattedMessage id="app.common.submit" />
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
		if (this.props.activeCampaign && this.props.activeCampaign.error) {
			return <AppAlertError message={this.props.activeCampaign.error.message} />;
		}
		if (this.props.addCampaignError) {
			return <AppAlertError message={this.props.addCampaignError.message} />;
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

	renderNativeFields() {
		const { iconImage, mainImage } = this.state;
		return (
			<div>
				<Row className="form-group">
					<Col md={6}>
						<FormattedMessage {...messages.iconImage} />
						<br />
						<div className="file_upload btn btn-md btn-primary">
							Upload
							<input type="file" name="iconImage" accept="image/*" onChange={this.fileChange} />
						</div>
						<div className="display-inline button-margin-left-10">{iconImage}</div>
					</Col>
					<Col md={6}>
						<FormattedMessage {...messages.mainImage} />
						<br />
						<div className="file_upload btn btn-md btn-primary">
							Upload
							<input type="file" name="mainImage" accept="image/*" onChange={this.fileChange} />
						</div>
						<div className="display-inline button-margin-left-10">{mainImage}</div>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col md={6}>
						<IntlFieldGroup name="title" label={messages.title} />
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="description" label={messages.description} />
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="description" label={messages.callToAction} />
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="description" label={messages.additionalDescription} />
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="description" label={messages.clickURL} />
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="description" label={messages.thirdPartyViewTracking} />
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
						options: [],
					}}
					name="size"
					label={messages.adSize}
				/>
				<FormGroup className="file_upload">
					<Label for="Code">
						<FormattedMessage {...messages.code} />
					</Label>
					<Input type="textarea" onChange={e => this.checkCode(e).bind(this)} name="counterCode" rows="15" />
				</FormGroup>
				,<IntlFieldGroup name="size" label={messages.tracking} />,
			</div>
		);
	}

	renderForm({ handleSubmit, values }) {
		// console.log(values);

		const type = this.getParamValue('type');
		return (
			<form onSubmit={args => handleSubmit(args)}>
				{this.renderError()}
				{this.renderLoading()}
				{this.renderNameField()}
				{type === 'display' && this.renderSelectDisplayType()}
				{this.renderCPMSelect()}
				{type === 'native' && this.renderNativeFields()}
				{this.renderEditBtn()}
				{(type === 'display' || type === 'video') && this.props.activeCreative
					? this.renderUploadField()
					: null}
				{type === 'other' && this.renderCustomCodeField()}
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

	renderCreativeFilesTable() {
		if (!this.props.activeCreative || !this.props.activeCreative.banners) {
			return null;
		}
		const type = this.getParamValue('type');

		return !this.isEditMode() &&
			(type === 'display' || type === 'video') &&
			this.props.activeCreative.banners.length ? (
			<div>
				<h3>
					<FormattedMessage {...messages.adDetails} />
				</h3>
				<CreativeFileTable
					type={this.getParamValue('type')}
					data={this.props.activeCreative.banners}
					keyField="site"
					onClickGetCode={link => this.setState({ previewModal: link })}
					onClickRemoveEntry={id => this.setState({ deletedSlot: id })}
					toggleEntryStatus={this.props.toggleSlotStatus}
				/>
			</div>
		) : null;
	}

	render() {
		const type = this.getParamValue('type');
		const initValues = { cpm_type: 2, type: 'html5' };
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
												this.props.activeCreative !== null &&
												Object.keys(this.props.activeCreative).length
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
													src={getGeneratedPageURL(DOMPurify.sanitize(this.state.codeOther))}
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
});

function mapDispatchToProps(dispatch) {
	return {
		onUpload: (file, path) => dispatch(uploadRequest(file, path)),
		addCreative: values => dispatch(creativeCollectionActions.addEntry(values)),
		updateCreative: (id, values) => dispatch(creativeCollectionActions.updateEntry(id, values)),
		setActiveCreative: id => dispatch(creativeCollectionActions.setActiveEntry(id)),
		unsetActiveCreative: _ => dispatch(creativeCollectionActions.unsetActiveEntry()),
		getCreative: id => dispatch(creativeCollectionActions.getEntry(id)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CreativeForm);
