/**
 *
 * AppCard
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Alert, Row, Spinner } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import CampaignsList from '../../containers/TradingDesk/components/CampaignsList/Loadable';
// import styled from 'styled-components';

class AppCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardIsOpen: false,
		};
	}

	toggleCard() {
		this.setState({ cardIsOpen: !this.state.cardIsOpen });
		setTimeout(() => {
			if (typeof this.props.onToggle === 'function' && this.state.cardIsOpen) {
				this.props.onToggle(this.state.cardIsOpen);
			}
		});
	}

	arrowCardIsOpen() {
		if (!this.props.arrow) {
			return true;
		}
		return this.props.arrowForceOpen;
	}

	renderWithArrow(head, body) {
		return [
			<Row className="pointer">
				<i
					onClick={() => this.toggleCard()}
					className={`appcard-arrow campaign fas fa-chevron-right ${this.arrowCardIsOpen() ? 'active' : ''}`}
				/>
				{head}
			</Row>,
			!this.arrowCardIsOpen() ? null : (
				<div className="pt-3">
					{body || (
						<Alert color="primary">
							<FormattedMessage id="app.common.noEntries" defaultMessage="No entries" />
						</Alert>
					)}
				</div>
			),
		];
	}

	render() {
		const classNames = classnames(
			{ r4_counter: true },
			{ db_box: true },
			{ 'r4_counter-chart': this.props.chart },
			{ [`${this.props.className}`]: this.props.className },
		);

		return (
			<div>
				<div className="loading-wrapper">
					{this.props.loading ? <div className="loading-appcard"></div> : null}
					{this.props.loading ? <Spinner className="loading-appcard-spinner" type="grow" /> : null}
				</div>
				<div className={classNames} style={this.props.style} onClick={this.props.onClick}>
					{!this.props.arrow
						? this.props.children
						: this.renderWithArrow(this.props.arrowHead, this.props.children)}
				</div>
			</div>
		);
	}
}

AppCard.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
	chart: PropTypes.bool,
	className: PropTypes.string,
	style: PropTypes.object,
	onClick: PropTypes.func,
	onToggle: PropTypes.func,
	arrow: PropTypes.bool,
	arrowForceOpen: PropTypes.bool,
	arrowHead: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

AppCard.defaultProps = {
	arrow: false,
	arrowForceOpen: false,
};

export default AppCard;
