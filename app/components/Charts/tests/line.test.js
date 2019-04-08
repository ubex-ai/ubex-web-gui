import React from 'react';
import { shallow } from 'enzyme';
import LineChart from '../Line';

describe('LineChart', () => {
	it('should render based on passed in props', () => {
		const datasetsData = {
			arrayChart: [[1, 123, 12938912, 1237, 281], [123123, 123569, 834828, 8384828, 182]],
			arrayLabels: ['test', 'asd', '123esadc', '123asd', 'skzjlkasjdlkasjlkj'],
		};
		const height = 300;
		const legend = true;
		const settings = false;
		const wrapper = shallow(<LineChart data={datasetsData} settings={settings} height={height} legend={legend} />);

		// expect(wrapper.find('Line').props().data).toEqual(datasetsData);
		// expect(wrapper.find('Line').props().settings).toEqual(settings);
		// expect(wrapper.find('Line').props().height).toEqual(height);
		// expect(wrapper.find('Line').props().legend).toEqual(legend);

		expect(wrapper.find('canvas')).toBeTruthy();
	});
});
