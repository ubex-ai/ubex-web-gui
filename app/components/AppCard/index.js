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
// import styled from 'styled-components';

class AppCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cardIsOpen: false,
		};
	}

	toggleCard() {
		this.setStateAsync({ cardIsOpen: !this.state.cardIsOpen }).then(() => {
			this.props.onToggle(this.state.cardIsOpen);
		});
	}

	setStateAsync(state) {
		return new Promise(resolve => {
			this.setState(state, resolve);
		});
	}

	arrowCardIsOpen() {
		if (!this.props.arrow) {
			return true;
		}
		return this.props.arrowForceOpen;
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	renderWithArrow(head, body) {
		return [
			!head ? null : (
				<Row className="pointer" key="row" onClick={() => this.toggleCard()}>
					<i
						className={`appcard-arrow campaign fas fa-chevron-right ${
							this.arrowCardIsOpen() ? 'active' : ''
						}`}
					/>
					{head.header}
					{head.buttons && (
						<div
							className="col-12 col-sm-6 col-md-6"
							style={{ height: '35px' }}
							onClick={this.stopPropagation.bind(this)}
						>
							<Row>{head.buttons}</Row>
						</div>
					)}
					{head.span}
				</Row>
			),
			!this.arrowCardIsOpen() ? null : (
				<div className="pt-3" key="div">
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
			{ 'mini-card': this.props.mini },
		);
		return (
			<div>
				<div className="loading-wrapper">
					{this.props.loading ? <div className="loading-appcard" /> : null}
					{this.props.loading ? <Spinner className="loading-appcard-spinner" type="grow" /> : null}
				</div>
				<div className={classNames} style={this.props.style} onClick={this.props.onClick}>
					{!this.props.arrow
						? this.props.children
						: this.renderWithArrow(this.props.arrowHead, this.props.children)}
					{this.props.star ? (
						<div className="r4_counter__star" onClick={this.props.star.select}>
							{!this.props.star.selectedList ? (
								<i className="far fa-star r4_counter__star--noselected" />
							) : (
								<i className="fas fa-star r4_counter__star--selected" />
							)}
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

AppCard.propTypes = {
	mini: PropTypes.bool,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
	arrowHead: PropTypes.shape({
		buttons: PropTypes.node,
		span: PropTypes.node,
		header: PropTypes.node,
	}),
	chart: PropTypes.bool,
	loading: PropTypes.bool,
	mini: PropTypes.bool,
	className: PropTypes.string,
	style: PropTypes.object,
	star: PropTypes.object,
	onClick: PropTypes.func,
	onToggle: PropTypes.func,
	openTitle: PropTypes.bool,
	arrow: PropTypes.bool,
	arrowForceOpen: PropTypes.bool,
};

AppCard.defaultProps = {
	arrow: false,
	arrowForceOpen: false,
};

export default AppCard;
