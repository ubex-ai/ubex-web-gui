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
import { Button, Input, FormGroup, Row, Col } from 'reactstrap';
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
import InlineEditField from 'components/InlineEditField';
import TableInput from 'components/TableInput';
import validateDomain from 'utils/validateDomain';
import messages from '../../messages';
import CreativeBannerShape from '../../shapes/CreativeBanner';
import IntlFieldGroup from 'components/IntlFieldGroup';

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
	return (
		<Input type="select" name="adSize" onChange={e => props.adSizeChange(row.id, e.target.value)} invalid={!row.ad_size}>
			{!row.ad_size && <option>Select Ad Size</option>}
			{props.adSize.map(size => (
				<option value={size.value} selected={size.value === row.ad_size}>
					{size.label}
				</option>
			))}
		</Input>
	);
};
const MetricsFormatter = ({ value, row }, props) => (
	<TableInput
		value={row.tracking_js}
		onSave={val => {
			props.changeBannerURL(row.id, { tracking_js: val }, 'Other tracking');
		}}
	/>
);

const LinkFormatter = ({ value, row }, props) => (
	<TableInput
		value={row.callback_url}
		validation={val => validateDomain(val)}
		onSave={val => {
			props.changeBannerURL(row.id, { callback_url: val }, 'Click URL');
		}}
	/>
);

const PreviewFormatter = ({ value, row }, props) => (
	<Button
		key="code"
		className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
		onClick={() => props.onClickGetCode(row.aws_s3_location)}
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
				onClick={() => props.removeBanner(row.id)}
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
const LinkProvider = props => (
	<DataTypeProvider formatterComponent={metricsProps => LinkFormatter(metricsProps, props)} {...props} />
);
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
				{ name: 'preview', title: ' ' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'mimetype', title: this.props.intl.formatMessage(messages.format) },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'metrics', title: this.props.intl.formatMessage(messages.otherTracking) },
				{ name: 'id', title: ' ' },
			],
			columnWidths: [
				{ columnName: 'upload_name', width: 200 },
				{ columnName: 'mimetype', width: 200 },
				{ columnName: 'ad_size', width: 200 },
				{ columnName: 'link', width: 400 },
				{ columnName: 'metrics', width: 300 },
				{ columnName: 'preview', width: 60 },
				{ columnName: 'id', width: 60 },
			],
			columnsVideo: [
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.filename) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'quality', title: this.props.intl.formatMessage(messages.quality) },
				{ name: 'ratio', title: this.props.intl.formatMessage(messages.aspectRatio) },
				{ name: 'length', title: this.props.intl.formatMessage(messages.videoLength) },
				{ name: 'mimetype', title: this.props.intl.formatMessage(messages.mime) },
				{ name: 'protocol', title: this.props.intl.formatMessage(messages.protocol) },
				{ name: 'id', title: ' ' },
			],
			columnVideoWidths: [
				{ columnName: 'file', width: 100 },
				{ columnName: 'quality', width: 100 },
				{ columnName: 'ratio', width: 100 },
				{ columnName: 'length', width: 100 },
				{ columnName: 'mimetype', width: 400 },
				{ columnName: 'protocol', width: 400 },
				{ columnName: 'link', width: 400 },
				{ columnName: 'id', width: 60 },
			],
			rightColumns: ['id'],
			leftColumns: ['preview'],
			sorting: [{ columnName: 'upload_name', direction: 'asc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			fileColumn: ['file'],
			linkColumn: ['link'],
			adSizeColumn: ['ad_size'],
			formatColumn: ['mimetype'],
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
						<LinkProvider for={linkColumn} {...this.props} />
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
