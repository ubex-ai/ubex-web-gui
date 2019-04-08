import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { FieldGroup } from '../../../components/FormInputs/FormInputs';

import messages from '../messages';

export default function walletsForm() {
	return (
		<section className="box box_worker">
			<header className="panel_header">
				<h2 className="title">
					<FormattedMessage {...messages.myWallets} />
				</h2>
			</header>
			<div className="content-body">
				<Row>
					<Col>
						<FieldGroup
							label="BTC"
							inputProps={{
								type: 'text',
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FieldGroup
							label="ETH"
							inputProps={{
								type: 'text',
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<FieldGroup
							label="UBEX"
							inputProps={{
								type: 'text',
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Button color="primary">
							<FormattedMessage id="app.common.submit" />
						</Button>
					</Col>
				</Row>
			</div>
		</section>
	);
}
