/**
 *
 * RemoveModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import messages from 'containers/TradingDesk/messages';

import { FormattedMessage } from 'react-intl';
/* eslint-disable react/prefer-stateless-function */
class RemoveModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	render() {
		const { isOpen, onSuccess, onCancel, msg, title } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...messages.remove} />
				</ModalHeader>
				<ModalBody>
					<FormattedMessage {...messages.remove} />
				</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={() => onSuccess(isOpen)}>
						<FormattedMessage id="app.common.confirm" />
					</Button>
					<Button color="secondary" onClick={onCancel}>
						<FormattedMessage id="app.common.cancel" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

RemoveModal.propTypes = {};

export default RemoveModal;
