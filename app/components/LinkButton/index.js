/**
 *
 * LinkButton
 *
 */

import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
function LinkButton(props) {
	const {
		history,
		location,
		match,
		staticContext,
		to,
		onClick,
		children,
		// ⬆ filtering out props that `button` doesn’t know what to do with.
		...rest
	} = props;
	return (
		<Button
			{...rest} // `children` is just another prop!
			onClick={event => {
				/* eslint-disable no-unused-expressions */
				onClick && onClick(event);
				history.push(to);
			}}
		>
			{children}
		</Button>
	);
}

LinkButton.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default withRouter(LinkButton);
