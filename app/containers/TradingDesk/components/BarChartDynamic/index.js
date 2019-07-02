import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotation';
import { Button, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Col } from 'reactstrap';
import { defoptions, defdata } from 'containers/DataMiner/Variables/graphics';
Chart.plugins.register(ChartDataLabels);
Chart.defaults.global.defaultFontFamily = "'Proxima Nova Rg', Arial, sans-serif";
class BarChart extends React.Component {
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
		const { arrayChart = [], arrayLabels, average, arrayName, creativeLabels } = this.props.data;
		const { settings, legend, color, lines } = this.props;
		function indexOfMinMax(arr) {
			const minIndex = arr.indexOf(Math.min(...arr));
			const maxIndex = arr.indexOf(Math.max(...arr));
			return { minIndex, maxIndex };
		}
		const options1 = {
			layout: {
				padding: {
					left: 40,
					right: 0,
					top: 0,
					bottom: 0
				}
			},
			legend: {
				display: false,
				onClick: false,
			},
			scales: {
				yAxes: [
					{
						stacked: true,
						ticks: {
							beginAtZero: true,
							display: false,
						},
						gridLines: {
							display:false,
						}
					},
				],
				xAxes: [
					{
						ticks: {
							display: true,
						},
						barPercentage: 100,
						barThickness: 1000,
						maxBarThickness: 300,
						minBarLength: 2,
						gridLines: {
							display:false,
							drawOnChartArea: false,
						}
					},
				],
			},
			plugins: {
				filler: {
					propagate: true
				},
				datalabels: {
					color: '#767676',
					padding: {
						bottom: -10,
					},
					anchor: 'start',
					align: 'top',
					font: {
						family: 'Proxima Nova Rg',
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
			for (let i = 0; i < arrayChart.length; i++) {
				const gradientFill2 = ctx.createLinearGradient(0, 10, 0, 300);
				gradientFill2.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.${i})`);
				gradientFill2.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.${i+1})`);
				datasets.push({
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
				});
			}
			return {
				labels: arrayLabels,
				datasets,
			};
		};

		return (
			<Col className="padding-0">
				<div className="row">
					<div className="col-12">
						<div className="chart-container">
							<div className="chart-area">
								<Bar
									data={!arrayChart ? defdata : data1}
									height={this.props.height}
									options={!arrayChart ? defoptions : options1}
								/>
							</div>
						</div>
					</div>
				</div>
			</Col>
		);
	}
}

BarChart.propTypes = {
	data: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired)),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
		average: PropTypes.string,
		color: PropTypes.string,
	}),
	settings: PropTypes.bool,
	height: PropTypes.number,
	legend: PropTypes.bool,
};
export default BarChart;
