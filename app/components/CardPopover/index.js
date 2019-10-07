/* eslint-disable react/button-has-type */
/**
 *
 * CardPopover
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import AppCard from 'components/AppCard';
import ReactAwesomePopover from 'react-awesome-popover';
import 'react-awesome-popover/dest/react-awesome-popover.css';
import { FormattedMessage } from 'react-intl';
const Popover = ReactAwesomePopover;
/* eslint-disable react/prefer-stateless-function */
class CardPopover extends React.PureComponent {
	target = React.createRef();

	state = {
		isOpen: false,
	};

	toggle(e, close) {
		if (close) {
			this.setState({
				isOpen: false,
			});

			return;
		}

		this.setState({
			isOpen: true,
		});
	}

	render() {
		return (
			<div className="CardPopover">
				<Popover>
					<button className="buttonPopoverLil">
						<i className="fal fa-question-circle" />
					</button>
					<div className="popoverContent">
						{this.props.popoverHeader && (
							<div className="popoverHeader">
								{typeof this.props.popoverHeader === 'object' ? (
									<FormattedMessage {...this.props.popoverHeader} />
								) : (
									<FormattedMessage id={this.props.popoverHeader} />
								)}
							</div>
						)}
						{this.props.popoverBody && (
							<div className="popoverBody">
								{typeof this.props.popoverHeader === 'object' ? (
									<FormattedMessage {...this.props.popoverBody} />
								) : (
									<FormattedMessage id={this.props.popoverBody} />
								)}
							</div>
						)}
					</div>
				</Popover>
				<AppCard chart={this.props.chart} loading={this.props.loading} mini={this.props.mini}>{this.props.children}</AppCard>
			</div>
		);
	}
}

CardPopover.defaultProps = {
	placement: 'top',
	chart: false,
};

CardPopover.propTypes = {
	popoverHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	popoverBody: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	children: PropTypes.node,
	placement: PropTypes.oneOf([
		'auto',
		'auto-start',
		'auto-end',
		'top',
		'top-start',
		'top-end',
		'right',
		'right-start',
		'right-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'left',
		'left-start',
		'left-end',
	]),
	chart: PropTypes.bool,
};

export default CardPopover;
