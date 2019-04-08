import React from 'react';
import PropTypes from 'prop-types';
import { HorizontalBar, Chart, Bar, Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import { defdata } from 'containers/DataMiner/Variables/graphics';

class HorizontalBarChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: 0,
		};
	}

	render() {
		const { arrayChart, arrayLabels } = this.props.data;
		const { height, legend } = this.props;
		const data1 = canvas => {
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
				labels: arrayLabels,
				datasets: [
					{
						label: 'Reward users',
						data: arrayChart,
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
		const options1 = {
			legend: {
				display: legend || false,
			},
			plugins: {
				datalabels: {
					color: '#575962',
					textShadowColor: '#fff',
					align: 'right',
					padding: {
						bottom: 10,
						left: 5,
					},
					anchor: 'center',
					font: {
						size: 12,
						family: 'Proxima Nova Rg',
					},
				},
			},
		};
		return (
			<HorizontalBar
				height={height}
				data={!arrayChart || arrayChart.length === 0 || !Array.isArray(arrayChart) ? defdata : data1}
				options={options1}
			/>
		);
	}
}
HorizontalBarChart.defaultProps = {};

HorizontalBarChart.propTypes = {
	data: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.number.isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}),
	settings: PropTypes.bool,
	height: PropTypes.number,
	legend: PropTypes.bool,
};
export default HorizontalBarChart;
