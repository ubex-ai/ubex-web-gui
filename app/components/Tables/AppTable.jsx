import React from 'react';
import PropTypes from 'prop-types';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
	GroupingState,
	IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableGroupRow } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';

const getRowId = row => row.id;

class AppTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 50,
			pageSizes: [5, 10, 15, 50, 100],
			dateColumn: ['date'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	render() {
		const { sorting, currentPage, pageSize, pageSizes } = this.state;
		const { data, columns, pagination, grouping } = this.props;
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={columns}>
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
						{grouping && (
							<GroupingState
								grouping={[{ columnName: 'date' }]}
								defaultExpandedGroups={[moment().format('YYYY-MM-DD')]}
							/>
						)}
						{grouping && <IntegratedGrouping />}
						<Table />
						<TableHeaderRow showSortingControls />
						{grouping && <TableGroupRow />}
						{pagination && <PagingPanel pageSizes={pageSizes} />}
					</Grid>
				)}
			</div>
		);
	}
}

AppTable.propTypes = {
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
		}).isRequired,
	).isRequired,
	data: PropTypes.array.isRequired,
	grouping: PropTypes.bool,
	pagination: PropTypes.bool.isRequired,
	className: PropTypes.string,
};

export default AppTable;
