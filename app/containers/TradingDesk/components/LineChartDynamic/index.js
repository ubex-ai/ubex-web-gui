import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Col } from 'reactstrap';
import { defoptions, defdata } from 'containers/DataMiner/Variables/graphics';
Chart.plugins.register(ChartDataLabels);
Chart.defaults.global.defaultFontFamily = "'Open Sans', Arial, sans-serif";
class LineChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: 0,
			dropdownOpen: false,
			tempAverage: null,
			options: null,
			dropDownValue: 'By day',
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
		const { arrayChart = [], arrayLabels, average, arrayName, creativeLabels, arrayBarChart } = this.props.data;
		const { settings, legend, color, lines, colorBar } = this.props;
		function indexOfMinMax(arr) {
			const minIndex = arr.indexOf(Math.min(...arr));
			const maxIndex = arr.indexOf(Math.max(...arr));
			return { minIndex, maxIndex };
		}

		const options1 = {
			layout: {
				padding: {
					left: 0,
					right: 20,
					top: 0,
					bottom: 0,
				},
			},
			legend: {
				display: !lines,
				onClick: false,
			},
			scales: {
				yAxes: !lines
					? [
							{
								stacked: true,
								ticks: {
									beginAtZero: true,
								},
								type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
								display: true,
								position: 'left',
								id: 'y-axis-0',
							},
					  ]
					: [
							{
								stacked: false,
								ticks: {
									beginAtZero: true,
								},
								type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
								display: true,
								position: 'left',
								id: 'y-axis-0',
							},
							{
								stacked: false,
								ticks: {
									beginAtZero: true,
								},
								type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
								display: true,
								position: 'right',
								id: 'y-axis-1',
								gridLines: {
									drawOnChartArea: false, // only want the grid lines for one axis to show up
								},
							},
					  ],
				xAxes: [
					{
						barPercentage: 0.4,
						ticks: {
							display: true,
						},
					},
				],
			},
			plugins: {
				filler: {
					propagate: true,
				},
				datalabels: {
					color: '#767676',
					padding: {
						bottom: 10,
					},
					anchor: 'center',
					align: 'top',
					font: {
						family: 'Open Sans',
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
			},
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
			gradientFill.addColorStop(0, 'rgba(63, 153, 184, 0.3)');
			gradientFill.addColorStop(1, 'rgba(53, 153, 184, 0.3)');
			const datasets = new Array();
			if (creativeLabels && creativeLabels.length) {
				for (let i = 0; i < arrayChart.length; i++) {
					const gradientFill2 = ctx.createLinearGradient(0, 10, 0, 300);
					gradientFill2.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.${i})`);
					gradientFill2.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.${i + 1})`);
					!lines
						? datasets.push({
								label: `${creativeLabels[i]}`,
								borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
								pointBorderColor: '#FFF',
								pointBackgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
								pointBorderWidth: 2,
								pointHoverRadius: 4,
								pointHoverBorderWidth: 1,
								pointRadius: 4,
								fill: true,
								backgroundColor: gradientFill2,
								borderWidth: 2,
								data: JSON.parse(JSON.stringify(arrayChart[i])),
								yAxisID: 'y-axis-0',
								datalabels: {
									display: true,
									backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}`,
									color: '#fff',
									padding: {
										bottom: 1,
										top: 3,
										left: 5,
										right: 5,
									},
									borderRadius: 5,
									anchor: 'center',
									align: 'top',
									font: {
										family: 'Open Sans',
									},
									formatter(value, context) {
										const { minIndex, maxIndex } = indexOfMinMax(arrayChart[0]);
										const d = context.dataset.data.filter(c => typeof c !== 'function');

										if (d.length > 25) {
											return context.dataIndex === minIndex
												? d[minIndex]
												: context.dataIndex === maxIndex
													? d[maxIndex]
													: null;
										}
										return d[context.dataIndex];
									},
								},
						  })
						: datasets.push(
								{
									label: ``,
									borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
									pointBorderColor: '#FFF',
									pointBackgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
									pointBorderWidth: 2,
									pointHoverRadius: 4,
									pointHoverBorderWidth: 1,
									pointRadius: 4,
									fill: true,
									backgroundColor: 'transparent',
									borderWidth: 2,
									data: JSON.parse(JSON.stringify(arrayChart[i])),
									yAxisID: 'y-axis-0',
									type: 'line',
									datalabels: {
										display: true,
										backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}`,
										color: '#fff',
										padding: {
											bottom: 1,
											top: 3,
											left: 5,
											right: 5,
										},
										borderRadius: 5,
										anchor: 'center',
										align: 'top',
										font: {
											family: 'Open Sans',
										},
										formatter(value, context) {
											const d = context.dataset.data.filter(c => typeof c !== 'function');
											const { minIndex, maxIndex } = indexOfMinMax(d.map(Number));
											if (d.length > 25) {
												return context.dataIndex === minIndex
													? d[minIndex]
													: context.dataIndex === maxIndex
														? d[maxIndex]
														: null;
											}
											return d[context.dataIndex];
										},
									},
								},
								{
									label: ``,
									borderColor: `rgba(${colorBar.r}, ${colorBar.g}, ${colorBar.b}, 1)`,
									pointBorderColor: '#FFF',
									pointBackgroundColor: `rgba(${colorBar.r}, ${colorBar.g}, ${colorBar.b}, 1)`,
									pointBorderWidth: 2,
									pointHoverRadius: 4,
									pointHoverBorderWidth: 1,
									pointRadius: 4,
									fill: true,
									backgroundColor: `rgba(${colorBar.r}, ${colorBar.g}, ${colorBar.b}, 0.5)`,
									borderWidth: 2,
									data: JSON.parse(JSON.stringify(this.props.databar.arrayChart[i])),
									yAxisID: 'y-axis-1',
									datalabels: {
										display: true,
										backgroundColor: `rgba(${colorBar.r}, ${colorBar.g}, ${colorBar.b}, 0.6)`,
										color: '#fff',
										padding: {
											bottom: 1,
											top: 3,
											left: 5,
											right: 5,
										},
										borderRadius: 5,
										anchor: 'center',
										align: 'top',
										font: {
											family: 'Open Sans',
										},
										formatter(value, context) {
											const d = context.dataset.data.filter(c => typeof c !== 'function');
											const { minIndex, maxIndex } = indexOfMinMax(d.map(Number));
											if (d.length > 25) {
												return context.dataIndex === minIndex
													? d[minIndex]
													: context.dataIndex === maxIndex
														? d[maxIndex]
														: null;
											}
											return d[context.dataIndex];
										},
									},
								},
						  );
				}
			}

			return {
				labels: arrayLabels && arrayLabels.length && creativeLabels && creativeLabels.length ? arrayLabels : [],
				datasets,
			};
		};
		return (
			<Col className="padding-0">
				<div className="row">
					<div className="col-12">
						<div className="chart-container">
							<div className="chart-area">
								{lines ? (
									<Bar
										data={!arrayChart ? defdata : data1}
										height={this.props.height}
										options={!arrayChart ? defoptions : options1}
									/>
								) : (
									<Line
										data={!arrayChart ? defdata : data1}
										height={this.props.height}
										options={!arrayChart ? defoptions : options1}
									/>
								)}
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
		average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		color: PropTypes.string,
	}),
	settings: PropTypes.bool,
	height: PropTypes.number,
	legend: PropTypes.array,
};
export default LineChart;
