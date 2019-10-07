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
import classNames from 'classnames';
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
	selectCampaignsIds,
	selectOpenedFormCards,
	filtersSelectors,
} from 'containers/TradingDesk/selectors';
import validateEmail from 'utils/validateEmail';
import validateEmails from 'utils/validateEmails';
import validateInteger from 'utils/validateInteger';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import formatDateToUTC from 'utils/formatDateToUTC';
import formatDateFromUTC from 'utils/formatDateFromUTC';
import validateEmpty from 'utils/validateEmpty';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import findTimezone from 'utils/findTimezone';
import _ from 'lodash';
import GaugeChart from 'react-gauge-chart';
import { getCountries } from 'containers/Dashboard/actions';
import TreeCountrySelectV2 from 'components/TreeCountrySelectV2';

// only manual import
import TreeSelect from 'antd/es/tree-select';
import { campaingCollectionActions, creativeCollectionActions, setOpenedFormCards, campaingFormLoadingStart} from '../../actions';
import messages, { scope as messageScope } from './messages';
import { selectCategories, selectCountries, selectTimezones, selectCategoriesV1 } from '../../../Dashboard/selectors';
import 'antd/dist/antd.css';
import validateDomainWithoutHttp from 'utils/validateDomainWithoutHttp';
import CampaignDetails from '../CampaignDetails';
const { SHOW_PARENT } = TreeSelect;

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
			startDate: moment().toDate(),
			endDate: null,
			timetable: [],
			selectedCategoriesV1: [],
			deviceTypeSelected: [],
			languageSelected: [],
			osTypeSelected: [],
			browserTypeSelected: [],
			ageGroupSelected: [],
			SSPSelected: [],
			creativesSelected: [],
			tempGeo: [],
			geoSelected: {},
			countrySelected: [],
			categoriesSelected: [],
			blacklistSelected: [],
			whitelistSelected: [],
			placementSelected: [],
			minTime: moment(),
			activeCampaign: props.activeCampaign ? props.activeCampaign : {},
			fillCampaign: {},
			createdAt: '',
			continueEditing: false,
			toggle: false,
			categoriesV1: [],
			blockedPosition: true,
			blockedLanguages: true,
			blockedGenders: true,
			blockedAges: true,
			blockedBrowsers: true,
			blockedOS: true,
			blockedDevices: true,
			clearTimeTable: false,
			updatedForm: false,
			genderMale: false,
			genderFemale: false,
			previewTree: [],
		};

		this.deviceTypeTouched = false;
		this.osTypeTouched = false;
		this.browserTypeTouched = false;
		this.ageGroupTouched = false;
		this.languageTouched = false;
		this.blacklistTouched = false;
		this.whitelistTouched = false;
		this.placementTouched = false;
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
		this.fillOutCampaign = this.fillOutCampaign.bind(this);
		this.selectGeo = this.selectGeo.bind(this);
	}

	componentDidMount() {
		const {
			activeCampaign,
			setActiveCampaign,
			unsetActiveCampaign,
			match: {
				params: { idCampaign },
			},
		} = this.props;
		if (idCampaign && !this.props.campaignsIds.includes(parseInt(idCampaign, 10))) {
			createToast('error', 'You do not have such a campaign!');
			this.props.history.push({ pathname: `/app/campaigns/list` });
		}
		if (!idCampaign) {
			unsetActiveCampaign();
		} else if (!activeCampaign || activeCampaign.id !== parseInt(idCampaign, 10)) {
			setActiveCampaign(idCampaign);
		}
		if (activeCampaign) {
			this.setInitialStateForEdit({}, activeCampaign);
		}
		this.props.bigFormLoadingStart();
	}

	componentWillUnmount() {
		this.setState({ activeCampaign: null });
		// сброс значений формы
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
		this.sent = false;
	}

	componentDidUpdate(prevProps) {
		const { activeCampaign } = this.props;
		this.setInitialStateForEdit(prevProps, activeCampaign);
	}

	setInitialStateForEdit(prevProps = {}, activeCampaign) {
		if (!activeCampaign && prevProps.activeCampaign) {
			this.setState({
				deviceTypeSelected: [],
				osTypeSelected: [],
				browserTypeSelected: [],
				ageGroupSelected: [],
				SSPSelected: [],
				creativesSelected: [],
				languageSelected: [],
				geoSelected: [],
				categoriesSelected: [],
				selectedCategoriesV1: [],
				startDate: moment().toDate(),
				endDate: null,
				timetable: [],
				tempGeo: [],
				emails: [],
				blacklistSelected: [],
				whitelistSelected: [],
				placementSelected: [],
				blockedPosition: true,
				blockedLanguages: true,
				blockedGenders: true,
				blockedAges: true,
				blockedBrowsers: true,
				blockedOS: true,
				blockedDevices: true,
				activeCampaign: null,
				clearTimeTable: false,
				updatedForm: false,
				genderMale: false,
				genderFemale: false,
				countrySelected: [],
				previewTree: [],
			});
		}

		if (!activeCampaign || activeCampaign === prevProps.activeCampaign) {
			return;
		}

		if (!this.state.toggle) {
			const actCampaign = {
				...activeCampaign,
				stop_advertising:
					activeCampaign.monitoring && activeCampaign.monitoring.stop_advertising
						? activeCampaign.monitoring.stop_advertising
						: null,
				counter:
					activeCampaign.monitoring && activeCampaign.monitoring.counter
						? activeCampaign.monitoring.counter
						: null,
				main_email:
					activeCampaign.monitoring &&
					activeCampaign.monitoring.notification_emails &&
					activeCampaign.monitoring.notification_emails.length
						? activeCampaign.monitoring.notification_emails[
								activeCampaign.monitoring.notification_emails.length - 1
						  ]
						: '',
				emails:
					activeCampaign && activeCampaign.monitoring && activeCampaign.monitoring.notification_emails
						? activeCampaign.monitoring.notification_emails.slice(
								activeCampaign.monitoring.notification_emails.pop(),
						  )
						: [],
				audience_gender_male:
					activeCampaign.audience_gender !== null &&
					typeof activeCampaign.audience_gender === 'object' &&
					activeCampaign.audience_gender.length &&
					activeCampaign.audience_gender.includes(1),
				audience_gender_female:
					activeCampaign.audience_gender !== null &&
					typeof activeCampaign.audience_gender === 'object' &&
					activeCampaign.audience_gender.length &&
					activeCampaign.audience_gender.includes(2),
			};

			this.setState({
				genderMale:
					activeCampaign.audience_gender !== null &&
					typeof activeCampaign.audience_gender === 'object' &&
					activeCampaign.audience_gender.length &&
					activeCampaign.audience_gender.includes(1),
				genderFemale:
					activeCampaign.audience_gender !== null &&
					typeof activeCampaign.audience_gender === 'object' &&
					activeCampaign.audience_gender.length &&
					activeCampaign.audience_gender.includes(2),
				blockedGenders: activeCampaign.audience_gender === null || activeCampaign.audience_gender.length === 0,
				emails:
					activeCampaign &&
					activeCampaign.monitoring &&
					activeCampaign.monitoring.notification_emails &&
					activeCampaign.monitoring.notification_emails.length > 1
						? activeCampaign.monitoring.notification_emails.slice(
								activeCampaign.monitoring.notification_emails.pop(),
						  )
						: activeCampaign.monitoring &&
						  activeCampaign.monitoring.notification_emails &&
						  activeCampaign.monitoring.notification_emails.length === 1
						? activeCampaign.monitoring.notification_emails
						: [],
				startDate: formatDateFromUTC(activeCampaign.start_date).toDate(),
				endDate: activeCampaign.end_date ? formatDateFromUTC(activeCampaign.end_date).toDate() : null,
				deviceTypeSelected:
					activeCampaign.device_type && activeCampaign.device_type.length ? activeCampaign.device_type : [],
				osTypeSelected:
					activeCampaign.device_os && activeCampaign.device_os.length ? activeCampaign.device_os : [],
				browserTypeSelected:
					activeCampaign.device_browser && activeCampaign.device_browser.length
						? activeCampaign.device_browser
						: [],
				blockedBrowsers: !(
					activeCampaign &&
					activeCampaign.device_browser &&
					activeCampaign.device_browser.length > 0
				),
				blockedOS: !(activeCampaign && activeCampaign.device_os && activeCampaign.device_os.length > 0),
				blockedDevices: !(
					activeCampaign &&
					activeCampaign.device_type &&
					activeCampaign.device_type.length > 0
				),
				ageGroupSelected:
					activeCampaign.audience_age_group && activeCampaign.audience_age_group.length
						? activeCampaign.audience_age_group
						: [],
				blockedAges: !(
					activeCampaign &&
					activeCampaign.audience_age_group &&
					activeCampaign.audience_age_group.length > 0
				),
				languageSelected:
					activeCampaign.language && activeCampaign.language.length ? activeCampaign.language : [],
				SSPSelected:
					activeCampaign.ssp_blacklist && activeCampaign.ssp_blacklist.length
						? activeCampaign.ssp_blacklist
						: [],
				creativesSelected:
					activeCampaign.creatives && activeCampaign.creatives.length
						? activeCampaign.creatives.map(creative => creative.value)
						: [],
				geoSelected: activeCampaign && activeCampaign.target_geo ? activeCampaign.target_geo : {},
				tempGeo:
					activeCampaign && activeCampaign.target_geo
						? this.getSelectedGeoByArray(activeCampaign.target_geo)
						: [],
				previewTree:
					activeCampaign && activeCampaign.target_geo_with_data && activeCampaign.target_geo_with_data.length
						? activeCampaign.target_geo_with_data
						: [],
				selectedCategoriesV1: activeCampaign.target_category_v1,
				activeCampaign: actCampaign,
				createdAt: moment(activeCampaign.created).format('DD.MM.YY HH:mm'),
				blacklistSelected:
					activeCampaign.blacklist_filter && activeCampaign.blacklist_filter.length
						? activeCampaign.blacklist_filter
						: [],
				whitelistSelected:
					activeCampaign.whitelist_filter && activeCampaign.whitelist_filter.length
						? activeCampaign.whitelist_filter
						: [],
				blockedPosition: !(
					activeCampaign &&
					activeCampaign.placement_positions &&
					activeCampaign.placement_positions.length > 0
				),
				blockedLanguages: !(activeCampaign && activeCampaign.language && activeCampaign.language.length > 0),
				placementSelected:
					activeCampaign && activeCampaign.placement_positions ? activeCampaign.placement_positions : [],
			});
		}
	}

	getSelectedGeoByArray(targetGeoObject) {
		let tempArray = [];
		Object.keys(targetGeoObject).map(key => {
			if (Object.keys(targetGeoObject[key]).length > 0) {
				Object.keys(targetGeoObject[key]).map(keySecond => {
					if (targetGeoObject[key][keySecond].length > 0) {
						tempArray = [
							...tempArray,
							...targetGeoObject[key][keySecond].map(cities => parseInt(cities, 10)),
						];
					} else {
						tempArray.push(parseInt(keySecond, 10));
					}
				});
			} else {
				tempArray.push(parseInt(key, 10));
			}
		});
		return tempArray;
	}

	validate(formValues) {
		const errors = {};
		errors.name = validateEmpty(formValues.name) || validateStringAndNumber(formValues.name);
		errors.adomain = validateDomainWithoutHttp(formValues.adomain);
		errors.audience_type = validateEmpty(formValues.audience_type);
		errors.strategy = validateEmpty(formValues.strategy);
		if (!validateEmpty(formValues.budget) && formValues.budget.length < 2) {
			errors.budget = 'Budget must be at least $10';
		} else {
			errors.budget = validateEmpty(formValues.budget);
		}
		if (!validateEmpty(formValues.adomain) && formValues.adomain.length) {
			errors.adomain = validateDomainWithoutHttp(formValues.adomain);
		} else {
			errors.adomain = validateEmpty(formValues.adomain);
		}
		errors.budget_allocation_strategy = validateEmpty(formValues.budget_allocation_strategy);
		// errors.show_position = validateEmpty(formValues.show_position);
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
		// errors.timezone = validateEmpty(formValues.timezone);
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
			unsetActiveCampaign,
			match: {
				params: { idGroup, idCampaign },
			},
		} = this.props;
		const audienceGender = [];
		if (values.audience_gender_male) {
			audienceGender.push(1);
		}
		if (values.audience_gender_female) {
			audienceGender.push(2);
		}
		const result = {
			...values,
			placement_positions:
				!this.state.blockedPosition && this.state.placementSelected.length
					? this.state.placementSelected
					: null,
			campaign_group: idGroup || activeCampaign.campaign_group,
			monitoring: {
				counter: values.counter,
				stop_advertising: values.stop_advertising || false,
				notification_emails: CampaignForm.notificationEmails(values.main_email, values.emails),
			},
			direct_domains: values.direct_domains ? values.direct_domains : null,
			audience_gender: !this.state.blockedGenders ? audienceGender : [],
			start_date: formatDateToUTC(this.state.startDate).format('YYYY-MM-DDTHH:mm'),
			end_date: this.state.endDate ? formatDateToUTC(this.state.endDate).format('YYYY-MM-DDTHH:mm') : null,
			time_targeting: this.state.timetable,
			device_type:
				!this.state.blockedDevices && this.state.deviceTypeSelected.length ? this.state.deviceTypeSelected : [],
			device_os: !this.state.blockedOS && this.state.osTypeSelected.length ? this.state.osTypeSelected : [],
			device_browser:
				!this.state.blockedBrowsers && this.state.browserTypeSelected.length
					? this.state.browserTypeSelected
					: [],
			target_geo: this.state.geoSelected,
			target_category_v1: this.state.selectedCategoriesV1,
			audience_age_group:
				!this.state.blockedAges && this.state.ageGroupSelected.length ? this.state.ageGroupSelected : [],
			language:
				!this.state.blockedLanguages && this.state.languageSelected.length ? this.state.languageSelected : [],
			ssp_blacklist: this.state.SSPSelected,
			creatives: this.state.creativesSelected.map(c => ({
				value: c,
				start_date: null,
				end_date: null,
				status: 'active',
			})),
			blacklist_filter: this.state.blacklistSelected,
			whitelist_filter: this.state.whitelistSelected,
		};

		if (!idCampaign) {
			result.status = 'active';
		}
		if (this.props.activeCampaign) {
			this.sent = true;
			this.props
				.patchCampaign(idCampaign, result)
				.then(response => {
					createToast('success', 'Campaign successfully updated!');
					if (!this.state.continueEditing) {
						this.props.history.push({ pathname: `/app/campaigns/list` });
						unsetActiveCampaign();
					} else {
						this.props.history.push({ pathname: `/app/campaign/${response.id}/edit` });
					}
				})
				.catch(() => {
					createToast('error', 'Campaign creation error. Try again later.');
				});
		} else {
			this.sent = true;
			this.props
				.addCampaign(result)
				.then(response => {
					createToast('success', 'Campaign successfully added!');
					if (!this.state.continueEditing) {
						this.props.history.push({ pathname: `/app/campaigns/list` });
						unsetActiveCampaign();
					} else {
						this.props.history.push({ pathname: `/app/campaign/${response.id}/edit` });
					}
				})
				.catch(() => {
					createToast('error', 'Campaign creation error. Try again later.');
				});
		}
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

	renderSelectByName(field, values, errors) {
		let required = false;
		let blocked = false;
		if (field === 'creatives') {
			required = false;
		}
		if (field === 'placement') {
			blocked = this.state.blockedPosition;
		}
		if (field === 'language') {
			blocked = this.state.blockedLanguages;
		}
		if (field === 'ageGroup') {
			blocked = this.state.blockedAges;
		}
		if (field === 'deviceType') {
			blocked = this.state.blockedDevices;
		}
		if (field === 'osType') {
			blocked = this.state.blockedOS;
		}
		if (field === 'browserType') {
			blocked = this.state.blockedBrowsers;
		}
		return this.renderSelectFieldGroup({
			msg: messages[field],
			items: this.props[field] ? this.props[field] : [],
			selectedItems: this.state[`${field}Selected`],
			touched: this[`${field}Touched`],
			field,
			blocked,
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

	renderSelectFieldGroup({
		msg,
		items,
		selectedItems,
		onChange,
		blocked,
		errors,
		touched,
		field,
		showSelectAll,
		required,
	}) {
		const tProps = {
			treeData:
				items && items.length
					? items.map(item => ({
							id: item.id,
							value: item.id,
							key: item.id,
							title: item.label || item.name || item.data.name,
					  }))
					: [],
			className: 'treeSelect-wrapper',
			dropdownClassName: 'treeSelect-wrapper__dropdown',
			value: selectedItems,
			onChange,
			disabled: blocked,
			treeCheckable: true,
			showCheckedStrategy: SHOW_PARENT,
			searchPlaceholder: (
				<div>
					<FormattedMessage {...messages.select} />
					<span
						style={{
							textTransform: 'lowercase',
						}}
					>
						{' '}
						<FormattedMessage {...msg} />
					</span>
				</div>
			),
			style: {
				width: '100%',
			},
			treeNodeFilterProp: 'title',
		};
		return (
			<div>
				{msg && (
					<Label>
						<FormattedMessage {...msg} />
						{required && <span style={{ color: '#f00' }}> *</span>}
					</Label>
				)}
				<br />
				<div>
					<TreeSelect {...tProps} />
					{required && touched && errors[field] && (
						/* eslint-disable react/jsx-boolean-value */
						<FormFeedback invalid="true">{errors[field]}</FormFeedback>
					)}
				</div>
			</div>
		);
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
				{touched && errors[field] && (
					/* eslint-disable react/jsx-boolean-value */
					<FormFeedback invalid="true">{errors[field]}</FormFeedback>
				)}
			</FormGroup>
		);
	}

	renderMultiselectByName(field, errors) {
		let required = false;
		if (field === 'creatives') {
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
			minTime: moment(date)
				.hours(moment(date).hour())
				.minutes(moment(date).minutes()),
		});
	}

	handleChangeEnd(date) {
		this.setState({
			endDate: date,
		});
	}

	searchTrue(matrix) {
		for (let i = 0; i <= 6; i++) {
			for (let j = 1; j <= 24; j++) {
				if (matrix[i][j]) {
					return true;
				}
			}
		}
		return false;
	}

	fixColumnAndRowsTimeTable(matrix) {
		const tempArr = [];
		for (let i = 0; i <= 6; i++) {
			tempArr[i] = [];
			for (let j = 1; j <= 24; j++) {
				tempArr[i][j - 1] = matrix[i][j];
			}
		}
		this.setState({ timetable: tempArr, clearTimeTable: this.searchTrue(tempArr) });
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
		const spanError = document.getElementsByClassName('span-campaign');
		if (spanError.length) {
			window.setTimeout(() => {
				window.scrollTo(0, spanError[0].offsetTop);
			}, 500);
		}
	}

	scrollToCard(card) {
		const firstError = document.getElementsByClassName(card);
		if (!firstError.length) {
			window.setTimeout(() => {
				window.scrollTo(0, firstError[0].offsetTop);
			}, 500);
		} else {
			window.scrollTo(0, firstError[0].offsetTop);
		}
	}

	renderFormMainInfo(values, errors) {
		const { strategy, placement, budgetDistribution } = this.props;
		return (
			<div>
				{this.renderLoading()}
				<IntlFieldGroup name="name" required label={messages.campaignName} />
				<IntlFieldGroup
					name="adomain"
					required
					label={messages.advertiserDomain}
					formText={messages.advertiserDomainExample}
				/>
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
								id: 'audience_type_1',
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
								id: 'audience_type_2',
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
							dateFormat="dd.MM.yyyy HH:mm"
							timeCaption="time"
							minDate={moment()}
							minTime={
								moment().format('DD.MM.YY') === moment(this.state.startDate).format('DD.MM.YY')
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
							dateFormat="dd.MM.yyyy HH:mm"
							timeCaption="time"
							minDate={this.state.startDate}
							minTime={
								moment(this.state.startDate).format('DD.MM.YY') ===
								moment(this.state.endDate ? this.state.endDate : moment()).format('DD.MM.YY')
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
							inputProps={{ placeholder: 'no limit' }}
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
							inputProps={{ placeholder: 'no limit' }}
						/>
					</Col>
					<Col md={6}>
						<IntlFieldGroup
							name="daily_impressions_limit"
							label={messages.dailyImpressions}
							prepend="MAX"
							inputProps={{ placeholder: 'no limit' }}
						/>
					</Col>
				</Row>
				<Row>
					<Col md={9}>{this.renderSelectByName('placement', values, errors)}</Col>
					<Col md={3}>
						<div className="campaign-form__allcheckbox">
							<IntlFieldGroup
								name="all_placements"
								inputProps={{
									type: 'checkbox',
									id: 'all_placements',
									value: true,
									checked: this.state.blockedPosition,
									onChange: () => this.setState({ blockedPosition: !this.state.blockedPosition }),
								}}
								label={messages.all}
								html
							/>
						</div>
					</Col>
				</Row>
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
						id: 'stop_advertising',
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

	renderFormPartHeader(msg, block, errors) {
		function checkError() {
			if (
				block === 'mainInfo' &&
				(errors.audience_type ||
					errors.strategy ||
					errors.startDate ||
					errors.budget_allocation_strategy ||
					errors.budget ||
					errors.placement_positions ||
					errors.adomain)
			) {
				return 'Required fields';
			}
			if (block === 'target' && (errors.geo || errors.timezone)) {
				return 'Required fields';
			}
			return false;
		}
		return {
			header: (
				<Col>
					<h3 className="group-title campaign-form-title">
						<i
							className={classNames(
								{ 'fal fa-crosshairs': block === 'target' },
								{ 'fal fa-filter': block === 'blackList' },
								{ 'fal fa-users-cog': block === 'audience' },
								{ 'fal fa-sliders-h': block === 'mainInfo' },
								{ 'fal fa-handshake': block === 'directDeals' },
								{ 'fal fa-analytics': block === 'reports' },
								{ 'fal fa-ad': block === 'addCreative' },
								{ 'fal fa-laptop': block === 'devices' },
							)}
						/>{' '}
						<FormattedMessage {...msg} />
					</h3>
				</Col>
			),
			span: checkError() ? <span className="span-campaign red">{checkError()}</span> : null,
		};
	}

	selectGeo(array) {
		this.setState({
			countrySelected: array,
		});
	}

	toggleCard(id) {
		if (!this.props.openedCards.includes(id)) {
			this.props.setOpenedFormCards([...this.props.openedCards, id]);
		} else {
			this.props.setOpenedFormCards(this.props.openedCards.filter(l => l !== id));
		}
		this.setState({
			toggle: true,
		});
	}

	openCard(id) {
		const {
			match: {
				params: { idCampaign },
			},
		} = this.props;
		if (this.props.openedCards.includes(id)) {
			return true;
		}
		return !idCampaign;
	}

	onChange = value => {
		this.setState({ selectedCategoriesV1: value });
	};

	renderCategoriesSelect() {
		const { categoriesV1 } = this.props;
		const tProps = {
			treeData:
				categoriesV1 && categoriesV1.length
					? categoriesV1.map(category => ({
							id: category.id,
							value: category.key,
							key: category.key,
							title: `${category.name} (${category.key})`,
							children: category.sub_category.map(sub => ({
								key: sub.key,
								value: sub.key,
								label: `${sub.name} (${sub.key})`,
							})),
					  }))
					: [],
			className: 'treeSelect-wrapper',
			dropdownClassName: 'treeSelect-wrapper__dropdown',
			value: this.state.selectedCategoriesV1,
			onChange: this.onChange,
			treeCheckable: true,
			showCheckedStrategy: SHOW_PARENT,
			searchPlaceholder: 'Select categories',
			style: {
				width: '100%',
			},
			treeNodeFilterProp: 'title',
		};
		return (
			<div>
				<Label>
					<FormattedMessage {...messages.categories} />
				</Label>
				<br />
				<div>
					<TreeSelect {...tProps} />
				</div>
			</div>
		);
	}

	renderForm({ handleSubmit, values, change, errors }) {
		const {
			gender,
			match: {
				params: { idCampaign, type },
			},
			match,
		} = this.props;
		const see = match.url.indexOf('see');
		return (
			<form
				onSubmit={args => {
					this.geoTouched = true;
					this.creativesTouched = true;
					handleSubmit(args);
				}}
			>
				<div style={{ marginBottom: '40px' }}>
					<AppCard
						arrow
						onToggle={() => this.toggleCard('mainInfo')}
						arrowForceOpen={this.openCard('mainInfo')}
						arrowHead={this.renderFormPartHeader(messages.mainInfo, 'mainInfo', errors)}
						popoverHeader={messages.amountSpentPopover}
						popoverBody={messages.amountSpentPopoverText}
					>
						{this.renderFormMainInfo(values, errors)}
					</AppCard>
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('audience');
							this.openCard('audience') ? this.scrollToCard('appCard-audience') : null;
						}}
						arrowForceOpen={this.openCard('audience')}
						arrowHead={this.renderFormPartHeader(messages.audience, 'audience', errors)}
						className="appCard-audience"
						openTitle
					>
						<Row>
							<Col md={12}>
								<label>
									<FormattedMessage {...messages.gender} />
								</label>
							</Col>
							<Col md={2} xs={6} className="radio-mb-0">
								<IntlFieldGroup
									name="audience_gender_male"
									inputProps={{
										type: 'checkbox',
										value: 1,
										id: 'audience_gender_male',
										[values.audience_gender_male && !this.state.blockedGenders ? 'checked' : false]:
											(values.audience_gender_male && !this.state.blockedGenders) || false,
										onClick: () => this.setState({ genderMale: !this.state.genderMale }),
										disabled: this.state.blockedGenders,
									}}
									label={messages.man}
									html
								/>
							</Col>
							<Col md={2} xs={6} className="radio-mb-0">
								<IntlFieldGroup
									name="audience_gender_female"
									inputProps={{
										type: 'checkbox',
										value: 2,
										id: 'audience_gender_female',
										[values.audience_gender_female && !this.state.blockedGenders
											? 'checked'
											: false]:
											(values.audience_gender_female && !this.state.blockedGenders) || false,
										onClick: () => this.setState({ genderFemale: !this.state.genderFemale }),
										disabled: this.state.blockedGenders,
									}}
									label={messages.woman}
									html
								/>
							</Col>
							<Col md={3}>
								<IntlFieldGroup
									name="all_genders"
									inputProps={{
										type: 'checkbox',
										id: 'all_genders',
										value: true,
										checked: this.state.blockedGenders,
										onChange: () => this.setState({ blockedGenders: !this.state.blockedGenders }),
									}}
									label={messages.allGenders}
									html
								/>
							</Col>
						</Row>
						<hr />
						<Row>
							<Col md={9}>{this.renderSelectByName('language', errors)}</Col>
							<Col md={3}>
								<div className="campaign-form__allcheckbox">
									<IntlFieldGroup
										name="all_languages"
										inputProps={{
											type: 'checkbox',
											id: 'all_languages',
											value: true,
											checked: this.state.blockedLanguages,
											onChange: () =>
												this.setState({ blockedLanguages: !this.state.blockedLanguages }),
										}}
										label={messages.allLanguages}
										html
									/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col md={9}>{this.renderSelectByName('ageGroup', errors)}</Col>
							<Col md={3}>
								<div className="campaign-form__allcheckbox">
									<IntlFieldGroup
										name="all_ages"
										inputProps={{
											type: 'checkbox',
											id: 'all_ages',
											value: true,
											checked: this.state.blockedAges,
											onChange: () => this.setState({ blockedAges: !this.state.blockedAges }),
										}}
										label={messages.allAges}
										html
									/>
								</div>
							</Col>
						</Row>
					</AppCard>
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('target');
							this.openCard('target') ? this.scrollToCard('appCard-target') : null;
						}}
						arrowForceOpen={this.openCard('target')}
						arrowHead={this.renderFormPartHeader(messages.target, 'target', errors)}
						className="appCard-target"
						openTitle
					>
						{this.renderCategoriesSelect()}

						<TreeCountrySelectV2
							countries={this.props.geo}
							getCountries={this.props.getCountries}
							previewTree={this.state.previewTree}
							selected={this.state.tempGeo}
							selectedObject={this.state.geoSelected}
							onSelect={(tempGeo, geoSelected) => {
								this.setState({
									tempGeo,
									geoSelected,
								});
							}}
						/>
						{/* this.renderListOfMultiselects(['categories'], errors) */}
						<IntlFieldGroup
							name="timezone"
							inputProps={{
								type: 'select',
								options: this.props.timezones,
							}}
							label={messages.timezone}
						/>
						<hr />
						<Label>
							<FormattedMessage {...messages.timeTargeting} />
						</Label>
						<TimeTable
							selectWorkingTime={false}
							onUpdate={e => this.fixColumnAndRowsTimeTable(e)}
							initialValues={
								this.state.activeCampaign &&
								Object.keys(this.state.activeCampaign).length &&
								this.state.activeCampaign.time_targeting &&
								idCampaign
									? this.convertToTimeTable(this.state.activeCampaign.time_targeting)
									: false
							}
						/>
					</AppCard>
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('devices');
							this.openCard('devices') ? this.scrollToCard('appCard-devices') : null;
						}}
						arrowForceOpen={this.openCard('devices')}
						arrowHead={this.renderFormPartHeader(messages.devices, 'devices', errors)}
						className="appCard-devices"
						openTitle
					>
						<Row>
							<Col md={9}>{this.renderSelectByName('deviceType', errors)}</Col>
							<Col md={3}>
								<div className="campaign-form__allcheckbox">
									<IntlFieldGroup
										name="all_devices"
										inputProps={{
											type: 'checkbox',
											id: 'all_devices',
											value: true,
											checked: this.state.blockedDevices,
											onChange: () =>
												this.setState({ blockedDevices: !this.state.blockedDevices }),
										}}
										label={messages.allDevices}
										html
									/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col md={9}>{this.renderSelectByName('osType', errors)}</Col>
							<Col md={3}>
								<div className="campaign-form__allcheckbox">
									<IntlFieldGroup
										name="all_os"
										inputProps={{
											type: 'checkbox',
											id: 'all_os',
											value: true,
											checked: this.state.blockedOS,
											onChange: () => this.setState({ blockedOS: !this.state.blockedOS }),
										}}
										label={messages.allOS}
										html
									/>
								</div>
							</Col>
						</Row>
						<Row>
							<Col md={9}>{this.renderSelectByName('browserType', errors)}</Col>
							<Col md={3}>
								<div className="campaign-form__allcheckbox">
									<IntlFieldGroup
										name="all_browsers"
										inputProps={{
											type: 'checkbox',
											id: 'all_browsers',
											value: true,
											checked: this.state.blockedBrowsers,
											onChange: () =>
												this.setState({ blockedBrowsers: !this.state.blockedBrowsers }),
										}}
										label={messages.allBrowsers}
										html
									/>
								</div>
							</Col>
						</Row>
					</AppCard>
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('reports');
							this.openCard('reports') ? this.scrollToCard('appCard-reports') : null;
						}}
						arrowForceOpen={this.openCard('reports')}
						arrowHead={this.renderFormPartHeader(messages.reports, 'reports', errors)}
						className="appCard-reports"
						openTitle
					>
						{this.renderFormReports(values, change)}
					</AppCard>
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('addCreative');
							this.openCard('addCreative') ? this.scrollToCard('appCard-addCreative') : null;
						}}
						arrowForceOpen={this.openCard('addCreative')}
						arrowHead={this.renderFormPartHeader(messages.creatives, 'addCreative', errors)}
						className="appCard-addCreative"
						openTitle
					>
						{this.renderSelectByName('creatives', errors)}
					</AppCard>
					{/* <AppCard
						arrow
						onToggle={() => {
							this.toggleCard('directDeals');
							this.openCard('directDeals') ? this.scrollToCard('appCard-directDeals') : null;
						}}
						arrowForceOpen={this.openCard('directDeals')}
						arrowHead={this.renderFormPartHeader(messages.directDeals, 'directDeals', errors)}
						className="appCard-directDeals"
						openTitle
					>
						<IntlFieldGroup
							name="direct_domains"
							inputProps={{
								type: 'textarea',
								rows: '5',
							}}
							label={messages.domainList}
							formText={messages.domainExample}
						/>
					</AppCard> */}
					<AppCard
						arrow
						onToggle={() => {
							this.toggleCard('blackList');
							this.openCard('blackList') ? this.scrollToCard('appCard-blackList') : null;
						}}
						arrowForceOpen={this.openCard('blackList')}
						arrowHead={this.renderFormPartHeader(messages.filter, 'blackList', errors)}
						className="appCard-blackList"
						openTitle
					>
						{this.renderSelectByName('whitelist', errors)}
						{this.renderSelectByName('blacklist', errors)}
						{this.renderSelectByName('SSP', errors)}
					</AppCard>
				</div>
				{see === -1 ? (
					<div className="submitFormBottom">
						<Button
							type="submit"
							color="success"
							onClick={() => {
								this.scrollToError();
								this.setState({ continueEditing: false });
							}}
						>
							<FormattedMessage id="app.common.saveAndExit" />
						</Button>
						<Button
							type="submit"
							color="primary"
							style={{ marginLeft: '10px' }}
							onClick={() => {
								this.scrollToError();
								this.setState({ continueEditing: true });
							}}
						>
							<FormattedMessage id="app.common.save" />
						</Button>
					</div>
				) : null}
			</form>
		);
	}

	fillOutCampaign(e) {
		e.preventDefault();
		if (e.target.value !== '') {
			const campaign = _.find(this.props.campaigns, ['id', parseInt(e.target.value, 10)]);
			if (campaign) {
				this.setState({ fillCampaign: campaign });
				this.setInitialStateForEdit({}, campaign);
			}
		} else {
			this.setState({ fillCampaign: {} });
		}
	}

	getInitialValues() {
		const {
			match: {
				params: { idCampaign },
			},
			timezones,
		} = this.props;

		const initValues = {
			timezone: findTimezone(timezones),
			frequency: '3',
			name: `New campaign ${moment().format('DD.MM.YY HH:mm')}`,
		};

		if (!idCampaign && !this.formRef) {
			return initValues;
		}

		if (this.props.activeCampaign) {
			return this.state.activeCampaign;
		}

		if (!this.props.activeCampaign && this.state.fillCampaign && Object.keys(this.state.fillCampaign).length) {
			return this.state.fillCampaign;
		}
	}

	percentGauge() {
		const {
			selectedCategoriesV1,
			deviceTypeSelected,
			languageSelected,
			osTypeSelected,
			browserTypeSelected,
			ageGroupSelected,
			SSPSelected,
			blacklistSelected,
			whitelistSelected,
			placementSelected,
			clearTimeTable,
			genderMale,
			genderFemale,
			geoSelected,
		} = this.state;
		let percent = 0;
		if (Object.keys(geoSelected).length) {
			percent += 20;
		}

		if (selectedCategoriesV1.length) {
			percent += 20;
		}

		if (deviceTypeSelected.length) {
			percent += 5;
		}

		if (osTypeSelected.length) {
			percent += 5;
		}

		if (browserTypeSelected.length) {
			percent += 5;
		}

		if (ageGroupSelected.length) {
			percent += 5;
		}

		if (clearTimeTable) {
			percent += 10;
		}

		if (languageSelected.length) {
			percent += 10;
		}
		if (placementSelected.length) {
			percent += 5;
		}
		if (whitelistSelected.length) {
			percent += 10;
		}

		if (blacklistSelected.length) {
			percent += 10;
		}

		if (SSPSelected.length) {
			percent += 15;
		}

		if (genderMale || genderFemale) {
			percent += 5;
		}

		return parseFloat(percent / 100);
	}

	getPercentColor(percent) {
		const colors = ['#f4516c', 'rgb(255, 184, 34)', 'rgb(129, 200, 186)', '#34bfa3', '#f44336'];

		if (percent <= 20) {
			return colors[0];
		}
		if (percent <= 40) {
			return colors[1];
		}
		if (percent <= 60) {
			return colors[2];
		}
		if (percent <= 80) {
			return colors[3];
		}
		if (percent <= 100) {
			return colors[4];
		}
		if (percent > 100) {
			return colors[0];
		}
	}

	render() {
		const {
			match: {
				params: { idCampaign },
			},
			match,
		} = this.props;
		const percentGauge = this.percentGauge();
		const colorGauge = this.getPercentColor(percentGauge * 100);
		const see = match.url.indexOf('see');
		return (
			<Row className="margin-0">
				<Col md={12}>
					<header className="page-title">
						<div className="float-left">
							<h1 className="title">
								{!idCampaign ? <FormattedMessage {...messages.addCampaignHeader} /> : null}
								{idCampaign && see === -1 ? (
									<FormattedMessage {...messages.editCampaignHeader} />
								) : null}
								{idCampaign && see !== -1 ? <FormattedMessage {...messages.seeCampaignHeader} /> : null}
								{idCampaign && <span>{` #${idCampaign}`}</span>}
							</h1>
							{idCampaign && (
								<span className="createdCampaign">{`Created at: ${this.state.createdAt}`}</span>
							)}
						</div>
						{this.props.campaigns && this.props.campaigns.length ? (
							<div className="float-right select-campaign">
								<select className="form-control" onChange={this.fillOutCampaign}>
									<option value="">Copy data from campaign</option>
									{this.props.campaigns.map(campaign => (
										<option value={campaign.id}>{campaign.name}</option>
									))}
								</select>
							</div>
						) : null}
					</header>
					<Row>
						<Col sm={12} lg={9} md={8} xs={12}>
							<Form
								validate={formValues => this.validate(formValues)}
								initialValues={this.getInitialValues()}
								onSubmit={values => this.onSubmit(values)}
								ref={c => (this.formRef = c)}
								render={this.renderForm}
							/>
						</Col>
						<Col md={4} lg={3}>
							<AppCard
								arrow
								onToggle={() => {
									this.toggleCard('gaugeChart');
								}}
								arrowForceOpen={true}
								arrowHead={{
									header: (
										<Col>
											<h3 className="group-title campaign-form-title">Audience analytics</h3>
										</Col>
									),
								}}
								className="appCard-reports"
								openTitle
							>
								<div className="border-bottom">
									<GaugeChart
										id="gauge-chart2"
										needleColor="#eaecef"
										arcWidth={0.1}
										arcPadding={0.02}
										cornerRadius={1}
										nrOfLevels={5}
										textColor={colorGauge}
										percent={percentGauge}
										hideText
										colors={[
											'rgba(255, 184, 34, 0.7)',
											'rgb(255, 184, 34)',
											'rgb(129, 200, 186)',
											'#34bfa3',
											'#f4516c',
										]}
									/>
									{percentGauge <= 0.4 && (
										<div
											style={{
												color: 'rgb(255, 184, 34)',
												fontSize: '20px',
												textAlign: 'center',
											}}
										>
											Wide
										</div>
									)}
									{percentGauge > 0.4 && percentGauge <= 0.8 && (
										<div style={{ color: '#34bfa3', fontSize: '20px', textAlign: 'center' }}>
											Moderate
										</div>
									)}
									{percentGauge > 0.8 && percentGauge <= 1 && (
										<div style={{ color: '#f4516c', fontSize: '20px', textAlign: 'center' }}>
											Narrow
										</div>
									)}
									<CampaignDetails
										{...this.props}
										states={this.state}
										messages={messages}
										preview={this.state.previewTree}
									/>
								</div>
							</AppCard>
							<AppCard
								arrow
								onToggle={() => {
									this.toggleCard('instructionsText');
								}}
								arrowForceOpen={this.openCard('instructionsText')}
								arrowHead={{
									header: (
										<Col>
											<h3 className="group-title campaign-form-title">Instructions</h3>
										</Col>
									),
								}}
								className="appCard-reports"
								openTitle
							>
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
	getCountries: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	timezones: selectTimezones(),
	categories: selectCategories(),
	categoriesV1: selectCategoriesV1(),
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
	campaignsIds: selectCampaignsIds(),
	activeCampaign: campaingsSelectors.activeEntry(),
	addCampaignError: campaingsSelectors.addEntryError(),
	addCampaignLoading: campaingsSelectors.addEntryLoading(),
	openedCards: selectOpenedFormCards(),
	blacklist: filtersSelectors.collectionList(),
	whitelist: filtersSelectors.collectionList(),
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
		setOpenedFormCards: value => dispatch(setOpenedFormCards(value)),
		getCountries: () => dispatch(getCountries()),
		bigFormLoadingStart: () => dispatch(campaingFormLoadingStart()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CampaignForm);
