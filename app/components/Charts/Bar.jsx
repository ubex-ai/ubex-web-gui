import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import { Button, ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { defdata } from 'containers/DataMiner/Variables/graphics';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.register(ChartDataLabels);
const colors = ['#716aca', '#22b9ff', '#f4516c', '#34bfa3', '#03a9f4', 'rgb(255, 184, 34)', '#f44336'];

class BarChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
			dropDownValue: 'By day',
		};

		this.toggle = this.toggle.bind(this);
		this.changeValue = this.changeValue.bind(this);
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}

	changeValue(e) {
		this.setState({ dropDownValue: e.target.value });
	}

	render() {
		const { arrayChart, arrayLabels, arrayDimensions } = this.props.data;
		const { settings, height, channel, legend } = this.props;
		const data1 = canvas => {
			const ctx = canvas.getContext('2d');

			const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
			if (channel) {
				gradientFill.addColorStop(0, 'rgba(62, 149, 205, 0.7)');
				gradientFill.addColorStop(1, 'rgba(62, 149, 205, 0.7)');
			} else {
				gradientFill.addColorStop(0, 'rgba(142, 94, 162, 0.7)');
				gradientFill.addColorStop(1, 'rgba(142, 94, 162, 0.7)');
			}
			return {
				labels: arrayLabels,
				datasets: arrayChart.map((dimension, i) => ({
					label: arrayDimensions[i],
					data: dimension,
					backgroundColor: colors[i],
					hoverBackgroundColor: colors[i],
					datalabels: {
						display: false,
						color: '#fff',
					},
				})),
			};
		};
		const options1 = {
			legend: {
				display: legend || false,
			},
			scales: {
				xAxes: [{ stacked: true }],
				yAxes: [{ stacked: true }]
			},
		};
		return (
			<div className={settings ? 'row margin-0' : 'row'}>
				<div className={settings ? 'col-12 col-lg-9 col-xl-9' : 'col-12 col-lg-12 col-xl-12'}>
					<div className="row">
						<div className="col-12">
							<div className="chart-container">
								<div className="chart-area">
									<Bar
										data={
											!arrayChart || arrayChart.length === 0 || !Array.isArray(arrayChart)
												? defdata
												: data1
										}
										height={height}
										options={options1}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				{this.props.settings ? (
					<div className="col-12 col-lg-3 col-xl-3 chart-settings">
						<Row>
							<Col xs={4} lg={5}>
								<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
									<DropdownToggle color="primary" caret>
										{this.state.dropDownValue}
									</DropdownToggle>
									<DropdownMenu>
										<DropdownItem value="By week" onClick={this.changeValue}>
											By week
										</DropdownItem>
										<DropdownItem value="By month" onClick={this.changeValue}>
											By month
										</DropdownItem>
									</DropdownMenu>
								</ButtonDropdown>
							</Col>
						</Row>
						<hr />
						<Button color="primary" block>
							Download PDF
						</Button>
						<Button color="primary" block>
							Download CSV
						</Button>
					</div>
				) : null}
			</div>
		);
	}
}

BarChart.defaultProps = {};

BarChart.propTypes = {
	channel: PropTypes.bool,
	data: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.number.isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}),
	settings: PropTypes.bool,
	height: PropTypes.number,
	legend: PropTypes.bool,
};

export default BarChart;
