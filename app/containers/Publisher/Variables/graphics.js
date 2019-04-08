const data = canvas => {
	const ctx = canvas.getContext('2d');
	const chartColor = '#FFFFFF';
	const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
	gradientStroke.addColorStop(0, '#80b6f4');
	gradientStroke.addColorStop(0.5, '#80b6f4');
	gradientStroke.addColorStop(1, chartColor);

	const gradientFill = ctx.createLinearGradient(0, 1000, 0, 50);
	gradientFill.addColorStop(0, 'rgba(1, 184, 170, 0.5)');
	gradientFill.addColorStop(1, 'rgba(1, 184, 170, 0.5)');
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
				borderColor: '#01B8AA',
				pointBorderColor: '#FFF',
				pointBackgroundColor: '#01B8AA',
				pointBorderWidth: 2,
				pointHoverRadius: 4,
				pointHoverBorderWidth: 1,
				pointRadius: 4,
				fill: true,
				backgroundColor: gradientFill,
				borderWidth: 2,
				data,
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

	const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
	gradientFill.addColorStop(0, 'rgba(53, 153, 184, 0.5)');
	gradientFill.addColorStop(1, 'rgba(53, 153, 184, 0.5)');

	return {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: 'Active Users',
				borderColor: '#3599B8',
				pointBorderColor: '#FFF',
				pointBackgroundColor: '#3599B8',
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

const data2 = canvas => {
	const ctx = canvas.getContext('2d');
	const chartColor = '#FFFFFF';
	const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
	gradientStroke.addColorStop(0, '#DA4453');
	gradientStroke.addColorStop(1, '#89216B');

	const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
	gradientFill.addColorStop(0, 'rgba(253, 98, 94, 0.5)');
	gradientFill.addColorStop(1, 'rgba(253, 98, 94, 0.5)');

	return {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: 'Active Users',
				borderColor: '#FD625E',
				pointBorderColor: '#FFF',
				pointBackgroundColor: '#FD625E',
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

const data1 = {
	labels: ['PC', 'Smartphones', 'Tablet', 'SmartTV'],
	datasets: [
		{
			backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
			data: [68, 51, 132, 20],
		},
	],
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
	annotation: {
		annotations: [
			{
				type: 'line',
				mode: 'horizontal',
				drawTime: 'afterDatasetsDraw',
				scaleID: 'y-axis-0',
				value: 350,
				borderColor: '#676767',
				borderWidth: 1,
				label: {
					backgroundColor: 'transparent',
					fontFamily: 'sans-serif',
					fontSize: 12,
					fontStyle: 'bold',
					fontColor: '#676767',
					xPadding: 6,
					yPadding: 20,
					position: 'right',
					xAdjust: 0,
					yAdjust: 10,
					enabled: true,
					content: 'Average: 350',
				},
			},
		],
	},
};
const options2 = {
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
const data3 = {
	labels: ['January', 'February'],
	datasets: [
		{
			label: '',
			backgroundColor: 'rgba(63, 81, 181,1)',
			borderColor: 'rgba(63, 81, 181,1)',
			borderWidth: 2,
			fill: false,
			data: [2, 10],
		},
		{
			label: 'Visits',
			backgroundColor: 'rgba(0, 0, 0,1)',
			borderColor: 'rgba(0, 0, 0,1)',
			borderWidth: 0,
			fill: false,
			data: [5, 5],
		},
	],
};

const options3 = {
	responsive: true,
	title: {
		display: false,
		text: 'Chart.js Drsw Line on Chart',
	},
	legend: {
		display: false,
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
				drawTime: 'afterDatasetsDraw',
				scaleID: 'y-axis-0',
				value: 500,
				borderColor: '#676767',
				borderWidth: 1,
				label: {
					backgroundColor: 'transparent',
					fontFamily: 'sans-serif',
					fontSize: 12,
					fontStyle: 'bold',
					fontColor: '#676767',
					xPadding: 6,
					yPadding: 20,
					position: 'right',
					xAdjust: 0,
					yAdjust: 10,
					enabled: true,
					content: 'Average: 500',
				},
			},
		],
	},
};
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
		labels: ['ubex.com', 'google.ru', 'microsoft.com', 'vk.com', 'yandex.ru', 'rt.ru', 'afisha.ru', 'ok.ru'],
		datasets: [
			{
				data: [300, 50, 100, 230, 55, 890, 53, 560],
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

const options6 = {
	legend: false,
	legendCallback: chart => {
		const text = [];
		text.push('<ul class="doughnut-legend">');
		for (let j = 0; j < chart.data.datasets[0].data.length; j++) {
			const total = chart.data.datasets[0].data.reduce(
				(previousValue, currentValue, currentIndex, array) => previousValue + currentValue,
			);

			const currentValue = chart.data.datasets[0].data[j];

			const precentage = Math.floor((currentValue / total) * 100 + 0.5);

			if (j !== 0 && j % 8 === 0) {
				text.push('</ul>');
				text.push('<ul class="doughnut-legend">');
			}
			text.push(`<li><span style="background-color:${chart.data.datasets[0].hoverBorderColor[j]}"></span>`);
			if (chart.data.labels) {
				text.push(`${precentage}% - ${chart.data.labels[j]}`);
			}
		}
		text.push('</ul>');
		return text.join('');
	},
	title: {
		display: false,
	},
	tooltips: {},
	animation: {
		animateScale: true,
		animateRotate: true,
	},
};

const data8 = canvas => {
	const ctx = canvas.getContext('2d');
	const colors = ['#e6194b', '#4363d8'];

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
		labels: ['Male', 'Female'],
		datasets: [
			{
				data: [35, 65],
				backgroundColor: colorsTemp,
				hoverBackgroundColor: ['#e6194b', '#4363d8'],
				hoverBorderColor: colorsForLegend,
				borderWidth: 2,
				borderColor: '#fff',
			},
		],
	};
};

const options8 = {
	legend: false,
	legendCallback: chart => {
		const text = [];
		text.push('<ul class="doughnut-legend">');
		for (let j = 0; j < chart.data.datasets[0].data.length; j++) {
			const total = chart.data.datasets[0].data.reduce(
				(previousValue, currentValue, currentIndex, array) => previousValue + currentValue,
			);

			const currentValue = chart.data.datasets[0].data[j];

			const precentage = Math.floor((currentValue / total) * 100 + 0.5);

			if (j !== 0 && j % 8 === 0) {
				text.push('</ul>');
				text.push('<ul class="doughnut-legend">');
			}
			text.push(`<li><span style="background-color:${chart.data.datasets[0].hoverBorderColor[j]}"></span>`);
			if (chart.data.labels) {
				text.push(`${precentage}% - ${chart.data.labels[j]}`);
			}
		}
		text.push('</ul>');
		return text.join('');
	},
	title: {
		display: false,
	},
	tooltips: {},
	animation: {
		animateScale: true,
		animateRotate: true,
	},
};

const data9 = {
	labels: ['15-18', '18-25', '25-30', 'over 30'],
	datasets: [
		{
			backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
			data: [10, 50, 30, 20],
		},
	],
};

const options9 = {
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
	annotation: {
		annotations: [
			{
				type: 'line',
				mode: 'horizontal',
				drawTime: 'afterDatasetsDraw',
				scaleID: 'y-axis-0',
				value: 0,
				borderColor: '#676767',
				borderWidth: 1,
				label: {
					backgroundColor: 'transparent',
					fontFamily: 'sans-serif',
					fontSize: 12,
					fontStyle: 'bold',
					fontColor: '#676767',
					xPadding: 6,
					yPadding: 20,
					position: 'right',
					xAdjust: 0,
					yAdjust: 10,
					enabled: true,
					content: 'Average: 350',
				},
			},
		],
	},
};

const data10 = canvas => {
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
				`rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.7)`,
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
		labels: [
			'720x90',
			'300x400',
			'100x100',
			'300 x 250',
			'336 x 280',
			'728 x 90',
			'300 x 600',
			'320 x 100',
			'320 x 50',
			'468 x 60',
			'392 х 72',
			'250 x 250',
		],
		datasets: [
			{
				backgroundColor: colorsTemp,
				data: [30, 20, 40, 10, 14, 15, 7, 30, 24, 50, 21, 13],
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
			},
		],
	};
};

const options10 = {
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
	annotation: {
		annotations: [
			{
				type: 'line',
				mode: 'horizontal',
				drawTime: 'afterDatasetsDraw',
				scaleID: 'y-axis-0',
				value: 350,
				borderColor: '#676767',
				borderWidth: 1,
				label: {
					backgroundColor: 'transparent',
					fontFamily: 'sans-serif',
					fontSize: 12,
					fontStyle: 'bold',
					fontColor: '#676767',
					xPadding: 6,
					yPadding: 20,
					position: 'right',
					xAdjust: 0,
					yAdjust: 10,
					enabled: true,
					content: 'Average: 350',
				},
			},
		],
	},
};

export {
	data,
	data1,
	data2,
	data6,
	data7,
	data8,
	data9,
	data10,
	options1,
	options2,
	options3,
	options6,
	options8,
	options9,
	options10,
};
