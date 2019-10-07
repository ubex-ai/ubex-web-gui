/**
 *
 * ModerationModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
/* eslint-disable react/prefer-stateless-function */
class ModerationModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			statuses: {
				moderation_state: 'Moderation',
				moderation_error: 'Moderation error',
				ready: 'Ready',
			},
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	render() {
		const { isOpen, onCancel, title } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
					{isOpen && isOpen.moderation_status ? (
						<div
							className={classNames(
								{ badge: true },
								{ 'badge-danger': isOpen.moderation_status === 'denied' },
								{ 'badge-danger': isOpen.moderation_status === 'moderation_error' },
								{ 'badge-warning': isOpen.moderation_status === 'moderation_state' },
								{ 'badge-warning': isOpen.moderation_status === 'awaiting' },
								{ 'badge-warning': isOpen.moderation_status === 'pending' },
								{ 'badge-warning': isOpen.moderation_status === 'moderation' },
								{ 'badge-success': isOpen.moderation_status === 'accepted' },
								{ 'badge-success': isOpen.moderation_status === 'ready' },
							)}
							style={{ borderRadius: '5px' }}
						>
							<span style={{ textTransform: 'capitalize' }}>
								{this.state.statuses.hasOwnProperty(isOpen.moderation_status)
									? this.state.statuses[isOpen.moderation_status]
									: null}
							</span>
						</div>
					) : null}
				</ModalHeader>
				<ModalBody>
					{isOpen && (isOpen.moderation_status === 'null' || isOpen.moderation_status === 'awaiting') ? (
						<p>Awaiting submission for moderation</p>
					) : null}
					{isOpen && isOpen.moderation_errors ? isOpen.moderation_errors.map(error => error !== null ? <p>{error}</p> : <p>No comment!</p>) : 'No comment!'}
				</ModalBody>
			</Modal>
		);
	}
}

ModerationModal.propTypes = {
	isOpen: PropTypes.exact({
		moderation_status: PropTypes.string,
		moderation_errors: PropTypes.array,
	}),
	title: PropTypes.object,
	onCancel: PropTypes.func,
};

export default ModerationModal;
