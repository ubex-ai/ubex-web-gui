/**
 *
 * CreativesTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
} from '@devexpress/dx-react-grid';
import { Button } from 'reactstrap';
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
import _ from 'lodash';

const FileFormatter = ({ value, row }, props) => {
	let entry;
	if (props.data) {
		entry = props.data.find(c => c.upload_name === value);
	}
	if (!entry) {
		throw new Exception('no upload name for banner file!');
	}
	return (
		<div>
			{row.ad_size && row.callback_url ? null : (
				<i
					className="icon-status__table fas fa-exclamation icon-xs icon-rounded icon-warning"
					title="Moderation"
				/>
			)}
			<a
				href="#"
				onClick={e => {
					e.preventDefault();
					props.onClickGetCode(row.type === 'native_image' ? row.files : row.aws_s3_location);
				}}
			>
				{value}
			</a>
		</div>
	);
};

const getAdName = (id, sizes) => {
	return _.result(
		_.find(sizes, function(obj) {
			return obj.value === id;
		}),
		'label',
	);
};
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
		onClick={() => props.onClickGetCode(row.type === 'natimve_image' ? row.files : value)}
	>
		<i className="fas fa-file-image" />
	</Button>
);

const DateFormatter = ({ value, row }, props) =>
	moment(row.created)
		.local()
		.format('DD-MM-YYYY HH:mm');

const AdSizeFormatter = ({ value, row }, props) => {
	return getAdName(row.ad_size, props.adSize) ? (
		<div>{getAdName(row.ad_size, props.adSize)}</div>
	) : (
		<Link to={`/app/creative/${props.inventoryType}/${props.creativeId}/`}>Select Ad Size</Link>
	);
};

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
const DateTypeProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => DateFormatter(fileProps, props)} {...props} />
);
const AdSizeProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => AdSizeFormatter(fileProps, props)} {...props} />
);
const FileProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => FileFormatter(fileProps, props)} {...props} />
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

class CreativesTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			sorting: [{ columnName: 'upload_name', direction: 'asc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			fileColumn: ['upload_name'],
			linkColumn: ['callback_url'],
			dateColumn: ['created'],
			adSizeColumn: ['ad_size'],
			settingsColumn: ['id'],
			previewColumn: ['aws_s3_location'],
			rightColumns: ['id'],
			leftColumns: ['preview'],
		};
		this.columns = {
			native: [
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
			],
			other: [
				{ name: 'created', title: 'Created' },
				{ name: 'name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
			],
			video: [
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'id', title: ' ' },
			],
			display: [
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'id', title: ' ' },
			],
		};
		this.columnWidths = [
			{ columnName: 'created', width: 160 },
			{ columnName: 'upload_name', width: 'auto' },
			{ columnName: 'callback_url', width: 'auto' },
			{ columnName: 'name', width: 400 },
			{ columnName: 'id', width: 60 },
			{ columnName: 'ad_size', width: 'auto' },
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
			dateColumn,
			linkColumn,
			settingsColumn,
			previewColumn,
			fileColumn,
			adSizeColumn,
		} = this.state;
		const { data, inventoryType } = this.props;
		const { columns } = this;
		this.changeColumnWidths = columnWidths => {
			this.setState({ columnWidths });
		};
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={columns[inventoryType]}>
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
						<AdSizeProvider for={adSizeColumn} {...this.props} />
						<FileProvider for={fileColumn} {...this.props} />
						<LinkProvider for={linkColumn} {...this.props} />
						<PreviewProvider for={previewColumn} {...this.props} />
						<DateTypeProvider for={dateColumn} {...this.props} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<Table />
						<TableColumnResizing
							defaultColumnWidths={this.columnWidths}
							onColumnWidthsChange={this.changeColumnWidths}
						/>
						<TableHeaderRow showSortingControls />
						<TableFixedColumns rightColumns={this.state.rightColumns} />
						<PagingPanel pageSizes={pageSizes} />
					</Grid>
				)}
			</div>
		);
	}
}

CreativesTable.propTypes = {
	data: PropTypes.array.isRequired,
	inventoryType: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(CreativesTable);
