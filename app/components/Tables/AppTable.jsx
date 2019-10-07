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
	SearchState,
	IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
	Grid,
	Table,
	TableHeaderRow,
	PagingPanel,
	TableGroupRow,
	SearchPanel,
	Toolbar, GroupingPanel,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, Input, FormGroup, Label, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

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
			addUser: null,
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	render() {
		const { sorting, currentPage, pageSize, pageSizes } = this.state;
		const { data, columns, pagination, grouping, search, exportTable, addUser, pSize } = this.props;
		const ToolbarRootBase = ({ classes, className, ...restProps }) => (
			<Toolbar.Root {...restProps}>
				<div style={{ marginLeft: 'auto' }}>
					<Button size="sm" color="success">
						CSV
					</Button>
					<Button size="sm" color="success" className="button-margin-left-10">
						PDF
					</Button>
					<Button size="sm" color="success" className="button-margin-left-10">
						XLS
					</Button>
				</div>
			</Toolbar.Root>
		);
		const ToolbarUserBase = ({ classes, className, ...restProps }) => (
			<Toolbar.Root {...restProps}>
				<div>
					<Button color="success" onClick={() => this.props.addUser()}>
						Add user
					</Button>
				</div>
			</Toolbar.Root>
		);
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={columns}>
						<PagingState
							currentPage={currentPage}
							onCurrentPageChange={this.changeCurrentPage}
							pageSize={pSize || pageSize}
							onPageSizeChange={this.changePageSize}
							getRowId={getRowId}
						/>
						<SortingState sorting={sorting} onSortingChange={this.changeSorting} />
						{search && <SearchState />}
						<IntegratedFiltering />
						<IntegratedSorting />
						<IntegratedPaging />
						{grouping && (
							<GroupingState
								grouping={[
									{
										columnName:
											grouping !== 'date' && typeof grouping === 'string' ? grouping : 'date',
									},
								]}
								defaultExpandedGroups={[moment().format('YYYY-MM-DD')]}
							/>
						)}
						{grouping && <IntegratedGrouping />}
						<Table noData="213123" />
						<TableHeaderRow showSortingControls />
						<Toolbar
							{...(exportTable && { rootComponent: ToolbarRootBase }) ||
								(addUser && { rootComponent: ToolbarUserBase })}
						/>
						{grouping && <GroupingPanel showSortingControls />}
						{search && <SearchPanel />}
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
	search: PropTypes.bool,
	pagination: PropTypes.bool.isRequired,
	className: PropTypes.string,
	export: PropTypes.bool,
	addUser: PropTypes.func,
};

export default AppTable;
