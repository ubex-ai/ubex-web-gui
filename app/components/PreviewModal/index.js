/**
 *
 * PreviewModal
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CodeCard from 'components/CodeCard';
import { Zoom } from 'react-slideshow-image';
import AdBlockDetect from 'react-ad-block-detect';
import messages from '../../containers/TradingDesk/messages';
import RenderNativeBanner from '../../containers/TradingDesk/components/RenderNativeBanner';
import _ from 'lodash';

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
			iFrameHeight: '0px',
		};
		this.formRef = null;
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	getImageLink(activeCreative, image) {
		if (activeCreative && !!activeCreative.banners.length && !!activeCreative.banners[0].files.length) {
			const link = _.find(activeCreative.banners[0].files, item => item.file_location.indexOf(image) !== -1);
			return link.aws_s3_location;
		}
		return false;
	}

	render() {
		const { isOpen, onCancel, msg, title, type, additionalType } = this.props;
		console.log(this.props)
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
					{isOpen &&
						typeof msg === 'string' &&
						type === 'display' &&
						additionalType === 'image' && <img src={msg} alt="preview" />}
					{isOpen &&
						typeof msg === 'string' &&
						type === 'display' &&
						additionalType === 'html5' && (
							<iframe
								style={{
									maxWidth: 728,
									width: '100%',
									maxHeight: 600,
									height: '-webkit-fill-available',
									overflow: 'visible',
								}}
								className="banners-flex__frame--iframe"
								frameBorder="0"
								scrolling="yes"
								src={msg}
							/>
						)}
					{isOpen &&
						typeof msg === 'string' &&
						type === 'video' && (
							<video controls="controls" style={{ width: '100%' }} autoPlay>
								<source src={msg} type="video/mp4" />
							</video>
						)}
					{isOpen && typeof msg === 'object' && type === 'native' ? (
						<RenderNativeBanner
							icon={this.getImageLink(msg, 'icon')}
							image={this.getImageLink(msg, 'image')}
							title={msg && msg.data ? msg.data.title : null}
							description={msg && msg.data ? msg.data.description : null}
							additionalDescription={msg && msg.data ? msg.data.additional_description : null}
							clickUrl={msg && msg.data ? msg.data.click_url : null}
							callToAction={msg && msg.data ? msg.data.call_to_action : null}
						/>
					) : null}
					{isOpen &&
						typeof msg === 'object' &&
						type === 'display' && (
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
