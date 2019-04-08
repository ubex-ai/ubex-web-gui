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

const defdata = canvas => {
	const ctx = canvas.getContext('2d');
	const chartColor = '#FFFFFF';

	const gradientFill = ctx.createLinearGradient(0, 500, 0, 50);
	gradientFill.addColorStop(0, 'rgba(53, 153, 184, 0.5)');
	gradientFill.addColorStop(1, 'rgba(53, 153, 184, 0.5)');

	const gradientFill2 = ctx.createLinearGradient(0, 1000, 0, 50);
	gradientFill2.addColorStop(0, 'rgba(1, 184, 170, 0.5)');
	gradientFill2.addColorStop(1, 'rgba(1, 184, 170, 0.5)');

	return {
		labels: [
			'00:00',
			'02:00',
			'04:00',
			'06:00',
			'08:00',
			'10:00',
			'12:00',
			'14:00',
			'16:00',
			'18:00',
			'20:00',
			'22:00',
			'23:59',
		],
		datasets: [
			{
				label: 'Reward visitors',
				borderColor: '#01B8AA',
				pointBorderColor: '#FFF',
				pointBackgroundColor: '#01B8AA',
				pointBorderWidth: 2,
				pointHoverRadius: 4,
				pointHoverBorderWidth: 1,
				pointRadius: 4,
				fill: true,
				backgroundColor: gradientFill2,
				borderWidth: 2,
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
			{
				label: 'Visitors',
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
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			},
		],
	};
};

const defoptions = {
	legend: {
		display: false,
	},
	scales: {},
};


export {
	data,
	defdata,
	defoptions,
};
