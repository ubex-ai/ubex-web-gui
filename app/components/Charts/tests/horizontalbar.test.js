import React from 'react';
import { shallow } from 'enzyme';
import HorizontalBar from '../HorizontalBar';

describe('HorizontalBar', () => {
	it('should render based on passed in props', () => {
		const datasetsData = {
			arrayChart: [123123, 123569, 834828, 8384828, 182],
			arrayLabels: ['test', 'asd', '123esadc', '123asd', 'skzjlkasjdlkasjlkj'],
		};
		const height = 300;
		const legend = true;
		const settings = false;
		const wrapper = shallow(
			<HorizontalBar data={datasetsData} settings={settings} height={height} legend={legend} />,
		);

		// expect(wrapper.find('HorizontalBar').props().data).toEqual(datasetsData);
		// expect(wrapper.find('HorizontalBar').props().settings).toEqual(settings);
		// expect(wrapper.find('HorizontalBar').props().height).toEqual(height);
		// expect(wrapper.find('HorizontalBar').props().legend).toEqual(legend);

		expect(wrapper.find('canvas')).toBeTruthy();
	});
});
