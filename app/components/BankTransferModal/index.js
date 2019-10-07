/**
 *
 * ShareModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Row, FormGroup, Label } from 'reactstrap';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Col from 'reactstrap/es/Col';
import { Form } from 'react-final-form';
import IntlFieldGroup from 'components/IntlFieldGroup';
import validateEmail from 'utils/validateEmail';
import validateEmpty from 'utils/validateEmpty';
import Select from 'react-select';

/* eslint-disable react/prefer-stateless-function */
class BankTransferModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addUser: false,
			related: true,
		};
		this.formRef = null;
		this.renderForm = this.renderForm.bind(this);
	}

	componentWillUnmount() {
		// сброс значений формы
		if (this.formRef && this.formRef.form) {
			this.formRef.form.reset({});
		}
	}

	validate(formValues) {
		const errors = {};

		if (!validateEmpty(formValues.username)) {
			errors.username = validateEmail(formValues.username);
		} else {
			errors.username = validateEmpty(formValues.username);
		}
		errors.perm = validateEmpty(formValues.perm);

		return errors;
	}

	onSubmit(values) {
		this.props.addShareUser({
			...values,
		});
		this.setState({
			addUser: false,
		});
	}

	renderForm({ handleSubmit, values, change, errors }) {
		const { countries } = this.props;
		return (
			<form
				onSubmit={args => {
					return handleSubmit(args);
				}}
			>
				<ModalBody>
					<Row>
						<Col md={6}>
							<IntlFieldGroup name="email" label={messages.email} required />
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="phone" label={messages.phone} required />
						</Col>
						<Col md={6}>
							<label className="">
								<FormattedMessage {...messages.countries} />{' '}
								<span style={{ color: 'rgb(255, 0, 0)' }}>*</span>
							</label>
							<Select
								className="campaign-select-container"
								classNamePrefix="campaign-select"
								options={countries.map(country => ({
									value: country.id,
									label: country.label,
								}))}
								onChange={this.handleChangeCountry}
								value={this.state.selectedOptionCountry}
								placeholder="Select coutnry"
							/>
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="company_name" label={messages.companyName} required />
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="director_name" label={messages.directorName} required />
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="residence_address" label={messages.residenceAddress} required />
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="zip" label={messages.zip} required />
						</Col>
						<Col md={6}>
							<IntlFieldGroup name="city" label={messages.city} required />
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Button color="info">
						<FormattedMessage id="app.common.create" />
					</Button>
				</ModalFooter>
			</form>
		);
	}

	render() {
		const { isOpen, onCancel, title } = this.props;
		return (
			<Modal isOpen={!!isOpen} size="xl">
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...messages.createInvoice} /> ${isOpen}
				</ModalHeader>
				<Form
					validate={formValues => this.validate(formValues)}
					initialValues={{
						share_related: true,
					}}
					onSubmit={values => this.onSubmit(values)}
					ref={c => (this.formRef = c)}
					render={this.renderForm}
				/>
			</Modal>
		);
	}
}

BankTransferModal.propTypes = {};

export default BankTransferModal;
