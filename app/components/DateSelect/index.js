/**
 *
 * DateSelect
 *
 */

import React from 'react';
import { Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { DateRangePicker } from 'react-dates';
import PropTypes from 'prop-types';
import moment from 'moment';
import messages from '../../containers/Publisher/messages';

/* eslint-disable react/prefer-stateless-function */
class DateSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focusedInput: null,
			tempPeriod: 'today',
		};
		this.startDate = moment(props.startDate, 'YYYY-MM-DD');
		this.endDate = moment(props.endDate, 'YYYY-MM-DD');
		this.period = props.period;
		this.onSelectDate = this.onSelectDate.bind(this);
	}

	onSelectDate(event) {
		if (event.target.value === 'week') {
			this.startDate = moment().subtract('6', 'day');
			this.endDate = moment();
			this.period = 'week';
		}

		if (event.target.value === 'month') {
			this.startDate = moment().subtract('1', 'month');
			this.endDate = moment();
			this.period = 'month';
		}

		if (event.target.value === 'year') {
			this.startDate = moment().subtract('1', 'year');
			this.endDate = moment();
			this.period = 'year';
		}

		if (event.target.value === 'all') {
			this.startDate = moment().subtract('2', 'year');
			this.endDate = moment();
			this.period = 'all';
		}
		this.props.onChange(
			{
				start_date: this.startDate.format('YYYY-MM-DD'),
				end_date: this.endDate.format('YYYY-MM-DD'),
				group: event.target.value === 'all' ? 'year' : event.target.value === 'year' ? 'month' : 'day',
			},
			{
				startDate: this.startDate.format('YYYY-MM-DD'),
				endDate: this.endDate.format('YYYY-MM-DD'),
				period: this.period,
			},
		);
	}

	onSelectDateRange(startDate, endDate) {
		this.startDate = startDate;
		this.endDate = endDate;
		let tempStartDate;
		let tempEndDate;

		if (endDate === null) {
			tempStartDate = startDate.format('YYYY-MM-DD');
			tempEndDate = startDate.format('YYYY-MM-DD').add(7, 'days');
		} else if (endDate < startDate) {
			tempStartDate = startDate.format('YYYY-MM-DD').subtract('7', 'days');
			tempEndDate = startDate.format('YYYY-MM-DD');
		} else {
			tempStartDate = startDate.format('YYYY-MM-DD');
			tempEndDate = endDate.format('YYYY-MM-DD');
		}

		this.props.onChange(
			{
				start_date: tempStartDate,
				end_date: tempEndDate,
			},
			{ startDate: tempStartDate, endDate: tempEndDate, period: this.period },
		);
	}

	render() {
		return (
			<Col md={12} xl={6} lg={6} xs={12}>
				<Row className="float-right space-between">
					<Col md={4} xs={12} className="padding-0">
						<div className="form-group">
							<select
								name="select"
								defaultValue={this.period}
								onChange={this.onSelectDate}
								id="exampleSelect"
								className="form-control"
							>
								{['week', 'month', 'year', 'all'].map(period => (
									<FormattedMessage
										key={period}
										id={`app.common.${period === 'all' ? 'alltime' : period}`}
									>
										{message => <option value={period}>{message}</option>}
									</FormattedMessage>
								))}
							</select>
						</div>
					</Col>
					<p className="is-inline">or</p>
					<Col md={7} xs={12} className="padding-0">
						<DateRangePicker
							orientation="vertical"
							startDate={this.startDate} // momentPropTypes.momentObj or null,
							startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
							endDate={this.endDate} // momentPropTypes.momentObj or null,
							endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
							onDatesChange={({ startDate, endDate }) => this.onSelectDateRange(startDate, endDate)} // PropTypes.func.isRequired,
							focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
							onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
							isOutsideRange={() => false}
						/>
					</Col>
				</Row>
			</Col>
		);
	}
}

DateSelect.propTypes = {
	onChange: PropTypes.func.isRequired,
	endDate: PropTypes.string.isRequired,
	period: PropTypes.string.isRequired,
	startDate: PropTypes.string.isRequired,
};

export default DateSelect;
