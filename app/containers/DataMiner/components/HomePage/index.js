/**
 *
 * DataMiner
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import injectReducer from 'utils/injectReducer';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
import randomColor from 'randomcolor';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import LineChart from 'components/Charts/Line';
import BarChart from 'components/Charts/Bar';
import CardPopover from 'components/CardPopover';
import Datamap from 'components/Maps/Datamaps';
import reducer from 'containers/DataMiner/reducer';
import {
	getMetricsError,
	getMetricsLoading,
	selectOnlineCounters,
	selectMetricByName,
	selectRatio,
	totalUsers,
	selectAverage,
	selectRevenue,
	selectChartsDates,
	countersSelectors,
} from 'containers/DataMiner/selectors';
import messages from 'containers/DataMiner/messages';
import DateSelect from 'components/DateSelect';
import HorizontalBarChart from 'components/Charts/HorizontalBar';
import { updateCharts } from 'containers/DataMiner/actions';
import CountersOnlineDashboardCard from '../DashboardCards/CountersOnlineDashboardCard';
import NextPayoutDashboardCard from '../DashboardCards/NextPayoutDashboardCard';
import AverageRevenueDashboardCard from '../DashboardCards/AverageRevenueDashboardCard';
import UnpaidBalanceDashboardCard from '../DashboardCards/UnpaidBalanceDashboardCard';
import RevenueDashboardCard from '../DashboardCards/RevenueDashboardCard';
const moment = extendMoment(originalMoment);

/* eslint-disable react/prefer-stateless-function */
export class HomePage extends React.Component {
	state = {
		date: [new Date(), new Date()],
		isOpen: false,
		value: moment.range(
			moment()
				.clone()
				.subtract(7, 'days'),
			moment().clone(),
		),
		dates1: null,
		legend: <>no legend</>,
		colors: randomColor({
			count: 14,
			luminosity: 'dark',
			format: 'rgba',
			alpha: 0.7,
			hue: 'random',
		}),
	};

	render() {
		const {
			counters,
			onlineCounters,
			topProfitability,
			topCounters,
			topDevices,
			topChannel,
			topVisitors,
			topRegions,
			totalUsers,
			visitorsRatio,
			profitabilityRatio,
			totalPaidUser,
			averageProfitability,
			revenuePerDay,
			dates,
			updateCharts,
		} = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Helmet>
					<title>Ubex Data Miner</title>
					<meta name="description" content="Ubex Data Miner" />
				</Helmet>
				<Row className="margin-0">
					<Col xs={12} md={12}>
						<Row>
							<Col md={12} className="title_with_select">
								<Row>
									<Col md={12} sm={6} xl={6} lg={6}>
										<div className="page-title">
											<div className="float-left">
												<h1 className="title">
													<FormattedMessage {...messages.DataMiningHeader} />
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
						<div className="row">
							<div className="col-xl-6 col-md-12 col-12">
								<CountersOnlineDashboardCard {...onlineCounters} lg={6} md={6} sm={12}  />
							</div>
							<div className="col-xl-6 col-md-12 col-12">
								<NextPayoutDashboardCard />
							</div>
							<div className="col-12 col-lg-6 col-xl-6">
								<CardPopover
									popoverHeader={messages.visitorsPopover}
									popoverBody={messages.visitorsPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<Link to="/app/reports/visitors">
											<h2 className="cardPopover__header-title float-left">
												<FormattedMessage id="app.common.visitors" />
											</h2>
										</Link>
										<div className="actions digits float-right">
											<div
												className={
													(visitorsRatio > 0 && 'green') ||
													(visitorsRatio < 0 && 'red') ||
													(visitorsRatio === 0 && null)
												}
											>
												{totalUsers.toFixed(0)}
											</div>
										</div>
									</header>
									<div className="chart-container">
										<div className="chart-area">
											<LineChart
												data={topVisitors}
												height={window.innerWidth > 600 ? null : 300}
												legend
											/>
										</div>
									</div>
								</CardPopover>
							</div>
							<div className="col-12 col-lg-6 col-xl-6">
								<CardPopover
									popoverHeader={messages.profitabilityPopover}
									popoverBody={messages.profitabilityPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<Link to="/app/reports/counters/profitability">
											<h2 className="cardPopover__header-title float-left">
												<FormattedMessage {...messages.revenue} />
											</h2>
										</Link>
										<div className="actions digits float-right">
											<div
												className={
													(profitabilityRatio > 0 && 'green') ||
													(profitabilityRatio < 0 && 'red') ||
													(profitabilityRatio === 0 && null)
												}
											>
												{totalPaidUser.toFixed(0)}
											</div>
										</div>
									</header>
									<div className="chart-area">
										<LineChart
											data={topProfitability}
											height={window.innerWidth > 600 ? null : 300}
										/>
									</div>
								</CardPopover>
							</div>
							<div className="col-xl-4 col-md-12 col-12">
								<RevenueDashboardCard revenuePerDay={revenuePerDay} profitabilityRatio={profitabilityRatio} />
							</div>
							<div className="col-xl-4 col-md-12 col-12">
								<UnpaidBalanceDashboardCard />
							</div>
							<div className="col-xl-4 col-md-12 col-12">
								<AverageRevenueDashboardCard average={averageProfitability} />
							</div>
						</div>
						<div className="clearfix" />
						<div className="row">
							<div className="col-md-6">
								<CardPopover
									popoverHeader={messages.channelPopover}
									popoverBody={messages.channelPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<Link to="/app/reports/channel">
											<h2 className="cardPopover__header-title float-left">
												<FormattedMessage {...messages.channel} /> (reward)
											</h2>
										</Link>
									</header>
									<div className="chart-area">
										<BarChart
											data={topChannel}
											height={window.innerWidth > 600 ? null : 300}
											channel
										/>
									</div>
								</CardPopover>
							</div>

							<div className="col-md-6">
								<CardPopover
									popoverHeader={messages.topCountersPopover}
									popoverBody={messages.topCountersPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.topCounters} /> (reward)
										</h2>
									</header>
									<div className="chart-area doughnut-area">
										<div className="row">
											<HorizontalBarChart
												data={topCounters}
												height={window.innerWidth > 600 ? null : 300}
												counters={counters}
											/>
										</div>
									</div>
								</CardPopover>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6">
								<CardPopover
									popoverHeader={messages.visitorsCountriesPopover}
									popoverBody={messages.visitorsCountriesPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<Link to="/app/reports/regions">
											<h2 className="cardPopover__header-title float-left">
												Top-5 <FormattedMessage {...messages.visitorsStatistics} />
											</h2>
										</Link>
									</header>
									<div className="wid-vectormap">
										<Datamap data={topRegions} />
									</div>
								</CardPopover>
							</div>
							<div className="col-md-6">
								<CardPopover
									popoverHeader={messages.devicesPopover}
									popoverBody={messages.devicesPopoverText}
									chart
								>
									<header className="cardPopover__header">
										<Link to="/app/reports/devices">
											<h2 className="cardPopover__header-title float-left">
												<FormattedMessage {...messages.devices} /> (reward)
											</h2>
										</Link>
									</header>
									<div className="chart-container">
										<BarChart data={topDevices} height={window.innerWidth > 600 ? null : 300} />
									</div>
								</CardPopover>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
	counters: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number,
			is_online: PropTypes.bool,
			name: PropTypes.string,
			counter: PropTypes.string,
			created: PropTypes.string,
			paid_visitors: PropTypes.number,
			paid_percent: PropTypes.number,
		}),
	).isRequired,
	getMetricsIsLoading: PropTypes.bool,
	getMetricsError: PropTypes.object,
	onlineCounters: PropTypes.object,
	topChannel: PropTypes.object,
	topCounters: PropTypes.object,
	topDevices: PropTypes.object,
	topProfitability: PropTypes.object,
	topRegions: PropTypes.object,
	topVisitors: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	counters: countersSelectors.collectionList(),
	dates: selectChartsDates(),
	onlineCounters: selectOnlineCounters(),
	getMetricsIsLoading: getMetricsLoading(),
	getMetricsError: getMetricsError(),
	topVisitors: selectMetricByName('topVisitors'),
	topChannel: selectMetricByName('topChannel'),
	topCounters: selectMetricByName('topCounters'),
	topDevices: selectMetricByName('topDevices'),
	topProfitability: selectMetricByName('topProfitability'),
	topRegions: selectMetricByName('topRegions'),
	visitorsRatio: selectRatio('topVisitors'),
	profitabilityRatio: selectRatio('topProfitability'),
	totalUsers: totalUsers('topVisitors'),
	totalPaidUser: totalUsers('topProfitability'),
	averageProfitability: selectAverage('topProfitability'),
	revenuePerDay: selectRevenue('topProfitability'),
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
)(HomePage);
