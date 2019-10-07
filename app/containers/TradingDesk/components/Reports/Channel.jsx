/**
 *
 * Channel
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import messages from 'containers/DataMiner/messages';
import AppCard from 'components/AppCard';
import BarChart from 'components/Charts/Bar';
import AppTable from 'components/Tables/AppTable';
import DateSelect from 'components/DateSelect';
import {getCounterChannel, getCounterChannelTable, setActiveCounterStats} from '../../actions';
import {
	countersSelectors,
	selectCountersIds,
	selectCounterChannel,
	selectCounterChannelTable,
	selectChartsDates, selectActiveCounterStats,
} from '../../selectors';

class Channel extends React.Component {
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
			this.props.getCounterChannel({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
			this.props.getCounterChannelTable({
				start_date: startDate,
				end_date: endDate,
				ids: activeCounterStats || firstCounter,
			});
		}
	}

	updateCharts(params, dates) {
		const { countersIds } = this.props;
		this.props.getCounterChannel({
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
		this.props.getCounterChannelTable({
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
		const { counterChannel, dates, counters, counterChannelTable } = this.props;
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
											<FormattedMessage {...messages.channel} />
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
				<Row className="row margin-0">
					<Col className="col-md-12">
						<AppCard chart>
							<BarChart data={counterChannel} height={window.innerWidth > 600 ? 100 : 300} channel />
						</AppCard>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable
								data={counterChannelTable.length ? counterChannelTable : []}
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
Channel.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableChannels: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topChannel: PropTypes.shape({
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
	counterChannel: selectCounterChannel(),
	counterChannelTable: selectCounterChannelTable(),
	activeCounterStats: selectActiveCounterStats(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getCounterChannel: dates => dispatch(getCounterChannel(dates)),
		getCounterChannelTable: dates => dispatch(getCounterChannelTable(dates)),
		setActiveCounterStats: value => dispatch(setActiveCounterStats(value)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(Channel));
