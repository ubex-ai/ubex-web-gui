/**
 *
 * CreativeBannerList
 *
 */

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Alert, Col, Row } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { createStructuredSelector } from 'reselect';
import DOMPurify from 'dompurify';
import AdBlockDetect from 'react-ad-block-detect';
import AppCard from 'components/AppCard';
import AppSafeframe from 'components/AppSafeframe';
import RenderNativeBanner from 'containers/TradingDesk/components/RenderNativeBanner';
import getGeneratedPageURL from 'utils/getBlob';
import messages from '../../messages';
import { creativesSelectors, selectAdSize } from '../../selectors';
import { creativeCollectionActions } from '../../actions';

// import PropTypes from 'prop-types';
// import styled from 'styled-components';

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
class CreativeBannerList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.props.getCreatives();
	}

	getAdSize(id) {
		const sizes = this.props.adSize.filter(f => f.value === id);
		return sizes.length ? sizes[0] : { width: 300, height: 600 };
	}

	getImageLink(activeCreative, image) {
		if (activeCreative && !!activeCreative.banners.length && !!activeCreative.banners[0].files.length) {
			const link = _.find(activeCreative.banners[0].files, item => item.file_location.indexOf(image) !== -1);
			return link.aws_s3_location;
		}
		return false;
	}

	render() {
		const {
			creatives,
			match: {
				params: { idCreative },
			},
		} = this.props;
		const creative = creatives.filter(c => c.id === parseInt(idCreative, 10));
		const { banners } = creative && creative.length ? creative[0] : [];
		let type;
		let nativeCreative;
		let otherCreative;
		if (_.find(creative, item => item.creative_type === 'native')) {
			type = 'native';
			nativeCreative = _.find(creative, item => item.creative_type === 'native');
		}
		if (_.find(creative, item => item.creative_type === 'other')) {
			type = 'other';
			otherCreative = _.find(creative, item => item.creative_type === 'other');
		}
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={7}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.listCreativeBanners} /> ({creative[0].data.name})
									</h1>
								</div>
							</div>
						</Col>
					</Row>
				</Col>
				<Col xs={12} md={12}>
					<AdBlockDetect>
						<Alert color="danger">
							<p style={{ marginBottom: 0 }}>
								<FormattedMessage {...messages.adBlock} />
							</p>
						</Alert>
					</AdBlockDetect>
				</Col>
				<Col>
					<AppCard>
						<div className="banners-flex">
							{type === 'display' ? banners.map(b => <AppSafeframe html={b.src} size={b.size} />) : null}
							{banners && banners.length && type !== 'native' && type !== 'other' && type !== 'display'
								? banners
										.sort((a, b) => {
											const aWidth = a.width;

											const aHeight = a.height;

											const bWidth = b.width;
											if (aWidth < aHeight && aWidth > bWidth) return 1;
											if (aWidth > aHeight && aWidth > bWidth) return -1;
											return 0;
										})
										.map((item, i) => {
											return (
												<div className="banners-flex__frame">
													<label className="banners-flex__frame--label">
														Banner size:{' '}
														{item.width ? item.width : this.getAdSize(item.ad_size).width}x
														{item.height
															? item.height
															: this.getAdSize(item.ad_size).height}
													</label>
													<div className="iframe-container">
														<iframe
															className="banners-flex__frame--iframe"
															title={i}
															id={i}
															frameBorder="0"
															scrolling="yes"
															style={{ border: '0 none transparent' }}
															src={item.aws_s3_location}
														/>
													</div>
													{!item.callback_url ? null : (
														<div style={clickerStyle} onClick={e => window.open(item.callback_url, '_blank')} />
													)}
												</div>
											);
										})
								: null}
							{banners && banners.length && type === 'native' ? (
								<RenderNativeBanner
									icon={this.getImageLink(nativeCreative, 'icon')}
									image={this.getImageLink(nativeCreative, 'image')}
									title={nativeCreative && nativeCreative.data ? nativeCreative.data.title : null}
									description={
										nativeCreative && nativeCreative.data ? nativeCreative.data.description : null
									}
									additionalDescription={
										nativeCreative && nativeCreative.data
											? nativeCreative.data.additional_description
											: null
									}
									clickUrl={
										nativeCreative && nativeCreative.data ? nativeCreative.data.click_url : null
									}
									callToAction={
										nativeCreative && nativeCreative.data
											? nativeCreative.data.call_to_action
											: null
									}
								/>
							) : null}
							{type === 'other' ? (
								<div>
									<iframe
										className="banners-flex__frame--iframe"
										width={this.getAdSize(otherCreative.ad_size).width}
										height={this.getAdSize(otherCreative.ad_size).height}
										frameBorder="0"
										scrolling="yes"
										style={{ border: '0 none transparent' }}
										src={getGeneratedPageURL(DOMPurify.sanitize(otherCreative.data.code))}
									/>
								</div>
							) : null}
							{banners && !banners.length && type !== 'other' ? (
								<Alert color="primary">No banners!</Alert>
							) : null}
						</div>
					</AppCard>
				</Col>
			</Row>
		);
	}
}

CreativeBannerList.propTypes = {};

const withConnect = connect(
	createStructuredSelector({
		creatives: creativesSelectors.collectionList(),
		adSize: selectAdSize(),
	}),
	dispatch => ({
		dispatch,
		getCreatives: () => dispatch(creativeCollectionActions.getCollection()),
	}),
);

export default compose(withConnect)(injectIntl(CreativeBannerList));
