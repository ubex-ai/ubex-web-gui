/**
 *
 * Loader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import logowhite from 'assets/img/logos/logowhite.svg';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class FullScreenLoader extends React.Component {
	render() {
		const { message, show } = this.props;
		return (
			<div>
				{show ? (
					<div className="FullScreenLoader__container">
						<img src={logowhite} alt="logowhite" className="FullScreenLoader__logo-image" />
						{message ? <div className="FullScreenLoader__message">{message}</div> : null}
					</div>
				) : null}
			</div>
		);
	}
}

FullScreenLoader.defaultProps = {
	show: true,
};
FullScreenLoader.propTypes = {
	message: PropTypes.string,
	show: PropTypes.bool,
};

export default FullScreenLoader;
