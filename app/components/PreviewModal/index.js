/**
 *
 * PreviewModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CodeCard from 'components/CodeCard';
import { Zoom } from 'react-slideshow-image';
import AdBlockDetect from 'react-ad-block-detect';
import messages from '../../containers/TradingDesk/messages';

const zoomOutProperties = {
	duration: 5000,
	transitionDuration: 500,
	infinite: true,
	indicators: true,
	scale: 0.4,
	arrows: true,
};

/* eslint-disable react/prefer-stateless-function */
class PreviewModal extends React.Component {
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
					<AdBlockDetect>
						<Alert color="danger">
							<p style={{ marginBottom: 0 }}>
								<FormattedMessage {...messages.adBlock} />
							</p>
						</Alert>
					</AdBlockDetect>
					{isOpen && typeof msg === 'string' && <img src={msg} alt="preview" />}
					{isOpen &&
						typeof msg === 'object' && (
							<Zoom {...zoomOutProperties}>
								{msg.map((each, index) => (
									<div
										style={{
											background: `url(${each}) 0% 0% / contain no-repeat`,
											height: '100%',
											width: '100%',
										}}
									/>
								))}
							</Zoom>
						)}
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

PreviewModal.propTypes = {};

export default PreviewModal;
