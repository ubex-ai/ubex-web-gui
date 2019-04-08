import React from 'react';
import { Row, Col } from 'reactstrap';
import LineChart from 'components/Charts/Line';

import { FormattedMessage } from 'react-intl';
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
		{ name: 'name', title: 'Counter' },
		{ name: 'date', title: 'Date' },
		{ name: 'count', title: 'Today visitors' },
		{ name: 'paidusers', title: 'Reward visitors' },
		{ name: 'paidpercent', title: 'Paid %' },
		{ name: 'txid', title: 'TxID' },
	];

	render() {
		const { topVisitors, toTableTopCounters, dates, updateCharts } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={6}>
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
							<LineChart data={topVisitors} legend height={window.innerWidth > 600 ? 100 : 300} />
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
)(Visitors);
