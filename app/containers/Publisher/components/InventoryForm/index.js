/**
 *
 * AddInventoryForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button, FormGroup, Label, FormFeedback, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import MultiSelect from '@kenshooui/react-multi-select';
import IntlFieldGroup from 'components/IntlFieldGroup';
import AppCard from 'components/AppCard';
import AppAlertError from 'components/AppAlertError';
import { createStructuredSelector } from 'reselect';
import validateDomain from 'utils/validateDomain';
import validateBundleID from 'utils/validateBundleID';
import validateAliases from 'utils/validateAliases';
import validateEmpty from 'utils/validateEmpty';
import { selectCategories, selectLanguages } from 'containers/Dashboard/selectors';
import { inventoriesSelectors, selectUserCategoriesBlacklist, selectDSP } from 'containers/Publisher/selectors';
import { inventoryCollectionActions } from 'containers/Publisher/actions';
import InventoryShape from 'containers/Publisher/shapes/Inventory';
import { INVENTORY_TYPES } from 'containers/Publisher/constants';
import messages, { scope as messageScope } from 'containers/Publisher/components/InventoryForm/messages';
import DomainDynamicField from 'components/DomainDynamicField';

/* eslint-disable react/prefer-stateless-function */
class InventoryForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formDisabled: false,
			embeddedScript: null,
			aliases: [],
			selectedBlockedCategories: [],
			selectedBlockedDSP: [],
			types: [{ id: 1, value: 'ios', label: 'iOS' }, { id: 2, value: 'android', label: 'Android' }],
		};
		this.renderForm = this.renderForm.bind(this);
		this.formRef = null;
		this.blockedCategoryListTouched = false;
		this.blockedDSPTouched = false;
		this.validate = this.validate.bind(this);
	}

	componentDidMount() {
		const {
			activeInventory,
			setActiveInventory,
			unsetActiveInventory,
			match: {
				params: { inventoryId },
			},
		} = this.props;

		if (!inventoryId) {
			this.formRef.form.reset({});
			unsetActiveInventory();
		} else if (!activeInventory || activeInventory.id !== parseInt(inventoryId, 10)) {
			setActiveInventory(inventoryId);
		}

		if (activeInventory) {
			this.setInitialStateForEdit();
		}
	}

	componentDidUpdate(prevProps) {
		const { type } = this.props.match.params;
		// Если было создание, нужно сделать редирект на редактирование
		if (
			!prevProps.activeInventory &&
			this.props.activeInventory &&
			this.props.location &&
			this.props.location.pathname === `/app/inventory/${type}/add`
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/inventory/${type}/edit/${this.props.activeInventory.id}/`);
		}
		this.setInitialStateForEdit(prevProps);
	}

	componentWillUnmount() {
		// сброс значений формы
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
	}

	setInitialStateForEdit(prevProps = {}) {
		const { activeInventory, categories, dsp, userCategoriesBlackList } = this.props;

		if (!activeInventory && prevProps.activeInventory) {
			this.setState({
				aliases: [],
				selectedBlockedCategories: [],
				selectedBlockedDSP: [],
			});
		}

		if (!activeInventory || activeInventory === prevProps.activeInventory) {
			return;
		}

		this.setState({
			selectedBlockedCategories: categories.filter(
				category =>
					activeInventory.category_blacklist.indexOf(category.id) >= 0 ||
					userCategoriesBlackList.indexOf(category.id) >= 0,
			),
			aliases: activeInventory.aliases,
			selectedBlockedDSP: dsp
				.map(d => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeInventory.dsp_blacklist.indexOf(d.id) >= 0),
		});
	}

	validate(formValues) {
		const {
			match: {
				params: { type },
			},
		} = this.props;
		const errors = {};
		errors.language = validateEmpty(formValues.language);
		if (formValues.type) {
			errors.type = validateEmpty(formValues.type);
		}
		errors.name = validateEmpty(formValues.name);
		if (formValues.inventory_id) {
			errors.inventory_id = validateEmpty(formValues.inventory_id);
			if (type === 'web') {
				errors.inventory_id = validateDomain(formValues.inventory_id);
			} else {
				errors.inventory_id = validateBundleID(formValues.inventory_id);
			}
		}
		if (this.state.aliases && this.state.aliases.length) {
			errors.aliases = validateAliases(formValues.aliases);
		}
		console.log(errors);
		return errors;
	}

	onSubmit(values) {
		const result = {
			...values,
			language: parseInt(values.language, 10),
			type: values.type ? values.type : INVENTORY_TYPES.web,
			aliases: values.aliases ? values.aliases.filter(a => !!a) : [],
			category_blacklist: this.state.selectedBlockedCategories.map(c => c.id),
			dsp_blacklist: this.state.selectedBlockedDSP.map(c => c.id),
		};

		if (this.props.activeInventory) {
			this.props.updateInventory(this.props.activeInventory.id, result);
		} else {
			this.props.addInventory(result);
		}
	}

	renderLoading() {
		if ((this.props.activeInventory && this.props.activeInventory.loading) || this.props.addInventoryLoading) {
			return (
				<Alert color="light">
					<FormattedMessage id="app.common.loading" />
				</Alert>
			);
		}
		return null;
	}

	renderError() {
		if (this.props.activeInventory && this.props.activeInventory.error) {
			return <AppAlertError message={this.props.activeInventory.error.message} />;
		}
		if (this.props.addCounterError) {
			return <AppAlertError message={this.props.addCounterError.message} />;
		}
		return null;
	}

	renderForm({ handleSubmit, change, errors }) {
		const {
			languages,
			categories,
			activeInventory,
			dsp,
			match: {
				params: { type },
			},
		} = this.props;
		const { types } = this.state;
		return (
			<form
				onSubmit={args => {
					this.blockedCategoryListTouched = true;
					this.blockedDSPTouched = true;
					return handleSubmit(args);
				}}
			>
				<AppCard>
					{this.renderError()}
					{this.renderLoading()}
					<IntlFieldGroup name="name" label={messages.siteName} />
					{type !== 'web' && (
						<IntlFieldGroup
							name="type"
							inputProps={{
								type: 'select',
								options: types.map(l => ({ id: l.id, value: l.value, label: l.label })),
							}}
							label={messages.platforms}
						/>
					)}
					<IntlFieldGroup name="inventory_id" label={type === 'web' ? messages.domain : messages.bundleId} />
					{type === 'web' && (
						<div className="form-group">
							<Button
								onClick={e => {
									e.preventDefault();
									this.setState(prevState => ({
										aliases: [...prevState.aliases, prevState.aliases.length],
									}));
								}}
								color="success"
							>
								<FormattedMessage {...messages.addAlias} />
							</Button>
						</div>
					)}
					{this.state.aliases.map((alias, index) => (
						<FormattedMessage
							key={`domain_${index}`}
							id={`${messageScope}.inventoryForm.domainAlias`}
							values={{ number: index + 1 }}
						>
							{msg => (
								<DomainDynamicField
									msg={msg}
									index={index}
									changeValue={change}
									name={`aliases[${index}]`}
									onClickRemove={(e, index) => {
										e.preventDefault();

										this.setState(prevState => ({
											aliases: prevState.aliases.filter((a, i) => i !== index),
										}));
									}}
								/>
							)}
						</FormattedMessage>
					))}
					<IntlFieldGroup
						name="language"
						inputProps={{
							type: 'select',
							options: languages.map(l => ({ id: l.id, value: l.id, label: l.name })),
						}}
						label={messages.language}
					/>
				</AppCard>
				<AppCard>
					<h2>Black List</h2>
					<FormGroup>
						<Label>
							<FormattedMessage {...messages.blockedCategories} />
						</Label>
						<MultiSelect
							showSelectAll={false}
							items={categories}
							selectedItems={this.state.selectedBlockedCategories}
							onChange={selectedBlockedCategories => {
								this.setState({ selectedBlockedCategories });
							}}
						/>
						{this.blockedCategoryListTouched && errors.blockedCategories && (
							/* eslint-disable react/jsx-boolean-value */
							<FormFeedback invalid="true">{errors.blockedCategories}</FormFeedback>
						)}
					</FormGroup>
					<FormGroup>
						<Label>
							<FormattedMessage {...messages.blockedDSP} />
						</Label>
						<MultiSelect
							showSelectAll={false}
							items={dsp.map(d => ({ id: d.id, label: d.name, value: d.id }))}
							selectedItems={this.state.selectedBlockedDSP}
							onChange={items => {
								this.blockedDSPTouched = true;
								this.setState({ selectedBlockedDSP: items });
							}}
						/>
						{this.blockedDSPTouched && errors.blockedDSP && (
							<FormFeedback invalid="true">{errors.blockedDSP}</FormFeedback>
						)}
					</FormGroup>
					<Button type="submit" color="primary" disabled={activeInventory && activeInventory.loading}>
						{activeInventory && activeInventory.loading ? (
							<FormattedMessage id="app.common.loading" />
						) : (
							<FormattedMessage id="app.common.submit" />
						)}
					</Button>
				</AppCard>
			</form>
		);
	}

	render() {
		const {
			activeInventory,
			match: {
				params: { type },
			},
		} = this.props;
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{activeInventory ? (
									<FormattedMessage {...messages.editSiteHeader} />
								) : type === 'web' ? (
									<FormattedMessage {...messages.addSiteHeader} />
								) : (
									<FormattedMessage {...messages.addBundleHeader} />
								)}
							</h1>
						</div>
					</header>
					<Row>
						<Col sm={12} lg={7} md={8} xs={12}>
							<Form
								validate={formValues => this.validate(formValues)}
								initialValues={activeInventory}
								onSubmit={values => this.onSubmit(values)}
								ref={c => (this.formRef = c)}
								render={this.renderForm}
							/>
						</Col>
						<Col md={4}>
							<AppCard>
								{type === 'web' ? (
									<FormattedHTMLMessage {...messages.instructionsText} />
								) : (
									<FormattedHTMLMessage {...messages.instructionsTextBundle} />
								)}
							</AppCard>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

InventoryForm.propTypes = {
	languages: PropTypes.array,
	inventories: PropTypes.arrayOf(PropTypes.shape(InventoryShape)),
	activeInventory: PropTypes.shape(InventoryShape),
	addInventoryLoading: PropTypes.bool,
	addInventoryError: PropTypes.object,
	addInventory: PropTypes.func,
	getInventory: PropTypes.func,
	updateInventory: PropTypes.func,
	setActiveInventory: PropTypes.func,
	unsetActiveInventory: PropTypes.func,
	userCategoriesBlackList: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
	languages: selectLanguages(),
	dsp: selectDSP(),
	categories: selectCategories(),
	userCategoriesBlackList: selectUserCategoriesBlacklist(),
	inventories: inventoriesSelectors.collectionList(),
	activeInventory: inventoriesSelectors.activeEntry(),
	addInventoryLoading: inventoriesSelectors.addEntryLoading(),
	addInventoryError: inventoriesSelectors.addEntryError(),
});

function mapDispatchToProps(dispatch) {
	return {
		addInventory: values => dispatch(inventoryCollectionActions.addEntry(values)),
		updateInventory: (id, values) => dispatch(inventoryCollectionActions.updateEntry(id, values)),
		setActiveInventory: id => dispatch(inventoryCollectionActions.setActiveEntry(id)),
		unsetActiveInventory: _ => dispatch(inventoryCollectionActions.unsetActiveEntry()),
		getInventory: id => dispatch(inventoryCollectionActions.getInventory(id)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(InventoryForm);
