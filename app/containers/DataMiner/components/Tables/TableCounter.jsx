import React from 'react';
import { Link } from 'react-router-dom';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
	SearchState,
	IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, SearchPanel, Toolbar } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { Button } from 'reactstrap';

/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD-MM-YYYY hh:mm:ss');

const StatusFormatter = ({ value }) =>
	value ? (
		<span className="badge badge-success">
			<i className="fa fa-thumbs-up" /> Online
		</span>
	) : (
		<span className="badge badge-danger">
			<i className="fa fa-times" /> Offline
		</span>
	);

const SettingsFormatter = ({ value }, props) => {
	const counterData = props.data.find(c => c.id === value);

	return (
		<span>
			{!counterData.loading
				? [
					<Button
						key="code"
						onClick={() => props.onClickGetCode(value)}
						className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
					>
						<i className="fas fa-code" />
					</Button>,
					<Link
						key="edit"
						to={`/app/counter/${value}`}
						className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"
					>
						<i className="fas fa-edit" />
					</Link>,
					<Link
						key="remove"
						to="/app/counters/list"
						onClick={() => props.onClickRemoveEntry(value)}
						className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
					>
						<i className="fas fa-trash" />
					</Link>,
				  ]
				: 'loading'}
		</span>
	);
};

const getRowId = row => row.id;

const StatusProvider = props => <DataTypeProvider formatterComponent={StatusFormatter} {...props} />;
const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
const SettingsProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => SettingsFormatter(fCProps, props)} {...props} />
);

class TableCounter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'is_online', title: 'Status' },
				{ name: 'name', title: 'Name' },
				{ name: 'counter', title: 'Counter ID' },
				{ name: 'created', title: 'Created at' },
				{ name: 'visitors', title: 'Visitors' },
				{ name: 'paid_visitors', title: 'Paid visitors' },
				{ name: 'paid_percent', title: 'Paid %' },
				{ name: 'id', title: 'Settings' },
			],
			sorting: [{ columnName: 'is_online', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			dateColumn: ['created'],
			statusColumn: ['is_online'],
			settingsColumn: ['id'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	changeSearchValue(searchValue) {
		this.setState({
			loading: true,
			searchValue,
		});
	}

	render() {
		const {
			sorting,
			columns,
			currentPage,
			pageSize,
			pageSizes,
			dateColumn,
			statusColumn,
			settingsColumn,
		} = this.state;
		const { data } = this.props;
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={columns}>
						<SearchState />
						<IntegratedFiltering />
						<PagingState
							currentPage={currentPage}
							onCurrentPageChange={this.changeCurrentPage}
							pageSize={pageSize}
							onPageSizeChange={this.changePageSize}
							getRowId={getRowId}
						/>
						<SortingState sorting={sorting} onSortingChange={this.changeSorting} />
						<IntegratedSorting />
						<IntegratedPaging />
						<DateTypeProvider for={dateColumn} />
						<StatusProvider for={statusColumn} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<Table />
						<TableHeaderRow showSortingControls />
						<PagingPanel pageSizes={pageSizes} />
						<Toolbar />
						<SearchPanel />
					</Grid>
				)}
			</div>
		);
	}
}

export default TableCounter;
