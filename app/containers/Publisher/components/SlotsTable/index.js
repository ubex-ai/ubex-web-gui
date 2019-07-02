/**
 *
 * SlotsTable
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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
import { SLOT_STATUS_PAUSE } from 'containers/Publisher/constants';
import moment from 'moment';
import messages from './messages';
import { injectIntl, intlShape } from 'react-intl';

const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD-MM-YYYY hh:mm:ss');

const StatusFormatter = ({ value, row }, props) => {
	const data = props.data.find(c => c.id === row.id);
	const btn = data.loading ? null : (
		<Button
			key="toggleEntryStatus"
			onClick={() => props.toggleEntryStatus(value, data.status)}
			className="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill"
		>
			{data.status === SLOT_STATUS_PAUSE ? <i className="fas fa-pause" /> : <i className="fas fa-play" />}
		</Button>
	);
	if (value === 'moderation') {
		return <span className="badge badge-warning">Moderation</span>;
	}
	if (value === 'active') {
		return [
			<span className="badge badge-success">
				<i className="fa fa-times" /> Online
			</span>,
			btn,
		];
	}
	if (value === 'danger') {
		return [
			<span className="badge badge-danger">
				<i className="fa fa-times" /> Offline
			</span>,
		];
	}
	return null;
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
				key="code"
				onClick={() => props.onClickGetCode(value)}
				className="m-portlet__nav-link btn m-btn m-btn--hover-info m-btn--icon m-btn--icon-only m-btn--pill"
			>
				{props.inventoryType === 'web' ? <i className="fas fa-code" /> : <i className="fas fa-link" />}
			</Button>
			<Link
				key="edit"
				to={`/app/inventory/${props.inventoryType}/${row.inventory}/slot/${value}`}
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
const StatusProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => StatusFormatter(fCProps, props)} {...props} />
);
const SettingsProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => SettingsFormatter(fCProps, props)} {...props} />
);
class SlotsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'name', title: this.props.intl.formatMessage(messages.name) },
				{ name: 'ubx', title: 'ID' },
				{ name: 'status', title: this.props.intl.formatMessage(messages.status) },
				{ name: 'summary', title: this.props.intl.formatMessage(messages.size) },
				{ name: 'floor_price_cpm', title: this.props.intl.formatMessage(messages.priceCPM) },
				{ name: 'updated', title:  this.props.intl.formatMessage(messages.dateOfChange) },
				{ name: 'id', title: this.props.intl.formatMessage(messages.settings) },
			],
			sorting: [{ columnName: 'created', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			dateColumn: ['updated'],
			statusColumn: ['status'],
			settingsColumn: ['id'],
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
			statusColumn,
			settingsColumn,
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
						<DateTypeProvider for={dateColumn} />
						<StatusProvider for={statusColumn} {...this.props} />
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

SlotsTable.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			site: PropTypes.string,
			earnings: PropTypes.number,
			pageViews: PropTypes.number,
			clicks: PropTypes.number,
		}),
	).isRequired,
	inventoryType: PropTypes.string.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl(SlotsTable);
