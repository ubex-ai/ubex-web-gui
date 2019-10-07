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
import { getCounterDevices, getCounterDevicesTable, setActiveCounterStats } from '../../actions';
import {
	countersSelectors,
	selectCountersIds,
	selectCounterDevices,
	selectCounterDevicesTable,
	selectChartsDates,
	selectActiveCounterStats,
} from '../../selectors';

class Devices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{ name: 'name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
				{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
				{ name: 'paidusers', title: this.props.intl.formatMessage(messages.newVisitors) },
				{ name: 'paidpercent', title: 'NEW %' },
			],
			selectedCounter: null,
		};
	}

	componentDidMount() {
		const { dates, countersIds, activeCounterStats } = this.props;
		const { startDate, endDate } = dates;
		const firstCounter = countersIds.length ? countersIds[0] : 0;
		this.setState({ selectedCounter: activeCounterStats || firstCounter });
		if (countersIds.length) {
			this.props.getCounterDevices({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
			this.props.getCounterDevicesTable({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
		}
	}

	updateCharts(params, dates) {
		const { countersIds } = this.props;
		this.props.getCounterDevices({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids:
				params.selectedOption && params.selectedOption.value !== 'all'
					? params.selectedOption.counter
					: countersIds
							.sort((a, b) => a - b)
							.slice(0, 19)
							.join(),
		});
		this.props.getCounterDevicesTable({
			start_date: dates.startDate,
			end_date: dates.endDate,
			ids:
				params.selectedOption && params.selectedOption.value !== 'all'
					? params.selectedOption.counter
					: countersIds
							.sort((a, b) => a - b)
							.slice(0, 19)
							.join(),
		});
		if (params.selectedOption && params.selectedOption.value !== 'all') {
			this.props.setActiveCounterStats(params.selectedOption.counter);
		}
	}

	render() {
		const { counterDevices, dates, counters, counterDevicesTable } = this.props;
		const { startDate, endDate, period } = dates;

		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={4}>
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
								miningSelected={this.state.selectedCounter}
								disableDefaultSelect
							/>
						</Row>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-md-12">
						<AppCard chart>
							<BarChart data={counterDevices} height={window.innerWidth > 600 ? 100 : 300} legend />
						</AppCard>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable
								data={counterDevicesTable.length ? counterDevicesTable : []}
								pagination
								grouping
								columns={this.state.columns}
							/>
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
	activeCounterStats: selectActiveCounterStats(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getCounterDevices: dates => dispatch(getCounterDevices(dates)),
		getCounterDevicesTable: dates => dispatch(getCounterDevicesTable(dates)),
		setActiveCounterStats: value => dispatch(setActiveCounterStats(value)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(Devices));
