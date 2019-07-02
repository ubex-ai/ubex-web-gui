/**
 *
 * LinkDropdown
 *
 */

import React from 'react';
import { DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

function LinkDropdown(props) {
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
		<DropdownItem
			{...rest} // `children` is just another prop!
			onClick={event => {
				/* eslint-disable no-unused-expressions */
				onClick && onClick(event);
				history.push(to);
			}}
		>
			{children}
		</DropdownItem>
	);
}

LinkDropdown.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default withRouter(LinkDropdown);
