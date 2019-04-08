import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import arrayToOptions from 'utils/arrayToOptions';
import { FieldGroup } from '../../../components/FormInputs/FormInputs';

import messages from '../messages';

export default function KYCForm() {
	return (
		<section className="box box_worker">
			<header className="panel_header">
				<h2 className="title">
					<FormattedMessage {...messages.kyc} />
				</h2>
			</header>
			<div className="content-body">
				<Row>
					<Col>
						<FormattedMessage {...messages.birthday}>
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
						<FormattedMessage {...messages.gender}>
							{msg => (
								<FieldGroup
									label={msg}
									inputProps={{
										type: 'select',
										children: arrayToOptions(['Male', 'Female']),
									}}
								/>
							)}
						</FormattedMessage>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormattedMessage {...messages.country}>
							{msg => (
								<FieldGroup
									label={msg}
									inputProps={{
										type: 'select',
										children: arrayToOptions(['Russia']),
									}}
								/>
							)}
						</FormattedMessage>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormattedMessage {...messages.city}>
							{msg => (
								<FieldGroup
									label={msg}
									inputProps={{
										type: 'select',
										children: arrayToOptions(['Moscow', 'Krasnodar', 'Kazan']),
									}}
								/>
							)}
						</FormattedMessage>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormattedMessage {...messages.address1}>
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
						<FormattedMessage {...messages.address2}>
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
						<FormattedMessage {...messages.postcode}>
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
						<FormattedMessage {...messages.numberOfDocument}>
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
						<FormattedMessage {...messages.nameOfDocument}>
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
						<FormattedMessage {...messages.sourceOfFinancing}>
							{msg => (
								<FieldGroup
									label={msg}
									inputProps={{
										type: 'select',
										children: arrayToOptions([
											'Ownership of a business',
											'Employment',
											'Inheritance',
											'Investments',
											'Other',
										]),
									}}
								/>
							)}
						</FormattedMessage>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormattedMessage {...messages.employmentStatus}>
							{msg => (
								<FieldGroup
									label={msg}
									inputProps={{
										type: 'select',
										children: arrayToOptions(['Employed', 'Self-employed', 'Unemployed', 'Other']),
									}}
								/>
							)}
						</FormattedMessage>
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
