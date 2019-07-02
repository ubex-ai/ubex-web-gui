/**
 *
 * AddCounterForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Button, FormGroup, Label, FormFeedback, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Form } from 'react-final-form';
import CodeCard from 'components/CodeCard';
import MultiSelect from '@kenshooui/react-multi-select';
import validateDomain from 'utils/validateDomain';
import validateEmpty from 'utils/validateEmpty';
import validateAliases from 'utils/validateAliases';
import checkboxForDjango from 'utils/checkboxForDjango';
import IntlFieldGroup from 'components/IntlFieldGroup';
import AppCard from 'components/AppCard';
import AppAlertError from 'components/AppAlertError';
import { createStructuredSelector } from 'reselect';
import { selectCategories, selectCountries, selectTimezones } from 'containers/Dashboard/selectors';
import { countersSelectors } from 'containers/DataMiner/selectors';
import {
	addCounter,
	updateCounter,
	setActiveCounter,
	unsetActiveCounter,
	getCounter,
} from 'containers/DataMiner/actions';
import DomainDynamicField from 'components/DomainDynamicField';
import messages, { scope as messageScope } from 'containers/DataMiner/messages';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';

/* eslint-disable react/prefer-stateless-function */
class CounterForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formDisabled: false,
			embeddedScript: null,
			aliases: [],
			selectedCategories: [],
		};
		this.renderForm = this.renderForm.bind(this);
		this.formRef = null;
		this.categoryListTouched = false;
	}

	componentDidMount() {
		const {
			activeCounter,
			setActiveCounter,
			unsetActiveCounter,
			match: {
				params: { id },
			},
		} = this.props;

		if (!id) {
			this.formRef.form.reset({});
			unsetActiveCounter();
		} else if (!activeCounter || activeCounter.id !== parseInt(id, 10)) {
			setActiveCounter(id);
		}

		if (id) {
			this.props.getCounter(this.props.match.params.id);
		}

		if (activeCounter) {
			this.setInitialStateForEdit();
		}
	}

	componentDidUpdate(prevProps) {
		// Если было создание, нужно сделать редирект на редактирование
		if (
			!prevProps.activeCounter &&
			this.props.activeCounter &&
			this.props.location &&
			this.props.location.pathname === '/app/counter/add'
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/counter/${this.props.activeCounter.id}`);
			this.edit = true;
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
		const { activeCounter, categories } = this.props;
		if (!activeCounter && prevProps.activeCounter) {
			this.setState({
				aliases: [],
				selectedCategories: [],
			});
		}

		if (!activeCounter || activeCounter === prevProps.activeCounter) {
			return;
		}

		this.setState({
			aliases: activeCounter.aliases ? activeCounter.aliases : [],
			selectedCategories: activeCounter.categories
				? categories.filter(category => activeCounter.categories.indexOf(category.id) >= 0)
				: [],
		});
	}

	validate(formValues) {
		const errors = {};

		errors.name = validateEmpty(formValues.name);
		errors.main_domain = validateEmpty(formValues.main_domain);
		errors.region = validateEmpty(formValues.region);
		errors.timezone = validateEmpty(formValues.timezone);
		errors.is_agreed_process_data = validateEmpty(formValues.is_agreed_process_data);

		if (this.state.aliases && this.state.aliases.length) {
			errors.aliases = validateAliases(formValues.aliases);
		}
		if (!errors.main_domain) {
			errors.main_domain = validateDomain(formValues.main_domain);
		}

		if (!this.state.selectedCategories.length || this.state.selectedCategories.length > 3) {
			errors.categories = 'Required. Min 1, max 3';
		}

		return errors;
	}

	onSubmit(values) {
		const result = {
			...values,
			timezone: parseInt(values.timezone, 10),
			region: parseInt(values.region, 10),
			categories: this.state.selectedCategories.map(c => c.id),
			aliases: values.aliases ? values.aliases.filter(a => !!a) : [],
		};
		['is_agreed_process_data', 'is_allowed_keep_customers_ip', 'is_subdomain_accept'].forEach(k => {
			result[k] = checkboxForDjango(values[k]);
		});
		if (this.props.activeCounterId) {
			this.props.updateCounter(this.props.activeCounterId, result).then(() => {
				createToast('success', 'Counter successfully updated!');
			});
		} else {
			this.props.addCounter(result).then(() => {
				createToast('success', 'Counter successfully added!');
			});
		}
	}

	renderLoading() {
		if ((this.props.activeCounter && this.props.activeCounter.loading) || this.props.addCounterLoading) {
			return (
				<Alert color="light">
					<FormattedMessage id="app.common.loading" />
				</Alert>
			);
		}
		return null;
	}

	renderError() {
		if (this.props.activeCounter && this.props.activeCounter.error) {
			return <AppAlertError message={this.props.activeCounter.error.message} />;
		}
		if (this.props.addCounterError) {
			return <AppAlertError message={this.props.addCounterError.message} />;
		}
		return null;
	}

	renderForm({ handleSubmit, values, change, errors }) {
		return (
			<form
				onSubmit={args => {
					this.categoryListTouched = true;
					return handleSubmit(args);
				}}
			>
				{this.renderError()}
				{this.renderLoading()}
				<Alert color="danger">
					<FormattedHTMLMessage {...messages.attention} />
				</Alert>
				<IntlFieldGroup name="name" label={messages.siteName} />
				<IntlFieldGroup
					name="is_subdomain_accept"
					inputProps={{
						type: 'checkbox',
						values: true,
						[values.is_subdomain_accept ? 'checked' : false]: values.is_subdomain_accept,
					}}
					label={messages.agreement}
				/>
				<IntlFieldGroup
					name="main_domain"
					label={messages.domain}
					inputGroupProps={{
						className: 'form-group',
					}}
					inputGroupAddonProps={{
						addonType: 'append',
					}}
					validate={validateDomain}
				/>
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
				{this.state.aliases.map((alias, index) => (
					<FormattedMessage
						key={`domain_${index}`}
						id={`${messageScope}.counterForm.domainAlias`}
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
					name="region"
					inputProps={{ type: 'select', options: this.props.countries }}
					label={messages.region}
				/>
				<IntlFieldGroup
					name="timezone"
					inputProps={{ type: 'select', options: this.props.timezones }}
					label={messages.timezone}
				/>
				<FormGroup>
					<Label>
						<FormattedMessage {...messages.categories} />
					</Label>
					<MultiSelect
						showSelectAll={false}
						items={this.props.categories}
						selectedItems={this.state.selectedCategories}
						onChange={selectedCategories => {
							this.categoryListTouched = true;
							this.setState({ selectedCategories });
						}}
					/>
					{this.categoryListTouched &&
						errors.categories && (
					/* eslint-disable react/jsx-boolean-value */
						<FormFeedback invalid="true">{errors.categories}</FormFeedback>
					)}
				</FormGroup>
				<IntlFieldGroup
					name="is_agreed_process_data"
					inputProps={{
						type: 'checkbox',
						value: true,
						[values.is_agreed_process_data ? 'checked' : false]: values.is_agreed_process_data,
					}}
					label={messages.agreement2}
					html
				/>

				<IntlFieldGroup
					name="is_allowed_keep_customers_ip"
					inputProps={{
						type: 'checkbox',
						value: true,
						[values.is_allowed_keep_customers_ip ? 'checked' : 'c']: values.is_allowed_keep_customers_ip,
					}}
					label={messages.agreement3}
					html
				/>
				<Button
					type="submit"
					color="primary"
					disabled={this.props.activeCounter && this.props.activeCounter.loading}
				>
					{this.props.activeCounter && this.props.activeCounter.loading ? (
						<FormattedMessage id="app.common.loading" />
					) : (
						<FormattedMessage id="app.common.submit" />
					)}
				</Button>
			</form>
		);
	}

	render() {
		const { activeCounter } = this.props;
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{activeCounter ? (
									<FormattedMessage {...messages.EditCounterHeader} />
								) : (
									<FormattedMessage {...messages.AddCounterHeader} />
								)}
								{activeCounter && <span> {activeCounter.id}</span>}
							</h1>
						</div>
					</header>
					<Row>
						<Col sm={12} md={6}>
							<AppCard>
								<Form
									validate={formValues => this.validate(formValues)}
									initialValues={activeCounter}
									onSubmit={values => this.onSubmit(values)}
									ref={c => (this.formRef = c)}
									render={this.renderForm}
								/>
							</AppCard>
						</Col>
						<Col sm={12} lg={6} md={6}>
							<AppCard>
								<h3 className="title">
									<FormattedMessage {...messages.counterCode} />
								</h3>
								<p>
									<FormattedHTMLMessage {...messages.counterDescription} />
								</p>
								<CodeCard
									messages={messages}
									embeddedScript={activeCounter ? activeCounter.embedded_script : ''}
								/>
							</AppCard>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

CounterForm.propTypes = {
	addCounter: PropTypes.func.isRequired,
	getCounter: PropTypes.func.isRequired,
	setActiveCounter: PropTypes.func.isRequired,
	unSetActiveCounter: PropTypes.func.isRequired,
	activeCounter: PropTypes.object,
	activeCounterId: PropTypes.number,
	timezones: PropTypes.array,
	categories: PropTypes.array,
	countries: PropTypes.array,
	addCounterLoading: PropTypes.bool,
	addCounterError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	timezones: selectTimezones(),
	categories: selectCategories(),
	countries: selectCountries(),
	activeCounterId: countersSelectors.activeEntryId(),
	activeCounter: countersSelectors.activeEntry(),
	addCounterLoading: countersSelectors.addEntryLoading(),
	addCounterError: countersSelectors.addEntryError(),
});

function mapDispatchToProps(dispatch) {
	return {
		addCounter: values => makePromiseAction(dispatch, addCounter(values)),
		updateCounter: (id, values) => makePromiseAction(dispatch, updateCounter(id, values)),
		setActiveCounter: id => dispatch(setActiveCounter(id)),
		unsetActiveCounter: _ => dispatch(unsetActiveCounter()),
		getCounter: id => dispatch(getCounter(id)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CounterForm);
