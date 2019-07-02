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
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import messages from '../../messages';

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
			{entry.status === 'moderation' && (
				<i className="icon-status__table fas fa-exclamation icon-xs icon-rounded icon-warning" />
			)}
			{value}
		</div>
	);
};

const LinkFormatter = ({ value }) => (
	<Button
		key="code"
		className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
	>
		<i className="fas fa-link" />
	</Button>
);

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
			<Link
				key="edit"
				to={`/app/inventory/${props.inventoryType}/${row.creativeId}/slot/${value}`}
				className="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"
			>
				<i className="fas fa-edit" />
			</Link>
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
const LinkProvider = props => <DataTypeProvider formatterComponent={LinkFormatter} {...props} />;
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
			columns: [
				{ name: 'upload_name', title: this.props.intl.formatMessage(messages.file) },
				{ name: 'adSize', title: this.props.intl.formatMessage(messages.adSize) },
				{ name: 'callback_url', title: this.props.intl.formatMessage(messages.clickURL) },
				{ name: 'aws_s3_location', title: this.props.intl.formatMessage(messages.preview) },
				{ name: 'id', title: this.props.intl.formatMessage(messages.settings) },
			],
			sorting: [{ columnName: 'created', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			fileColumn: ['upload_name'],
			linkColumn: ['callback_url'],
			dateColumn: ['updated'],
			settingsColumn: ['id'],
			previewColumn: ['aws_s3_location'],
		};
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeCurrentPage = currentPage => this.setState({ currentPage });
		this.changePageSize = pageSize => this.setState({ pageSize });
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
		} = this.state;
		const { data } = this.props;
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
						<FileProvider for={fileColumn} {...this.props} />
						<LinkProvider for={linkColumn} />
						<PreviewProvider for={previewColumn} {...this.props} />
						<DateTypeProvider for={dateColumn} />
						<SettingsProvider for={settingsColumn} {...this.props} />
						<Table />
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
