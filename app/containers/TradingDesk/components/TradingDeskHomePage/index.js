/**
 *
 * TradingDeskHomePage
 *
 */

import React from 'react';
import { Col, Row, Alert } from 'reactstrap';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import DateSelect from 'components/DateSelect';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CardPopover from 'components/CardPopover';
import { Link } from 'react-router-dom';
import { HorizontalBar, Line } from 'react-chartjs-2';
import AdCampaignsDashboardCard from 'containers/TradingDesk/components/DashboardCards/AdCampaignsDashboardCard';
import EnoughMoneyDashboardCard from 'containers/TradingDesk/components/DashboardCards/EnoughMoneyDashboardCard';
import AdBlockDetect from 'react-ad-block-detect';
import messages from '../../messages';
import { campaingCollectionActions, updateCharts, setAdBlock } from '../../actions';
import { selectChartsDates, campaingsSelectors, selectAdBlock, campaingGroupSelectors } from '../../selectors';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

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

	render() {
		const { dates, campaigns, adBlock, groups } = this.props;
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
										<Col md={12} sm={12} xl={5} lg={6}>
											<div className="page-title">
												<div className="float-left">
													<h1 className="title">
														<FormattedMessage {...messages.TradingDeskHeader} />
													</h1>
												</div>
											</div>
										</Col>
										<DateSelect
											onChange={(params, dates) => updateCharts(params, dates)}
											startDate={startDate}
											endDate={endDate}
											period={period}
											tradingDesk={groups}
										/>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col xl={3} md={12} lg={12} xs={12}>
							<CardPopover
								popoverHeader={messages.winratePopover}
								popoverBody={messages.winratePopoverText}
							>
								<i className="float-left fa fa-trophy icon-md icon-rounded icon-primary" />
								<div className="stats">
									<Row>
										<Col lg={12} className="mobile_center">
											<h4>
												<strong>0%</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.winrate} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={12} xs={12}>
							<CardPopover popoverHeader={messages.spendPopover} popoverBody={messages.spendPopoverText}>
								<i className="float-left fas fa-comment-dollar icon-md icon-rounded icon-success" />
								<div className="stats">
									<Row>
										<Col lg={10} className="mobile_center">
											<h4>
												<strong>$0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.spend} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={12} xs={12}>
							<CardPopover popoverHeader={messages.CTRPopover} popoverBody={messages.CTRPopoverText}>
								<i className="float-left fas fa-file-invoice-dollar icon-md icon-rounded icon-info" />
								<div className="stats">
									<Row>
										<Col lg={10} className="mobile_center">
											<h4>
												<strong>0.00%</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.CTR} />
											</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<Col xl={3} md={12} lg={12} xs={12}>
							<CardPopover popoverHeader={messages.eCPMPopover} popoverBody={messages.eCPMPopoverText}>
								<i className="float-left fas fa-file-invoice-dollar icon-md icon-rounded icon-accent" />
								<div className="stats">
									<Row>
										<Col lg={10} className="mobile_center">
											<h4>
												<strong>$0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.eCPM} />
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
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.impressionsAndClicks} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.amountSpentPopover}
								popoverBody={messages.amountSpentPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.amountSpent} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						{/* <Col xl={6} md={12} xs={12}>
							<AdCampaignsDashboardCard />
						</Col>
						<Col xl={6} md={12} xs={12}>
							<EnoughMoneyDashboardCard />
						</Col> */}
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.top5campaignsPopover}
								popoverBody={messages.top5campaignsPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.top5campaigns} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.top5adstypePopover}
								popoverBody={messages.top5adstypePopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.top5adstype} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
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
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.devicesPopover}
								popoverBody={messages.devicesPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.devices} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.channelPopover}
								popoverBody={messages.channelPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/impressions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.channel} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<HorizontalBar data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
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
	updateCharts: PropTypes.func,
	getCampaigns: PropTypes.func,
	setAdBlock: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	campaigns: campaingsSelectors.collectionList(),
	groups: campaingGroupSelectors.collectionList(),
	adBlock: selectAdBlock(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getCampaigns: dispatch(campaingCollectionActions.getCollection()),
		setAdBlock: values => dispatch(setAdBlock(values)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(TradingDeskHomePage);
