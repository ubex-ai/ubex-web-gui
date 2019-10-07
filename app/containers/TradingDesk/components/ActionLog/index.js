/**
 *
 * ActionLog
 *
 */

import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppCard from 'components/AppCard';
import AppTable from 'components/Tables/AppTable';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import messages from '../../messages';
import { updateCharts } from '../../actions';
import DateSelect from 'components/DateSelect';
import { createStructuredSelector } from 'reselect';
import { selectChartsDates } from '../../selectors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class ActionLog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			startDate: moment(),
			endDate: null,
			logColumns: [
				{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
				{ name: 'type', title: this.props.intl.formatMessage(messages.type) },
				{ name: 'user', title: this.props.intl.formatMessage(messages.user) },
				{ name: 'action', title: this.props.intl.formatMessage(messages.action) },
			],
			logData: [{ date: '12-04-2019', type: 'Top Up Balance', user: 'admin', action: '$100 recharge' }],
		};
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
	}

	handleChangeStart(date) {
		this.setState({
			startDate: date,
		});
	}

	handleChangeEnd(date) {
		this.setState({
			endDate: date,
		});
	}

	updateCharts(){

	}

	render() {
		const { dates } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<Row className="margin-0">
				<Col md={12}>
					<Row>
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={12} sm={12} xl={4} lg={5}>
									<div className="page-title">
										<div className="float-left">
											<h1 className="title">
												<FormattedMessage {...messages.actionLogHeader} /> (coming soon)
											</h1>
										</div>
									</div>
								</Col>
								<DateSelect
									onChange={(params, dates) => this.updateCharts(params, dates)}
									startDate={startDate}
									endDate={endDate}
									period={period}
								/>
							</Row>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<AppCard>
								<AppTable columns={this.state.logColumns} data={this.state.logData} pagination search />
							</AppCard>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

ActionLog.propTypes = { intl: intlShape.isRequired, dates: PropTypes.object };
const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(ActionLog));
