import React from 'react';
import { Container } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';

function Footer(props) {
	return (
		<footer className={`footer${props.default ? ' footer-default' : ''}`}>
			<Container fluid={!!props.fluid}>
				<div className="copyright">
					&copy; {1900 + new Date().getYear()},
					<a href="https://ubex.com" target="_blank" rel="noopener noreferrer">
						UBEX
					</a>
				</div>
			</Container>
		</footer>
	);
}

Footer.propTypes = {
	default: PropTypes.bool,
	fluid: PropTypes.bool,
};

export default Footer;
