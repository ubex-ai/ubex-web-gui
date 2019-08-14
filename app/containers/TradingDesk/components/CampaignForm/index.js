/**
 *
 * CampaignForm
 *
 */

import React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Alert, Button, Col, FormFeedback, FormGroup, Label, Row } from 'reactstrap';
import moment from 'moment';
import { Form } from 'react-final-form';
import AppCard from 'components/AppCard';
import IntlFieldGroup from 'components/IntlFieldGroup';
import AppAlertError from 'components/AppAlertError';
import MultiSelect from '@kenshooui/react-multi-select';
import TimeTable from 'components/TimeTable';
import DomainDynamicField from 'components/DomainDynamicField';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
	campaingsSelectors,
	creativesSelectors,
	selectAgeGroup,
	selectBrowserType,
	selectCountersIdsAndNames,
	selectDeviceType,
	selectGender,
	selectPlacement,
	selectSSP,
	selectStrategy,
	selectTypeOS,
	selectBudgetDistribution,
	selectLanguages,
} from 'containers/TradingDesk/selectors';
import validateEmail from 'utils/validateEmail';
import validateEmails from 'utils/validateEmails';
import validateInteger from 'utils/validateInteger';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import formatDateToUTC from 'utils/formatDateToUTC';
import { selectCategories, selectCountries, selectTimezones } from '../../../Dashboard/selectors';
import messages, { scope as messageScope } from './messages';
import validateEmpty from 'utils/validateEmpty';
import { campaingCollectionActions, creativeCollectionActions } from '../../actions';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import findTimezone from 'utils/findTimezone';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CampaignForm extends React.Component {
	constructor(props) {
		super(props);
		const {
			match: {
				params: { idCampaign },
			},
		} = props;
		this.state = {
			today: moment().format('YYYY-MM-DD'),
			emails: [],
			openCard: 'mainInfo',
			startDate: moment(),
			endDate: null,
			timetable: [],
			deviceTypeSelected: [],
			osTypeSelected: [],
			browserTypeSelected: [],
			ageGroupSelected: [],
			SSPSelected: [],
			creativesSelected: [],
			geoSelected: [],
			categoriesSelected: [],
			minTime: moment(),
			activeCampaign: props.activeCampaign ? props.activeCampaign : {},
		};

		this.deviceTypeTouched = false;
		this.osTypeTouched = false;
		this.browserTypeTouched = false;
		this.ageGroupTouched = false;
		this.languageTouched = false;
		this.SSPTouched = false;
		this.creativesTouched = false;
		this.geoTouched = false;
		this.categoriesTouched = false;
		this.formRef = null;
		this.errors = null;
		this.sent = false;
		this.renderForm = this.renderForm.bind(this);
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.validate = this.validate.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		const {
			activeCampaign,
			setActiveCampaign,
			unsetActiveCampaign,
			getCampaign,
			match: {
				params: { idCampaign },
			},
		} = this.props;
		if (!idCampaign) {
			unsetActiveCampaign();
		} else if (!activeCampaign || activeCampaign.id !== parseInt(idCampaign, 10)) {
			setActiveCampaign(idCampaign);
		}
		if (activeCampaign) {
			this.setInitialStateForEdit();
		}
	}

	componentWillUnmount() {
		// сброс значений формы
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
		this.sent = false;
		this.setState({ activeCampaign: null });
	}

	componentDidUpdate(prevProps) {
		const { activeCampaign, unsetActiveCampaign, addCampaignError } = this.props;
		// this.setInitialStateForEdit(prevProps);
		if (JSON.stringify(prevProps.activeCampaign) !== JSON.stringify(activeCampaign) && this.sent) {
			this.props.history.push({ pathname: `/app/campaigns/list` });
			unsetActiveCampaign();
		}
		this.setInitialStateForEdit(prevProps);
	}

	setInitialStateForEdit(prevProps = {}) {
		const {
			activeCampaign,
			setActiveCampaign,
			unsetActiveCampaign,
			counters,
			creatives,
			categories,
			geo,
			deviceType,
			osType,
			browserType,
			ageGroup,
			SSP,
			countries,
			language,
			match: {
				params: { idCampaign },
			},
		} = this.props;

		if (!activeCampaign && prevProps.activeCampaign) {
			this.setState({
				deviceTypeSelected: [],
				osTypeSelected: [],
				browserTypeSelected: [],
				ageGroupSelected: [],
				SSPSelected: [],
				creativesSelected: [],
				geoSelected: [],
				categoriesSelected: [],
				startDate: moment(),
				endDate: null,
				timetable: [],
				emails: [],
				activeCampaign: null,
			});
		}

		if (!activeCampaign || activeCampaign === prevProps.activeCampaign) {
			return;
		}

		const actCampaign = {
			...activeCampaign,
			stop_advertising: activeCampaign.monitoring.stop_advertising,
			counter: activeCampaign.monitoring.counter,
			main_email: activeCampaign.monitoring.notification_emails.length
				? activeCampaign.monitoring.notification_emails[
						activeCampaign.monitoring.notification_emails.length - 1
				  ]
				: '',
			emails:
				activeCampaign && activeCampaign.monitoring.notification_emails
					? activeCampaign.monitoring.notification_emails.slice(
							activeCampaign.monitoring.notification_emails.pop(),
					  )
					: [],
		};
		this.setState({
			emails:
				activeCampaign &&
				activeCampaign.monitoring.notification_emails &&
				activeCampaign.monitoring.notification_emails.length > 1
					? activeCampaign.monitoring.notification_emails.slice(
							activeCampaign.monitoring.notification_emails.pop(),
					  )
					: activeCampaign.monitoring.notification_emails.length === 1
						? activeCampaign.monitoring.notification_emails
						: [],
			startDate: moment(activeCampaign.start_date),
			endDate: activeCampaign.end_date ? moment(activeCampaign.end_date) : null,
			deviceTypeSelected: deviceType
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.device_type.indexOf(d.id) >= 0),
			osTypeSelected: osType
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.device_os.indexOf(d.id) >= 0),
			browserTypeSelected: browserType
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.device_browser.indexOf(d.id) >= 0),
			ageGroupSelected: ageGroup
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.audience_age_group.indexOf(d.id) >= 0),
			languageSelected: language
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.language.indexOf(d.id) >= 0),
			SSPSelected: SSP.map((d, i) => ({ id: d.id, label: d.name, value: d.id })).filter(
				d => activeCampaign.ssp_blacklist.indexOf(d.id) >= 0,
			),
			creativesSelected: creatives
				.map((d, i) => ({
					id: d.id,
					label: d.data ? d.data.name : 'Unnamed',
					value: d.id,
					group: d.creative_type,
				}))
				.filter(d => activeCampaign.creatives.some(creative => creative.value === d.id)),
			geoSelected: geo
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.target_geo.indexOf(d.id) >= 0),
			categoriesSelected: categories
				.map((d, i) => ({ id: d.id, label: d.name, value: d.id }))
				.filter(d => activeCampaign.target_category.indexOf(d.id) >= 0),
			activeCampaign: actCampaign,
		});
	}

	validate(formValues) {
		const errors = {};
		errors.name = validateEmpty(formValues.name) || validateStringAndNumber(formValues.name);
		errors.audience_type = validateEmpty(formValues.audience_type);
		errors.strategy = validateEmpty(formValues.strategy);
		if (!validateEmpty(formValues.budget) && formValues.budget.length < 3) {
			errors.budget = 'Budget must be at least $100';
		} else {
			errors.budget = validateEmpty(formValues.budget);
		}
		errors.budget_allocation_strategy = validateEmpty(formValues.budget_allocation_strategy);
		errors.show_position = validateEmpty(formValues.show_position);
		errors.startDate = validateEmpty(this.state.startDate);
		if (!validateEmpty(formValues.main_email)) {
			errors.main_email = validateEmail(formValues.main_email);
		}
		if (validateInteger(formValues.frequency) && formValues.frequency !== '') {
			errors.frequency = 'Numeric value only';
		}
		if (validateInteger(formValues.impressions_limit) && formValues.impressions_limit !== '') {
			errors.impressions_limit = 'Numeric value only';
		}
		if (validateInteger(formValues.daily_impressions_limit) && formValues.daily_impressions_limit !== '') {
			errors.daily_impressions_limit = 'Numeric value only';
		}
		if (validateInteger(formValues.daily_budget) && formValues.daily_budget !== '') {
			errors.daily_budget = 'Numeric value only';
		}
		if (validateInteger(formValues.budget) && formValues.budget !== '') {
			errors.budget = 'Numeric value only';
		}
		// errors.counter = validateEmpty(formValues.counter);
		errors.timezone = validateEmpty(formValues.timezone);
		if (!this.state.geoSelected.length) {
			errors.geo = 'Required';
		}
		/* if (!this.state.creativesSelected.length) {
			errors.creatives = 'Required';
		} */
		if (this.state.emails && this.state.emails.length) {
			errors.emails = validateEmails(formValues.emails);
		}
		return errors;
	}

	static notificationEmails(string, array) {
		let tempArray = [];

		if (string && !array) {
			tempArray.push(string);
		}
		if (!string && array) {
			tempArray = array;
		}
		if (string && array) {
			tempArray = [...array, string];
		}

		return tempArray.filter(email => email !== null || email !== '' || email !== 'undefined');
	}

	onSubmit(values) {
		const {
			activeCampaign,
			match: {
				params: { idGroup, idCampaign },
			},
		} = this.props;
		const result = {
			...values,
			campaign_group: idGroup || activeCampaign.campaign_group,
			monitoring: {
				counter: values.counter,
				stop_advertising: values.stop_advertising || false,
				notification_emails: CampaignForm.notificationEmails(values.main_email, values.emails),
			},
			start_date: formatDateToUTC(this.state.startDate).format('YYYY-MM-DDTHH:mm'),
			end_date: this.state.endDate ? formatDateToUTC(this.state.endDate).format('YYYY-MM-DDTHH:mm') : null,
			time_targeting: this.state.timetable,
			device_type: this.state.deviceTypeSelected.map(c => c.id),
			device_os: this.state.osTypeSelected.map(c => c.id),
			device_browser: this.state.browserTypeSelected.map(c => c.id),
			target_geo: this.state.geoSelected.map(c => c.id),
			target_category: this.state.categoriesSelected.map(c => c.id),
			audience_age_group: this.state.ageGroupSelected.map(c => c.id),
			language: this.state.languageSelected.map(c => c.id),
			ssp_blacklist: this.state.SSPSelected.map(c => c.id),
			creatives: this.state.creativesSelected.map(c => ({ value: c.id, start_date: null, end_date: null })),
		};

		if (!idCampaign) {
			result.status = 'active';
		}
		if (this.props.activeCampaign) {
			this.sent = true;
			this.props.patchCampaign(idCampaign, result).then(() => {
				createToast('success', 'Campaign successfully updated!');
			});
		} else {
			this.sent = true;
			this.props.addCampaign(result).then(() => {
				createToast('success', 'Campaign successfully added!');
			});
		}
	}

	toggleCard(blockId) {
		const tempArray = this.state.openCard;
		tempArray[blockId] = !tempArray[blockId];
		this.setState({ openCard: tempArray });
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

	renderMultiselectFieldGroup({
		msg,
		items,
		selectedItems,
		onChange,
		withGrouping = false,
		errors,
		touched,
		field,
		showSelectAll,
		required,
	}) {
		return (
			<FormGroup>
				{msg && (
					<Label>
						<FormattedMessage {...msg} />
						{required && <span style={{ color: '#f00' }}>*</span>}
					</Label>
				)}
				<MultiSelect
					showSelectAll={showSelectAll}
					items={items}
					selectedItems={selectedItems}
					onChange={onChange}
					itemHeight={30}
					height={200}
					withGrouping={withGrouping}
					selectedItemHeight={30}
					responsiveHeight={200}
				/>
				{touched &&
					errors[field] && (
						/* eslint-disable react/jsx-boolean-value */
						<FormFeedback invalid="true">{errors[field]}</FormFeedback>
					)}
			</FormGroup>
		);
	}

	renderMultiselectByName(field, errors) {
		let required = false;
		if (field === 'geo' || field === 'creatives') {
			required = true;
		}
		return this.renderMultiselectFieldGroup({
			msg: messages[field],
			items: this.props[field] ? this.props[field] : [],
			selectedItems: this.state[`${field}Selected`],
			touched: this[`${field}Touched`],
			field,
			errors,
			showSelectAll: true,
			required,
			onChange: items => {
				this[`${field}Touched`] = true;
				const s = `${field}Selected`;
				const ns = {};
				ns[s] = items;
				this.setState(ns);
			},
		});
	}

	renderMultiselectCreative(field, errors) {
		return this.renderMultiselectFieldGroup({
			msg: messages[field],
			items: this.props[field]
				? this.props[field]
						.sort((a, b) => {
							const keyA = a.creative_type;

							const keyB = b.creative_type;
							if (keyA < keyB) return -1;
							if (keyA > keyB) return 1;
							return 0;
						})
						.filter(filter => filter.banners.length > 0)
						.map((l, i) => ({
							id: l.id,
							label: l.data ? l.data.name : 'Unnamed',
							value: l.id,
							group: l.creative_type.charAt(0).toUpperCase() + l.creative_type.slice(1),
						}))
				: [],
			selectedItems: this.state[`${field}Selected`],
			withGrouping: true,
			touched: this[`${field}Touched`],
			errors,
			field,
			showSelectAll: false,
			onChange: items => {
				this[`${field}Touched`] = true;
				const s = `${field}Selected`;
				const ns = {};
				ns[s] = items;
				this.setState(ns);
			},
		});
	}

	renderListOfMultiselects(fields, errors) {
		return fields.map(field => this.renderMultiselectByName(field, errors));
	}

	handleChangeStart(date) {
		this.setState({
			startDate: date,
			minTime: date.hours(date.hour()).minutes(date.minutes()),
		});
	}

	handleChangeEnd(date) {
		this.setState({
			endDate: date,
		});
	}

	fixColumnAndRowsTimeTable(matrix) {
		const tempArr = [];
		for (let i = 0; i <= 6; i++) {
			tempArr[i] = [];
			for (let j = 1; j <= 24; j++) {
				tempArr[i][j - 1] = matrix[i][j];
			}
		}
		this.setState({ timetable: tempArr });
	}

	convertToTimeTable(matrix) {
		const tempArr = [];
		if (matrix && matrix.length) {
			for (let i = 0; i <= 7; i++) {
				tempArr[i] = [];
				for (let j = 0; j <= 24; j++) {
					if (i === 7 || j === 0) {
						tempArr[i][j] = false;
					} else {
						tempArr[i][j] = matrix[i][j - 1];
					}
				}
			}
		}

		return tempArr;
	}

	scrollToError() {
		const firstError = document.getElementsByClassName('invalid-feedback');
		if (!firstError.length) {
			window.setTimeout(() => {
				window.scrollTo(0, firstError[0].offsetParent.offsetTop);
			}, 500);
		} else {
			window.scrollTo(0, firstError[0].offsetParent.offsetTop);
		}
	}

	renderFormMainInfo(values) {
		const { strategy, placement, budgetDistribution } = this.props;
		return (
			<div>
				{this.renderError()}
				{this.renderLoading()}
				<IntlFieldGroup name="name" required label={messages.campaignName} />
				<Row>
					<Col md={12}>
						<label>
							<FormattedMessage {...messages.typeOfAudience} />
							<span style={{ color: '#f00' }}>*</span>
						</label>
					</Col>
					<Col md={3} className="radio-mb-0">
						<IntlFieldGroup
							name="audience_type"
							inputProps={{
								type: 'radio',
								value: 'new',
								name: 'audience_type',
								[values && values.audience_type === 'new' ? 'checked' : false]:
									(values && values.audience_type === 'new') || false,
							}}
							label={messages.searchNewAudience}
							html
						/>
					</Col>
					<Col md={{ size: 4, offset: 1 }} className="radio-mb-0">
						<IntlFieldGroup
							name="audience_type"
							inputProps={{
								type: 'radio',
								name: 'audience_type',
								value: 'retargeting',
								[values && values.audience_type === 'retargeting' ? 'checked' : false]:
									(values && values.audience_type === 'retargeting') || false,
							}}
							label={messages.retargetingCampaign}
							html
						/>
					</Col>
				</Row>
				<hr />
				<Row>
					<Col md={6}>
						<IntlFieldGroup
							name="strategy"
							label={messages.strategy}
							inputProps={{
								type: 'select',
								options: strategy,
							}}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup name="frequency" label={messages.frequency} />
					</Col>
				</Row>
				<hr />
				<Row>
					<Col md={6}>
						<Label>
							<FormattedMessage {...messages.startDate} />
							<span style={{ color: '#f00' }}>*</span>
						</Label>
						<DatePicker
							selected={this.state.startDate}
							selectsStart
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							onChange={this.handleChangeStart}
							showTimeSelect
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="DD.MM.YYYY HH:mm"
							timeCaption="time"
							minDate={moment()}
							minTime={
								moment().format('DD-MM-YYYY') === moment(this.state.startDate).format('DD-MM-YYYY')
									? this.state.minTime
											.hours(this.state.minTime.hour())
											.minutes(this.state.minTime.minutes())
									: this.state.minTime.hours(0).minutes(0)
							}
							maxTime={moment()
								.hours(23)
								.minutes(45)}
						/>
					</Col>
					<Col md={6}>
						<Label className="mt-3-responsive">
							<FormattedMessage {...messages.endDate} />
						</Label>
						<DatePicker
							selected={this.state.endDate}
							selectsEnd
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							onChange={this.handleChangeEnd}
							showTimeSelect
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="DD.MM.YYYY HH:mm"
							timeCaption="time"
							minDate={this.state.startDate}
							minTime={
								moment(this.state.startDate).format('DD-MM-YYYY') ===
								moment(this.state.endDate ? this.state.endDate : moment()).format('DD-MM-YYYY')
									? this.state.minTime
											.hours(this.state.minTime.hour())
											.minutes(this.state.minTime.minutes())
									: moment()
											.hours(0)
											.minutes(0)
							}
							maxTime={moment()
								.hours(23)
								.minutes(45)}
						/>
					</Col>
				</Row>
				<hr />
				<IntlFieldGroup
					name="budget_allocation_strategy"
					label={messages.budgetDistribution}
					inputProps={{
						type: 'select',
						options: budgetDistribution,
					}}
					required
				/>
				<Row>
					<Col md={6}>
						<IntlFieldGroup
							name="budget"
							label={messages.budget}
							prepend="$"
							formText={messages.textTotalBudget}
							required
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="daily_budget"
							label={messages.dailyBudget}
							inputProps={{ placeholder: 'unlimited', className: 'endDate' }}
							prepend="$"
							formText={messages.textDailyBudget}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={6}>
						<IntlFieldGroup
							name="impressions_limit"
							label={messages.impressions}
							prepend="MAX"
							inputProps={{ placeholder: 'unlimited' }}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="daily_impressions_limit"
							label={messages.dailyImpressions}
							prepend="MAX"
							inputProps={{ placeholder: 'unlimited', className: 'endDate' }}
						/>
					</Col>
				</Row>
				<IntlFieldGroup
					name="show_position"
					label={messages.showPosition}
					inputProps={{
						type: 'select',
						options: placement,
					}}
					required
				/>
			</div>
		);
	}

	renderFormReports(values, change) {
		const { counters } = this.props;
		return (
			<div>
				<IntlFieldGroup
					name="counter"
					label={messages.targetCounter}
					inputProps={{
						type: 'select',
						options: counters.map(item => ({ id: item.id, label: item.name, value: item.id })),
					}}
				/>
				<IntlFieldGroup
					name="stop_advertising"
					inputProps={{
						type: 'checkbox',
						value: values && values.stop_advertising ? values.stop_advertising : false,
					}}
					label={messages.stopAdvertising}
					html
				/>
				<IntlFieldGroup name="main_email" label={messages.email} />
				<div className="form-group">
					<Button
						onClick={e => {
							e.preventDefault();
							this.setState(prevState => ({
								emails: [...prevState.emails, prevState.emails.length],
							}));
						}}
						color="success"
					>
						<FormattedMessage {...messages.addEmail} />
					</Button>
				</div>
				{this.state.emails.map((alias, index) => (
					<FormattedMessage
						key={`emails_${index}`}
						id={`${messageScope}.emails`}
						values={{ number: index + 1 }}
					>
						{msg => (
							<DomainDynamicField
								msg={msg}
								index={index}
								changeValue={change}
								name={`emails[${index}]`}
								value={typeof alias === 'string' ? alias : ''}
								onClickRemove={(e, index) => {
									e.preventDefault();

									this.setState(prevState => ({
										emails: prevState.emails.filter((a, i) => i !== index),
									}));
								}}
							/>
						)}
					</FormattedMessage>
				))}
			</div>
		);
	}

	renderFormPartHeader(msg) {
		return (
			<Col>
				<h3 className="group-title campaign-form-title">
					<FormattedMessage {...msg} />
				</h3>
			</Col>
		);
	}

	renderForm({ handleSubmit, values, change, errors }) {
		const {
			gender,
			match: {
				params: { idCampaign },
			},
		} = this.props;
		return (
			<form
				onSubmit={args => {
					this.geoTouched = true;
					this.creativesTouched = true;
					handleSubmit(args);
				}}
			>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'mainInfo' })}
					arrowForceOpen={this.state.openCard === 'mainInfo' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.mainInfo)}
				>
					{this.renderFormMainInfo(values)}
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'audience' })}
					arrowForceOpen={this.state.openCard === 'audience' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.audience)}
				>
					<Row>
						<Col md={12}>
							<label>
								<FormattedMessage {...messages.gender} />
							</label>
						</Col>
						<Col md={2} xs={6} className="radio-mb-0">
							<IntlFieldGroup
								name="audience_gender"
								inputProps={{
									type: 'radio',
									value: 1,
									[values.audience_gender === 1 ? 'checked' : false]:
										values.audience_gender === 1 || false,
								}}
								label={messages.man}
								html
							/>
						</Col>
						<Col md={2} xs={6} className="radio-mb-0">
							<IntlFieldGroup
								name="audience_gender"
								inputProps={{
									type: 'radio',
									value: 2,
									[values.audience_gender === 2 ? 'checked' : false]:
										values.audience_gender === 2 || false,
								}}
								label={messages.woman}
								html
							/>
						</Col>
					</Row>
					<hr />
					{this.renderListOfMultiselects(['language', 'ageGroup'], errors)}
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'target' })}
					arrowForceOpen={this.state.openCard === 'target' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.target)}
				>
					{this.renderListOfMultiselects(['geo', 'categories'], errors)}
					<hr />
					<IntlFieldGroup
						name="timezone"
						inputProps={{
							type: 'select',
							options: this.props.timezones,
						}}
						label={messages.timezone}
						required
					/>
					<hr />
					<Label>
						<FormattedMessage {...messages.timeTargeting} />
					</Label>
					<TimeTable
						selectWorkingTime={!this.state.activeCampaign && !idCampaign}
						onUpdate={e => this.fixColumnAndRowsTimeTable(e)}
						initialValues={
							this.state.activeCampaign &&
							Object.keys(this.state.activeCampaign).length &&
							this.state.activeCampaign.time_targeting &&
							idCampaign
								? this.convertToTimeTable(this.state.activeCampaign.time_targeting.time_grid)
								: false
						}
					/>
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'devices' })}
					arrowForceOpen={this.state.openCard === 'devices' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.devices)}
				>
					{this.renderListOfMultiselects(['deviceType', 'osType', 'browserType'], errors)}
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'reports' })}
					arrowForceOpen={this.state.openCard === 'reports' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.reports)}
				>
					{this.renderFormReports(values, change)}
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'addCreative' })}
					arrowForceOpen={this.state.openCard === 'addCreative' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.addCreative)}
				>
					{this.renderMultiselectCreative('creatives', errors)}
				</AppCard>
				<AppCard
					arrow
					onToggle={() => this.setState({ openCard: 'devices' })}
					arrowForceOpen={this.state.openCard === 'devices' || !idCampaign}
					arrowHead={this.renderFormPartHeader(messages.blacklist)}
				>
					{this.renderMultiselectByName('SSP', errors)}
				</AppCard>
				<Button type="submit" color="primary" onClick={() => this.scrollToError()}>
					<FormattedMessage id="app.common.submit" />
				</Button>
			</form>
		);
	}

	render() {
		const { activeCampaign } = this.state;
		const { timezones } = this.props;
		const {
			match: {
				params: { idCampaign },
			},
		} = this.props;
		const initValues = {
			timezone: findTimezone(timezones),
			frequency: '3',
			name: `New campaign ${moment().format('DD-MM-YYYY HH:mm')}`,
		};
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{!idCampaign ? (
									<FormattedMessage {...messages.addCampaignHeader} />
								) : (
									<FormattedMessage {...messages.editCampaignHeader} />
								)}
							</h1>
						</div>
					</header>
					<Row>
						<Col sm={12} lg={8} md={8} xs={12}>
							<Form
								validate={formValues => this.validate(formValues)}
								initialValues={
									!idCampaign && !this.formRef
										? initValues
										: this.props.activeCampaign && Object.keys(this.props.activeCampaign).length
											? activeCampaign
											: false
								}
								onSubmit={values => this.onSubmit(values)}
								ref={c => (this.formRef = c)}
								render={this.renderForm}
							/>
						</Col>
						<Col md={4}>
							<AppCard>
								<FormattedHTMLMessage {...messages.instructionsText} />
							</AppCard>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

CampaignForm.propTypes = {
	timezones: PropTypes.array,
	categories: PropTypes.array,
	counters: PropTypes.array,
	deviceType: PropTypes.array,
	osType: PropTypes.array,
	browserType: PropTypes.array,
	ageGroup: PropTypes.array,
	gender: PropTypes.array,
	SSP: PropTypes.array,
	geo: PropTypes.array,
	strategy: PropTypes.array,
	placement: PropTypes.array,
	creatives: PropTypes.array,
	campaigns: PropTypes.array,
	activeCampaign: PropTypes.object,
	addCampaignError: PropTypes.string,
	addCampaignLoading: PropTypes.string,
	getCreatives: PropTypes.func,
	addCampaign: PropTypes.func,
	patchCampaign: PropTypes.func,
	getCampaign: PropTypes.func,
	setActiveCampaign: PropTypes.func,
	unsetActiveCampaign: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	timezones: selectTimezones(),
	categories: selectCategories(),
	counters: selectCountersIdsAndNames(),
	deviceType: selectDeviceType(),
	osType: selectTypeOS(),
	browserType: selectBrowserType(),
	language: selectLanguages(),
	ageGroup: selectAgeGroup(),
	gender: selectGender(),
	SSP: selectSSP(),
	geo: selectCountries(),
	strategy: selectStrategy(),
	placement: selectPlacement(),
	budgetDistribution: selectBudgetDistribution(),
	creatives: creativesSelectors.collectionList(),
	campaigns: campaingsSelectors.collectionList(),
	activeCampaign: campaingsSelectors.activeEntry(),
	addCampaignError: campaingsSelectors.addEntryError(),
	addCampaignLoading: campaingsSelectors.addEntryLoading(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCreatives: dispatch(creativeCollectionActions.getCollection()),
		addCampaign: values => makePromiseAction(dispatch, campaingCollectionActions.addEntry(values)),
		patchCampaign: (id, values) => makePromiseAction(dispatch, campaingCollectionActions.patchEntry(id, values)),
		getCampaign: id => dispatch(campaingCollectionActions.getEntry(id)),
		setActiveCampaign: id => dispatch(campaingCollectionActions.setActiveEntry(id)),
		unsetActiveCampaign: () => dispatch(campaingCollectionActions.unsetActiveEntry()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CampaignForm);
