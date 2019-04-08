import React from 'react';
import { Button, Form, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { FieldGroup } from '../../../components/FormInputs/FormInputs';

import messages from '../messages';

export default class ContactsForm extends React.Component {
	languages() {
		const languagesData = ['English', 'Russian', 'Chinese'];
		return languagesData.map((lng, i) => (
			<option key={i} value={i}>
				{lng}
			</option>
		));
	}

	render() {
		return (
			<section className="box box_worker">
				<header className="panel_header">
					<h2 className="title">
						<FormattedMessage {...messages.myContacts} />
					</h2>
				</header>
				<div className="content-body">
					<Form>
						<Row>
							<Col>
								<FormattedMessage {...messages.firstName}>
									{msg => (
										<FieldGroup
											label={msg}
											inputProps={{
												type: 'text',
											}}
										/>
									)}
								</FormattedMessage>
							</Col>
						</Row>
						<Row>
							<Col>
								<FormattedMessage {...messages.lastName}>
									{msg => (
										<FieldGroup
											label={msg}
											inputProps={{
												type: 'text',
											}}
										/>
									)}
								</FormattedMessage>
							</Col>
						</Row>
						<Row>
							<Col>
								<FormattedMessage {...messages.lng}>
									{msg => (
										<FieldGroup
											label={msg}
											inputProps={{
												type: 'select',
												children: this.languages(),
											}}
										/>
									)}
								</FormattedMessage>
							</Col>
						</Row>
						<Row>
							<Col>
								<FormattedMessage {...messages.phone}>
									{msg => (
										<FieldGroup
											label={msg}
											inputProps={{
												type: 'text',
											}}
										/>
									)}
								</FormattedMessage>
							</Col>
						</Row>

						<Row>
							<Col>
								<FormattedMessage {...messages.email}>
									{msg => (
										<FieldGroup
											label={msg}
											inputProps={{
												type: 'text',
											}}
										/>
									)}
								</FormattedMessage>
							</Col>
						</Row>

						<Row>
							<Col>
								<FieldGroup
									label="Skype"
									inputProps={{
										type: 'text',
									}}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<FieldGroup
									label="Telegram"
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
					</Form>
				</div>
			</section>
		);
	}
}
