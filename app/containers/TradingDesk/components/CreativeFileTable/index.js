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
import IntlFieldGroup from 'components/IntlFieldGroup';
import messages from '../../messages';
import CreativeBannerShape from '../../shapes/CreativeBanner';
import classNames from 'classnames';
import _ from 'lodash';

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

const AdSizeFormatter = ({ value, row }, props) => (
	<Input
		type="select"
		name="adSize"
		onChange={e => props.adSizeChange(row.id, e.target.value)}
		invalid={!row.ad_size}
		disabled={!props.permissions || row.ad_size}
	>
		{!row.ad_size && <option>Select Ad Size</option>}
		{props.adSize.map(size => {
			console.log(size);
			return (
				<option value={size.id} selected={size.id === row.ad_size}>
					{size.label}
				</option>
			);
		})}
	</Input>
);
const MetricsFormatter = ({ value, row }, props) => (
	<TableInput
		value={row.tracking_js}
		onSave={val => {
			props.changeBannerURL(row.id, { tracking_js: val }, 'Other tracking');
		}}
		disabled={!props.permissions}
	/>
);

const LinkFormatter = ({ value, row }, props) => (
	<TableInput
		value={row.callback_url}
		validation={val => validateDomain(val)}
		onSave={val => {
			props.changeBannerURL(row.id, { callback_url: val }, 'Click URL');
		}}
		disabled={!props.permissions}
	/>
);

const PreviewFormatter = ({ value, row }, props) => {
	return (
		<Button
			key="code"
			className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
			onClick={() => props.onClickGetCode(row.aws_s3_location)}
		>
			<i className="fas fa-file-image" />
		</Button>
	);
};

const NameFormatter = ({ value, row }, props) => (
	<a
		href="#"
		onClick={e => {
			e.preventDefault();
			props.onClickGetCode(row.aws_s3_location, { width: row.width, height: row.height }, row.upload_name);
		}}
	>
		{value}
	</a>
);

const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD.MM.YY HH:mm');

const SettingsFormatter = ({ value, row }, props) => {
	if (props.data) {
		const entry = props.data.find(c => c.id === value);
		if (entry.loading) {
			return <span>loading</span>;
		}
	}
	return props.permissions ? (
		<span>
			<Button
				key="remove"
				onClick={() => props.removeBanner(row.id)}
				className="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-trash" />
			</Button>
		</span>
	) : null;
};

const ImageFormatter = ({ value, row }, props) =>
	!row.fallback ? (
		<div className="file_upload btn btn-md btn-primary">
			Select image
			<input
				type="file"
				name="bannerImage"
				accept="image/*"
				onChange={image => props.selectedImage(row.id, image)}
			/>
		</div>
	) : (
		<a
			href="#"
			onClick={e => {
				e.preventDefault();
				props.onClickGetCode(row.fallback.aws_s3_location, { width: row.width, height: row.height });
			}}
		>
			{row.fallback.upload_name}
		</a>
	);

const ModerationFormatter = ({ value, row }, props) => {
	// ubex should be FIRST
	let filteredArray = [];
	if (value && Object.keys(value) && Object.keys(value).length) {
		filteredArray = Object.keys(value);
		const itemIndex = _.findIndex(filteredArray, 'ubex');
		filteredArray.splice(0, 0, filteredArray.splice(itemIndex, 1)[0]);
	}

	const statuses = {
		draft: 'Draft',
		moderation: 'Moderation',
		paused: 'Paused',
		activating: 'Activating',
		delayed: 'Delayed',
		running: 'Running',
		deactivating: 'Deactivating',
		stopped: 'Stopped',
		archive: 'Archive',
		insufficient_funds: 'Insufficient funds',
		no_creatives: 'No creatives',
		no_banners: 'No banners',
		moderation_state: 'Moderation',
		moderation_error: 'Moderation error',
		ready: 'Ready',
	};

	function returnStatus(key) {
		return statuses.hasOwnProperty(key) ? statuses[key] : key;
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
										title={`${
											value[key] !== null
												? 'Moderation: ' + returnStatus(value[key].moderation_status)
												: 'No moderation'
										}`}
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

const IDFormatter = ({ value, row }, props) => row.id;

const ModerationProvider = props => (
	<DataTypeProvider formatterComponent={previewProps => ModerationFormatter(previewProps, props)} {...props} />
);

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
const NameProvider = props => (
	<DataTypeProvider formatterComponent={previewProps => NameFormatter(previewProps, props)} {...props} />
);
const SettingsProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => SettingsFormatter(fCProps, props)} {...props} />
);

const ImageProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => ImageFormatter(fCProps, props)} {...props} />
);

const IDProvider = props => (
	<DataTypeProvider formatterComponent={fileProps => IDFormatter(fileProps, props)} {...props} />
);

class CreativeFileTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'metrics', title: this.props.intl.formatMessage(messages.otherTracking) },
				{ name: 'mimetype', title: this.props.intl.formatMessage(messages.format) },
				{ name: 'id', title: ' ' },
			],
			columnWidths: [
				{ columnName: 'idd', width: 70 },
				{ columnName: 'created', width: 130 },
				{ columnName: 'upload_name', width: 130 },
				{ columnName: 'mimetype', width: 110 },
				{ columnName: 'ad_size', width: 200 },
				{ columnName: 'link', width: 300 },
				{ columnName: 'metrics', width: 200 },
				{ columnName: 'moderation', width: 150 },
				{ columnName: 'id', width: 60 },
			],
			columnsHTML5: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'moderation', title: 'Moderation' },
				{ name: 'ad_size', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'link', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'img', title: this.props.intl.formatMessage(messages.backfill) },
				{ name: 'metrics', title: this.props.intl.formatMessage(messages.otherTracking) },
				{ name: 'mimetype', title: this.props.intl.formatMessage(messages.format) },
				{ name: 'id', title: ' ' },
			],
			columnHTML5Widths: [
				{ columnName: 'idd', width: 70 },
				{ columnName: 'created', width: 130 },
				{ columnName: 'upload_name', width: 130 },
				{ columnName: 'mimetype', width: 110 },
				{ columnName: 'ad_size', width: 200 },
				{ columnName: 'link', width: 300 },
				{ columnName: 'img', width: 200 },
				{ columnName: 'metrics', width: 200 },
				{ columnName: 'moderation', width: 150 },
				{ columnName: 'id', width: 60 },
			],
			columnsVideo: [
				{ name: 'idd', title: 'ID' },
				{ name: 'created', title: 'Created' },
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
				{ columnName: 'idd', width: 70 },
				{ columnName: 'created', width: 130 },
				{ columnName: 'upload_name', width: 130 },
				{ columnName: 'quality', width: 120 },
				{ columnName: 'ratio', width: 150 },
				{ columnName: 'length', width: 150 },
				{ columnName: 'mimetype', width: 150 },
				{ columnName: 'protocol', width: 150 },
				{ columnName: 'link', width: 300 },
				{ columnName: 'id', width: 60 },
			],
			rightColumns: ['id'],
			sorting: [{ columnName: 'upload_name', direction: 'asc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			fileColumn: ['file'],
			linkColumn: ['link'],
			adSizeColumn: ['ad_size'],
			formatColumn: ['mimetype'],
			dateColumn: ['created'],
			settingsColumn: ['id'],
			previewColumn: ['preview'],
			metricsColumn: ['metrics'],
			nameColumn: ['upload_name'],
			imgColumn: ['img'],
			moderationColumn: ['moderation'],
			idColumn: ['idd'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });

		this.changeColumnWidths = columnWidths => {
			this.setState({ columnWidths });
		};

		this.changeColumnsHTML5Widths = columnHTML5Widths => {
			this.setState({ columnHTML5Widths });
		};

		this.changeColumnVideoWidths = columnVideoWidths => {
			this.setState({ columnVideoWidths });
		};
	}

	columns(type) {
		if (type === 'video') {
			return this.state.columnsVideo;
		}
		if (type === 'html5') {
			return this.state.columnsHTML5;
		}
		return this.state.columns;
	}

	columnWidths(type) {
		if (type === 'video') {
			return this.state.columnVideoWidths;
		}
		if (type === 'html5') {
			return this.state.columnHTML5Widths;
		}
		return this.state.columnWidths;
	}

	columnChange(type) {
		console.log(type);
		if (type === 'video') {
			return this.changeColumnVideoWidths;
		}
		if (type === 'html5') {
			return this.changeColumnsHTML5Widths;
		}
		return this.changeColumnWidths;
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
			nameColumn,
			fileColumn,
			adSizeColumn,
			columnWidths,
			metricsColumn,
			rightColumns,
			leftColumns,
			columnsVideo,
			idColumn,
			moderationColumn,
			imgColumn,
		} = this.state;
		const { data, type } = this.props;
		return (
			<div className="table__card">
				{data && (
					<Grid rows={data} columns={this.columns(type)}>
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
						{type !== 'video' && <AdSizeProvider for={adSizeColumn} {...this.props} />}
						<LinkProvider for={linkColumn} {...this.props} />
						<NameProvider for={nameColumn} {...this.props} />
						{type !== 'video' && <PreviewProvider for={previewColumn} {...this.props} />}
						{type !== 'video' && <MetricsProvider for={metricsColumn} {...this.props} />}
						<DateTypeProvider for={dateColumn} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<ModerationProvider for={moderationColumn} {...this.props} />
						<ImageProvider for={imgColumn} {...this.props} />
						<Table />
						<TableColumnResizing
							defaultColumnWidths={this.columnWidths(type)}
							onColumnWidthsChange={this.columnChange(type)}
						/>
						<TableHeaderRow showSortingControls />
						<TableFixedColumns rightColumns={rightColumns} />
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
