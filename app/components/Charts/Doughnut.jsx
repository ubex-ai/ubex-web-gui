import React from 'react';
import PropTypes from 'prop-types';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';

class DoughnutChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: 0,
			legend: <>no legend</>,
		};

		this.labels = [];
		this.paidVisitors = [];
		this.myRef = null;
		this.createMarkup = this.createMarkup.bind(this);
	}

	createMarkup() {
		return { __html: this.state.legend };
	}

	componentDidMount() {
		if (this.props.data && !this.props.bug) {
			this.getVisitors(this.props.data);
		}
		const leg = this.generateLegend();
		this.setState({ legend: leg });
	}

	setTextInputRef(element) {
		this.myRef = element;
	}

	generateLegend() {
		if (!this.myRef) return null;
		return this.myRef.chartInstance.generateLegend();
	}

	getName(id) {
		const counters = this.props.counters;
		const labels = [];
		counters.forEach(item => {
			if (item.counter === id) {
				labels.push(id);
			}
		});
		return labels;
	}

	getVisitors(data) {
		for (let i = 0; i < data.length; i++) {
			this.labels.push(
				data[i].dimensions.length && data[i].dimensions[0].name
					? this.getName(data[i].dimensions[0].name)
					: 'Unknown',
			);
			const reducer = (accumulator, currentValue) => accumulator + currentValue;
			this.paidVisitors.push(data[i].metrics[1].reduce(reducer) + 1);
		}
		return data;
	}

	render() {
		const data6 = canvas => {
			const ctx = canvas.getContext('2d');
			const colors = [
				'#e6194b',
				'#3cb44b',
				'#ffe119',
				'#4363d8',
				'#f58231',
				'#911eb4',
				'#46f0f0',
				'#f032e6',
				'#bcf60c',
				'#fabebe',
				'#008080',
				'#e6beff',
				'#9a6324',
				'#fffac8',
				'#800000',
				'#aaffc3',
				'#808000',
				'#ffd8b1',
				'#000075',
				'#808080',
				'#ffffff',
				'#000000',
			];

			const colorsTemp = [];
			const colorsForLegend = [];

			function hexToRgbA(hex) {
				let c;
				if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
					c = hex.substring(1).split('');
					if (c.length === 3) {
						c = [c[0], c[0], c[1], c[1], c[2], c[2]];
					}
					c = `0x${c.join('')}`;
					const colorsRGBA = [
						`rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.5)`,
						`rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},1)`,
					];
					return colorsRGBA;
				}
				throw new Error('Bad Hex');
			}
			for (let i = 0; i < colors.length; i++) {
				const gradientFill = ctx.createLinearGradient(100, 30, 100, 300);
				gradientFill.addColorStop(0, hexToRgbA(colors[i])[0]);
				gradientFill.addColorStop(1, hexToRgbA(colors[i])[1]);
				colorsForLegend.push(hexToRgbA(colors[i])[0]);
				colorsTemp.push(gradientFill);
			}
			return {
				labels: this.labels,
				datasets: [
					{
						data: this.paidVisitors.sort().reverse(),
						backgroundColor: colorsTemp,
						hoverBackgroundColor: [
							'#e6194b',
							'#3cb44b',
							'#ffe119',
							'#4363d8',
							'#f58231',
							'#911eb4',
							'#46f0f0',
							'#f032e6',
							'#bcf60c',
							'#fabebe',
							'#008080',
							'#e6beff',
							'#9a6324',
							'#fffac8',
							'#800000',
							'#aaffc3',
							'#808000',
							'#ffd8b1',
							'#000075',
							'#808080',
							'#ffffff',
							'#000000',
						],
						hoverBorderColor: colorsForLegend,
						borderWidth: 2,
						borderColor: '#fff',
					},
				],
			};
		};
		return (
			<div className="col-md-12">
				<div className="row">
					<div className="col-md-6">
						<Doughnut
							ref={element => this.setTextInputRef(element)}
							height={314}
							data={this.props.bug ? this.props.data : data6}
							options={this.props.options}
						/>
					</div>
					<div className="col-md-6 nopadding flex-col">
						<div className="contents-legend" dangerouslySetInnerHTML={this.createMarkup()} />
					</div>
				</div>
			</div>
		);
	}
}

export default DoughnutChart;
