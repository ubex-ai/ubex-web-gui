/**
 *
 * AddCounterForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Col, FormFeedback, FormGroup, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import MultiSelect from '@kenshooui/react-multi-select';
import IntlFieldGroup from 'components/IntlFieldGroup';
import checkboxForDjango from 'utils/checkboxForDjango';
import CodeCard from 'components/CodeCard';
import validateEmpty from 'utils/validateEmpty';
import AppCard from 'components/AppCard';
import AppAlertError from 'components/AppAlertError';
import { createStructuredSelector } from 'reselect';
import {
	selectBanners,
	selectPositions,
	slotsSelectors,
	selectAdvertAttributes,
	selectUserCategoryBlacklist,
	inventoriesSelectors,
} from 'containers/Publisher/selectors';
import { inventoryCollectionActions, slotCollectionActions } from 'containers/Publisher/actions';
import { selectCategories, selectLanguages } from 'containers/Dashboard/selectors';
import messages from 'containers/Publisher/components/SlotForm/messages';
import InventoryShape from 'containers/Publisher/shapes/Inventory';
import SlotShape from 'containers/Publisher/shapes/Slot';
/* eslint-disable react/prefer-stateless-function */
class SlotForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formDisabled: false,
			width: null,
			height: null,
			selectedBlockedCategories: [],
			selectedBlockedPlacementAttribute: [],
		};
		this.renderForm = this.renderForm.bind(this);
		this.formRef = null;
		this.selectedBlockedPlacementAttributeTouched = false;
		this.selectedBlockedCategoriesTouched = false;
		this.devicesTouched = false;
	}

	componentDidMount() {
		const {
			activeSlot,
			activeInventory,
			setActiveInventory,
			setActiveSlot,
			unsetActiveSlot,
			match: {
				params: { inventoryId, slotId },
			},
		} = this.props;

		if (!activeInventory) {
			if (inventoryId) {
				setActiveInventory(inventoryId);
			} else {
				return;
			}
		}

		if (!slotId) {
			this.formRef.form.reset({});
			unsetActiveSlot();
		} else if (!activeSlot || activeSlot.id !== slotId) {
			setActiveSlot(slotId);
		}

		if (activeSlot) {
			this.setInitialStateForEdit();
		}
	}

	componentDidUpdate(prevProps) {
		// Если было создание, нужно сделать редирект на редактирование
		if (
			!prevProps.activeSlot &&
			this.props.activeSlot &&
			this.props.location &&
			this.props.location.pathname === `/app/inventory/${this.props.activeInventoryId}/slot/add`
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/inventory/${this.props.activeInventoryId}/slot/${this.props.activeSlot.id}`);
		}
		// Установка значений категорий и алиасов при появлении активного счетчика
		this.setInitialStateForEdit(prevProps);
	}

	componentWillUnmount() {
		// сброс значений формы
		console.warn('componentWillUnmount');
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
	}

	setInitialStateForEdit(prevProps = {}) {
		const { activeSlot, activeInventory, categories, adAttributes, userCategoriesBlackList } = this.props;

		if (!activeSlot && prevProps.activeSlot) {
			this.setState({
				width: [],
				height: [],
				selectedBlockedCategories: [],
				selectedBlockedPlacementAttribute: [],
			});
		}

		if (!activeSlot || !activeInventory || activeSlot === prevProps.activeSlot) {
			return;
		}

		this.setState({
			selectedBlockedCategories: categories.filter(
				category =>
					activeSlot.category_blacklist.indexOf(category.id) >= 0 ||
					activeInventory.category_blacklist.indexOf(category.id) >= 0 ||
					userCategoriesBlackList.indexOf(category.id) >= 0,
			),
			selectedBlockedPlacementAttribute: adAttributes
				.filter(d => activeSlot.blocked_ad_attribute.indexOf(d.id) >= 0)
				.map(d => ({
					label: d.name,
					value: d.id,
					id: d.id,
				})),
			width: activeSlot.banner.width,
			height: activeSlot.banner.height,
		});
	}

	onSubmit(values = {}) {
		const {
			match: {
				params: { type },
			},
		} = this.props;
		const result = {
			...values,
			position: parseInt(values.position, 10),
			inventory: this.props.activeInventoryId,
			category_blacklist: this.state.selectedBlockedCategories.map(c => c.id),
			blocked_ad_attribute: this.state.selectedBlockedPlacementAttribute.map(c => c.id),
			floor_price_cpm: values.floor_price_cpm ? parseFloat(values.floor_price_cpm) : null,
		};
		if (type === 'web') {
			['is_pc', 'is_mobile', 'is_tablet', 'not_exact_size', 'optimal_floor_price'].forEach(k => {
				result[k] = checkboxForDjango(values[k]);
			});
		} else {
			['not_exact_size', 'optimal_floor_price'].forEach(k => {
				result[k] = checkboxForDjango(values[k]);
			});
		}
		if (values.not_exact_size) {
			result.banner = {
				banner: values.banner,
				width: this.state.width,
				height: this.state.height,
			};
		} else {
			const activeBanner = this.props.banners.find(b => b.id === parseInt(values.banner, 10));
			result.banner = {
				banner: activeBanner.id,
				width: activeBanner.width,
				height: activeBanner.height,
			};
		}
		if (this.props.activeSlot) {
			this.props.updateSlot(this.props.activeSlot.id, result);
		} else {
			this.props.addSlot(result);
		}
	}

	validate(formValues) {
		const {
			match: {
				params: { type },
			},
		} = this.props;
		const errors = {};
		errors.name = validateEmpty(formValues.name);
		if (formValues.not_exact_size) {
			errors.width = validateEmpty(this.state.width);
			errors.height = validateEmpty(this.state.height);
		} else {
			errors.banner = validateEmpty(formValues.banner);
		}
		if (
			typeof formValues.optimal_floor_price !== 'undefined' &&
			!formValues.optimal_floor_price &&
			!formValues.floor_price_cpm
		) {
			errors.floor_price_cpm = validateEmpty(formValues.floor_price_cpm);
		}
		errors.position = validateEmpty(formValues.position);
		if (type === 'web') {
			if (!formValues.is_pc && !formValues.is_mobile && !formValues.is_tablet) {
				errors.devices = 'Required. Min 1';
			}
		}
		return errors;
	}

	renderLoading() {
		if ((this.props.activeSlot && this.props.activeSlot.loading) || this.props.addSlotLoading) {
			return (
				<Alert color="light">
					<FormattedMessage id="app.common.loading" />
				</Alert>
			);
		}
		return null;
	}

	renderError() {
		if (this.props.activeSlot && this.props.activeSlot.error) {
			return <AppAlertError key="activeSlotError" message={this.props.activeSlot.error.message} />;
		}
		if (this.props.addSlotError && !this.props.activeSlot) {
			return <AppAlertError key="addSlotError" message={this.props.addSlotError.message} />;
		}
		return null;
	}

	renderForm({ handleSubmit, values, change, errors }) {
		const {
			adAttributes,
			banners,
			positions,
			categories,
			match: {
				params: { type },
			},
		} = this.props;
		return (
			<form
				onSubmit={args => {
					this.selectedBlockedCategoriesTouched = true;
					this.selectedBlockedPlacementAttributeTouched = true;
					this.devicesTouched = true;
					return handleSubmit(args);
				}}
			>
				<AppCard>
					{this.renderError()}
					{this.renderLoading()}
					<IntlFieldGroup name="name" label={messages.siteName} />
					{type === 'web' && (
						<label>
							<FormattedMessage {...messages.devices} />
						</label>
					)}
					{type === 'web' && (
						<Row>
							<Col md={2}>
								<IntlFieldGroup
									name="is_pc"
									inputProps={{
										type: 'checkbox',
										value: true,
										[values.is_pc ? 'checked' : false]: values.is_pc,
									}}
									label={messages.PC}
								/>
							</Col>
							<Col md={2}>
								<IntlFieldGroup
									name="is_mobile"
									inputProps={{
										type: 'checkbox',
										value: true,
										[values.is_mobile ? 'checked' : false]: values.is_mobile,
									}}
									label={messages.mobile}
								/>
							</Col>
							<Col md={1}>
								<IntlFieldGroup
									name="is_tablet"
									inputProps={{
										type: 'checkbox',
										value: true,
										[values.is_tablet ? 'checked' : false]: values.is_tablet,
									}}
									label={messages.tablet}
								/>
							</Col>
							<Col md={12}>
								{this.devicesTouched && errors.devices && (
									/* eslint-disable react/jsx-boolean-value */
									<FormFeedback invalid="true">{errors.devices}</FormFeedback>
								)}
							</Col>
						</Row>
					)}
					<hr />
					<Row>
						<Col md={6}>
							<IntlFieldGroup
								name="position"
								inputProps={{
									type: 'select',
									options: positions.map(({ value, name }) => ({ value, label: name })),
								}}
								label={messages.position}
							/>
						</Col>
						<Col md={6}>
							<IntlFieldGroup
								name="banner"
								inputProps={{
									type: 'select',
									onChange: e => {
										const b = this.props.banners.find(b => b.id === parseInt(e.target.value, 10));
										if (b) {
											this.setState({
												width: b.width,
												height: b.height,
											});
										}
										return e;
									},
									options: banners.map(({ id, label }) => ({ value: id, label })),
								}}
								label={messages.sizes}
							/>
						</Col>
					</Row>
					<hr />
					<IntlFieldGroup
						name="not_exact_size"
						inputProps={{
							type: 'checkbox',
							value: true,
							[values.not_exact_size ? 'checked' : 'c']: values.not_exact_size,
						}}
						label={messages.not_exact_size}
						html
					/>
					<Row>
						<Col md={6}>
							<IntlFieldGroup
								name="width"
								label={messages.width}
								inputProps={{
									value: this.state.width,
									onChange: e => this.setState({ width: parseInt(e.target.value, 10) }),
									disabled: !values.not_exact_size,
								}}
							/>
						</Col>
						<Col md={6}>
							<IntlFieldGroup
								name="height"
								label={messages.height}
								inputProps={{
									value: this.state.height,
									onChange: e => this.setState({ height: parseInt(e.target.value, 10) }),
									disabled: !values.not_exact_size,
								}}
							/>
						</Col>
					</Row>
					<hr />

					<IntlFieldGroup
						name="optimal_floor_price"
						inputProps={{
							type: 'checkbox',
							value: true,
							[values.optimal_floor_price ? 'checked' : 'checked']:
								typeof values.optimal_floor_price === 'undefined' || values.optimal_floor_price
									? 'checked'
									: '',
						}}
						label={messages.optimal_floor_price}
						html
					/>
					<IntlFieldGroup
						name="floor_price_cpm"
						label={messages.floor_price_cpm}
						inputProps={{
							disabled: typeof values.optimal_floor_price === 'undefined' || values.optimal_floor_price,
						}}
						prepend="$"
					/>

					<IntlFieldGroup name="back_fill" label={messages.back_fill} />
				</AppCard>
				<AppCard>
					<h2>
						<FormattedMessage {...messages.blackList} />
					</h2>
					<FormGroup>
						<Label>
							<FormattedMessage {...messages.blockedCategory} />
						</Label>
						<MultiSelect
							showSelectAll={false}
							items={categories}
							selectedItems={this.state.selectedBlockedCategories}
							onChange={items => {
								this.selectedBlockedCategoriesTouched = true;
								this.setState({ selectedBlockedCategories: items });
							}}
							itemHeight={30}
							height={200}
							selectedItemHeight={30}
							responsiveHeight={200}
						/>
						{this.selectedBlockedCategoriesTouched && errors.blockedCategories && (
							/* eslint-disable react/jsx-boolean-value */
							<FormFeedback invalid="true">{errors.blockedCategories}</FormFeedback>
						)}
					</FormGroup>
					<FormGroup>
						<Label>
							<FormattedMessage {...messages.BPA} />
						</Label>
						<MultiSelect
							showSelectAll={false}
							items={adAttributes.map(a => ({ label: a.name, value: a.id, id: a.id }))}
							selectedItems={this.state.selectedBlockedPlacementAttribute}
							onChange={items => {
								this.selectedBlockedPlacementAttributeTouched = true;
								this.setState({ selectedBlockedPlacementAttribute: items });
							}}
							itemHeight={30}
							height={200}
							selectedItemHeight={30}
							responsiveHeight={200}
						/>
						{this.selectedBlockedPlacementAttributeTouched && errors.blockedPlacementAttribute && (
							/* eslint-disable react/jsx-boolean-value */
							<FormFeedback invalid="true">{errors.blockedPlacementAttribute}</FormFeedback>
						)}
					</FormGroup>
					<Button
						type="submit"
						color="primary"
						disabled={this.props.activeSlot && this.props.activeSlot.loading}
					>
						{this.props.activeSlot && this.props.activeSlot.loading ? (
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
			match: {
				params: { type, slotId },
			},
			activeSlot,
		} = this.props;
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{this.props.activeSlotId ? (
									<FormattedMessage {...messages.editSlotHeader} />
								) : type === 'web' ? (
									<FormattedMessage {...messages.addSlotHeader} />
								) : (
									<FormattedMessage {...messages.addMobileSlotHeader} />
								)}{' '}
								{activeSlot && <span>({activeSlot.name})</span>}
							</h1>
						</div>
					</header>
					<Row>
						<Col sm={12} lg={7} md={7}>
							<Form
								validate={formValues => this.validate(formValues)}
								initialValues={slotId ? {
									...this.props.activeSlot,
									loading: null,
									error: null,
									banner: this.props.activeSlot ? this.props.activeSlot.banner.banner : null,
								} : {}}
								onSubmit={values => this.onSubmit(values)}
								ref={c => (this.formRef = c)}
								render={params => this.renderForm(params)}
							/>
						</Col>
						<Col md={5} sm={12}>
							<AppCard>
								{this.props.activeSlot ? (
									<div>
										<h3 className="title">
											<FormattedMessage {...messages.codeHeader} />
										</h3>
										<CodeCard embeddedScript={this.props.activeSlot.embedding_code} />
									</div>
								) : null}
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

SlotForm.propTypes = {
	activeInventory: PropTypes.shape(InventoryShape).isRequired,
	activeSlot: PropTypes.shape(SlotShape),
};

const mapStateToProps = createStructuredSelector({
	banners: selectBanners(),
	positions: selectPositions(),
	adAttributes: selectAdvertAttributes(),
	languages: selectLanguages(),
	categories: selectCategories(),
	activeInventory: inventoriesSelectors.activeEntry(),
	activeInventoryId: inventoriesSelectors.activeEntryId(),
	userCategoriesBlackList: selectUserCategoryBlacklist(),
	addSlotLoading: slotsSelectors.addEntryLoading(),
	addSlotError: slotsSelectors.addEntryError(),
	activeSlotId: slotsSelectors.activeEntryId(),
	activeSlot: slotsSelectors.activeEntry(),
});

function mapDispatchToProps(dispatch) {
	return {
		addSlot: values => dispatch(slotCollectionActions.addEntry(values)),
		updateSlot: (id, values) => dispatch(slotCollectionActions.updateEntry(id, values)),
		setActiveSlot: id => dispatch(slotCollectionActions.setActiveEntry(id)),
		unsetActiveSlot: _ => dispatch(slotCollectionActions.unsetActiveEntry()),
		setActiveInventory: id => dispatch(inventoryCollectionActions.setActiveEntry(id)),
		unsetActiveInventory: _ => dispatch(inventoryCollectionActions.unsetActiveEntry()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(SlotForm);
