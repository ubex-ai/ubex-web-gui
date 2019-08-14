import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Col } from 'reactstrap';
import { defoptions, defdata } from '../../containers/DataMiner/Variables/graphics';
Chart.plugins.register(ChartDataLabels);
Chart.defaults.global.defaultFontFamily = "'Proxima Nova Rg', Arial, sans-serif";
class LineChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: 0,
			dropdownOpen: false,
			tempAverage: null,
			options: null,
			dropDownValue: 'By day',
			color: {
				r: 244,
				g: 81,
				b: 108,
			},
		};
		this.options = null;
		this.tempCount = 0;
		this.toggleAverage = this.toggleAverage.bind(this);
		this.toggle = this.toggle.bind(this);
		this.changeValue = this.changeValue.bind(this);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}

	toggleAverage() {
		if (
			this.options.annotation.annotations[this.tempCount] &&
			this.options.annotation.annotations[this.tempCount].length !== 0
		) {
			this.setState({ tempAverage: this.options.annotation.annotations[this.tempCount] });
			this.options.annotation.annotations[this.tempCount] = [];
			this.tempCount++;
		} else {
			this.options.annotation.annotations.push(this.state.tempAverage);
			this.setState({ options: this.options });
		}
	}

	changeValue(e) {
		this.setState({ dropDownValue: e.target.value });
	}

	render() {
		const { arrayChart, arrayLabels, average } = this.props.data;
		const { settings, legend } = this.props;
		let color = this.props.color;
		if (!color) {
			color = this.state.color;
		}
		function indexOfMinMax(arr) {
			const minIndex = arr.indexOf(Math.min(...arr));
			const maxIndex = arr.indexOf(Math.max(...arr));
			return { minIndex, maxIndex };
		}

		const options1 = {
			legend: {
				display: legend || false,
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
			plugins:
				arrayChart && arrayChart.length > 1
					? {
							datalabels: {
								color: 'rgba(53, 153, 184, 1)',
								padding: {
									bottom: 10,
								},
								anchor: 'center',
								align: 'top',
								formatter: function(value, context) {
									const { minIndex, maxIndex } = indexOfMinMax(arrayChart[0]);
									if (context.dataset.data.length > 25) {
										return context.datasetIndex === 1 && context.dataIndex === minIndex
											? context.dataset.data[minIndex]
											: context.datasetIndex === 1 && context.dataIndex === maxIndex
												? context.dataset.data[maxIndex]
												: null;
									} else {
										return context.datasetIndex === 1
											? context.dataset.data[context.dataIndex]
											: null;
									}
								},
								font: {
									family: 'Proxima Nova Rg',
								},
							},
					  }
					: arrayChart && arrayChart.length === 1
						? {
								datalabels: {
									color: '#767676',
									padding: {
										bottom: 10,
									},
									anchor: 'center',
									align: 'top',
									font: {
										family: 'Proxima Nova Rg',
									},
									formatter: function(value, context) {
										const { minIndex, maxIndex } = indexOfMinMax(arrayChart[0]);
										if (context.dataset.data.length > 25) {
											return context.dataIndex === minIndex
												? context.dataset.data[minIndex]
												: context.dataIndex === maxIndex
													? context.dataset.data[maxIndex]
													: null;
										} else {
											return context.dataset.data[context.dataIndex];
										}
									},
								},
						  }
						: null,
			annotation: average
				? {
						annotations: [
							{
								type: 'line',
								mode: 'horizontal',
								drawTime: 'afterDraw',
								scaleID: 'y-axis-0',
								value: average,
								borderDash: [2, 2],
								borderDashOffset: 5,
								borderColor: '#676767',
								borderWidth: 0.5,
								label: {
									backgroundColor: 'transparent',
									fontFamily: 'sans-serif',
									fontSize: 10,
									fontStyle: 'bold',
									fontColor: '#676767',
									xPadding: 2,
									yPadding: 20,
									position: 'right',
									xAdjust: 0,
									yAdjust: 10,
									enabled: true,
									content: `AVG: ${average}`,
								},
							},
						],
				  }
				: null,
		};

		const data1 = canvas => {
			const ctx = canvas.getContext('2d');
			const chartColor = '#FFFFFF';

			const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
			gradientFill.addColorStop(0, 'rgba(63, 153, 184, 0.5)');
			gradientFill.addColorStop(1, 'rgba(53, 153, 184, 0.5)');

			const gradientFill2 = ctx.createLinearGradient(0, 1000, 0, 50);
			gradientFill2.addColorStop(0, 'rgba(1, 184, 170, 0.5)');
			gradientFill2.addColorStop(1, 'rgba(1, 184, 170, 0.5)');

			return {
				labels: arrayLabels,
				datasets: [
					{
						label: legend.length ? legend[1] : '',
						borderColor: color.length ? `rgba(${color[1].r}, ${color[1].g}, ${color[1].b}, 1)` : '#fff',
						pointBorderColor: '#FFF',
						pointBackgroundColor: color.length ? `rgba(${color[1].r}, ${color[1].g}, ${color[1].b}, 1)` : '#fff',
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: color.length ? `rgba(${color[1].r}, ${color[1].g}, ${color[1].b}, 0.6)` : '#fff',
						borderWidth: 2,
						data: arrayChart[1],
						datalabels: {
							color: '#FFCE56',
						},
					},
					{
						label: legend.length ? legend[0] : '',
						borderColor: color.length ? `rgba(${color[0].r}, ${color[0].g}, ${color[0].b}, 1)` : '#fff',
						pointBorderColor: '#FFF',
						pointBackgroundColor: color.length ? `rgba(${color[0].r}, ${color[0].g}, ${color[0].b}, 1)` : '#fff',
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: color.length ? `rgba(${color[0].r}, ${color[0].g}, ${color[0].b}, 0.6)` : '#fff',
						borderWidth: 2,
						data: arrayChart[0],
					},
				],
			};
		};

		const data2 = canvas => {
			const ctx = canvas.getContext('2d');
			const chartColor = '#FFFFFF';
			const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
			gradientStroke.addColorStop(0, '#DA4453');
			gradientStroke.addColorStop(1, '#89216B');

			const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
			gradientFill.addColorStop(0, `rgba(${color.r}, ${color.r}, ${color.r}, 0.5)`);
			gradientFill.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`);

			return {
				labels: arrayLabels,
				datasets: [
					{
						label: 'UBEX',
						borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
						pointBorderColor: '#FFF',
						pointBackgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
						pointBorderWidth: 2,
						pointHoverRadius: 4,
						pointHoverBorderWidth: 1,
						pointRadius: 4,
						fill: true,
						backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`,
						borderWidth: 2,
						data: arrayChart[0],
					},
				],
			};
		};
		return (
			<Col className="padding-0">
				<div className="row">
					<div className="col-12">
						<div className="chart-container">
							<div className="chart-area">
								<Line
									data={
										!arrayChart || arrayChart.length === 0 || !Array.isArray(arrayChart)
											? defdata
											: arrayChart.length > 1
												? data1
												: data2
									}
									height={this.props.height}
									options={options1}
								/>
							</div>
						</div>
					</div>
				</div>
			</Col>
		);
	}
}

LineChart.propTypes = {
	data: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired)),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
		average: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		color: PropTypes.string,
	}),
	settings: PropTypes.bool,
	height: PropTypes.number,
	legend: PropTypes.array,
};
export default LineChart;
