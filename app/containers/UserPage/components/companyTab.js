import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';

export default function CompanyTab() {
	return (
		<div>
			<Row>
				<Col className="my-3">
					<Button color="success" size="lg">
						<FormattedMessage {...messages.add} />
					</Button>
				</Col>
			</Row>
			<Row>
				<Col>
					<ReactTable
						data={[]}
						columns={[
							{
								Header: 'My Companies',
								columns: [
									{
										Header: 'Name',
										accessor: 'name',
									},
									{
										Header: 'Date',
										accessor: 'date',
									},
									{
										Header: 'Status',
										accessor: 'status',
									},
								],
							},
						]}
						defaultSorted={[
							{
								id: 'date',
								desc: true,
							},
						]}
						defaultPageSize={10}
						className="-striped -highlight"
					/>
				</Col>
			</Row>
		</div>
	);
}
