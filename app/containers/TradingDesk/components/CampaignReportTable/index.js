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
	GroupingPanel,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { Button } from 'reactstrap';
import CsvExport from '../../../../components/CsvExport';
import ExcelExport from '../../../../components/ExcelExport';
import PdfExport from '../../../../components/PdfExport';

const getRowId = row => row.id;
const NameFormatter = ({ value, row }, props) =>
	props.getName && typeof props.getName === 'function' ? props.getName(row.name) : row.name;
const NameProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => NameFormatter(fileProps, props)} {...props} />
);
const DateFormatter = ({ value, row }, props) => moment(value).format('DD.MM.YYYY');
const DateProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => DateFormatter(fileProps, props)} {...props} />
);

const CTRFormatter = ({ value, row }, props) => <div>{row.CTR}%</div>;
const CTRProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => CTRFormatter(fileProps, props)} {...props} />
);
const WinrateFormatter = ({ value, row }, props) => <div>{row.winrate}%</div>;
const WinrateProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => WinrateFormatter(fileProps, props)} {...props} />
);
const SpentFormatter = ({ value, row }, props) => <div>${row.spend}</div>;
const SpentProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => SpentFormatter(fileProps, props)} {...props} />
);
const eCPMFormatter = ({ value, row }, props) => <div>${row.spend}</div>;
const ECPMProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => eCPMFormatter(fileProps, props)} {...props} />
);
class CampaignReportTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15, 50, 100],
			dateColumn: ['date'],
			nameColumn: ['name'],
			CTRColumn: ['CTR'],
			winrateColumn: ['winrate'],
			spendColumn: ['spend'],
			eCPMColumn: ['eCPM'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
	}

	getAdditionalId(id) {
		if (this.props.getGroupId && typeof this.props.getGroupId === 'function') {
			return this.props.getGroupId(id);
		}
		if (this.props.getCampaignId && typeof this.props.getCampaignId === 'function') {
			return this.props.getCampaignId(id);
		}
	}

	getAdditionalHeader() {
		if (this.props.getGroupId && typeof this.props.getGroupId === 'function') {
			return 'Group ID';
		}
		return '';
	}

	render() {
		const { sorting, currentPage, pageSize, pageSizes } = this.state;
		const { data, columns, pagination, grouping, search, exportTable } = this.props;
		const additionalHeader = this.getAdditionalHeader();
		const ToolbarRootBase = ({ children, classes, className, ...restProps }) => (
			<Toolbar.Root {...restProps}>
				<div className="toolbarWrapper">
					<div className="toolbarWrapper__children">{children}</div>
					<div className="toolbarWrapper__buttons">
						<CsvExport
							header={columns}
							data={data}
							filename="campaignReport"
							getName={name => this.props.getName(name)}
							additionalHeader={additionalHeader}
							additionalID={name => this.getAdditionalId(name)}
						/>
						<PdfExport
							header={columns}
							data={data}
							filename="campaignReport"
							getName={name => this.props.getName(name)}
							additionalHeader={additionalHeader}
							additionalID={name => this.getAdditionalId(name)}
						/>
						<ExcelExport
							header={columns}
							data={data}
							filename="campaignReport"
							getName={name => this.props.getName(name)}
							additionalHeader={additionalHeader}
							additionalID={name => this.getAdditionalId(name)}
						/>
					</div>
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
								grouping={[{ columnName: 'date' }]}
								getCellValue={e => console.log(e)}
								defaultExpandedGroups={[data.length ? data[data.length - 1].date : null]}
							/>
						)}
						{grouping && <IntegratedGrouping />}
						<DateProvider for={this.state.dateColumn} {...this.props} />
						<NameProvider for={this.state.nameColumn} {...this.props} />
						<CTRProvider for={this.state.CTRColumn} {...this.props} />
						<WinrateProvider for={this.state.winrateColumn} {...this.props} />
						<SpentProvider for={this.state.spendColumn} {...this.props} />
						<ECPMProvider for={this.state.eCPMColumn} {...this.props} />
						<Table />
						<TableHeaderRow showSortingControls />
						<Toolbar {...(exportTable && { rootComponent: ToolbarRootBase })} />
						{grouping && <GroupingPanel showSortingControls />}
						{/*search && <SearchPanel />*/}
						{grouping && <TableGroupRow />}
						{pagination && <PagingPanel pageSizes={pageSizes} />}
					</Grid>
				)}
			</div>
		);
	}
}

CampaignReportTable.propTypes = {
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

export default CampaignReportTable;
