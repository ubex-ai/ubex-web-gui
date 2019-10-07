/**
 *
 * RenderNativeBanner
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class RenderNativeBanner extends React.Component {
	setAnimation(elem, imageLink) {
		const img = new Image();
		img.onload = () => {
			if (this.width <= 240) {
				elem.classList.remove('animation');
			}
		};
		img.src = imageLink;
	}

	setImage(imageLink) {
		const link = imageLink;
		const element = document.getElementById('image-native');
		element.style.backgroundImage = `url('${link}')`;
		// return this.setAnimation(element, link);
	}

	componentDidMount() {
		this.setImage(this.props.image);
	}

	render() {
		// todo for @dani5: PROP TYPES VALIDATION!!!
		const { title, description, additionalDescription, clickUrl, callToAction, icon } = this.props;
		return (
			<div>
				<div className="native-desktop">
					<a href="#link" className="native-desktop__main-link" />
					<div className="native-desktop__image-wrapper">
						<div className="native-desktop__image" id="image-native" />
					</div>
					<div className="native-desktop__content">
						<div className="native-desktop__content-text">
							<span>
								<FormattedMessage {...title} />
							</span>
							<div className="native-desktop__content-description">{description}</div>
							<div className="native-desktop__actions">
								<span className="native-desktop__content-link">
									<FormattedMessage {...title}>
										{msg => (
											<img
												src={icon}
												title="icon-link"
												alt={msg}
												className="native-desktop__content-link-image"
											/>
										)}
									</FormattedMessage>
									{clickUrl}
								</span>
								<div className="native-desktop__content-button">{callToAction || clickUrl}</div>
							</div>
						</div>
						<div className="native-desktop__content-additional-description">{additionalDescription}</div>
					</div>
				</div>
			</div>
		);
	}
}

RenderNativeBanner.propTypes = {
	title: PropTypes.object.isRequired,
};

export default RenderNativeBanner;
