/**
 *
 * CreativeReport
 *
 */

import React from 'react';
import { Button, Col, Row } from 'reactstrap';
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
						r: 244,
						g: 81,
						b: 108,
					},
					value: '500',
					key: 'clicks',
				},
				{
					name: messages.CTR,
					color: {
						r: 52,
						g: 191,
						b: 163,
					},
					value: '5%',
					key: 'CTR',
				},
				{
					name: messages.winrate,
					color: {
						r: 34,
						g: 185,
						b: 255,
					},
					value: '10%',
					key: 'winrate',
				},
				{
					name: messages.spend,
					color: {
						r: 255,
						g: 184,
						b: 34,
					},
					value: '$300',
					key: 'spend',
				},
				{
					name: messages.eCPM,
					color: {
						r: 113,
						g: 106,
						b: 202,
					},
					value: '$7',
					key: 'eCPM',
				},
			],
			activeAdditionalColor: {
				r: 244,
				g: 81,
				b: 108,
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
		};
		this.additionalFilter = false;
		this.selectedCreatives = [];
	}

	selectAdditionFilter(color, filter) {
		if (
			(filter === 'spent' && !this.state.activeAdditionalFilter) ||
			filter === this.state.activeAdditionalFilter
		) {
			this.setState({ activeAdditionalFilter: null });
			this.dataToChartLines(this.state.activeFilter, null);
		} else {
			this.setState({ activeAdditionalColor: color, activeAdditionalFilter: filter });
			this.additionalFilter = filter;
			this.dataToChartLines(this.state.activeFilter, filter);
		}
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
		const arrayLabels = this.props.creativeReport[0].labels;
		const creativeLabels = !this.state.selectedChange
			? this.props.creativeReport.map(c => c.name)
			: this.props.creativeReport.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name);

		if (additionalFilter) {
			const arrayBarChart = !this.state.selectedChange
				? this.props.creativeReport.map(c => c[additionalFilter])
				: this.props.creativeReport
						.filter(c => this.selectedCreatives.includes(c.id))
						.map(c => c[additionalFilter]);
			const arrayBarLabels = this.props.creativeReport[0].labels;
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
		finalArray.push(sum.map(value => value.toFixed(2)));
		const dataChart = { arrayChart: finalArray, arrayLabels, creativeLabels };
		return dataChart;
	}

	componentDidMount() {
		const { dates, campaignsIds } = this.props;
		const { startDate, endDate } = dates;
		const firstCampaign = campaignsIds ? campaignsIds[campaignsIds.length - 1] : 0;
		this.setState({ selectedCampaign: firstCampaign });
		this.props
			.getCreativeReport({
				start_date: startDate,
				end_date: endDate,
				campaign_group: '0',
				campaign: firstCampaign,
			})
			.then(() => {
				this.dataToChartLines();
			});
		this.props.getCreativeReportTable({
			start_date: startDate,
			end_date: endDate,
			campaign_group: '0',
			campaign: firstCampaign,
		});
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
				campaign_group: params.selectedOption.value,
			})
			.then(() => {
				this.dataToChartLines();
			});
		this.props.getCreativeReportTable({
			start_date: dates.startDate,
			end_date: dates.endDate,
			campaign_group: params.selectedOption.value,
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
		const creative = _.find(this.props.creatives, 'id', id);
		return creative ? creative.name : 'Unknown';
	}

	getValue(key) {
		if (this.props.creativeReport && this.selectedCreatives.length) {
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

				const finalReducer = (accumulator, currentValue) => accumulator + currentValue;
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
		const { dates, groups, campaigns } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={12} sm={12} xl={5} lg={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.creativeReports} />
										</h1>
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
											<Row>
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
															fontSize: '16px',
															paddingTop: '14px',
															display: 'inline-block',
															marginLeft: '20px',
														}}
													>
														<FormattedMessage {...messages.from} />{' '}
														{moment(startDate).format('DD-MM-YYYY')}{' '}
														<FormattedMessage {...messages.to} />{' '}
														{moment(endDate).format('DD-MM-YYYY')}
													</h6>
												</Col>
												<Col xl={3} className="report__export-block">
													<div>
														<Button
															size="sm"
															color={this.state.linesData ? 'purple' : 'secondary'}
															className="button-margin-left-10"
															onClick={() => {
																this.dataToChartLines(this.state.activeFilter);
																this.selectAdditionFilter(
																	this.state.activeAdditionalColor,
																	this.state.activeAdditionalFilter,
																);
															}}
														>
															Line
														</Button>
														<Button
															size="sm"
															color={this.state.allData ? 'purple' : 'secondary'}
															className="button-margin-left-10"
															onClick={() =>
																this.dataToChartAreas(this.state.activeFilter)
															}
														>
															Area
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
												{this.props.creativeReport &&
												Object.keys(this.props.creativeReport).length &&
												this.selectedCreatives.length
													? this.state.filter.map(filter => {
															const Blocks = styled.div`
																display: flex;
																width: 100%;
																align-items: center;
																justify-content: center;
																flex-direction: column;
																border-radius: 5px;
																background-color: rgba(
																	${filter.color.r},
																	${filter.color.g},
																	${filter.color.b},
																	0.6
																);

																:hover {
																	background-color: rgba(
																		${filter.color.r},
																		${filter.color.g},
																		${filter.color.b},
																		1
																	);
																}
																&.active {
																	background-color: rgba(
																		${filter.color.r},
																		${filter.color.g},
																		${filter.color.b},
																		1
																	);
																	::after {
																		content: '';
																		position: absolute;
																		top: -5px;
																		border: 10px solid transparent;
																		border-bottom: 10px solid
																			rgba(
																				${filter.color.r},
																				${filter.color.g},
																				${filter.color.b},
																				1
																			);
																	}
																}
															`;
															return (
																<Col xl={2} xs={4} md={4}>
																	<AppCard
																		onClick={() =>
																			(this.state.activeAdditionalFilter !==
																				filter.key ||
																				!this.state.linesData) &&
																			this.selectFilter(filter.color, filter.key)
																		}
																	>
																		<Blocks
																			className={
																				JSON.stringify(
																					this.state.activeColor,
																				) === JSON.stringify(filter.color)
																					? 'active'
																					: null
																			}
																		>
																			<span>
																				<FormattedMessage {...filter.name} />
																			</span>
																			<strong>
																				{filter.key === 'spend' ||
																				filter.key === 'eCPM'
																					? '$'
																					: null}
																				{this.getValue(filter.key)}
																				{filter.key === 'CTR' ||
																				filter.key === 'winrate'
																					? '%'
																					: null}
																			</strong>
																		</Blocks>
																	</AppCard>
																</Col>
															);
													  })
													: null}
											</Row>
										</Col>
										<Col xl={2}>
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
													<div className="report__filter-checkbox">
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
																			{this.getCreativeName(campaign.id)}
																		</label>
																	</div>
															  ))
															: null}
													</div>
												</Col>
												{this.state.linesData && (
													<Col xl={12}>
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
