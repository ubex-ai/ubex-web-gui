import React from 'react';
import { Link } from 'react-router-dom';
import {
	SortingState,
	IntegratedSorting,
	PagingState,
	IntegratedPaging,
	DataTypeProvider,
} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel, TableColumnResizing } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import moment from 'moment';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import messages from 'containers/DataMiner/messages';

const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD-MM-YYYY hh:mm:ss');

const StatusFormatter = ({ value }) =>
	value === 'success' ? (
		<div>
			<span className="badge badge-success">
				<i className="fa fa-thumbs-up" />
			</span>
			{value}
		</div>
	) : (
		<div>
			<span className="badge badge-danger">
				<i className="fa fa-times" />
			</span>
			{value}
		</div>
	);

const TxFormatter = ({ value }, props) => (
	<a href={value}>{value}</a>
);

const getRowId = row => row.id;

const StatusProvider = props => <DataTypeProvider formatterComponent={StatusFormatter} {...props} />;
const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
const TxProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => TxFormatter(fCProps, props)} {...props} />
);

class TablePaymentHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'status', title: this.props.intl.formatMessage(messages.status) },
				{ name: 'date', title: this.props.intl.formatMessage(messages.time) },
				{ name: 'payment_method', title: this.props.intl.formatMessage(messages.method) },
				{ name: 'operation_type', title: 'Opetation type' },
				{ name: 'amount', title: this.props.intl.formatMessage(messages.amountTablePayment) },
			],
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			dateColumn: ['date'],
			statusColumn: ['status'],
			txColumn: ['txid'],
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
			txColumn,
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
						<StatusProvider for={statusColumn} />
						<TxProvider for={txColumn} {...this.props} />
						<Table />
						<TableHeaderRow showSortingControls />
						<PagingPanel pageSizes={pageSizes} />
					</Grid>
				)}
			</div>
		);
	}
}

export default injectIntl(TablePaymentHistory);
