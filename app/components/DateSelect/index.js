/**
 *
 * DateSelect
 *
 */

import React from 'react';
import { Col, Row } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import Select from 'react-select';
import messages from './messages';
import DatePicker, { setDefaultLocale, registerLocale } from 'react-datepicker';
import enGB from 'date-fns/locale/en-GB';
registerLocale('en-gb', enGB);
setDefaultLocale('en-gb', enGB);
/* eslint-disable react/prefer-stateless-function */
class DateSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focusedInput: null,
			tempPeriod: 'today',
			startDate: moment(props.startDate).toDate(),
			endDate: moment(props.endDate).toDate(),
			selectedOptionInventory: { value: 'all', label: this.props.intl.formatMessage(messages.allInventories) },
			selectedOptionCounter: { value: 'all', label: this.props.intl.formatMessage(messages.allCounters) },
			selectedOptionGroup: { value: 'all', label: this.props.intl.formatMessage(messages.allGroups) },
			options: [
				{ value: 'week', label: this.props.intl.formatMessage(messages.week) },
				{ value: 'month', label: this.props.intl.formatMessage(messages.month) },
				{ value: 'year', label: this.props.intl.formatMessage(messages.year) },
				{ value: 'all', label: this.props.intl.formatMessage(messages.alltime) },
			],
			selectedOption: { value: 'month', label: this.props.intl.formatMessage(messages.month) },
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

	selOption() {
		if (this.props.mining) {
			return this.state.selectedOptionCounter;
		}
		if (this.props.tradingDesk) {
			return this.state.selectedOptionGroup;
		}
		if (this.props.publisher) {
			return this.state.selectedOptionInventory;
		}
		if (this.props.tradingDeskCampaigns) {
			return this.state.selectedOptionCampaign;
		}
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
		this.setState({ startDate: this.startDate.toDate(), endDate: this.endDate.toDate() });
		this.props.onChange(
			{
				start_date: moment(this.startDate).format('YYYY-MM-DD'),
				end_date: moment(this.endDate).format('YYYY-MM-DD'),
				group: selectedOption.value === 'all' ? 'year' : selectedOption.value === 'year' ? 'month' : 'day',
				selectedOption: this.selOption(),
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
		const tempStartDate = moment(this.state.startDate).format('YYYY-MM-DD');
		const tempEndDate = moment(this.state.endDate).format('YYYY-MM-DD');
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
		console.log(selectedOptionCampaign);
		const tempStartDate = moment(this.state.startDate).format('YYYY-MM-DD');
		const tempEndDate = moment(this.state.endDate).format('YYYY-MM-DD');
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
		const tempStartDate = moment(this.state.startDate).format('YYYY-MM-DD');
		const tempEndDate = moment(this.state.endDate).format('YYYY-MM-DD');
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
		const tempStartDate = moment(this.state.startDate).format('YYYY-MM-DD');
		const tempEndDate = moment(this.state.endDate).format('YYYY-MM-DD');
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
		const { startDate, endDate } = this.state;
		let tempStartDate;
		let tempEndDate;
		tempStartDate = moment(date).format('YYYY-MM-DD');
		if (endDate) {
			tempEndDate = moment(endDate).format('YYYY-MM-DD');
		}

		this.setState({
			startDate: date,
		});
		if (endDate !== null && tempEndDate >= tempStartDate) {
			tempStartDate = moment(date).format('YYYY-MM-DD');
			tempEndDate = moment(endDate).format('YYYY-MM-DD');
			this.props.onChange(
				{
					start_date: date,
					end_date: tempEndDate,
					selectedOption: this.selOption(),
				},
				{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
			);
		} else {
			this.endDatepicker.setOpen(true);
		}
	}

	handleChangeEnd(date) {
		const { startDate, endDate } = this.state;
		let tempStartDate;
		let tempEndDate;
		tempStartDate = moment(startDate).format('YYYY-MM-DD');
		tempEndDate = moment(date).format('YYYY-MM-DD');

		if (startDate !== null && tempEndDate >= tempStartDate) {
			tempStartDate = moment(startDate).format('YYYY-MM-DD');
			tempEndDate = moment(date).format('YYYY-MM-DD');
			this.setState({
				endDate: moment(tempEndDate).toDate(),
			});
			this.props.onChange(
				{
					start_date: tempStartDate,
					end_date: tempEndDate,
					selectedOption: this.selOption(),
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
		if (this.endDate.format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
			this.setState({
				startDate: moment()
					.startOf('day')
					.subtract('1', 'month')
					.toDate(),
				endDate: moment()
					.startOf('day')
					.toDate(),
			});
			this.props.onChange(
				{
					start_date: moment()
						.startOf('day')
						.subtract('1', 'month')
						.format('YYYY-MM-DD'),
					end_date: moment()
						.startOf('day')
						.format('YYYY-MM-DD'),
					selectedOption: this.selOption(),
				},
				{
					startDate: moment()
						.startOf('day')
						.subtract('1', 'month')
						.format('YYYY-MM-DD'),
					endDate: moment()
						.startOf('day')
						.format('YYYY-MM-DD'),
					period: this.period,
				},
			);
		}
		if (this.props.publisher) {
			const publisher = [
				{ code: 'all', name: this.props.intl.formatMessage(messages.allInventories) },
				...this.props.publisher,
			];
			this.setState({ publisher });
		}
		if (this.props.mining) {
			if (this.props.miningSelected) {
				this.setState({
					selectedOptionCounter: this.props.mining
						.filter(f => f.counter === this.props.miningSelected)
						.map(l => ({
							value: l.id,
							label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
							counter: l.counter,
						}))[0],
				});
			} else {
				const mining = [...this.props.mining];
				if (!this.props.disableDefaultSelect) {
					mining.unshift({ id: 'all', name: this.props.intl.formatMessage(messages.allCounters) });
				}
				this.setState({ mining });
			}
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
			}
			const tradingDesk = [...this.props.tradingDesk];
			if (!this.props.disableDefaultSelect) {
				tradingDesk.unshift({
					id: 'all',
					name: this.props.intl.formatMessage(messages.allGroups),
					status: 'active',
				});
			}
			this.setState({ tradingDesk });
		}
		if (this.props.tradingDeskCampaigns) {
			if (this.props.tradingDeskCampaignsSelected) {
				this.setState({
					selectedOptionCampaign: this.props.tradingDeskCampaigns
						.filter(f => f.id === parseInt(this.props.tradingDeskCampaignsSelected, 10))
						.map(l => ({
							value: l.id,
							label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
							campaign_group: l.campaign_group,
						}))[0],
				});
			} else {
				const tradingDeskCampaigns = [...this.props.tradingDeskCampaigns];
				if (!this.props.disableDefaultSelect) {
					tradingDeskCampaigns.unshift({
						id: 'all',
						name: this.props.intl.formatMessage(messages.allCampaigns),
						status: 'active',
					});
				}
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

		if (prevProps.miningSelected !== this.props.miningSelected) {
			this.setState(
				{
					selectedOptionCounter: this.props.mining
						.filter(f => f.counter === this.props.miningSelected)
						.map(l => ({
							value: l.id,
							label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
							counter: l.counter,
						}))[0],
				},
				() => {
					const tempStartDate = moment(this.state.startDate).format('YYYY-MM-DD');
					const tempEndDate = moment(this.state.endDate).format('YYYY-MM-DD');
					this.props.onChange(
						{
							start_date: tempStartDate,
							end_date: tempEndDate,
							selectedOption: this.selOption(),
						},
						{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
					);
				},
			);
		}

		if (prevProps.tradingDeskCampaignsSelected !== this.props.tradingDeskCampaignsSelected) {
			this.setState({
				selectedOptionCampaign: this.props.tradingDeskCampaigns
					.filter(f => f.id === parseInt(this.props.tradingDeskCampaignsSelected, 10))
					.map(l => ({
						value: l.id,
						label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
						campaign_group: l.campaign_group,
					}))[0],
			});
		}
	}

	render() {
		const { startDate, endDate } = this.state;
		const { tradingDesk, publisher, mining, tradingDeskCampaigns } = this.state;
		return (
			<Col xl={8}>
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
								options={tradingDesk
									.filter(filter => filter.status === 'active')
									.map(l => ({
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
								options={tradingDeskCampaigns
									.filter(filter => filter.status === 'active')
									.map(l => ({
										value: l.id,
										label: l.id !== 'all' ? `${l.name} (ID: ${l.id})` : `${l.name}`,
										campaign_group: l.campaign_group,
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
									value: l.guid,
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
							popperClassName="startDatePopper"
							selected={startDate}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							onChange={this.handleChangeStart}
							className="picker"
							popperPlacement="top-end"
							dateFormat="dd.MM.yy"
							locale="en-gb"
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
							dateFormat="dd.MM.yy"
							locale="en-gb"
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
