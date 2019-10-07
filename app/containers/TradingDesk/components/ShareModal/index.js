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
import ShareTable from 'components/ShareTable';
import { Form } from 'react-final-form';
import IntlFieldGroup from 'components/IntlFieldGroup';
import validateEmail from 'utils/validateEmail';
import validateEmpty from 'utils/validateEmpty';

/* eslint-disable react/prefer-stateless-function */
class ShareModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{ name: 'id', title: '№' },
				{ name: 'username', title: 'Email' },
				{ name: 'perm', title: 'Access' },
				{ name: 'created', title: 'Added' },
				{ name: 'comment', title: 'Comments' },
				{ name: 'actions', title: 'Actions' },
			],
			addUser: false,
			related: true,
		};
		this.formRef = null;
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
		return (
			<form
				onSubmit={args => {
					return handleSubmit(args);
				}}
			>
				<ModalBody>
					<IntlFieldGroup name="username" label={messages.email} required />
					<IntlFieldGroup
						name="perm"
						inputProps={{
							type: 'select',
							options: [
								{
									value: 'write',
									label: 'Editing',
								},
								{
									value: 'read',
									label: 'View only',
								},
							],
						}}
						label={messages.access}
						required
					/>
					<IntlFieldGroup name="comment" label={messages.comment} />
					<IntlFieldGroup
						name="share_related"
						inputProps={{
							type: 'checkbox',
							value: true,
							name: 'share_related',
							id: 'share_related',
							checked: values.share_related,
						}}
						label={messages.shareRelated}
						html
					/>
				</ModalBody>
				<ModalFooter>
					<Button color="info" onKeyDown={event => (event.keyCode === 13 ? this.formRef.onSubmit() : null)}>
						<FormattedMessage id="app.common.add" />
					</Button>
				</ModalFooter>
			</form>
		);
	}

	render() {
		const { isOpen, onCancel, title, sharedOwners, permissions } = this.props;
		return (
			<Modal isOpen={!!isOpen} size="xl">
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} /> #{isOpen}
				</ModalHeader>
				<ModalBody className="shareModal">
					<Row>
						<Col md={12} className="shareModal__button" />
						<Col md={12} className="shareModal__table">
							<ShareTable
								columns={this.state.columns}
								data={sharedOwners}
								className="table-responsive"
								removeSharedOwner={id => this.props.removeSharedOwner(id)}
								permissions={permissions}
								addUser={() =>
									this.setState({
										addUser: isOpen,
									})
								}
							/>
						</Col>
					</Row>
				</ModalBody>
				<Modal isOpen={this.state.addUser}>
					<ModalHeader toggle={() => this.setState({ addUser: null })}>Add user</ModalHeader>
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
			</Modal>
		);
	}
}

ShareModal.propTypes = {};

export default ShareModal;
