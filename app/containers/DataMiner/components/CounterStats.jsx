import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Row, Col, Popover, PopoverHeader, PopoverBody, Button } from 'reactstrap';
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import moment from 'moment';
import { StatsTable } from '../../../components/index';

class CounterStats extends React.Component {
	constructor(props, context) {
		super(props);

		const today = moment();

		this.state = {
			value: moment.range(today.clone().subtract(7, 'days'), today.clone()),
			startDate: moment(),
			endDate: moment(),
			width: 0,
			height: 0,
		};
		this.onSelectDate = this.onSelectDate.bind(this);
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	onSelectDate(event) {
		if (event.target.value === 'today') {
			this.setState({
				startDate: moment(),
				endDate: moment(),
			});
		}

		if (event.target.value === 'week') {
			this.setState({
				startDate: moment().subtract('1', 'week'),
				endDate: moment(),
			});
		}

		if (event.target.value === 'month') {
			this.setState({
				startDate: moment().subtract('1', 'month'),
				endDate: moment(),
			});
		}
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	render() {
		const data = canvas => {
			const ctx = canvas.getContext('2d');
			const chartColor = '#FFFFFF';
			const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, '#80b6f4');
			gradientStroke.addColorStop(0.5, '#80b6f4');
			gradientStroke.addColorStop(1, chartColor);

			const gradientFill = ctx.createLinearGradient(0, 300, 0, 50);
			gradientFill.addColorStop(0, 'rgba(57, 137, 33, 0)');
			gradientFill.addColorStop(1, 'rgba(53, 127, 31, 0.40)');
			const data = [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630];
			const sum = data.reduce((previous, current) => (current += previous));

			const avg = sum / data.length;
			const temp = [];
			for (let i = 0; i < data.length; i++) {
				temp.push(avg);
			}

			return {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				datasets: [
					{
						label: 'Profitability',
						borderColor: '#2c6d19',
						pointBorderColor: '#FFF',
						pointBackgroundColor: '#2c6d19',
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: gradientFill,
						borderWidth: 2,
						data,
					},
					{
						label: 'Average',
						backgroundColor: 'rgba(0, 0, 0,1)',
						borderColor: 'rgba(0, 0, 0,1)',
						borderWidth: 1,
						pointBorderWidth: 0,
						pointRadius: 0,
						fill: false,
						data: temp,
					},
				],
			};
		};
		const options3 = {
			legend: {
				display: true,
				position: 'top',
			},
			title: {
				display: true,
			},
			tooltips: {
				mode: 'index',
				intersect: true,
			},
			annotation: {
				annotations: [
					{
						type: 'line',
						mode: 'horizontal',
						scaleID: 'y-axis-0',
						value: 5,
						borderColor: 'rgb(75, 192, 192)',
						borderWidth: 4,
						label: {
							enabled: false,
							content: 'Test label',
						},
					},
				],
			},
		};
		const data2 = canvas => {
			const ctx = canvas.getContext('2d');
			const chartColor = '#FFFFFF';
			const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, '#DA4453');
			gradientStroke.addColorStop(1, '#89216B');

			const gradientFill = ctx.createLinearGradient(0, 250, 0, 50);
			gradientFill.addColorStop(0, 'rgba(255, 0, 0, 0)');
			gradientFill.addColorStop(1, 'rgba(219, 13, 13, 0.4)');

			return {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				datasets: [
					{
						label: 'Active Users',
						borderColor: '#db0d0d',
						pointBorderColor: '#FFF',
						pointBackgroundColor: '#db0d0d',
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: gradientFill,
						borderWidth: 2,
						data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
					},
				],
			};
		};
		const data7 = canvas => {
			const ctx = canvas.getContext('2d');
			const chartColor = '#FFFFFF';
			const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, '#3f51b5');
			gradientStroke.addColorStop(1, chartColor);

			const gradientFill = ctx.createLinearGradient(0, 250, 0, 50);
			gradientFill.addColorStop(0, 'rgba(63, 81, 181, 0)');
			gradientFill.addColorStop(1, 'rgba(80, 95, 178, 0.50)');

			return {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				datasets: [
					{
						label: 'Active Users',
						borderColor: '#3f51b5',
						pointBorderColor: '#FFF',
						pointBackgroundColor: '#3f51b5',
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: gradientFill,
						borderWidth: 2,
						data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
					},
				],
			};
		};
		const options1 = {
			legend: {
				display: false,
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		};
		return (
			<div>
				<Row>
					<Col xs={12} md={12}>
						<div className="page-title">
							<div className="float-left">
								<h1 className="title">UBEX.COM / ubx-879</h1>
							</div>
							<div className="float-right  range_date">
								<div className="form-group is-inline">
									<select
										name="select"
										onChange={this.onSelectDate}
										id="exampleSelect"
										className="form-control"
									>
										<option value="today">Today</option>
										<option value="week">Last week</option>
										<option value="month">Last month</option>
									</select>
								</div>
								<p className="is-inline">or</p>
								<DateRangePicker
									startDate={this.state.startDate} // momentPropTypes.momentObj or null,
									startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
									endDate={this.state.endDate} // momentPropTypes.momentObj or null,
									endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
									onDatesChange={({ startDate, endDate }) =>
										this.setState({
											startDate,
											endDate,
										})
									} // PropTypes.func.isRequired,
									focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
									onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
									isOutsideRange={() => false}
								/>
							</div>
						</div>
						<div className="row margin-0">
							<div className="col-12 col-lg-6 col-xl-4">
								<section className="box">
									<header className="panel_header">
										<Link to="/app/visitors">
											<h2 className="title float-left">Visitors</h2>
										</Link>
										<div className="actions digits float-right">
											<div className="green">
												170.00 (<span>+15%</span>)
											</div>
										</div>
									</header>
									<div className="content-body">
										<div className="row">
											<div className="col-12">
												<div className="chart-container">
													<div className="chart-area">
														{this.state.width < 600 && (
															<Line height={180} data={data7} options={options1} />
														)}
														{this.state.width > 600 && (
															<Line height={85} data={data7} options={options1} />
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>
							</div>
							<div className="col-12 col-lg-6 col-xl-4">
								<section className="box ">
									<header className="panel_header">
										<Link to="/app/rewards">
											<h2 className="title float-left">Unique visitor reward</h2>
										</Link>
										<div className="actions digits float-right">
											<div className="red">
												18 <span>(-3%)</span>
											</div>
										</div>
									</header>
									<div className="content-body">
										<div className="row">
											<div className="col-12">
												<div className="chart-container">
													<div className="chart-area">
														{this.state.width < 600 && (
															<Line height={180} data={data2} options={options1} />
														)}
														{this.state.width > 600 && (
															<Line height={85} data={data2} options={options1} />
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>
							</div>
							<div className="col-12 col-lg-6 col-xl-4 nopadding">
								<div className="col-xl-12 col-md-12 col-12">
									<div className="r4_counter db_box db_box_vertical">
										<i className="float-left fas fa-chart-bar icon-md icon-rounded icon-purple" />
										<div className="stats">
											<h4>
												<strong className="green">
													1050 UBEX <span>(+10%)</span>
												</strong>
											</h4>
											<span>Revenue</span>
										</div>
									</div>
								</div>
								<div className="col-xl-12 col-md-12 col-12">
									<div className="r4_counter db_box db_box_vertical">
										<i className="float-left fas fa-coins icon-md icon-rounded icon-warning" />
										<div className="stats">
											<h4>
												<strong>15 UBEX</strong>
											</h4>
											<span>Average Profit</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row margin-0">
							<div className="col-md-12">
								<section className="box ">
									<header className="panel_header">
										<Link to="/app/profitability">
											<h2 className="title float-left">Profit</h2>
										</Link>
									</header>
									<div className="content-body">
										<div className="row">
											<div className="col-12">
												<div className="chart-area">
													{this.state.width < 600 && (
														<Line height={80} data={data} options={options3} />
													)}
													{this.state.width > 600 && (
														<Line height={60} data={data} options={options3} />
													)}
												</div>
											</div>
										</div>
									</div>
								</section>
							</div>
						</div>
						<div className="row margin-0">
							<div className="col-md-12">
								<section className="box">
									<StatsTable />
								</section>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default CounterStats;
