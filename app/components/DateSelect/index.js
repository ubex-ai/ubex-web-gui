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
import messages from './messages';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

/* eslint-disable react/prefer-stateless-function */
class DateSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focusedInput: null,
			tempPeriod: 'today',
			startDate: moment(props.startDate),
			endDate: moment(props.endDate),
			selectedOptionCampaign: { value: 'all', label: this.props.intl.formatMessage(messages.allGroups) },
			selectedOptionInventory: { value: 'all', label: this.props.intl.formatMessage(messages.allInventories) },
			selectedOptionCounter: { value: 'all', label: this.props.intl.formatMessage(messages.allCounters) },
			options: [
				{ value: 'week', label: this.props.intl.formatMessage(messages.week) },
				{ value: 'month', label: this.props.intl.formatMessage(messages.month) },
				{ value: 'year', label: this.props.intl.formatMessage(messages.year) },
				{ value: 'all', label: this.props.intl.formatMessage(messages.alltime) },
			],
			selectedOption: { value: 'week', label: this.props.intl.formatMessage(messages.week) },
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
			},
			{
				startDate: this.startDate.format('YYYY-MM-DD'),
				endDate: this.endDate.format('YYYY-MM-DD'),
				period: this.period,
			},
		);
	};

	handleChangeCampaign = selectedOptionCampaign => {
		this.setState({ selectedOptionCampaign });
	};

	handleChangeInventory = selectedOptionInventory => {
		this.setState({ selectedOptionInventory });
	};

	handleChangeCounter = selectedOptionCounter => {
		this.setState({ selectedOptionCounter });
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
			this.props.publisher.unshift({ code: 'all', name: this.props.intl.formatMessage(messages.allInventories) });
		}
		if (this.props.mining) {
			this.props.mining.unshift({ id: 'all', name: this.props.intl.formatMessage(messages.allCounters) });
		}
		if (this.props.tradingDesk) {
			this.props.tradingDesk.unshift({ id: 'all', name: this.props.intl.formatMessage(messages.allGroups) });
		}
	}

	render() {
		const { startDate, endDate } = this.state;
		const { tradingDesk, publisher, mining } = this.props;
		return (
			<Col xl={7}>
				<div className={'form-inline'}>
					<div
						className="form-group mb-2"
						style={!tradingDesk && !publisher && !mining ? { position: 'absolute' } : {}}
					>
						{mining && (
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={mining.map(l => ({
									value: l.id,
									label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
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
								onChange={this.handleChangeCampaign}
								value={this.state.selectedOptionCampaign}
								placeholder="Select campaign group"
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
};

export default injectIntl(DateSelect);
