/**
 *
 * PaymentStatus
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

/* eslint-disable react/prefer-stateless-function */
class PaymentStatus extends React.Component {
	render() {
		const { isOpen, onCancel, amount, status } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					{status === 'success' ? 'Payment completed' : 'Payment error'}
				</ModalHeader>
				<ModalBody className="topUp-modal__transaction-success">
					{status === 'success' ? (
						<i className="fas fa-check-circle topUp-modal__transaction-success--icon" />
					) : (
						<i className="fas fa-times-circle topUp-modal__transaction-error--icon" />
					)}
					<div>
						<h3>{status === 'success' ? 'Payment completed' : 'Payment error'}</h3>
						{status === 'error' && <h6>Oops. Something went wrong, please try again later</h6>}
						{status === 'success' && <h5>Deposit amount ${amount}</h5>}
					</div>
				</ModalBody>
			</Modal>
		);
	}
}

PaymentStatus.propTypes = {};

export default PaymentStatus;
