import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
class StatsTable extends React.Component {
	render() {
		const data = [
			{
				date: '12.12.2012',
				visitors: 500,
				reward: 100,
				reward_percent: 20,
			},
			{
				date: '12.11.2016',
				visitors: 7802,
				reward: 587,
				reward_percent: 13,
			},
		];

		const columns = [
			{
				Header: 'Date',
				accessor: 'date', // String-based value accessors!
			},
			{
				Header: 'TopSites',
				accessor: 'visitors', // String-based value accessors!
			},
			{
				Header: props => (
					<div>
						<span>Reward visitors</span>
						<i className="far fa-question-circle buttonPopoverLil" id="Popover5" />
					</div>
				),
				accessor: 'reward', // String-based value accessors!
			},
			{
				Header: props => (
					<div>
						<span>% reward</span>
						<i className="far fa-question-circle buttonPopoverLil" id="Popover5" />
					</div>
				),
				accessor: 'reward_percent', // String-based value accessors!
			},
		];

		return (
			<div className="table-worker">
				<ReactTable
					data={data}
					columns={columns}
					defaultPageSize={10}
					className="table-responsive -striped -highlight"
				/>
			</div>
		);
	}
}

export default StatsTable;
