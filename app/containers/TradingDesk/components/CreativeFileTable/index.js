/**
 *
 * CreativeFileTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
} from '@devexpress/dx-react-grid';
import { Button, Input, FormGroup } from 'reactstrap';
import {
	Grid,
	Table,
	TableHeaderRow,
	PagingPanel,
	TableColumnResizing,
	TableFixedColumns,
} from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import CreativeBannerShape from '../../shapes/CreativeBanner';
import messages from '../../messages';

const FileFormatter = ({ value, row }, props) => {
	let entry;
	if (props.data) {
		entry = props.data.find(c => c.file === value);
	}
	return (
		<div>
			{entry.status === 'moderation' && (
				<i className="icon-status__table fas fa-exclamation icon-xs icon-rounded icon-warning" />
			)}
			{value}
		</div>
	);
};

const AdSizeFormatter = ({ value, row }, props) => {
	let entry;
	if (props.data) {
		entry = props.data.find(c => c.file === value);
	}
	return (
		<Input type="select" name="select">
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
		</Input>
	);
};
const MetricsFormatter = ({ value, row }, props) => <Input type="text" />;

const FormatFormatter = ({ value, row }, props) => (
	<FormGroup>
		<Input type="select" name="select" id="exampleSelect">
			<option>1</option>
			<option>2</option>
			<option>3</option>
			<option>4</option>
			<option>5</option>
		</Input>
	</FormGroup>
);
const LinkFormatter = ({ value }) => {
	if (value) {
		return (
			<a
				href={value}
				target="_blank"
				key="code"
				className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-link" />
			</a>
		);
	}
	return <Input type="text" />;
};

const PreviewFormatter = ({ value, row }, props) => (
	<Button
		key="code"
		className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
		onClick={() => props.onClickGetCode(value)}
	>
		<i className="fas fa-file-image" />
	</Button>
);

const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD-MM-YYYY hh:mm:ss');

const SettingsFormatter = ({ value, row }, props) => {
	if (props.data) {
		const entry = props.data.find(c => c.id === value);
		if (entry.loading) {
			return <span>loading</span>;
		}
	}
	return (
		<span>
			<Button
				key="remove"
				onClick={() => props.onClickRemoveEntry(value)}
				className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-trash" />
			</Button>
		</span>
	);
};

const getRowId = row => row.id;
const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
const FileProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => FileFormatter(fileProps, props)} {...props} />
);
const AdSizeProvider = props => (
	<DataTypeProvider formatterComponent={sizeProps => AdSizeFormatter(sizeProps, props)} {...props} />
);
const MetricsProvider = props => (
	<DataTypeProvider formatterComponent={metricsProps => MetricsFormatter(metricsProps, props)} {...props} />
);
const FormatProvider = props => (
	<DataTypeProvider formatterComponent={formatsProps => FormatFormatter(formatsProps, props)} {...props} />
);
const LinkProvider = props => <DataTypeProvider formatterComponent={LinkFormatter} {...props} />;
const PreviewProvider = props => (
	<DataTypeProvider formatterComponent={previewProps => PreviewFormatter(previewProps, props)} {...props} />
);
const SettingsProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => SettingsFormatter(fCProps, props)} {...props} />
);

class CreativeFileTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'format', title: this.props.intl.formatMessage(messages.format) },
				{ name: 'adSize', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'metrics', title: this.props.intl.formatMessage(messages.otherTracking) },
				{ name: 'preview', title: this.props.intl.formatMessage(messages.preview) },
				{ name: 'id', title: ' ' },
			],
			columnWidths: [
				{ columnName: 'upload_name', width: 200 },
				{ columnName: 'format', width: 200 },
				{ columnName: 'adSize', width: 200 },
				{ columnName: 'link', width: 400 },
				{ columnName: 'metrics', width: 300 },
				{ columnName: 'preview', width: 150 },
				{ columnName: 'id', width: 60 },
			],
			columnsVideo: [
				{ name: 'file', title: this.props.intl.formatMessage(messages.filename) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'quality', title: this.props.intl.formatMessage(messages.quality) },
				{ name: 'ratio', title: this.props.intl.formatMessage(messages.aspectRatio) },
				{ name: 'length', title: this.props.intl.formatMessage(messages.videoLength) },
				{ name: 'mime', title: this.props.intl.formatMessage(messages.mime) },
				{ name: 'protocol', title: this.props.intl.formatMessage(messages.protocol) },
				{ name: 'id', title: ' ' },
			],
			columnVideoWidths: [
				{ columnName: 'file', width: 100 },
				{ columnName: 'quality', width: 100 },
				{ columnName: 'ratio', width: 100 },
				{ columnName: 'length', width: 100 },
				{ columnName: 'mime', width: 400 },
				{ columnName: 'protocol', width: 400 },
				{ columnName: 'link', width: 400 },
				{ columnName: 'id', width: 60 },
			],
			rightColumns: ['id'],
			leftColumns: ['file'],
			sorting: [{ columnName: 'created', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			fileColumn: ['file'],
			linkColumn: ['link'],
			adSizeColumn: ['adSize'],
			formatColumn: ['format'],
			dateColumn: ['updated'],
			settingsColumn: ['id'],
			previewColumn: ['preview'],
			metricsColumn: ['metrics'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });

		this.changeColumnWidths = columnWidths => {
			this.setState({ columnWidths });
		};
	}

	render() {
		const {
			sorting,
			columns,
			currentPage,
			pageSize,
			pageSizes,
			dateColumn,
			linkColumn,
			settingsColumn,
			previewColumn,
			fileColumn,
			adSizeColumn,
			columnWidths,
			metricsColumn,
			rightColumns,
			leftColumns,
			columnsVideo,
			columnsVideoWidths,
			formatColumn,
		} = this.state;
		const { data, type } = this.props;
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={type === 'video' ? columnsVideo : columns}>
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
						{type !== 'video' && <AdSizeProvider for={adSizeColumn} {...this.props} />}
						<FileProvider for={fileColumn} {...this.props} />
						<LinkProvider for={linkColumn} />
						{type === 'display' && <FormatProvider for={formatColumn} {...this.props} />}
						{type !== 'video' && <PreviewProvider for={previewColumn} {...this.props} />}
						{type !== 'video' && <MetricsProvider for={metricsColumn} {...this.props} />}
						{type !== 'video' && <DateTypeProvider for={dateColumn} />}
						<SettingsProvider for={settingsColumn} {...this.props} />
						<Table />
						<TableColumnResizing
							defaultColumnWidths={type === 'video' ? columnsVideoWidths : columnWidths}
							onColumnWidthsChange={this.changeColumnWidths}
						/>
						<TableHeaderRow showSortingControls />
						<TableFixedColumns leftColumns={leftColumns} rightColumns={rightColumns} />
						<PagingPanel pageSizes={pageSizes} />
					</Grid>
				)}
			</div>
		);
	}
}

CreativeFileTable.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape(CreativeBannerShape),
		// PropTypes.shape({
		// 	site: PropTypes.string,
		// 	earnings: PropTypes.number,
		// 	pageViews: PropTypes.number,
		// 	clicks: PropTypes.number,
		// }),
	).isRequired,
	inventoryType: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(CreativeFileTable);
