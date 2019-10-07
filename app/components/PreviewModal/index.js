/**
 *
 * PreviewModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Zoom } from 'react-slideshow-image';
import AdBlockDetect from 'react-ad-block-detect';
import _ from 'lodash';
import messages from '../../containers/TradingDesk/messages';
import RenderNativeBanner from '../../containers/TradingDesk/components/RenderNativeBanner';

const zoomOutProperties = {
	duration: 5000,
	transitionDuration: 500,
	infinite: true,
	indicators: true,
	scale: 0.4,
	arrows: true,
};

const clickerStyle = {
	position: 'absolute',
	top: 0,
	left: 0,

	right: 0,
	bottom: 0,
	padding: 0,
	margin: 0,
	border: 0,
	overflow: 'hidden',
	width: '100%',
	height: '100%',
	cursor: 'pointer',
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
		const { isOpen, onCancel, msg, title, type, additionalType, bannerName } = this.props;
		return (
			<Modal isOpen={!!isOpen} className="w-800">
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...messages.previewCreative} /> {bannerName ? `(${bannerName})` : null}
				</ModalHeader>
				<ModalBody>
					<AdBlockDetect>
						<Alert color="danger">
							<p style={{ marginBottom: 0 }}>
								<FormattedMessage {...messages.adBlock} />
							</p>
						</Alert>
					</AdBlockDetect>
					<div style={{ textAlign: 'center' }}>
						{this.props.size && this.props.size.width && this.props.size.height
							? `Banner size: ${this.props.size.width}x${this.props.size.height}`
							: null}
					</div>
					{isOpen && typeof msg === 'string' && type === 'display' && additionalType === 'image' && (
						<img style={{ display: 'block', margin: '0 auto' }} src={msg} alt="preview" />
					)}
					{isOpen && typeof msg === 'string' && type === 'display' && additionalType === 'html5' && (
						<iframe
							style={{
								maxWidth: 728,
								maxHeight: 600,
								height: this.props.size ? this.props.size.height : 'auto',
								width: this.props.size ? this.props.size.width : 'auto',
								overflow: 'hidden',
								margin: '0 auto',
								display: 'block',
							}}
							className="banners-flex__frame--iframe"
							frameBorder="0"
							scrolling="yes"
							src={msg}
						/>
					)}
					{isOpen && typeof msg === 'string' && type === 'video' && (
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
					{isOpen && typeof msg === 'object' && type === 'display' && (
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

					{!this.props.clickUrl ? null : (
						<div
							style={clickerStyle}
							className="ddd"
							onClick={e => window.open(this.props.clickUrl, '_blank')}
						/>
					)}
				</ModalBody>
				<ModalFooter>
					<Button color="info" onClick={onCancel}>
						<FormattedMessage id="app.common.close" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

PreviewModal.propTypes = {
	type: PropTypes.string.isRequired,
	additionalType: PropTypes.string.isRequired,
	title: PropTypes.shape({
		id: PropTypes.string,
		defaultMessage: PropTypes.string,
	}).isRequired,
	msg: PropTypes.string.isRequired,
	isOpen: PropTypes.bool,
	onCancel: PropTypes.bool,
	clickUrl: PropTypes.string,
};

PreviewModal.defaultProps = {
	isOpen: false,
};

export default PreviewModal;
