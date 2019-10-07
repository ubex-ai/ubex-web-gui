/**
 *
 * PublisherHomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import 'chartjs-plugin-annotation';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
import randomColor from 'randomcolor';
import { Line, Bar, HorizontalBar, Chart } from 'react-chartjs-2';
import LinkButton from 'components/LinkButton';
import AppCard from 'components/AppCard';
import CardPopover from 'components/CardPopover';
import Datamap from 'components/Maps/Datamaps';
import LineChart from 'components/Charts/Line';
import {
	inventoriesSelectors,
	selectChartsDates,
	selectHomePageStats,
	selectTableHomePageStats,
	selectInventoryIds,
} from 'containers/Publisher/selectors';
import messages from 'containers/Publisher/messages';
import AppTable from 'components/Tables/AppTable';
import DateSelect from 'components/DateSelect';
import { updateCharts, getHomePageStats, getTableStatsHomePage, setChartsDates } from 'containers/Publisher/actions';
import InventoryShape from '../../shapes/Inventory';

const moment = extendMoment(originalMoment);
const colors = ['#1f77b4', '#9467bd', '#ff7f0e', '#2ca02c'];

/* eslint-disable react/prefer-stateless-function */
export class PublisherHomePage extends React.Component {
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
		worldData: [],
		width: 0,
		height: 0,
		startDate: originalMoment(),
		endDate: originalMoment(),
		data: {
			RUS: colors[0],
			KOR: colors[1],
			NZL: colors[2],
			DEU: colors[3],
		},
		sitesTableData: [],
		sitesTableColumns: [
			{ name: 'type', title: 'Type' },
			{ name: 'active', title: 'Active' },
			{ name: 'revenue', title: '% total of revenue' },
			{ name: 'reward', title: 'Reward' },
		],
		dataChart: { arrayCharts: [], labels: [], average: 0 },
	};

	componentDidMount() {
		const { dates, getHomePageStats, inventoryIds, getTableStatsHomePage } = this.props;
		const { startDate, endDate } = dates;
		if (inventoryIds.length) {
			getHomePageStats({
				inventory: inventoryIds
					.sort((a, b) => a - b)
					.slice(0, 19)
					.join(),
				start_date: startDate,
				end_date: endDate,
			});
			getTableStatsHomePage({
				inventory: inventoryIds
					.sort((a, b) => a - b)
					.slice(0, 19)
					.join(),
				start_date: startDate,
				end_date: endDate,
			});
		}
	}

	updateChart(params, dates) {
		const { getHomePageStats, getTableStatsHomePage, inventoryIds } = this.props;
		const { startDate, endDate } = dates;
		this.props.updateDates({ startDate: dates.startDate, endDate: dates.endDate, period: dates.period });
		if (inventoryIds.length) {
			getHomePageStats({
				inventory:
					params.selectedOption.value !== 'all'
						? params.selectedOption.value
						: inventoryIds
								.sort((a, b) => a - b)
								.slice(0, 19)
								.join(),
				start_date: startDate,
				end_date: endDate,
			});
			getTableStatsHomePage({
				inventory:
					params.selectedOption.value !== 'all'
						? params.selectedOption.value
						: inventoryIds
								.sort((a, b) => a - b)
								.slice(0, 19)
								.join(),
				start_date: startDate,
				end_date: endDate,
			});
		}
	}

	render() {
		const { dates, inventories, homePageStats, tableHomePageStats } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<Row>
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={12} className="title_with_select">
									<Row>
										<Col md={12} sm={6} xl={4} lg={6}>
											<div className="page-title">
												<div className="float-left">
													<h1 className="title">
														<FormattedMessage {...messages.PublisherHeader} />
													</h1>
												</div>
											</div>
										</Col>
										<DateSelect
											onChange={(params, dates) => this.updateChart(params, dates)}
											startDate={startDate}
											endDate={endDate}
											period={period}
											publisher={inventories}
										/>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="margin-0">
						<div className="col-xl-4 col-md-6 col-lg-6 col-12">
							<CardPopover
								popoverHeader={messages.impressionsPopover}
								popoverBody={messages.impressionsPopoverText}
							>
								<i className="float-left fa fa-eye icon-md icon-rounded icon-primary" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>
												{tableHomePageStats.impressions ? tableHomePageStats.impressions : 0}
											</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.impressions} />
										</span>
									</div>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-4 col-md-6 col-lg-6 col-12">
							<CardPopover
								popoverHeader={messages.clicksCountPopover}
								popoverBody={messages.clicksCountPopoverText}
							>
								<i className="float-left fas fa-hand-point-up icon-md icon-rounded icon-purple" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>{tableHomePageStats.clicks ? tableHomePageStats.clicks : 0}</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.clicksCount} />
										</span>
									</div>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-4 col-md-6 col-lg-6 col-12">
							<CardPopover popoverHeader={messages.CTRPopover} popoverBody={messages.CTRPopoverText}>
								<i className="float-left fas fa-sort-amount-up icon-md icon-rounded icon-danger" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>{tableHomePageStats.CTR ? tableHomePageStats.CTR : 0}%</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.CTR} />
										</span>
									</div>
								</div>
							</CardPopover>
						</div>
						<Col lg={6} md={6} xs={12} xl={4}>
							<CardPopover
								popoverHeader={messages.fillratePopover}
								popoverBody={messages.fillratePopoverText}
							>
								<i className="float-left fas fa-fill icon-md icon-rounded icon-success" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>
												{tableHomePageStats.fillrate ? tableHomePageStats.fillrate : 0}%
											</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.fillrate} />
										</span>
									</div>
								</div>
							</CardPopover>
						</Col>
						<div className="col-xl-3 col-md-6 col-lg-6 col-12 col-xl-4">
							<CardPopover popoverHeader={messages.eCPMPopover} popoverBody={messages.eCPMPopoverText}>
								<i className="float-left fas fa-file-invoice-dollar icon-md icon-rounded icon-warning" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>${tableHomePageStats.eCPM ? tableHomePageStats.eCPM : 0}</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.eCPM} />
										</span>
									</div>
								</div>
							</CardPopover>
						</div>
						<Col lg={6} md={6} xs={12} xl={4}>
							<CardPopover popoverHeader={messages.RPMPopover} popoverBody={messages.RPMPopoverText}>
								<i className="float-left fas fa-hand-holding-usd icon-md icon-rounded icon-accent" />
								<div className="stats dashboardCard__container">
									<div className="dashboardCard__text">
										<h4 className="dashboardCard__title">
											<strong>$0</strong>
										</h4>
										<span>
											<FormattedMessage {...messages.RPM} />
										</span>
									</div>
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.profitabilityPopover}
								popoverBody={messages.profitabilityPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.profitability} />
									</h2>
								</header>
								<div className="content-body chart-area">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.revenue],
														arrayLabels: homePageStats.labels,
												  }
												: this.state.dataChart
										}
										color={{
											r: 113,
											g: 106,
											b: 202,
										}}
										height={window.innerWidth > 600 ? null : 300}
									/>
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.fillratePopover}
								popoverBody={messages.fillratePopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.fillrate} />
									</h2>
								</header>
								<div className="content-body chart-container">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.fillrate],
														arrayLabels: homePageStats.labels,
												  }
												: this.state.dataChart
										}
										color={{
											r: 52,
											g: 191,
											b: 163,
										}}
										height={window.innerWidth > 600 ? null : 300}
									/>
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="row margin-0">
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.impressionsPopover}
								popoverBody={messages.impressionsPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.impressions} /> /{' '}
										<FormattedMessage {...messages.clicksCount} />
									</h2>
								</header>
								<div className="content-body chart-area">
									<div className="row">
										<LineChart
											data={
												Object.entries(homePageStats).length
													? {
															arrayChart: [
																homePageStats.impressions,
																homePageStats.clicks,
															],
															arrayLabels: homePageStats.labels,
													  }
													: this.state.dataChart
											}
											color={[
												{
													r: 0,
													g: 123,
													b: 255,
												},
												{
													r: 255,
													g: 184,
													b: 34,
												},
											]}
											height={window.innerWidth > 600 ? null : 300}
											legend={['Impressions', 'Clicks']}
										/>
									</div>
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.eCPMPopover}
								popoverBody={messages.eCPMPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.eCPM} /> / <FormattedMessage {...messages.CTR} />
									</h2>
								</header>
								<div className="content-body chart-area">
									<div className="row">
										<LineChart
											data={
												Object.entries(homePageStats).length
													? {
															arrayChart: [homePageStats.eCPM, homePageStats.CTR],
															arrayLabels: homePageStats.labels,
													  }
													: this.state.dataChart
											}
											color={[
												{
													r: 255,
													g: 184,
													b: 34,
												},
												{
													r: 244,
													g: 81,
													b: 108,
												},
											]}
											height={window.innerWidth > 600 ? null : 300}
											legend={['eCPM', 'CTR']}
										/>
									</div>
								</div>
							</CardPopover>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

PublisherHomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	inventories: PropTypes.arrayOf(PropTypes.shape(InventoryShape)).isRequired,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	inventories: inventoriesSelectors.collectionList(),
	inventoryIds: selectInventoryIds(),
	homePageStats: selectHomePageStats(),
	tableHomePageStats: selectTableHomePageStats(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getHomePageStats: values => dispatch(getHomePageStats(values)),
		getTableStatsHomePage: values => dispatch(getTableStatsHomePage(values)),
		updateDates: dates => dispatch(setChartsDates(dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(PublisherHomePage);
