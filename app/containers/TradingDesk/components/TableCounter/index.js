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
	TableColumnResizing,
} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, SearchPanel, Toolbar } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
const DateFormatter = ({ value }) =>
	value
		? moment(value)
				.local()
				.format('DD.MM.YY HH:mm:ss')
		: '';

const StatusFormatter = ({ value, row }, props) => {
	const isOnline = props.isOnline(row.counter);
	return isOnline && isOnline.is_online ? (
		<span className="badge badge-success" style={{ borderRadius: '5px' }}>
			Online
		</span>
	) : (
		<span className="badge badge-danger" style={{ borderRadius: '5px' }}>
			Offline
		</span>
	);
};

const SettingsFormatter = ({ value, row }, props) => {
	const counterData = props.data.find(c => c.id === value);

	return (
		<span>
			{[
				<Button
					key="code"
					onClick={() => props.onClickGetCode(value)}
					className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
				>
					<i className="far fa-code" />
				</Button>,
				(row.sharing && !row.sharing.shared) ||
				(row.sharing && row.sharing.shared && row.sharing.perm === 'write') ? (
					<Link
						key="edit"
						to={`/app/counter/${value}`}
						className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
					>
						<i className="far fa-edit" />
					</Link>
				) : null,
				row.sharing && !row.sharing.shared ? (
					<Button
						key="share"
						className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
						onClick={() => props.shareCounter(value)}
					>
						<i className="far fa-share" />
					</Button>
				) : null,
				row.sharing && !row.sharing.shared ? (
					<Link
						key="remove"
						to="/app/counters/list"
						onClick={() => props.onClickRemoveEntry(value)}
						className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
					>
						<i className="fal fa-trash" />
					</Link>
				) : null,
			]}
		</span>
	);
};

const getRowId = row => row.id;

const StatusProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => StatusFormatter(fCProps, props)} {...props} />
);
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
				/* { name: 'visitors', title: 'Visitors (Today)' }, */
				{ name: 'id', title: 'Settings' },
			],
			columnWidths: [
				{ columnName: 'is_online', width: 100 },
				{ columnName: 'name', width: 'auto' },
				{ columnName: 'counter', width: 'auto' },
				{ columnName: 'created', width: 160 },
				{ columnName: 'id', width: 'auto' },
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
			columnWidths,
		} = this.state;
		const { data } = this.props;
		this.setColumnWidths = columnWidths => {
			this.setState({ columnWidths });
		};
		return (
			<div className="table__card counter_list">
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
						<StatusProvider for={statusColumn} {...this.props} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<Table columnExtensions={columnWidths} />
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

TableCounter.propTypes = {
	data: PropTypes.array.isRequired,
};

export default TableCounter;
