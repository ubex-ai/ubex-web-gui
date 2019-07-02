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
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Line, Bar, HorizontalBar, Chart } from 'react-chartjs-2';
import LinkButton from 'components/LinkButton';
import AppCard from 'components/AppCard';
import CardPopover from 'components/CardPopover';
import Datamap from 'components/Maps/Datamaps';
import { inventoriesSelectors, selectChartsDates, selectSlotsTableFormat } from 'containers/Publisher/selectors';
import messages from 'containers/Publisher/messages';
import AppTable from 'components/Tables/AppTable';
import DateSelect from 'components/DateSelect';
import { updateCharts } from 'containers/Publisher/actions';
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

	render() {
		const { dates, inventories } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<Row>
				<Col xs={12} md={12}>
					<div className="row margin-0 alert-padding">
						<Col xs={12} md={12}>
							<div className="alert alert-warning alert-dismissible">
								<strong>
									<FormattedMessage {...messages.warning} />:
								</strong>{' '}
								<FormattedMessage {...messages.warningText} />
							</div>
						</Col>
					</div>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={12} className="title_with_select">
									<Row>
										<Col md={12} sm={6} xl={5} lg={6}>
											<div className="page-title">
												<div className="float-left">
													<h1 className="title">
														<FormattedMessage {...messages.PublisherHeader} />
													</h1>
												</div>
											</div>
										</Col>
										<DateSelect
											onChange={(params, dates) => updateCharts(params, dates)}
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
								<div className="stats">
									<div className="row">
										<div className="col-lg-8 mobile_center">
											<h4>
												<strong>0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.impressions} />
											</span>
										</div>
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
								<div className="stats">
									<div className="row">
										<div className="col-lg-10 mobile_center">
											<h4>
												<strong>0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.clicksCount} />
											</span>
										</div>
									</div>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-4 col-md-6 col-lg-6 col-12">
							<CardPopover popoverHeader={messages.CTRPopover} popoverBody={messages.CTRPopoverText}>
								<i className="float-left fas fa-sort-amount-up icon-md icon-rounded icon-danger" />
								<div className="stats">
									<div className="row">
										<div className="col-lg-8 mobile_center">
											<h4>
												<strong>0%</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.CTR} />
											</span>
										</div>
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
								<div className="stats">
									<Row>
										<div className="col-lg-8 mobile_center">
											<h4>
												<strong>0%</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.fillrate} />
											</span>
										</div>
									</Row>
								</div>
							</CardPopover>
						</Col>
						<div className="col-xl-3 col-md-6 col-lg-6 col-12 col-xl-4">
							<CardPopover popoverHeader={messages.eCPMPopover} popoverBody={messages.eCPMPopoverText}>
								<i className="float-left fas fa-file-invoice-dollar icon-md icon-rounded icon-warning" />
								<div className="stats">
									<div className="row">
										<div className="col-lg-8 mobile_center">
											<h4>
												<strong>$0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.eCPM} />
											</span>
										</div>
									</div>
								</div>
							</CardPopover>
						</div>
						<Col lg={6} md={6} xs={12} xl={4}>
							<CardPopover popoverHeader={messages.RPMPopover} popoverBody={messages.RPMPopoverText}>
								<i className="float-left fas fa-hand-holding-usd icon-md icon-rounded icon-accent" />
								<div className="stats">
									<div className="row">
										<div className="col-lg-5 mobile_center">
											<h4>
												<strong>$0</strong>
											</h4>
											<span>
												<FormattedMessage {...messages.RPM} />
											</span>
										</div>
									</div>
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col lg={6}>
							<AppCard chart>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.listInventory} />
									</h2>
									<LinkButton
										to="/app/inventory/web"
										color="success button-margin-left-10 button-margin-top-10"
									>
										{window.innerWidth > 1024 ? (
											<FormattedMessage {...messages.addNew} />
										) : (
											<i className="fas fa-plus" />
										)}
									</LinkButton>
								</header>
								<div className="content-body">
									<AppTable
										data={this.state.sitesTableData}
										columns={this.state.sitesTableColumns}
										pagination={false}
										paginationCount={false}
									/>
								</div>
							</AppCard>
						</Col>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.profitabilityPopover}
								popoverBody={messages.profitabilityPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/workers/profitability">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.profitability} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-area">
									<Line data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="row margin-0">
						<div className="col-md-12 col-lg-6">
							<CardPopover
								popoverHeader={messages.topRegionsPopover}
								popoverBody={messages.topRegionsPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/regions">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.topRegions} />{' '}
											<FormattedMessage {...messages.reward} />
										</h2>
									</Link>
								</header>
								<div className="content-body wid-vectormap">
									<Datamap data={{ countriesColors: {}, countriesCounts: {} }} />
								</div>
							</CardPopover>
						</div>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.topInventoryPopover}
								popoverBody={messages.topInventoryPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.topInventory} />
									</h2>
								</header>
								<div className="content-body chart-area">
									<div className="row">
										<HorizontalBar data={this.state.dataChart} />
									</div>
								</div>
							</CardPopover>
						</Col>
						<div className="col-md-12 col-lg-6">
							<CardPopover
								popoverHeader={messages.devicesPopover}
								popoverBody={messages.devicesPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/devices">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage id="app.common.devices" />{' '}
											<FormattedMessage {...messages.reward} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-container">
									<Bar data={this.state.dataChart} />
								</div>
							</CardPopover>
						</div>
						<Col lg={6}>
							<CardPopover
								popoverHeader={messages.sexPopover}
								popoverBody={messages.sexPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<h2 className="cardPopover__header-title float-left">
										<FormattedMessage {...messages.sex} /> <FormattedMessage {...messages.reward} />
									</h2>
								</header>
								<div className="content-body chart-area">
									<div className="row">
										<HorizontalBar data={this.state.dataChart} />
									</div>
								</div>
							</CardPopover>
						</Col>
					</Row>
					<Row className="margin-0">
						<Col md={6}>
							<CardPopover
								popoverHeader={messages.agePopover}
								popoverBody={messages.agePopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/devices">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.age} />{' '}
											<FormattedMessage {...messages.reward} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-container">
									<Bar data={this.state.dataChart} />
								</div>
							</CardPopover>
						</Col>
						<Col md={6}>
							<CardPopover
								popoverHeader={messages.formatPopover}
								popoverBody={messages.formatPopoverText}
								chart
							>
								<header className="cardPopover__header">
									<Link to="/app/reports/devices">
										<h2 className="cardPopover__header-title float-left">
											<FormattedMessage {...messages.format} />{' '}
											<FormattedMessage {...messages.reward} />
										</h2>
									</Link>
								</header>
								<div className="content-body chart-container">
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

PublisherHomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	inventories: PropTypes.arrayOf(PropTypes.shape(InventoryShape)).isRequired,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	inventories: inventoriesSelectors.collectionList(),
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

export default compose(withConnect)(PublisherHomePage);
