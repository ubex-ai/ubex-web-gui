/**
 *
 * CodeModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CodeCard from 'components/CodeCard';

/* eslint-disable react/prefer-stateless-function */
class CodeModal extends React.Component {
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
		const { isOpen, onCancel, msg, title } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
				</ModalHeader>
				<ModalBody>
					<CodeCard embeddedScript={msg} />
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={onCancel}>
						<FormattedMessage id="app.common.close" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

CodeModal.propTypes = {};

export default CodeModal;
