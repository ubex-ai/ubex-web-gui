/**
 *
 * CampaignReport
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
import LineChart from '../LineChartDynamic';
import BarChart from '../BarChartDynamic';
import messages from '../../messages';
import styled from 'styled-components';
import AppTable from '../../../../components/Tables/AppTable';
import { updateCharts } from '../../actions';
import DateSelect from 'components/DateSelect';
import { selectChartsDates } from '../../selectors';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CampaignReport extends React.Component {
	constructor(props) {
		super(props);

		this.creatives = [
			{
				id: 1,
				name: 'Creative 1',
				CTR: [20, 30, 50, 60],
				eCPM: [5, 12, 50, 34],
				clicks: [500, 120, 300, 240],
				impressions: [5000, 1230, 2301, 4000],
				spend: [230, 100, 260, 600],
				winrate: [10, 15, 5, 10],
				labels: ['1 Jan', '1 Feb', '1 Mar', '1 Apr'],
			},
			{
				id: 2,
				name: 'Creative 2',
				CTR: [20, 30, 50, 60],
				eCPM: [5, 12, 50, 34],
				clicks: [500, 120, 300, 240],
				impressions: [5000, 1230, 2301, 4000],
				spend: [230, 100, 260, 600],
				winrate: [10, 15, 10, 20],
				labels: ['1 Jan', '1 Feb', '1 Mar', '1 Apr'],
			},
			{
				id: 3,
				name: 'Creative 3',
				CTR: [20, 30, 50, 60],
				eCPM: [5, 12, 50, 34],
				clicks: [500, 120, 300, 240],
				impressions: [5000, 1230, 2301, 4000],
				spend: [230, 100, 260, 600],
				winrate: [10, 15, 20, 5],
				labels: ['1 Jan', '1 Feb', '1 Mar', '1 Apr'],
			},
		];
		this.state = {
			reportColumns: [
				{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
				{ name: 'impressions', title: this.props.intl.formatMessage(messages.impressions) },
				{ name: 'clicks', title: this.props.intl.formatMessage(messages.clicks) },
				{ name: 'CTR', title: 'CTR' },
				{ name: 'winrate', title: 'Win rate' },
				{ name: 'spend', title: this.props.intl.formatMessage(messages.spend) },
				{ name: 'CPM', title: 'CPM' },
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
			optionsSelect: [
				{ value: 'chocolate', label: 'Campaign 1' },
				{ value: 'strawberry', label: 'Campaign 2' },
				{ value: 'vanilla', label: 'Campaign 3' },
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
				r: 255,
				g: 184,
				b: 34,
			},
			activeAdditionalFilter: 'spend',
			allData: true,
			linesData: false,
			selectedChange: false,
			dataChart: {
				arrayChart: [],
				arrayLabels: this.creatives[0].labels,
			},
			dataBarChart: {
				arrayChart: [],
				arrayLabels: this.creatives[0].labels,
			},
		};
		this.additionalFilter = false;
		this.selectedCreatives = this.creatives.map(c => c.id);
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
					? this.creatives.map(c => c[filter])
					: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c[filter]),
				arrayLabels: this.creatives[0].labels,
				creativeLabels: !this.state.selectedChange
					? this.creatives.map(c => c.name)
					: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name),
			},
			allData: true,
			linesData: false,
		});
		this.selectedCreatives = !this.state.selectedChange ? this.creatives.map(c => c.id) : this.selectedCreatives;
		setTimeout(() => {
			console.log(this.state);
		}, 100);
	}

	dataToChartLines(filter = 'impressions', additionalFilter = 'spend') {
		const arrayChart = !this.state.selectedChange
			? this.creatives.map(c => c[filter])
			: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c[filter]);
		const arrayLabels = this.creatives[0].labels;
		const creativeLabels = !this.state.selectedChange
			? this.creatives.map(c => c.name)
			: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name);

		const arrayBarChart = !this.state.selectedChange
			? this.creatives.map(c => c[additionalFilter])
			: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c[additionalFilter]);
		const arrayBarLabels = this.creatives[0].labels;
		const creativeBarLabels = !this.state.selectedChange
			? this.creatives.map(c => c.name)
			: this.creatives.filter(c => this.selectedCreatives.includes(c.id)).map(c => c.name);

		this.setState({
			dataChart: this.makeDataToChart(arrayChart, arrayLabels, creativeLabels),
			dataBarChart: this.makeDataToChart(arrayBarChart, arrayBarLabels, creativeBarLabels),
			allData: false,
			linesData: true,
		});
	}

	makeDataToChart(arrayChart, arrayLabels, creativeLabels) {
		var finalArray = new Array();

		Array.prototype.SumArray = function(arr) {
			var sum = [];
			if (arr != null && this.length == arr.length) {
				for (var i = 0; i < arr.length; i++) {
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
		finalArray.push(sum);
		const dataChart = { arrayChart: finalArray, arrayLabels, creativeLabels };
		return dataChart;
	}

	componentDidMount() {
		this.dataToChartLines();
	}

	async selectCreative(creative) {
		this.setState({ selectedChange: true });
		if (this.selectedCreatives.includes(creative)) {
			this.selectedCreatives = await this.selectedCreatives.filter(c => c !== creative);
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
			this.selectedCreatives = [];
		} else {
			await this.setState({ selectedAll: true, selectedChange: true });
			this.selectedCreatives = this.creatives.map(c => c.id);
		}

		if (this.state.linesData) {
			this.dataToChartLines(this.state.activeFilter, this.state.activeAdditionalFilter);
		} else {
			this.dataToChartAreas(this.state.activeFilter);
		}
	}

	render() {
		const { creatives } = this;
		const { dates } = this.props;
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
											<FormattedMessage {...messages.campaignReports} /> (soon)
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
				<Row className="row margin-0">
					<Col className="col-md-12">
						<AppCard chart>
							<Row className="report">
								<Col xl={12}>
									<Row className="padding-0">
										<Col xl={10}>
											<Row>
												<Col xl={2} lg={12} md={12}>
													<h2>
														<FormattedMessage
															{...this.state.filter.find(
																x => x.key === this.state.activeFilter,
															).name}
														/>
													</h2>
												</Col>
												<Col xl={4}>
													<h6 style={{ fontSize: '16px', paddingTop: '14px' }}>
														<FormattedMessage {...messages.from} /> {moment().format('DD-MM-YYYY')} <FormattedMessage {...messages.to} />{' '}
														{moment()
															.add(7, 'days')
															.format('DD-MM-YYYY')}
													</h6>
												</Col>
												<Col xl={6} className="report__export-block">
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
												{this.state.filter.map(filter => {
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
																	(this.state.activeAdditionalFilter !== filter.key ||
																		!this.state.linesData) &&
																	this.selectFilter(filter.color, filter.key)
																}
															>
																<Blocks
																	className={
																		JSON.stringify(this.state.activeColor) ===
																		JSON.stringify(filter.color)
																			? 'active'
																			: null
																	}
																>
																	<span>
																		<FormattedMessage {...filter.name} />
																	</span>
																	<strong>{filter.value}</strong>
																</Blocks>
															</AppCard>
														</Col>
													);
												})}
											</Row>
										</Col>
										<Col xl={2}>
											<Row style={{ height: '100%' }}>
												<Col xl={12}>
													<h2><FormattedMessage {...messages.creatives} /></h2>
													<div className="report__settings">
														<Button onClick={() => this.selectAll()}>
															{this.state.selectedAll && this.selectedCreatives.length
																? <FormattedMessage {...messages.unselectAll} />
																: <FormattedMessage {...messages.selectAll} />}
														</Button>
													</div>
													<div className="report__filter-checkbox">
														{creatives.map((creative, i) => (
															<div className="custom-control custom-checkbox">
																<input
																	type="checkbox"
																	id={`checkboxCreative-${i}`}
																	name="customCheckbox"
																	className="custom-control-input"
																	onClick={() => this.selectCreative(creative.id)}
																	checked={this.selectedCreatives.includes(
																		creative.id,
																	)}
																/>
																<label
																	className="custom-control-label"
																	htmlFor={`checkboxCreative-${i}`}
																>
																	{creative.name}
																</label>
															</div>
														))}
													</div>
												</Col>
												{this.state.linesData && (
													<Col xl={12}>
														<h2><FormattedMessage {...messages.dataSeries} /></h2>
														{this.state.filter.map((filter, i) => (
															<div className="custom-control custom-radio">
																<input
																	type="radio"
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
							<AppTable
								columns={this.state.reportColumns}
								data={this.state.reportData}
								pagination
								exportTable
								search
							/>
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}

CampaignReport.propTypes = {
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
	intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
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

export default compose(withConnect)(injectIntl(CampaignReport));
