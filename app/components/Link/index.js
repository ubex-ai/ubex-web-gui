/**
 *
 * LinkButton
 *
 */

import React from 'react';
import { NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
function Link(props) {
	const {
		history,
		location,
		match,
		staticContext,
		to,
		onClick,
		children,
		color,
		className,
		// ⬆ filtering out props that `button` doesn’t know what to do with.
		...rest
	} = props;
	return (
		<div
			{...rest} // `children` is just another prop!
			className={`${className} text-${color}`}
			onClick={event => {
				/* eslint-disable no-unused-expressions */
				onClick && onClick(event);
				history.push(to);
			}}
		>
			{children}
		</div>
	);
}

Link.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default withRouter(Link);
