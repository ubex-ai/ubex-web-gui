/**
 *
 * CreativeBannerList
 *
 */

import React from 'react';
import { Alert, Col, Row } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import AdBlockDetect from 'react-ad-block-detect';
import messages from '../../messages';
import AppCard from 'components/AppCard';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { creativesSelectors } from '../../selectors';
import { creativeCollectionActions } from '../../actions';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CreativeBannerList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			banners: [
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/320x50/320x50.html',
					width: 320,
					height: 50,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/300x250/300x250.html',
					width: 300,
					height: 250,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/180x150/180x150.html',
					width: 180,
					height: 150,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/240x400/240x400.html',
					width: 240,
					height: 400,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/250x250/250x250.html',
					width: 250,
					height: 250,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/300x100/300x100.html',
					width: 300,
					height: 100,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/300x600/300x600_.html',
					width: 300,
					height: 600,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/250x250/250x250.html',
					width: 250,
					height: 250,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/300x100/300x100.html',
					width: 300,
					height: 100,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/300x600/300x600_.html',
					width: 300,
					height: 600,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/720x300/720x300.html',
					width: 720,
					height: 300,
				},
				{
					banner: 'https://s3.amazonaws.com/storage.ubex/files/temp/120x240/120x240.html',
					width: 120,
					height: 240,
				},
			],
		};
	}

	componentDidMount() {
		this.props.getCreatives();
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
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={7}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.listCreativeBanners} />
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
							{banners && banners.length ? banners
								.sort((a, b) => {
									const aWidth = a.width;

									const aHeight = a.height;

									const bWidth = b.width;
									if (aWidth < aHeight && aWidth > bWidth) return 1;
									if (aWidth > aHeight && aWidth > bWidth) return -1;
									return 0;
								})
								.map((item, i) => (
									<div className="banners-flex__frame">
										<label className="banners-flex__frame--label">
											Banner size: {item.width}x{item.height}
										</label>
										<iframe
											className="banners-flex__frame--iframe"
											title={i}
											width={item.width}
											height={item.height}
											id={i}
											frameBorder="0"
											scrolling="yes"
											style={{ border: '0 none transparent' }}
											src={item.aws_s3_location}
										/>
									</div>
								)) : null}
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
	}),
	dispatch => ({
		dispatch,
		getCreatives: () => dispatch(creativeCollectionActions.getCollection()),
	}),
);

export default compose(withConnect)(injectIntl(CreativeBannerList));
