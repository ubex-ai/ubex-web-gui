import React from 'react';
import { Row, Col } from 'reactstrap';
import LineChart from 'components/Charts/Line';

import AppTable from 'components/Tables/AppTable';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectCountersIds, selectChartsDates, selectCounterVisitors, countersSelectors, selectCounterVisitorsTable } from 'containers/TradingDesk/selectors';
import reducer from 'containers/DataMiner/reducer';
import { getCounterVisitors, getCounterVisitorsTable } from 'containers/TradingDesk/actions';
import DateSelect from 'components/DateSelect';
import AppCard from 'components/AppCard';
import injectReducer from 'utils/injectReducer';
import messages from 'containers/DataMiner/messages';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

class Visitors extends React.Component {
	columns = [
		{ name: 'name', title: this.props.intl.formatMessage(messages.counter) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidpercent', title: this.props.intl.formatMessage(messages.paidPercent) },
	];

	componentDidMount() {
		const { dates, countersIds } = this.props;
		const { startDate, endDate } = dates;
		this.props.getCounterVisitors({
			start_date: startDate,
			end_date: endDate,
			ids: countersIds.slice(0, 19).join(),
		});
		this.props.getCounterVisitorsTable({
			start_date: startDate,
			end_date: endDate,
			ids: countersIds.slice(0, 19).join(),
		});
	}

	updateCharts(params, dates) {
		this.props.getCounterVisitors({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids: params.selectedOption.counter,
		});
		this.props.getCounterVisitorsTable({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids: params.selectedOption.counter,
		});
	}

	render() {
		const { counterVisitors, dates, counters, counterVisitorsTable } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={5}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.visitors} />
										</h1>
									</div>
								</div>
							</Col>
							<DateSelect
								onChange={(params, dates) => this.updateCharts(params, dates)}
								startDate={startDate}
								endDate={endDate}
								period={period}
								mining={counters}
							/>
						</Row>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard chart>
							<LineChart
								data={counterVisitors}
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
								legend={['Visitors', 'New']}
								height={window.innerWidth > 600 ? 100 : 300}
							/>
						</AppCard>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable data={counterVisitorsTable.length ? counterVisitorsTable : []} pagination columns={this.columns} grouping />
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}

Visitors.propTypes = {
	dispatch: PropTypes.func.isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
	countersIds: selectCountersIds(),
	counters: countersSelectors.collectionList(),
	dates: selectChartsDates(),
	counterVisitors: selectCounterVisitors(),
	counterVisitorsTable: selectCounterVisitorsTable(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCounterVisitors: dates => dispatch(getCounterVisitors(dates)),
		getCounterVisitorsTable: dates => dispatch(getCounterVisitorsTable(dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(Visitors));
