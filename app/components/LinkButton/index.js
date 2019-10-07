/**
 *
 * LinkButton
 *
 */

import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
class LinkButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keyDown: null,
		};
	}
	componentDidMount() {
		window.addEventListener(
			'keydown',
			event => {
				const keyName = event.key;
				this.setState({ keyDown: keyName });
			},
			false,
		);
		window.addEventListener(
			'keyup',
			event => {
				this.setState({ keyDown: null });
			},
			false,
		);
	}

	componentWillUnmount() {
		window.removeEventListener(
			'keydown',
			event => {
				const keyName = event.key;
				this.setState({ keyDown: keyName });
			},
			false,
		);
		window.removeEventListener('keyup', event => {
			this.setState({ keyDown: null }, false);
		});
	}
	render() {
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
		} = this.props;
		return (
			<Button
				{...rest} // `children` is just another prop!
				onClick={event => {
					/* eslint-disable no-unused-expressions */
					if (this.state.keyDown === 'Control') {
						window.open(to);
					}
					if (!this.state.keyDown) {
						onClick && onClick(event);
						history.push(to);
					}
				}}
			>
				{children}
			</Button>
		);
	}
}

LinkButton.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default withRouter(LinkButton);
