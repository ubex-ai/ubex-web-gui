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
import classNames from 'classnames';
import DOMPurify from "dompurify";

const DateFormatter = ({ value }) =>
	moment(value)
		.local()
		.format('DD-MM-YYYY HH:mm:ss');

const StatusFormatter = ({ value }) => {
	const className = classNames(
		{
			badge: true,
		},
		{
			'badge-success': value === 'success',
		},
		{
			'badge-danger': value === 'fail',
		},
		{
			'badge-danger': value === 'canceled',
		},
		{
			'badge-warning': value !== 'canceled' && value !== 'fail' && value !== 'success',
		},
	);
	return (
		<div>
			<span className={className} style={{ textTransform: 'capitalize', borderRadius: '5px' }}>
				{value}
			</span>
		</div>
	);
};

const TxFormatter = ({ value }, props) => <a href={value}>{value}</a>;
const AmountFormatter = ({ value }, props) => <span>${value}</span>;
const CommentFormatter = ({ value }, props) => {
	return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} />;
};
const getRowId = row => row.id;

const StatusProvider = props => <DataTypeProvider formatterComponent={StatusFormatter} {...props} />;
const CommentProvider = props => <DataTypeProvider formatterComponent={CommentFormatter} {...props} />;
const DateTypeProvider = props => <DataTypeProvider formatterComponent={DateFormatter} {...props} />;
const TxProvider = props => <DataTypeProvider formatterComponent={fCProps => TxFormatter(fCProps, props)} {...props} />;
const AmountProvider = props => (
	<DataTypeProvider formatterComponent={fCProps => AmountFormatter(fCProps, props)} {...props} />
);

class TablePaymentHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: null,
			columns: [
				{ name: 'status', title: this.props.intl.formatMessage(messages.status) },
				{ name: 'amount', title: this.props.intl.formatMessage(messages.amountTablePayment) },
				{ name: 'payment_method', title: this.props.intl.formatMessage(messages.method) },
				{ name: 'operation_type', title: this.props.intl.formatMessage(messages.operationType) },
				{ name: 'comment', title: this.props.intl.formatMessage(messages.comment) },
				{ name: 'date', title: this.props.intl.formatMessage(messages.time) },
			],
			sorting: [{ columnName: 'date', direction: 'desc' }],
			currentPage: 0,
			pageSize: 10,
			pageSizes: [5, 10, 15],
			dateColumn: ['date'],
			statusColumn: ['status'],
			txColumn: ['txid'],
			amountColumn: ['amount'],
			commentColumn: ['comment'],
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
			amountColumn,
			commentColumn,
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
						<CommentProvider for={commentColumn} />
						<TxProvider for={txColumn} {...this.props} />
						<AmountProvider for={amountColumn} {...this.props} />
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
