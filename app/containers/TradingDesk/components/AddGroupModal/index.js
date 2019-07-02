/**
 *
 * AddGroupModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Label from 'reactstrap/es/Label';
import AppAlertError from 'components/AppAlertError';
import messages from '../../messages';
import AddCreativeToCampaignModal from '../AddCreativeToCampaignModal';

/* eslint-disable react/prefer-stateless-function */
class AddGroupModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			name: '',
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	handleChange(event) {
		this.setState({ name: event.target.value });
	}

	render() {
		const { isOpen, onCancel, onCreate, onCreateAndCreateCampaign, title, error, errorValidate } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
				</ModalHeader>
				<ModalBody>
					{error && <AppAlertError message={error.message} />}
					{errorValidate && <AppAlertError message={errorValidate} />}
					<Label>
						<FormattedMessage {...messages.groupName} />
					</Label>
					<Input name="name" onChange={this.handleChange.bind(this)} />
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => onCreate(this.state.name)}>
						<FormattedMessage id="app.common.create" />
					</Button>
					<Button color="success" onClick={() => onCreateAndCreateCampaign(this.state.name)}>
						<FormattedMessage id="app.common.createAndAddGroup" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

AddGroupModal.propTypes = {
	isOpen: PropTypes.number,
	onCancel: PropTypes.func,
	onSumbit: PropTypes.func,
	onCreateAndCreateCampaign: PropTypes.func,
	title: PropTypes.object,
	error: PropTypes.string,
	errorValidate: PropTypes.string,
};

export default AddGroupModal;
