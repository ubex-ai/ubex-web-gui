import moment from 'moment';
export default [
	{
		id: 1,
		id_creative: 1,
		campaigns: [100000, 200000, 300000],
		type: 'Display',
		name: 'Creative 1',
		cpm: '100',
		eCPM: '200',
		winrate: '50%',
		start: moment().format('DD-MM-YYYY'),
		end: moment()
			.add(7, 'days')
			.format('DD-MM-YYYY'),
		spend: '$1000',
		impressions: 500,
		clicks: 200,
		status: 0,
		cpm_select: 'fixed',
	},
	{
		id: 2,
		id_creative: 1,
		campaigns: [100000],
		name: 'Creative 2',
		cpm: '100',
		type: 'Display',
		eCPM: '200',
		winrate: '50%',
		start: moment().format('DD-MM-YYYY'),
		end: moment()
			.add(7, 'days')
			.format('DD-MM-YYYY'),
		spend: '$1000',
		impressions: 500,
		clicks: 200,
		status: 1,
		cpm_select: 'max',
	},
	{
		id: 3,
		id_creative: 1,
		campaigns: [100000, 200000, 300000],
		name: 'Creative 5',
		type: 'Display',
		cpm: '100',
		eCPM: '200',
		winrate: '50%',
		start: moment().format('DD-MM-YYYY'),
		end: moment()
			.add(7, 'days')
			.format('DD-MM-YYYY'),
		spend: '$1000',
		impressions: 500,
		clicks: 200,
		status: 1,
		cpm_select: 'fixed',
	},
]
