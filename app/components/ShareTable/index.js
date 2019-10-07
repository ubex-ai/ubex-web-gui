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
	Toolbar,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { Button, Modal, ModalHeader, ModalBody, Input, FormGroup, Label, ModalFooter } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

const getRowId = row => row.id;

function findElement(arr, sing) {
	for (let i = 0; i < arr.length; i++) {
		const element = arr[i];
		if (element.id === sing) {
			return i + 1;
		}
	}
	return 0;
}

const IDFormatter = ({ value, row }, props) => findElement(props.data, value);
const DateFormatter = ({ value, row }, props) => moment(value).format('DD.MM.YYYY HH:mm');
const ActionsFormatter = ({ value, row }, props) => (
	<span>
		<Button
			key="remove"
			onClick={() => props.removeSharedOwner(row.id)}
			className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
		>
			<i className="far fa-trash" />
		</Button>
	</span>
);

const ActionsProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => ActionsFormatter(fileProps, props)} {...props} />
);

const DateProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => DateFormatter(fileProps, props)} {...props} />
);

const PermissionsFormatter = ({ value, row }, props) => {
	const className = classnames(
		{ badge: true },
		{ 'badge-warning': value === 'write' },
		{ 'badge-success': value === 'read' },
	);
	return (
		<div className={className} style={{ borderRadius: '5px' }}>
			{value === 'write' ? 'Editing' : 'View only'}
		</div>
	);
};

const PermissionsProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => PermissionsFormatter(fileProps, props)} {...props} />
);

const IDProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => IDFormatter(fileProps, props)} {...props} />
);

class AppTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 50,
			pageSizes: [5, 10, 15, 50, 100],
			dateColumn: ['created'],
			actionsColumn: ['actions'],
			permColumn: ['perm'],
			idColumn: ['id'],
			addUser: null,
		};
		this.columnWidths = [
			{ columnName: 'id', width: 60 },
			{ columnName: 'username', width: 'auto' },
			{ columnName: 'perm', width: 110 },
			{ columnName: 'created', width: 160 },
			{ columnName: 'comment', width: 'auto' },
			{ columnName: 'actions', width: 'auto' },
		];
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	render() {
		const {
			sorting,
			currentPage,
			pageSize,
			pageSizes,
			actionsColumn,
			permColumn,
			idColumn,
			dateColumn,
		} = this.state;
		const { data, columns, pagination, grouping, search, exportTable, addUser, permissions } = this.props;
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
					{permissions && (
						<Button color="success" onClick={() => this.props.addUser()}>
							Add user
						</Button>
					)}
				</div>
			</Toolbar.Root>
		);
		return (
			<div className="table__card creative_list share_list">
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
						<IDProvider for={idColumn} {...this.props} />
						<ActionsProvider for={actionsColumn} {...this.props} />
						<DateProvider for={dateColumn} {...this.props} />
						<PermissionsProvider for={permColumn} {...this.props} />
						<Table columnExtensions={this.columnWidths} />
						<TableHeaderRow showSortingControls />
						<Toolbar
							{...((exportTable && { rootComponent: ToolbarRootBase }) ||
								(addUser && { rootComponent: ToolbarUserBase }))}
						/>
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
