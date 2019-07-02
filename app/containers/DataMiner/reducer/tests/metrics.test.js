import moment from 'moment';
import dataMinerReducer, { initialState as dataMiningIntialState } from '../../reducer';
import {
	getEntryName,
	getPaidUBEX,
	getVisitors,
	getPaidVisitors,
	getFormatData,
	getAverage,
	getTotal,
	getCounterName,
	getCount,
	getPaidUsers,
	getPaidPercent,
	toTableBase,
	formatForTopRegions,
	formatForTopDevices,
	formatForTopChannel,
	formatForTopProfitability,
	formatForTopVisitors,
	formatForTopCounters,
	getName,
} from '../metricsMapReducer';
describe('dataMinerReducer', () => {
	it('returns the initial state', () => {
		expect(dataMinerReducer(undefined, {})).toEqual(dataMiningIntialState);
	});
});

describe('getEntryName', () => {
	it('should return Unknown on empty data', () => {
		const data = {};

		const result = 'Unknown';

		expect(getEntryName(data)).toEqual(result);
	});
	it('should return Unknown on dimensions', () => {
		const data = {
			dimensions: [{}],
		};

		const result = 'Unknown';

		expect(getEntryName(data)).toEqual(result);
	});
	it('should return name', () => {
		const data = {
			dimensions: [{ name: 'user' }],
		};

		const result = 'user';

		expect(getEntryName(data)).toEqual(result);
	});
});

describe('getPaidUBEX', () => {
	it('should return 0 on empty data', () => {
		const i = 0;

		const totals = [];

		const result = 0;

		expect(getPaidUBEX(i, totals)).toEqual(result);
	});

	it('should return 0 on empty arrays', () => {
		const totals = [[], []];
		const result = 0;
		for (let i = 0; i < 10; i++) {
			expect(getPaidUBEX(i, totals)).toEqual(result);
		}
	});
	it('should return totals[1][i] *= 0.25', () => {
		const totals = [[0, 53, 123, 848, 182381, 123781], [6, 6, 5, 12, 7]];

		const result = [6 * 0.25, 6 * 0.25, 5 * 0.25, 12 * 0.25, 7 * 0.25];

		for (let i = 0; i < totals[1].length; i++) {
			expect(getPaidUBEX(i, totals)).toEqual(result[i]);
		}
	});
});

describe('getVisitors', () => {
	it('should return 0 on empty data', () => {
		const i = 0;

		const visitors = [];

		const result = 0;

		expect(getVisitors(i, visitors)).toEqual(result);
	});

	it('should return 0 on empty arrays', () => {
		const visitors = [[], []];
		const result = 0;
		for (let i = 0; i < 10; i++) {
			expect(getVisitors(i, visitors)).toEqual(result);
		}
	});
	it('should return totals[0][i]', () => {
		const visitors = [[0, 53, 123, 848, 182381, 123781], [6, 6, 5, 12, 7]];

		for (let i = 0; i < visitors[0].length; i++) {
			expect(getVisitors(i, visitors)).toEqual(visitors[0][i]);
		}
	});
});

describe('getPaidVisitors', () => {
	it('should return 0 on empty data', () => {
		const i = 0;

		const visitors = [];

		const result = 0;

		expect(getPaidVisitors(i, visitors)).toEqual(result);
	});

	it('should return 0 on empty arrays', () => {
		const visitors = [[], []];
		const result = 0;
		for (let i = 0; i < 10; i++) {
			expect(getPaidVisitors(i, visitors)).toEqual(result);
		}
	});
	it('should return totals[1][i]', () => {
		const visitors = [[0, 53, 123, 848, 182381, 123781], [6, 6, 5, 12, 7]];

		for (let i = 0; i < visitors[1].length; i++) {
			expect(getPaidVisitors(i, visitors)).toEqual(visitors[1][i]);
		}
	});
});

describe('getFormatData', () => {
	it('should return Unknown on empty data', () => {
		const i = 0;

		const labels = [];

		const result = 'Unknown';

		expect(getFormatData(i, labels)).toEqual(result);
	});

	it('should return Unknown on not valid date', () => {
		const labels = ['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'];
		const result = 'Unknown';
		for (let i = 0; i < 10; i++) {
			expect(getFormatData(i, labels)).toEqual(result);
		}
	});
	it('should return formatted date', () => {
		const labels = ['2017.01.23', '12-12-2015', '05.05.2011'];

		for (let i = 0; i < labels.length; i++) {
			expect(getFormatData(i, labels)).toEqual(moment(labels[i]).format('YY-MM-DD'));
		}
	});
});

describe('getAverage', () => {
	it('should return Unknown on empty data', () => {
		const i = 0;

		const visitors = [];

		const result = 0;
		expect(getAverage(visitors)).toEqual(result);
	});

	it('should return 0 on not valid data', () => {
		const visitors = ['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'];
		const result = 0;
		expect(getAverage(visitors)).toEqual(result);
	});

	it('should return average in array', () => {
		const visitors = [0, 54, 123, 1239, 12391, 2931, 49582, 12312];
		const result = 9829;
		expect(getAverage(visitors)).toEqual(result);
	});
});

describe('getTotal', () => {
	it('should return Unknown on empty data', () => {
		const visitors = [];

		const result = 0;
		expect(getTotal(visitors)).toEqual(result);
	});

	it('should return 0 on not valid data', () => {
		const visitors = {
			metrics: [
				[0, 54, 123, 1239, 12391, 2931, 49582, 12312],
				['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'],
			],
		};
		const result = 0;
		expect(getTotal(visitors)).toEqual(result);
	});

	it('should return average in array', () => {
		const visitors = {
			metrics: [[0, 54, 123, 1239, 12391, 2931, 49582, 12312], [0, 54, 123, 1239, 12391, 2931, 49582, 12312]],
		};
		const result = 78632;
		expect(getTotal(visitors)).toEqual(result);
	});
});

describe('getCounterName', () => {
	it('should return Unknown on empty data', () => {
		const data = {};

		const result = 'Unknown';

		expect(getCounterName(data)).toEqual(result);
	});
	it('should return Unknown on dimensions', () => {
		const data = {
			dimensions: [{}],
		};

		const result = 'Unknown';

		expect(getCounterName(data)).toEqual(result);
	});
	it('should return name of counter', () => {
		const data = {
			dimensions: [{ name: 'user' }],
		};

		const counters = [{ counter: 'user', name: '123123' }];

		const result = '123123';

		expect(getCounterName(data, counters)).toEqual(result);
	});
});

describe('getCount', () => {
	it('should return 0 on empty data', () => {
		const visitors = {};

		const result = 0;
		expect(getCount(0, visitors)).toEqual(result);
	});

	it('should return 0 on not valid data', () => {
		const visitors = {
			metrics: [
				['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'],
				[0, 54, 123, 1239, 12391, 2931, 49582, 12312],
			],
		};
		const result = 0;
		for (let i = 0; i < visitors.metrics[1].length; i++) {
			expect(getCount(i, visitors)).toEqual(result);
		}
	});

	it('should return metric in array', () => {
		const visitors = {
			metrics: [[0, 54, 123, 1239, 12391, 2931, 49582, 12312], [0, 54, 123, 1239, 12391, 2931, 49582, 12312]],
		};

		const result = [0, 54, 123, 1239, 12391, 2931, 49582, 12312];
		for (let i = 0; i < visitors.metrics[0].length; i++) {
			expect(getCount(i, visitors)).toEqual(result[i]);
		}
	});
});

describe('getPaidUsers', () => {
	it('should return 0 on empty data', () => {
		const visitors = {};

		const result = 0;
		expect(getPaidUsers(0, visitors)).toEqual(result);
	});

	it('should return 0 on not valid data', () => {
		const visitors = {
			metrics: [
				[0, 54, 123, 1239, 12391, 2931, 49582, 12312],
				['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'],
			],
		};
		const result = 0;
		for (let i = 0; i < visitors.metrics[1].length; i++) {
			expect(getPaidUsers(i, visitors)).toEqual(result);
		}
	});

	it('should return metric in array', () => {
		const visitors = {
			metrics: [[0, 54, 123, 1239, 12391, 2931, 49582, 12312], [0, 54, 123, 1239, 12391, 2931, 49582, 12312]],
		};

		const result = [0, 54, 123, 1239, 12391, 2931, 49582, 12312];
		for (let i = 0; i < visitors.metrics[1].length; i++) {
			expect(getPaidUsers(i, visitors)).toEqual(result[i]);
		}
	});
});

describe('getPaidPercent', () => {
	it('should return 0 on empty data', () => {
		const visitors = {};

		const result = 0;
		expect(getPaidPercent(0, visitors)).toEqual(result);
	});

	it('should return 0 on not valid data', () => {
		const visitors = {
			metrics: [
				[0, 54, 123, 1239, 12391, 2931, 49582, 12312],
				['0asd.123.9341', '123sad.adsasd.123123', '12313.asd.24as'],
			],
		};
		const result = 0;
		for (let i = 0; i < visitors.metrics[0].length; i++) {
			expect(getPaidPercent(i, visitors)).toEqual(result);
		}
	});

	it('should return metric in array', () => {
		const visitors = {
			metrics: [[0, 54, 123, 1239, 12391, 2931, 49582, 12312], [0, 54, 123, 1239, 12391, 2931, 49582, 12312]],
		};
		let result;
		for (let i = 0; i < visitors.metrics[1].length; i++) {
			result =
				visitors.metrics[1][i] !== 0 && visitors.metrics[0][i] !== 0
					? parseInt((visitors.metrics[1][i] * 100) / visitors.metrics[0][i], 10)
					: 0;
			expect(getPaidPercent(i, visitors)).toEqual(result);
		}
	});
});

describe('toTableBase', () => {
	it('should return [] on empty data', () => {
		const visitors = {};

		const result = [];
		expect(toTableBase(visitors)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const visitors = {
			data: [{ dimensions: [], metrics: [[4, 0, 21, 132], [123, 123, 123]] }],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = [
			{ name: 'Unknown', date: 'Invalid date', count: 4, paidusers: 123, paidpercent: 3075 },
			{ name: 'Unknown', date: 'Invalid date', count: 0, paidusers: 123, paidpercent: 0 },
			{ name: 'Unknown', date: 'Invalid date', count: 21, paidusers: 123, paidpercent: 585 },
		];
		expect(toTableBase(visitors)).toEqual(result);
	});

	it('should return metric in array', () => {
		const visitors = {
			data: [{ dimensions: [{ name: 'test' }], metrics: [[400], [200]] }],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = [{ name: 'test', date: '2019-02-26', count: 400, paidusers: 200, paidpercent: 50 }];
		expect(toTableBase(visitors)).toEqual(result);
	});
});

describe('formatForTopRegions', () => {
	it('should return {} on empty data', () => {
		const country = {};

		const result = {};
		expect(formatForTopRegions(country)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const country = {
			data: [{ dimensions: [{ name: 'test' }], metrics: [] }],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = { countriesColors: { Unknown: '#f00' }, countriesCounts: { Unknown: 0 } };
		expect(formatForTopRegions(country)).toEqual(result);
	});

	it('should return metric in array', () => {
		const country = {
			data: [{ dimensions: [{ name: 'RU' }], metrics: [[400], [200]] }],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = { countriesColors: { RUS: '#f00' }, countriesCounts: { RUS: 400 } };
		expect(formatForTopRegions(country)).toEqual(result);
	});
});

describe('formatForTopDevices', () => {
	it('should return {} on empty data', () => {
		const devices = {};

		const result = [];
		expect(formatForTopDevices(devices)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const country = {
			data: [{ dimensions: [], metrics: [] }],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = { arrayChart: [0], arrayLabels: ['Unknown'] };
		expect(formatForTopDevices(country)).toEqual(result);
	});

	it('should return metric in array', () => {
		const country = {
			data: [{ dimensions: [{ name: 'RU' }], metrics: [[400], [200]] }],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = { arrayChart: [400], arrayLabels: ['RU'] };
		expect(formatForTopDevices(country)).toEqual(result);
	});
});

describe('formatForTopChannel', () => {
	it('should return {} on empty data', () => {
		const devices = {};

		const result = [];
		expect(formatForTopChannel(devices)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const country = {
			data: [{ dimensions: [], metrics: [] }],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = { arrayChart: [0], arrayLabels: ['Unknown'] };
		expect(formatForTopChannel(country)).toEqual(result);
	});

	it('should return metric in array', () => {
		const country = {
			data: [{ dimensions: [{ name: 'RU' }], metrics: [[400], [200]] }],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = { arrayChart: [400], arrayLabels: ['RU'] };
		expect(formatForTopChannel(country)).toEqual(result);
	});
});

describe('formatForTopProfitability', () => {
	it('should return {} on empty data', () => {
		const profitability = {};

		const result = [];
		expect(formatForTopProfitability(profitability)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const profitability = {
			totals: [[], []],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = { arrayChart: [[]], arrayLabels: [], average: '0' };
		expect(formatForTopProfitability(profitability)).toEqual(result);
	});

	it('should return metric in array', () => {
		const profitability = {
			totals: [[400], [200]],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = { arrayChart: [[50]], arrayLabels: ['19-02-26'], average: '50' };
		expect(formatForTopProfitability(profitability)).toEqual(result);
	});
});

describe('formatForTopVisitors', () => {
	it('should return {} on empty data', () => {
		const profitability = {};

		const result = [];
		expect(formatForTopVisitors(profitability)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const profitability = {
			totals: [[], []],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const result = { arrayChart: [[], []], arrayLabels: [] };
		expect(formatForTopVisitors(profitability)).toEqual(result);
	});

	it('should return metric in array', () => {
		const profitability = {
			totals: [[400], [200]],
			labels: ['2019-02-26T00:00:00'],
		};
		const result = { arrayChart: [[400], [200]], arrayLabels: ['19-02-26'] };
		expect(formatForTopVisitors(profitability)).toEqual(result);
	});
});

describe('formatForTopCounters', () => {
	it('should return {} on empty data', () => {
		const topCounters = {};

		const result = [];
		expect(formatForTopCounters(topCounters)).toEqual(result);
	});

	it('should return array with correct data', () => {
		const topCounters = {
			data: [{ dimensions: [{ name: 'RU' }], metrics: [] }],
			labels: ['123asd', 'asdasdas', 'zxczxc'],
		};
		const counters = [{ counter: 'user', name: '123123' }];
		const result = { arrayChart: [0], arrayLabels: ['RU'] };
		expect(formatForTopCounters(topCounters, counters)).toEqual(result);
	});

	it('should return metric in array', () => {
		const topCounters = {
			data: [{ dimensions: [{ name: 'RU' }], metrics: [[400], [200]] }],
			labels: ['2019-02-26T00:00:00'],
		};
		const counters = [{ counter: 'user', name: '123123' }];
		const result = { arrayChart: [200], arrayLabels: ['RU'] };
		expect(formatForTopCounters(topCounters, counters)).toEqual(result);
	});
});

describe('getName', () => {
	it('should return {} on empty data', () => {
		const id = '';
		const counters = [];

		const result = 'Unknown';
		expect(getName(id, counters)).toEqual(result);
	});

	it('should return UBX-13212312', () => {
		const id = 'UBX-13212312';
		const counters = [{ counter: 'user', name: '123123' }];
		expect(getName(id, counters)).toEqual(id);
	});

	it('should return metric in array', () => {
		const id = 'UBX-13212312';
		const counters = [{ counter: 'UBX-13212312', name: '123123' }];
		const result = '123123';
		expect(getName(id, counters)).toEqual(result);
	});
});
