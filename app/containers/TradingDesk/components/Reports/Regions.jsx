import React from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import Datamap from 'components/Maps/Datamaps';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import AppCard from 'components/AppCard';
import { updateCharts } from 'containers/DataMiner/actions';
import messages from 'containers/DataMiner/messages';
import DateSelect from 'components/DateSelect';
import moment from 'moment';
import {getCounterRegions, getCounterRegionsTable, setActiveCounterStats, setChartsDates} from '../../actions';
import {
	selectChartsDates,
	countersSelectors,
	selectCountersIds,
	selectCounterRegions,
	selectCounterRegionsTable, selectActiveCounterStats,
} from '../../selectors';

class Regions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{ name: 'name', title: this.props.intl.formatMessage(messages.country) },
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
		this.props.updateDates({
			startDate: moment()
				.startOf('day')
				.subtract('1', 'month')
				.format('YYYY-MM-DD'),
			endDate: moment()
				.startOf('day')
				.format('YYYY-MM-DD'),
			period: 'month',
		});
		this.setState({ selectedCounter: activeCounterStats || firstCounter });
		if (countersIds.length) {
			this.props.getCounterRegions({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
			this.props.getCounterRegionsTable({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
		}
	}

	updateCharts(params, dates) {
		const { countersIds } = this.props;
		this.props.getCounterRegions({
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
		this.props.getCounterRegionsTable({
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
	}

	render() {
		const { counterRegions, dates, counters, counterRegionsTable } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row>
					<Col xs={12} md={12}>
						<Row className="margin-0">
							<Col md={12} className="title_with_select">
								<Row>
									<Col md={4}>
										<div className="page-title">
											<div className="float-left">
												<h1 className="title">
													<FormattedMessage {...messages.regions} />
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
									<Datamap data={counterRegions} />
								</AppCard>
							</Col>
						</Row>
						<Row className="margin-0">
							<Col className="col-12 col-lg-12 col-xl-12">
								<AppCard>
									<AppTable
										data={counterRegionsTable.length ? counterRegionsTable : []}
										pagination
										pSize={100}
										grouping
										columns={this.state.columns}
									/>
								</AppCard>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}

Regions.propTypes = {
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
	topRegions: PropTypes.shape({
		countriesColors: PropTypes.object,
		countriesCounts: PropTypes.object,
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
	counterRegions: selectCounterRegions(),
	counterRegionsTable: selectCounterRegionsTable(),
	activeCounterStats: selectActiveCounterStats(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateDates: dates => dispatch(setChartsDates(dates)),
		getCounterRegions: dates => dispatch(getCounterRegions(dates)),
		getCounterRegionsTable: dates => dispatch(getCounterRegionsTable(dates)),
		setActiveCounterStats: value => dispatch(setActiveCounterStats(value)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(Regions));
