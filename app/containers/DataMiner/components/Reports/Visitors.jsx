import React from 'react';
import { Row, Col } from 'reactstrap';
import LineChart from 'components/Charts/Line';

import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectChartsDates, selectMetricByName } from 'containers/DataMiner/selectors';
import reducer from 'containers/DataMiner/reducer';
import { updateCharts } from 'containers/DataMiner/actions';
import DateSelect from 'components/DateSelect';
import AppCard from 'components/AppCard';
import injectReducer from 'utils/injectReducer';
import messages from 'containers/DataMiner/messages';

class Visitors extends React.Component {
	columns = [
		{ name: 'name', title: this.props.intl.formatMessage(messages.counter) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidpercent', title: this.props.intl.formatMessage(messages.paidPercent) },
	];

	render() {
		const { topVisitors, toTableTopCounters, dates, updateCharts } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={12} sm={6} xl={5} lg={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.visitors} />
										</h1>
									</div>
								</div>
							</Col>
							<DateSelect
								onChange={(params, dates) => updateCharts(params, dates)}
								startDate={startDate}
								endDate={endDate}
								period={period}
							/>
						</Row>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard chart>
							<LineChart
								data={topVisitors}
								color={[
									{
										r: 63,
										g: 153,
										b: 184,
									},
									{
										r: 1,
										g: 184,
										b: 170,
									},
								]}
								legend={['Visitors', 'Paid visitors']}
								height={window.innerWidth > 600 ? 100 : 300}
							/>
						</AppCard>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable data={toTableTopCounters} pagination columns={this.columns} grouping />
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}

Visitors.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toTableTopCounters: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topVisitors: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}).isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
	intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
	topVisitors: selectMetricByName('topVisitors'),
	toTableTopCounters: selectMetricByName('toTableTopCounters'),
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

const withReducer = injectReducer({ key: 'dataMiner', reducer });
export default compose(
	withReducer,
	withConnect,
)(injectIntl(Visitors));
