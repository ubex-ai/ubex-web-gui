/**
 *
 * TradingDeskHomePage
 *
 */

import React from 'react';
import { Col, Row, Alert } from 'reactstrap';

import { FormattedMessage } from 'react-intl';
import DateSelect from 'components/DateSelect';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CardPopover from 'components/CardPopover';
import { Link } from 'react-router-dom';
import { HorizontalBar, Line } from 'react-chartjs-2';
import LineChartBar from '../LineChartDynamic';
import AdBlockDetect from 'react-ad-block-detect';
import LineChart from 'components/Charts/Line';
import messages from 'containers/TradingDesk/messages';
import {
	setAdBlock,
	getHomePageStats,
	getTableStatsHomePage,
	setChartsDates,
	setActiveCampaignStats,
} from 'containers/TradingDesk/actions';
import {
	selectChartsDates,
	campaingsSelectors,
	selectAdBlock,
	campaingGroupSelectors,
	selectHomePageStats,
	selectGroupsIds,
	selectTableHomePageStats,
	selectHomePageStatsLoading,
	selectActiveCampaignStats,
} from 'containers/TradingDesk/selectors';
import Spinner from 'reactstrap/es/Spinner';
import moment from 'moment';

/* eslint-disable react/prefer-stateless-function */
export class TradingDeskHomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataChart: { arrayCharts: [], labels: [], average: 0 },
			visibleWarning: true,
		};
		this.onDismiss = this.onDismiss.bind(this);
	}

	onDismiss() {
		this.props.setAdBlock({ display: false });
	}

	componentDidMount() {
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
		const {
			dates,
			getHomePageStats,
			groupsIds,
			getTableStatsHomePage,
			homePageStats,
			tableHomePageStats,
			activeCampaignStats,
		} = this.props;
		const { startDate, endDate } = dates;
		if (groupsIds.length && !homePageStats.length && !tableHomePageStats.length) {
			getHomePageStats({
				campaign_group:
					activeCampaignStats ||
					groupsIds
						.sort((a, b) => a - b)
						.slice(0, 19)
						.join(),
				start_date: startDate,
				end_date: endDate,
			});
			getTableStatsHomePage({
				campaign_group:
					activeCampaignStats ||
					groupsIds
						.sort((a, b) => a - b)
						.slice(0, 19)
						.join(),
				start_date: startDate,
				end_date: endDate,
			});
		}
	}

	updateChart(params, dates) {
		const { getHomePageStats, getTableStatsHomePage, groupsIds } = this.props;
		this.props.updateDates({ startDate: dates.startDate, endDate: dates.endDate, period: dates.period });
		if (groupsIds.length) {
			getHomePageStats({
				campaign_group:
					params.selectedOption.value !== 'all'
						? params.selectedOption.value
						: groupsIds
								.sort((a, b) => a - b)
								.slice(0, 19)
								.join(),
				start_date: dates.startDate,
				end_date: dates.endDate,
			});
			getTableStatsHomePage({
				campaign_group:
					params.selectedOption.value !== 'all'
						? params.selectedOption.value
						: groupsIds
								.sort((a, b) => a - b)
								.slice(0, 19)
								.join(),
				start_date: dates.startDate,
				end_date: dates.endDate,
			});
		}
		if (params.selectedOption.value !== 'all') {
			this.props.setActiveCampaignStats(params.selectedOption.value);
		}
	}

	render() {
		const {
			dates,
			campaigns,
			adBlock,
			groups,
			homePageStats,
			tableHomePageStats,
			activeCampaignStats,
		} = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<Row>
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col xs={12} md={12}>
							<AdBlockDetect>
								<Alert color="danger" isOpen={adBlock.display} toggle={this.onDismiss}>
									<p style={{ marginBottom: 0 }}>
										<FormattedMessage {...messages.adBlock} />
									</p>
								</Alert>
							</AdBlockDetect>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={12} className="title_with_select">
									<Row>
										<Col md={4} sm={12} xl={4} lg={6}>
											<div className="page-title">
												<div className="float-left">
													<h1 className="title">
														<FormattedMessage {...messages.TradingDeskHeader} />
													</h1>
												</div>
											</div>
										</Col>
										<DateSelect
											onChange={(params, dates) => this.updateChart(params, dates)}
											startDate={startDate}
											endDate={endDate}
											period={period}
											tradingDesk={groups}
											tradingDeskSelected={activeCampaignStats}
										/>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col xl={3} md={12} lg={6} xs={6} className="paddingHomePageCards">
							<CardPopover
								popoverHeader={messages.spendPopover}
								popoverBody={messages.spendPopoverText}
								mini
							>
								<i className="float-left far fa-dollar-sign icon-md icon-rounded icon-success" />
								<div className="stats">
									<Row>
										<Col lg={12} className="mobile_center">
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<h4>
													<strong>
														<strong>
															${tableHomePageStats.spent ? tableHomePageStats.spent : 0}
														</strong>
													</strong>
												</h4>
												{this.props.tableHomePageStatsLoading && (
													<Spinner
														size="sm"
														color="info"
														className="ml-1"
														style={{ position: 'relative', top: '5px' }}
													/>
												)}
											</div>
											<span>
												<FormattedMessage {...messages.spend} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={6} xs={6} className="paddingHomePageCards">
							<CardPopover
								popoverHeader={messages.eCPMPopover}
								popoverBody={messages.eCPMPopoverText}
								mini
							>
								<i className="float-left far fa-coins icon-md icon-rounded icon-accent" />
								<div className="stats">
									<Row>
										<Col lg={12} className="mobile_center">
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<h4>
													<strong>
														${tableHomePageStats.eCPM ? tableHomePageStats.eCPM : 0}
													</strong>
												</h4>
												{this.props.tableHomePageStatsLoading && (
													<Spinner
														size="sm"
														color="info"
														className="ml-1"
														style={{ position: 'relative', top: '5px' }}
													/>
												)}
											</div>
											<span>
												<FormattedMessage {...messages.eCPM} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={6} xs={6} className="paddingHomePageCards">
							<CardPopover popoverHeader={messages.CPCPopover} popoverBody={messages.CPCPopoverText} mini>
								<i className="float-left far fa-hand-point-up icon-md icon-rounded icon-primary" />
								<div className="stats">
									<Row>
										<Col lg={12} className="mobile_center">
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<h4>
													<strong>
														<strong>
															${tableHomePageStats.CPC ? tableHomePageStats.CPC : 0}
														</strong>
													</strong>
												</h4>
												{this.props.tableHomePageStatsLoading && (
													<Spinner
														size="sm"
														color="info"
														className="ml-1"
														style={{ position: 'relative', top: '5px' }}
													/>
												)}
											</div>
											<span>
												<FormattedMessage {...messages.CPC} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={6} xs={6} className="paddingHomePageCards">
							<CardPopover popoverHeader={messages.CTRPopover} popoverBody={messages.CTRPopoverText} mini>
								<i className="float-left fas fa-chart-bar icon-md icon-rounded icon-purple" />
								<div className="stats">
									<Row>
										<Col lg={12} className="mobile_center">
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<h4>
													<strong>
														{tableHomePageStats.CTR ? tableHomePageStats.CTR : 0}%
													</strong>
												</h4>
												{this.props.tableHomePageStatsLoading && (
													<Spinner
														size="sm"
														color="info"
														className="ml-1"
														style={{ position: 'relative', top: '5px' }}
													/>
												)}
											</div>
											<span>
												<FormattedMessage {...messages.CTR} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.impressionsAndClicksPopover}
								popoverBody={messages.impressionsAndClicksPopoverText}
								chart
							>
								<header className="cardPopover__header--homepage">
									<Link to="/app/campaigns/report">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.impressionsAndClicks} />
										</h2>
										{this.props.homePageStatsLoading && <Spinner size="sm" color="info" />}
									</Link>
									<span className="cardPopover__header--homepage-number">
										{tableHomePageStats.impressions ? tableHomePageStats.impressions : 0} /{' '}
										{tableHomePageStats.clicks ? tableHomePageStats.clicks : 0}
									</span>
								</header>
								<div className="content-body chart-area">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.impressions, homePageStats.clicks],
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
										lines
									/>
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.CTRPopover}
								popoverBody={messages.CTRPopoverText}
								chart
							>
								<header className="cardPopover__header--homepage">
									<Link to="/app/campaigns/reportByFilter/CTR">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.CTR} /> /{' '}
											<FormattedMessage {...messages.CPC} />
										</h2>
										{this.props.homePageStatsLoading && <Spinner size="sm" color="info" />}
									</Link>
									<span className="cardPopover__header--homepage-number">
										{tableHomePageStats.CTR ? tableHomePageStats.CTR : 0}% /{' '}
										${tableHomePageStats.CPC ? tableHomePageStats.CPC : 0}
									</span>
								</header>
								<div className="content-body chart-area">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.CTR, homePageStats.CPC],
														arrayLabels: homePageStats.labels,
												  }
												: this.state.dataChart
										}
										color={[
											{
												r: 113,
												g: 106,
												b: 202,
											},
											{
												r: 34,
												g: 185,
												b: 255,
											},
										]}
										legend={['CTR', 'CPC']}
										height={window.innerWidth > 600 ? null : 300}
										lines
									/>
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.amountSpentPopover}
								popoverBody={messages.amountSpentPopoverText}
								chart
							>
								<header className="cardPopover__header--homepage">
									<Link to="/app/campaigns/reportByFilter/spend">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.spend} /> /{' '}
											<FormattedMessage {...messages.eCPM} />
										</h2>
										{this.props.homePageStatsLoading && <Spinner size="sm" color="info" />}
									</Link>
									<span className="cardPopover__header--homepage-number">
										${tableHomePageStats.spent ? tableHomePageStats.spent : 0} /{' '}
										${tableHomePageStats.eCPM ? tableHomePageStats.eCPM : 0}
									</span>
								</header>
								<div className="content-body chart-area">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.spent, homePageStats.eCPM],
														arrayLabels: homePageStats.labels,
												  }
												: this.state.dataChart
										}
										color={[
											{
												r: 52,
												g: 191,
												b: 163,
											},
											{
												r: 244,
												g: 81,
												b: 108,
											},
										]}
										height={window.innerWidth > 600 ? null : 300}
										legend={['Spent', 'eCPM']}
										lines
									/>
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.winratePopover}
								popoverBody={messages.winratePopoverText}
								chart
							>
								<header className="cardPopover__header--homepage">
									<Link to="/app/campaigns/reportByFilter/winrate">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.winrate} />{' '}
										</h2>
										{this.props.homePageStatsLoading && <Spinner size="sm" color="info" />}
									</Link>
									<span className="cardPopover__header--homepage-number">
										{tableHomePageStats.winrate ? tableHomePageStats.winrate : 0}%
									</span>
								</header>
								<div className="content-body chart-area">
									<LineChart
										data={
											Object.entries(homePageStats).length
												? {
														arrayChart: [homePageStats.winrate],
														arrayLabels: homePageStats.labels,
												  }
												: this.state.dataChart
										}
										color={{
											r: 146,
											g: 157,
											b: 211,
										}}
										height={window.innerWidth > 600 ? null : 300}
									/>
								</div>
							</CardPopover>
						</Col>
						{/* <Col lg={6}>
							<CardPopover
								popoverHeader={messages.genderPopover}
								popoverBody={messages.genderPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.gender} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<HorizontalBar data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.agePopover}
								popoverBody={messages.agePopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.age} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col> */}
					</Row>
				</Col>
			</Row>
		);
	}
}
TradingDeskHomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	dates: PropTypes.object,
	campaigns: PropTypes.array,
	groups: PropTypes.array,
	adBlock: PropTypes.object,
	setAdBlock: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	campaigns: campaingsSelectors.collectionList(),
	groups: campaingGroupSelectors.collectionList(),
	homePageStats: selectHomePageStats(),
	groupsIds: selectGroupsIds(),
	adBlock: selectAdBlock(),
	tableHomePageStats: selectTableHomePageStats(),
	homePageStatsLoading: selectHomePageStatsLoading(),
	tableHomePageStatsLoading: selectHomePageStatsLoading(),
	activeCampaignStats: selectActiveCampaignStats(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		setAdBlock: values => dispatch(setAdBlock(values)),
		getHomePageStats: dates => dispatch(getHomePageStats(dates)),
		getTableStatsHomePage: dates => dispatch(getTableStatsHomePage(dates)),
		updateDates: dates => dispatch(setChartsDates(dates)),
		setActiveCampaignStats: value => dispatch(setActiveCampaignStats(value)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(TradingDeskHomePage);
