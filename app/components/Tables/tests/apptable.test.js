import React from 'react';
import { shallow, mount } from 'enzyme';
import AppTable from '../AppTable';

describe('AppTable', () => {
	it('should render based on passed in props', () => {
		const dataTable = [
			{
				status: 'DEMO',
				time: '23.12.18 10:17',
				method: 'ETH Deposit',
				amount: '0.1 ETH',
				txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
			},
		];
		const columnsTable = [
			{ name: 'status', title: 'Status' },
			{ name: 'time', title: 'Time' },
			{ name: 'method', title: 'Method' },
			{ name: 'amount', title: 'Amount' },
			{ name: 'txid', title: 'TxID' },
		];
		const grouping = true;
		const pagination = false;
		const tree = mount(
			<AppTable
				className="custom-class"
				data={dataTable}
				columns={columnsTable}
				grouping={grouping}
				pagination={pagination}
			/>,
		);

		expect(tree.find('table')).toBeTruthy();
	});
});
