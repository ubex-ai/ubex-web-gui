import React from 'react';
import { Row, Col } from 'reactstrap';
import BarChart from 'components/Charts/Bar';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import messages from 'containers/DataMiner/messages';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import reducer from 'containers/DataMiner/reducer';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import DateSelect from 'components/DateSelect';
import { getCounterDevices, getCounterDevicesTable } from '../../actions';
import {
	countersSelectors,
	selectCountersIds,
	selectCounterDevices,
	selectCounterDevicesTable,
	selectChartsDates,
} from '../../selectors';

class Devices extends React.Component {
	columns = [
		{ name: 'name', title: this.props.intl.formatMessage(messages.devices) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidpercent', title: this.props.intl.formatMessage(messages.paidPercent) },
	];

	componentDidMount() {
		const { dates, countersIds } = this.props;
		const { startDate, endDate } = dates;
		this.props.getCounterDevices({
			start_date: startDate,
			end_date: endDate,
			ids: countersIds.slice(0, 19).join(),
		});
		this.props.getCounterDevicesTable({
			start_date: startDate,
			end_date: endDate,
			ids: countersIds.slice(0, 19).join(),
		});
	}

	updateCharts(params, dates) {
		this.props.getCounterDevices({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids: params.selectedOption.counter,
		});
		this.props.getCounterDevicesTable({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids: params.selectedOption.counter,
		});
	}

	render() {
		const { counterDevices, dates, counters, counterDevicesTable } = this.props;
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
											<FormattedMessage {...messages.devices} />
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
					<Col className="col-md-12">
						<AppCard chart>
							<BarChart data={counterDevices} height={window.innerWidth > 600 ? 100 : 300} />
						</AppCard>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable data={counterDevicesTable.length ? counterDevicesTable : []} pagination columns={this.columns} grouping />
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}
Devices.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableDevices: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topDevices: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.number.isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}).isRequired,
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
	counterDevices: selectCounterDevices(),
	counterDevicesTable: selectCounterDevicesTable(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getCounterDevices: dates => dispatch(getCounterDevices(dates)),
		getCounterDevicesTable: dates => dispatch(getCounterDevicesTable(dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(
	withConnect,
)(injectIntl(Devices));
