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
import { Button, CustomInput } from 'reactstrap';

const getRowId = row => row.id;
const blockedDomainFormatter = ({ value, row }, props) => (
	<div>
		<CustomInput type="checkbox" id={row.id} />
	</div>
);
const BlockedDomainProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => blockedDomainFormatter(fileProps, props)} {...props} />
);
const CTRFormatter = ({ value, row }, props) => <div>{row.CTR}%</div>;
const CTRProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => CTRFormatter(fileProps, props)} {...props} />
);
const TotalFormatter = ({ value, row }, props) => <div>${row.total}</div>;
const TotalProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => TotalFormatter(fileProps, props)} {...props} />
);
const CostFormatter = ({ value, row }, props) => <div>${row.total}</div>;
const CostProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => CostFormatter(fileProps, props)} {...props} />
);
class TrafficTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 50,
			pageSizes: [5, 10, 15, 50, 100],
			blockedDomainColumn: ['blockedDomain'],
			CTRColumn: ['CTR'],
			totalColumn: ['total'],
			costColumn: ['cost'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	render() {
		const { sorting, currentPage, pageSize, pageSizes } = this.state;
		const { data, columns, pagination, grouping, search, exportTable, network } = this.props;
		const ToolbarRootBase = ({ classes, className, ...restProps }) => (
			<Toolbar.Root {...restProps}>
				<div style={{ marginLeft: '0px' }}>
					<Button size="sm" color="info">
						{network ? 'Block network' : 'Block domain'}
					</Button>
				</div>
				<div style={{ marginLeft: 'auto' }}>
					<Button size="sm" color="success">
						CSV
					</Button>
					<Button size="sm" color="success" className="button-margin-left-10">
						XML
					</Button>
				</div>
			</Toolbar.Root>
		);
		return (
			<div className="table__card trafficsource">
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
						<BlockedDomainProvider for={this.state.blockedDomainColumn} {...this.props} />
						<CTRProvider for={this.state.CTRColumn} {...this.props} />
						<TotalProvider for={this.state.totalColumn} {...this.props} />
						<CostProvider for={this.state.costColumn} {...this.props} />
						<Table />
						<TableHeaderRow showSortingControls />
						<Toolbar {...exportTable && { rootComponent: ToolbarRootBase }} />
						{search && <SearchPanel />}
						{grouping && <TableGroupRow />}
						{pagination && <PagingPanel pageSizes={pageSizes} />}
					</Grid>
				)}
			</div>
		);
	}
}

TrafficTable.propTypes = {
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
};

export default TrafficTable;
