/**
 *
 * CreativesTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
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
import TableInput from 'components/TableInput';
import validateDomain from 'utils/validateDomain';
import messages from '../../messages';
import classNames from 'classnames';

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
			<a
				href="#"
				onClick={e => {
					e.preventDefault();
					props.onClickGetCode(
						row.type === 'native_image' ? row.files : row.aws_s3_location,
						{ width: row.width, height: row.height },
						row.callback_url,
						row.upload_name,
					);
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
			return obj.id === id || obj.value === id;
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
		className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill"
		onClick={() => props.onClickGetCode(row.type === 'natimve_image' ? row.files : value)}
	>
		<i className="fas fa-file-image" />
	</Button>
);

const DateFormatter = ({ value, row }, props) =>
	moment(row.created)
		.local()
		.format('DD.MM.YY HH:mm');

const AdSizeFormatter = ({ value, row }, props) => {
	return getAdName(row.ad_size, props.adSize) ? (
		<div>{getAdName(row.ad_size, props.adSize)}</div>
	) : (
		<Link to={`/app/creative/${props.inventoryType}/${props.creativeId}/`} className="text-danger">
			Select Ad Size
		</Link>
	);
};

const ModerationFormatter = ({ value, row }, props) => {
	// ubex should be FIRST
	let filteredArray = [];
	if (value && Object.keys(value) && Object.keys(value).length) {
		filteredArray = Object.keys(value);
		const itemIndex = _.findIndex(filteredArray, 'ubex');
		filteredArray.splice(0, 0, filteredArray.splice(itemIndex, 1)[0]);
	}

	return (
		<div className="moderationTable">
			<div className="sspModeration">
				{filteredArray
					? filteredArray.map(key => {
							return (
								<div className={key}>
									<div
										className={classNames(
											{ badge: true },
											{ 'badge-danger': value[key] && value[key].moderation_status === 'denied' },
											{
												'badge-warning':
													value[key] && value[key].moderation_status === 'awaiting',
											},
											{
												'badge-success':
													value[key] && value[key].moderation_status === 'accepted',
											},
											{
												'badge-warning':
													value[key] && value[key].moderation_status === 'pending',
											},
											{
												'badge-danger':
													value[key] && value[key].moderation_status === 'moderation_error',
											},
											{ 'badge-success': value[key] && value[key].moderation_status === 'ready' },
											{
												'badge-warning':
													value[key] && value[key].moderation_status === 'moderation',
											},
											{
												'badge-warning':
													value[key] && value[key].moderation_status === 'moderation_state',
											},
										)}
										style={{ borderRadius: '5px' }}
										title={`Moderation: ${value[key] !== null ? value[key].moderation_status : ''}`}
										onClick={() =>
											value[key] === null ||
											(value[key].moderation_status === null &&
												value[key].moderation_errors === null)
												? props.moderationError({
														moderation_status: null,
														moderation_errors: ['No comment'],
												  })
												: props.moderationError(value[key])
										}
									>
										<span style={{ textTransform: 'capitalize' }}>{key}</span>
									</div>
								</div>
							);
					  })
					: null}
			</div>
		</div>
	);
};

const SettingsFormatter = ({ value, row }, props) => {
	if (props.data) {
		const entry = props.data.find(c => c.id === value);
		if (entry.loading) {
			return <span>loading</span>;
		}
	}
	return props.permissions ? (
		<Button
			key="remove"
			onClick={() => props.removeBanner(row.id)}
			className="m-portlet__nav-link btn m-btn m-btn--icon m-btn--icon-only m-btn--pill mr-0"
		>
			<i className="far fa-trash" />
		</Button>
	) : null;
};

const IDFormatter = ({ value, row }, props) => row.id;

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
const ModerationProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => ModerationFormatter(fCProps, props)} {...props} />
);
const IDProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => IDFormatter(fileProps, props)} {...props} />
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
			idColumn: ['idd'],
			moderationColumn: ['moderation'],
			leftColumns: ['preview'],
		};
		this.columns = {
			native: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
			],
			other: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
			],
			video: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'id', title: ' ' },
			],
			display: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'id', title: ' ' },
			],
		};
		this.columnWidths = [
			{ columnName: 'idd', width: 70 },
			{ columnName: 'created', width: 130 },
			{ columnName: 'upload_name', width: 'auto' },
			{ columnName: 'moderation', width: 150 },
			{ columnName: 'callback_url', width: 'auto' },
			{ columnName: 'name', width: 'auto' },
			{ columnName: 'id', width: 70 },
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
			idColumn,
			moderationColumn,
		} = this.state;
		const { data, inventoryType } = this.props;
		const { columns } = this;
		this.changeColumnWidths = columnWidths => {
			this.setState({ columnWidths });
		};
		return (
			<div className="table__card creative_list">
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
						<IDProvider for={idColumn} {...this.props} />
						<AdSizeProvider for={adSizeColumn} {...this.props} />
						<FileProvider for={fileColumn} {...this.props} />
						<LinkProvider for={linkColumn} {...this.props} />
						<PreviewProvider for={previewColumn} {...this.props} />
						<DateTypeProvider for={dateColumn} {...this.props} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<ModerationProvider for={moderationColumn} {...this.props} />
						<Table columnExtensions={this.columnWidths} />
						<TableHeaderRow showSortingControls />
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
