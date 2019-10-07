/**
 *
 * CreativeReport
 *
 */

import React from 'react';
import { Button, Col, Row, Spinner } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import styled from 'styled-components';
import DateSelect from 'components/DateSelect';
import _ from 'lodash';
import CampaignReportTable from 'containers/TradingDesk/components/CampaignReportTable';
import LineChart from '../LineChartDynamic';
import BarChart from '../BarChartDynamic';
import messages from '../../messages';
import { getCreativeReport, setChartsDates, getCreativeReportTable } from '../../actions';
import {
	selectCreativeReport,
	selectChartsDates,
	selectCampaignsIds,
	campaingGroupSelectors,
	creativesSelectors,
	selectCreativeReportTable,
	campaingsSelectors,
	selectCreativeReportLoading,
} from '../../selectors';
import { makePromiseAction } from '../../../../utils/CollectionHelper/actions';
import { selectAppInitLoading, selectDashboardLoading } from '../../../Dashboard/selectors';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CreativeReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reportColumns: [
				{ name: 'name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
				{ name: 'impressions', title: this.props.intl.formatMessage(messages.impressions) },
				{ name: 'clicks', title: this.props.intl.formatMessage(messages.clicks) },
				{ name: 'CTR', title: 'CTR' },
				{ name: 'CPC', title: 'CPC' },
				{ name: 'winrate', title: 'Win rate' },
				{ name: 'spend', title: this.props.intl.formatMessage(messages.spend) },
				{ name: 'eCPM', title: 'eCPM' },
			],
			reportData: [
				{
					date: '12-04-2019',
					impressions: '5000',
					clicks: '500',
					CTR: '5%',
					winrate: '10%',
					spend: '$200',
					CPM: '$12',
				},
			],
			selectedAll: true,
			activeColor: {
				r: 0,
				g: 123,
				b: 255,
			},
			activeFilter: 'impressions',
			filter: [
				{
					name: messages.impressions,
					color: {
						r: 0,
						g: 123,
						b: 255,
					},
					value: '1000',
					key: 'impressions',
				},
				{
					name: messages.clicks,
					color: {
						r: 255,
						g: 184,
						b: 34,
					},
					value: '500',
					key: 'clicks',
				},
				{
					name: messages.CTR,
					color: {
						r: 113,
						g: 106,
						b: 202,
					},
					value: '5%',
					key: 'CTR',
				},
				{
					name: messages.CPC,
					color: {
						r: 34,
						g: 185,
						b: 255,
					},
					value: '$7',
					key: 'CPC',
				},
				{
					name: messages.spend,
					color: {
						r: 52,
						g: 191,
						b: 163,
					},
					value: '$300',
					key: 'spend',
				},
				{
					name: messages.eCPM,
					color: {
						r: 244,
						g: 81,
						b: 108,
					},
					value: '$7',
					key: 'eCPM',
				},
				{
					name: messages.winrate,
					color: {
						r: 146,
						g: 157,
						b: 211,
					},
					value: '10%',
					key: 'winrate',
				},
			],
			activeAdditionalColor: {
				r: 255,
				g: 184,
				b: 34,
			},
			activeAdditionalFilter: 'clicks',
			selectedCampaign: null,
			allData: true,
			linesData: false,
			selectedChange: false,
			dataChart: {
				arrayChart: [],
				arrayLabels: [],
			},
			dataBarChart: {
				arrayChart: [],
				arrayLabels: [],
			},
			campaignName: '',
		};
		this.additionalFilter = false;
		this.selectedCreatives = [];
	}

	selectAdditionFilter(color, filter) {
		this.setState({ activeAdditionalColor: color, activeAdditionalFilter: filter });
		this.additionalFilter = filter;
		this.dataToChartLines(this.state.activeFilter, filter);
	}

	selectFilter(color, filter) {
		this.setState({ activeColor: color, activeFilter: filter });
		if (this.state.allData) {
			this.dataToChartAreas(filter);
		} else {
			this.dataToChartLines(filter, this.state.additionalFilter);
		}
	}

	dataToChartAreas(filter = 'impressions') {
		this.setState({
			dataChart: {
				arrayChart: !this.state.selectedChange
					? this.props.creativeReport.map(c => c[filter])
					: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c[filter]),
				arrayLabels: this.props.creativeReport[0].labels,
				creativeLabels: !this.state.selectedChange
					? this.props.creativeReport.map(c => this.getCreativeName(c.name))
					: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name),
			},
			allData: true,
			linesData: false,
		});
		this.selectedCreatives = !this.state.selectedChange
			? this.props.creativeReport.map(c => c.id)
			: this.selectedCreatives;
	}

	dataToChartLines(filter = 'impressions', additionalFilter = this.state.activeAdditionalFilter) {
		const arrayChart = !this.state.selectedChange
			? this.props.creativeReport.map(c => c[filter])
			: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c[filter]);
		const arrayLabels =
			this.props.creativeReport && this.props.creativeReport.length ? this.props.creativeReport[0].labels : '';
		const creativeLabels = !this.state.selectedChange
			? this.props.creativeReport.map(c => c.name)
			: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name);

		if (additionalFilter) {
			const arrayBarChart = !this.state.selectedChange
				? this.props.creativeReport.map(c => c[additionalFilter])
				: this.props.creativeReport
						.filter(c => this.selectedCreatives.includes(c.id))
						.map(c => c[additionalFilter]);
			const arrayBarLabels =
				this.props.creativeReport && this.props.creativeReport.length
					? this.props.creativeReport[0].labels
					: '';
			const creativeBarLabels = !this.state.selectedChange
				? this.props.creativeReport.map(c => c.name)
				: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name);
			this.setState({
				dataBarChart: this.makeDataToChart(arrayBarChart, arrayBarLabels, creativeBarLabels),
			});
		} else {
			this.setState({
				dataBarChart: { arrayChart: [[], []], arrayLabels: [], creativeLabels: [] },
			});
		}
		this.setState({
			dataChart: this.makeDataToChart(arrayChart, arrayLabels, creativeLabels),
			allData: false,
			linesData: true,
		});
	}

	makeDataToChart(arrayChart, arrayLabels, creativeLabels) {
		const finalArray = new Array();

		Array.prototype.SumArray = function(arr) {
			const sum = [];
			if (arr != null && this.length == arr.length) {
				for (let i = 0; i < arr.length; i++) {
					sum.push(this[i] + arr[i]);
				}
			}

			return sum;
		};
		let sum;
		if (arrayChart.length !== 0) {
			const reducer = (accumulator, currentValue) => accumulator.SumArray(currentValue);
			sum = arrayChart.reduce(reducer);
		} else {
			sum = [];
		}
		finalArray.push(sum.map(value => parseFloat(value).toFixed(2)));
		const dataChart = { arrayChart: finalArray, arrayLabels, creativeLabels };
		return dataChart;
	}

	componentDidMount() {
		const {
			dates,
			campaigns,
			match: {
				params: { filter, campaignId },
			},
		} = this.props;
		const filterCampaign = campaignId;
		const { startDate, endDate } = dates;
		const firstCampaign = campaigns ? campaigns.reverse()[campaigns.length - 1] : 0;
		let groupByCampaign = {};
		if (firstCampaign && !filterCampaign) {
			this.setState({ selectedCampaign: firstCampaign.id });
			this.props
				.getCreativeReport({
					start_date: startDate,
					end_date: endDate,
					campaign_group: firstCampaign.campaign_group,
					campaign: firstCampaign.id,
				})
				.then(() => {
					this.dataToChartLines();
				});
			this.props.getCreativeReportTable({
				start_date: startDate,
				end_date: endDate,
				campaign_group: firstCampaign.campaign_group,
				campaign: firstCampaign.id,
			});
		}

		if (filterCampaign) {
			const campaign = _.find(campaigns, ['id', parseInt(filterCampaign, 10)]);
			if (campaign) {
				this.setState({
					campaignName: campaign ? campaign.name : '',
					selectedCampaign: campaign.id,
				});
				this.props
					.getCreativeReport({
						start_date: startDate,
						end_date: endDate,
						campaign_group: campaign.campaign_group,
						campaign: campaign.id,
					})
					.then(() => {
						this.dataToChartLines();
					});
				this.props.getCreativeReportTable({
					start_date: startDate,
					end_date: endDate,
					campaign_group: campaign.campaign_group,
					campaign: campaign.id,
				});
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (Object.keys(this.props.creativeReport).length && prevProps.creativeReport !== this.props.creativeReport) {
			this.selectedCreatives = this.props.creativeReport.map(c => c.id);
		}
	}

	updateChart(params, dates) {
		this.props.updateDates({ startDate: dates.startDate, endDate: dates.endDate, period: dates.period });
		this.props
			.getCreativeReport({
				start_date: dates.startDate,
				end_date: dates.endDate,
				campaign_group: params.selectedOption.campaign_group,
				campaign: params.selectedOption.value,
			})
			.then(() => {
				this.dataToChartLines();
			});
		this.props.getCreativeReportTable({
			start_date: dates.startDate,
			end_date: dates.endDate,
			campaign_group: params.selectedOption.campaign_group,
			campaign: params.selectedOption.value,
		});
	}

	async selectCreative(creative) {
		this.setState({ selectedChange: true });
		if (this.selectedCreatives.includes(creative)) {
			if (this.selectedCreatives.length !== 1) {
				this.selectedCreatives = await this.selectedCreatives.filter(c => c !== creative);
			}
		} else {
			this.selectedCreatives[this.selectedCreatives.length] = creative;
		}
		if (this.state.linesData) {
			this.dataToChartLines(this.state.activeFilter, this.state.activeAdditionalFilter);
		} else {
			this.dataToChartAreas(this.state.activeFilter);
		}
	}

	async selectAll() {
		if (this.state.selectedAll && this.selectedCreatives.length) {
			await this.setState({ selectedAll: false, selectedChange: true });
			this.selectedCreatives = [this.props.creativeReport[0].id];
		} else {
			await this.setState({ selectedAll: true, selectedChange: true });
			this.selectedCreatives = this.props.creativeReport.map(c => c.id);
		}

		if (this.state.linesData) {
			this.dataToChartLines(this.state.activeFilter, this.state.activeAdditionalFilter);
		} else {
			this.dataToChartAreas(this.state.activeFilter);
		}
	}

	getCreativeName(id) {
		const creative = this.props.creatives.filter(creative => creative.id === id);
		return creative && creative.length ? creative[0].name : 'Unknown';
	}

	getValue(key) {
		if (this.props.creativeReport.length && this.selectedCreatives.length) {
			Array.prototype.SumArray = function(arr) {
				const sum = [];
				if (arr != null && this.length == arr.length) {
					for (let i = 0; i < arr.length; i++) {
						sum.push(this[i] + arr[i]);
					}
				}

				return sum;
			};
			const keyValue = this.props.creativeReport
				.filter(camp => this.selectedCreatives.includes(camp.id))
				.map(campaign => campaign[key]);

			if (keyValue.length) {
				const reducer = (accumulator, currentValue) => accumulator.SumArray(currentValue);
				const sum = keyValue.reduce(reducer);

				const finalReducer = (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue);
				if (sum.reduce(finalReducer)) {
					if (sum.reduce(finalReducer) - Math.floor(sum.reduce(finalReducer)) > 0) {
						return sum.reduce(finalReducer).toFixed(2);
					}
					return sum.reduce(finalReducer).toFixed(0);
				}
				return 0;
			}
			return 0;
		}
		return '';
	}

	render() {
		const { creatives } = this;
		const { dates, groups, campaigns, creativeReportLoading } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={12} sm={12} xl={4} lg={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title" style={{ display: 'inline-block' }}>
											<FormattedMessage {...messages.creativeReports} />
										</h1>
										<h6 style={{ display: 'inline-block' }} className="ml-2">
											{this.state.campaignName ? `(${this.state.campaignName})` : null}
										</h6>
									</div>
								</div>
							</Col>
							<DateSelect
								onChange={(params, dates) => this.updateChart(params, dates)}
								startDate={startDate}
								endDate={endDate}
								period={period}
								tradingDeskCampaigns={campaigns}
								tradingDeskCampaignsSelected={this.state.selectedCampaign}
								disableDefaultSelect
							/>
						</Row>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-md-12">
						<AppCard chart>
							<Row className="report">
								<Col xl={12}>
									<Row className="padding-0">
										<Col xl={10}>
											<Row className=" width-99">
												<Col xl={9} lg={12} md={12}>
													<h2 style={{ display: 'inline-block' }}>
														<FormattedMessage
															{...this.state.filter.find(
																x => x.key === this.state.activeFilter,
															).name}
														/>
													</h2>
													<h6
														style={{
															fontSize: '14px',
															paddingTop: '14px',
															display: 'inline-block',
															marginLeft: '20px',
														}}
													>
														<FormattedMessage {...messages.from} />{' '}
														{moment(startDate).format('DD.MM.YY')}{' '}
														<FormattedMessage {...messages.to} />{' '}
														{moment(endDate).format('DD.MM.YY')}
													</h6>
													<span>
														{creativeReportLoading ? (
															<Spinner
																size="sm"
																color="info"
																style={{ position: 'relative', top: '-5px' }}
															/>
														) : null}
													</span>
												</Col>
												<Col xl={3} className="report__export-block">
													<div>
														<Button
															size="sm"
															color="transparent"
															className="transparent button-margin-left-10"
															style={{
																color: this.state.linesData
																	? 'rgba( 113,106,202,1 )'
																	: '#6c757d',
															}}
															onClick={() => {
																this.selectAdditionFilter(
																	this.state.activeAdditionalColor,
																	this.state.activeAdditionalFilter,
																);
															}}
														>
															<i className="fal fa-analytics" />
														</Button>
														<Button
															size="sm"
															color="transparent"
															className="transparent button-margin-left-10"
															style={{
																color: this.state.allData
																	? 'rgba( 113,106,202,1 )'
																	: '#6c757d',
															}}
															onClick={() =>
																this.dataToChartAreas(this.state.activeFilter)
															}
														>
															<i className="fal fa-chart-area" />
														</Button>
													</div>
												</Col>
											</Row>
											<div className="report__chart">
												<LineChart
													data={this.state.dataChart ? this.state.dataChart : []}
													databar={this.state.dataBarChart ? this.state.dataBarChart : []}
													height={window.innerWidth > 600 ? 90 : 300}
													color={this.state.activeColor}
													colorBar={this.state.activeAdditionalColor}
													lines={this.state.linesData}
												/>
											</div>
											<Row className="report__blocks">
												<nav className="nav nav-pills nav-fill" style={{ width: '100%' }}>
													{this.state.filter.map(filter => {
														const Blocks = styled.div`
															cursor: pointer;
															border: 1px solid transparent;
															@media (max-width: 768px) {
																margin-bottom: 10px !important;
															}
															:hover {
																background-color: rgba(
																	${filter.color.r},
																	${filter.color.g},
																	${filter.color.b},
																	1
																);
																span {
																	color: #fff !important;
																}
															}
															&.active {
																background-color: rgba(
																	${filter.color.r},
																	${filter.color.g},
																	${filter.color.b},
																	1
																) !important;
																span {
																	color: #fff !important;
																}
															}
															&.not {
																border: 1px solid #e5e9eb;
															}
														`;
														return (
															<Blocks
																className={`nav-item nav-link ${
																	JSON.stringify(this.state.activeColor) ===
																	JSON.stringify(filter.color)
																		? 'active'
																		: 'not'
																}`}
																onClick={() =>
																	(this.state.activeAdditionalFilter !== filter.key ||
																		!this.state.linesData) &&
																	this.selectFilter(filter.color, filter.key)
																}
															>
																<span>
																	<FormattedMessage {...filter.name} />
																</span>{' '}
																<strong>
																	<span style={{ display: 'inline-block' }}>
																		{filter.key === 'spend' ||
																		filter.key === 'eCPM' ||
																		filter.key === 'CPC'
																			? '$'
																			: null}
																	</span>
																	{this.props.campaignReport &&
																	Object.keys(this.props.campaignReport).length &&
																	this.selectedCreatives.length ? (
																		<span style={{ display: 'inline-block' }}>
																			{filter.key === 'CTR'
																				? (
																						(this.getValue('clicks') /
																							this.getValue(
																								'impressions',
																							)) *
																						100
																				  ).toFixed(2)
																				: this.getValue(filter.key)}
																		</span>
																	) : (
																		<span style={{ display: 'inline-block' }}>
																			0
																		</span>
																	)}
																	<span style={{ display: 'inline-block' }}>
																		{filter.key === 'CTR' ||
																		filter.key === 'winrate'
																			? '%'
																			: null}
																	</span>
																</strong>
															</Blocks>
														);
													})}
												</nav>
											</Row>
										</Col>
										<Col xl={2} className="report__actions-block">
											<Row style={{ height: '100%' }}>
												<Col xl={12}>
													<h2>
														<FormattedMessage {...messages.creatives} />
													</h2>
													<div className="report__settings">
														<Button onClick={() => this.selectAll()}>
															{this.state.selectedAll && this.selectedCreatives.length ? (
																<FormattedMessage {...messages.unselectAll} />
															) : (
																<FormattedMessage {...messages.selectAll} />
															)}
														</Button>
													</div>
													<div className="report__filter-checkbox checkbox-wrapper ">
														{this.selectedCreatives.length
															? this.props.creativeReport.map((campaign, i) => (
																	<div className="custom-control custom-checkbox">
																		<input
																			type="checkbox"
																			id={`checkboxCreative-${i}`}
																			name="customCheckbox"
																			className="custom-control-input"
																			onClick={() =>
																				this.selectCreative(campaign.id)
																			}
																			checked={this.selectedCreatives.includes(
																				campaign.id,
																			)}
																		/>
																		<label
																			className="custom-control-label"
																			htmlFor={`checkboxCreative-${i}`}
																		>
																			{this.getCreativeName(
																				parseInt(campaign.id, 10),
																			)}
																		</label>
																	</div>
															  ))
															: null}
													</div>
												</Col>
												{this.state.linesData && (
													<Col xl={12} className="report__data-series checkbox-wrapper ">
														<h2>
															<FormattedMessage {...messages.dataSeries} />
														</h2>
														{this.state.filter.map((filter, i) => (
															<div className="custom-control custom-checkbox">
																<input
																	type="checkbox"
																	id={`radioFilter-${i}`}
																	name="radioFilter"
																	className="custom-control-input"
																	disabled={filter.key === this.state.activeFilter}
																	onClick={() =>
																		this.selectAdditionFilter(
																			filter.color,
																			filter.key,
																		)
																	}
																	checked={
																		filter.key === this.state.activeAdditionalFilter
																	}
																/>
																<label
																	className="custom-control-label"
																	htmlFor={`radioFilter-${i}`}
																>
																	<FormattedMessage {...filter.name} />
																</label>
															</div>
														))}
													</Col>
												)}
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</AppCard>
						<AppCard>
							<CampaignReportTable
								columns={this.state.reportColumns}
								data={this.props.creativeReportTable.length ? this.props.creativeReportTable : []}
								getName={id => this.getCreativeName(id)}
								pagination
								exportTable
								search
								grouping
							/>
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}

	getCampaignId(creativeId) {
		const creative = _.find(this.props.creatives, ['id', creativeId]);
		return creative && creative.campaign_group ? creative.campaign_group : '';
	}
}

CreativeReport.propTypes = {
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
	intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	creativeReport: selectCreativeReport(),
	creativeReportLoading: selectCreativeReportLoading(),
	creativeReportTable: selectCreativeReportTable(),
	campaignsIds: selectCampaignsIds(),
	campaigns: campaingsSelectors.collectionList(),
	creatives: creativesSelectors.collectionList(),
	groups: campaingGroupSelectors.collectionList(),
	appLoaing: selectDashboardLoading(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
		getCreativeReport: dates => makePromiseAction(dispatch, getCreativeReport(dates)),
		getCreativeReportTable: dates => makePromiseAction(dispatch, getCreativeReportTable(dates)),
		updateDates: dates => dispatch(setChartsDates(dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(CreativeReport));
