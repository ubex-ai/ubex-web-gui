/**
 *
 * DateSelect
 *
 */

import React from 'react';
import { Col, Row } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { DateRangePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class DateSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focusedInput: null,
			tempPeriod: 'today',
			startDate: moment(props.startDate),
			endDate: moment(props.endDate),
			selectedOptionCampaign: { value: 'all', label: this.props.intl.formatMessage(messages.allCampaigns) },
			selectedOptionInventory: { value: 'all', label: this.props.intl.formatMessage(messages.allInventories) },
			selectedOptionCounter: { value: 'all', label: this.props.intl.formatMessage(messages.allCounters) },
			selectedOptionGroup: { value: 'all', label: this.props.intl.formatMessage(messages.allGroups) },
			options: [
				{ value: 'week', label: this.props.intl.formatMessage(messages.week) },
				{ value: 'month', label: this.props.intl.formatMessage(messages.month) },
				{ value: 'year', label: this.props.intl.formatMessage(messages.year) },
				{ value: 'all', label: this.props.intl.formatMessage(messages.alltime) },
			],
			selectedOption: { value: 'week', label: this.props.intl.formatMessage(messages.week) },
			tradingDeskCampaigns: null,
			tradingDesk: null,
			publisher: null,
			mining: null,
		};
		this.period = props.period;
		this.startDate = moment(props.startDate);
		this.endDate = moment(props.endDate);
		this.startDatepicker = null;
		this.endDatepicker = null;
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
	}

	handleChange = selectedOption => {
		this.setState({ selectedOption });
		if (selectedOption.value === 'week') {
			this.startDate = moment().subtract('6', 'day');
			this.endDate = moment();
			this.period = 'week';
		}

		if (selectedOption.value === 'month') {
			this.startDate = moment().subtract('1', 'month');
			this.endDate = moment();
			this.period = 'month';
		}

		if (selectedOption.value === 'year') {
			this.startDate = moment().subtract('1', 'year');
			this.endDate = moment();
			this.period = 'year';
		}

		if (selectedOption.value === 'all') {
			this.startDate = moment().subtract('2', 'year');
			this.endDate = moment();
			this.period = 'all';
		}
		this.setState({ startDate: this.startDate, endDate: this.endDate });
		this.props.onChange(
			{
				start_date: this.startDate.format('YYYY-MM-DD'),
				end_date: this.endDate.format('YYYY-MM-DD'),
				group: selectedOption.value === 'all' ? 'year' : selectedOption.value === 'year' ? 'month' : 'day',
				selectedOption:
					this.state.selectedOptionCampaign ||
					this.state.selectedOptionInventory ||
					this.state.selectedOptionCounter,
			},
			{
				startDate: this.startDate.format('YYYY-MM-DD'),
				endDate: this.endDate.format('YYYY-MM-DD'),
				period: this.period,
			},
		);
	};

	handleChangeGroup = selectedOptionGroup => {
		this.setState({ selectedOptionGroup });
		const tempStartDate = this.state.startDate.format('YYYY-MM-DD');
		const tempEndDate = this.state.endDate.format('YYYY-MM-DD');
		this.props.onChange(
			{
				start_date: tempStartDate,
				end_date: tempEndDate,
				selectedOption: selectedOptionGroup,
			},
			{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
		);
	};

	handleChangeCampaign = selectedOptionCampaign => {
		this.setState({ selectedOptionCampaign });
		const tempStartDate = this.state.startDate.format('YYYY-MM-DD');
		const tempEndDate = this.state.endDate.format('YYYY-MM-DD');
		this.props.onChange(
			{
				start_date: tempStartDate,
				end_date: tempEndDate,
				selectedOption: selectedOptionCampaign,
			},
			{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
		);
	};

	handleChangeInventory = selectedOptionInventory => {
		this.setState({ selectedOptionInventory });
		const tempStartDate = this.state.startDate.format('YYYY-MM-DD');
		const tempEndDate = this.state.endDate.format('YYYY-MM-DD');
		this.props.onChange(
			{
				start_date: tempStartDate,
				end_date: tempEndDate,
				selectedOption: selectedOptionInventory,
			},
			{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
		);
	};

	handleChangeCounter = selectedOptionCounter => {
		this.setState({ selectedOptionCounter });
		const tempStartDate = this.state.startDate.format('YYYY-MM-DD');
		const tempEndDate = this.state.endDate.format('YYYY-MM-DD');
		this.props.onChange(
			{
				start_date: tempStartDate,
				end_date: tempEndDate,
				selectedOption: selectedOptionCounter,
			},
			{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
		);
	};

	handleChangeStart(date) {
		this.endDatepicker.setOpen(true);

		this.setState({
			startDate: date,
		});
	}

	handleChangeEnd(date) {
		const { startDate, endDate } = this.state;
		let tempStartDate;
		let tempEndDate;
		tempStartDate = startDate.format('YYYY-MM-DD');
		tempEndDate = date.format('YYYY-MM-DD');

		if (startDate !== null && tempEndDate > tempStartDate) {
			tempStartDate = startDate.format('YYYY-MM-DD');
			tempEndDate = date.format('YYYY-MM-DD');
			this.setState({
				endDate: moment(tempEndDate),
			});
			this.props.onChange(
				{
					start_date: tempStartDate,
					end_date: tempEndDate,
					selectedOption:
						this.state.selectedOptionCampaign ||
						this.state.selectedOptionInventory ||
						this.state.selectedOptionCounter,
				},
				{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
			);
		} else {
			this.setState({ startDate: null, endDate: null });
			this.startDatepicker.setOpen(true);
			this.startDatepicker.input.focus();
		}
	}

	componentDidMount() {
		if (this.props.publisher) {
			const publisher = [
				{ code: 'all', name: this.props.intl.formatMessage(messages.allInventories) },
				...this.props.publisher,
			];
			this.setState({ publisher });
		}
		if (this.props.mining) {
			const mining = [
				{ id: 'all', name: this.props.intl.formatMessage(messages.allCounters) },
				...this.props.mining,
			];
			this.setState({ mining });
		}
		if (this.props.tradingDesk) {
			if (this.props.tradingDeskSelected) {
				this.setState({
					selectedOptionGroup: this.props.tradingDesk
						.filter(f => f.id === parseInt(this.props.tradingDeskSelected, 10))
						.map(l => ({
							value: l.id,
							label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
						}))[0],
				});
			} else {
				const tradingDesk = [
					{ id: 'all', name: this.props.intl.formatMessage(messages.allGroups) },
					...this.props.tradingDesk,
				];
				this.setState({ tradingDesk });
			}
		}
		if (this.props.tradingDeskCampaigns) {
			if (this.props.tradingDeskCampaignsSelected) {
				this.setState({
					selectedOptionGroup: this.props.tradingDeskCampaigns
						.filter(f => f.id === parseInt(this.props.tradingDeskCampaignsSelected, 10))
						.map(l => ({
							value: l.id,
							label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
						}))[0],
				});
			} else {
				const tradingDeskCampaigns = [
					{ id: 'all', name: this.props.intl.formatMessage(messages.allGroups) },
					...this.props.tradingDeskCampaigns,
				];
				this.setState({ tradingDeskCampaigns });
			}
		}
		this.setState({
			selectedOption: this.state.options.filter(option => option.value === this.props.period),
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.tradingDeskSelected !== this.props.tradingDeskSelected) {
			this.setState({
				selectedOptionGroup: this.props.tradingDesk
					.filter(f => f.id === parseInt(this.props.tradingDeskSelected, 10))
					.map(l => ({
						value: l.id,
						label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
					}))[0],
			});
		}
		if (prevProps.tradingDeskCampaignsSelected !== this.props.tradingDeskCampaignsSelected) {
			this.setState({
				selectedOptionGroup: this.props.tradingDeskCampaigns
					.filter(f => f.id === parseInt(this.props.tradingDeskCampaignsSelected, 10))
					.map(l => ({
						value: l.id,
						label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
					}))[0],
			});
		}
	}

	render() {
		const { startDate, endDate } = this.state;
		const { tradingDesk, publisher, mining, tradingDeskCampaigns } = this.state;
		return (
			<Col xl={7}>
				<div className="form-inline">
					<div
						className="form-group mb-2"
						style={
							!tradingDesk && !publisher && !mining && !tradingDeskCampaigns
								? { position: 'absolute' }
								: {}
						}
					>
						{mining && (
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={mining.map(l => ({
									value: l.id,
									label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
									counter: l.counter,
								}))}
								onChange={this.handleChangeCounter}
								value={this.state.selectedOptionCounter}
								placeholder="Select counter"
							/>
						)}
						{tradingDesk && (
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={tradingDesk.filter(filter => filter.status === 'active').map(l => ({
									value: l.id,
									label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
								}))}
								onChange={this.handleChangeGroup}
								value={this.state.selectedOptionGroup}
								placeholder="Select campaign group"
							/>
						)}
						{tradingDeskCampaigns && (
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={tradingDeskCampaigns.filter(filter => filter.status === 'active').map(l => ({
									value: l.id,
									label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
								}))}
								onChange={this.handleChangeCampaign}
								value={this.state.selectedOptionCampaign}
								placeholder="Select campaign"
							/>
						)}
						{publisher && (
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={publisher.map(l => ({
									value: l.code,
									label: l.code !== 'all' ? `${l.name} (${l.code})` : `${l.name}`,
								}))}
								onChange={this.handleChangeInventory}
								value={this.state.selectedOptionInventory}
								placeholder="Select inventory"
							/>
						)}
					</div>
					<div className="form-group mb-2" onClick={() => this.startDatepicker.setOpen(false)}>
						<Select
							className="campaign-select-container week"
							classNamePrefix="campaign-select"
							options={this.state.options}
							onChange={this.handleChange}
							value={this.state.selectedOption}
							isSearchable={false}
						/>
					</div>
					<div className="or-text">
						<FormattedMessage {...messages.or} />
					</div>
					<div className="form-group mb-2">
						<DatePicker
							selected={startDate}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							onChange={this.handleChangeStart}
							className="picker"
							dateFormat="DD.MM.YYYY"
							ref={datepicker => {
								this.startDatepicker = datepicker;
							}}
						/>
					</div>
					<div className="arrow">
						<i className="fas fa-angle-right" />
					</div>
					<div className="form-group mb-2">
						<DatePicker
							popperClassName="endDatePopper"
							selected={endDate}
							selectsEnd
							popperPlacement="top-end"
							startDate={startDate}
							endDate={endDate}
							onChange={this.handleChangeEnd}
							className="picker"
							dateFormat="DD.MM.YYYY"
							ref={datepicker => {
								this.endDatepicker = datepicker;
							}}
						/>
					</div>
				</div>
			</Col>
		);
	}
}

DateSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	endDate: PropTypes.string.isRequired,
	period: PropTypes.string.isRequired,
	startDate: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
	mining: PropTypes.array,
	publisher: PropTypes.array,
	tradingDesk: PropTypes.array,
	tradingDeskSelected: PropTypes.string,
	tradingDeskCampaignsSelected: PropTypes.string,
	tradingDeskCampaigns: PropTypes.array,
};

export default injectIntl(DateSelect);
