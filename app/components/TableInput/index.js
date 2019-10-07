/**
 *
 * TableInput
 *
 */

import React from 'react';
import { Button, Col, Input, Row, InputGroup, InputGroupAddon } from 'reactstrap';
import PropTypes from 'prop-types';
import InlineEditField from '../InlineEditField';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class TableInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value ? props.value : null,
			edit: false,
		};
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(target) {
		if (target.charCode === 13) {
			if (this.state.value) {
				this.onClickSave();
			}
		}
	}

	onClickSave(e) {
		e ? e.preventDefault() : null;
		if (
			typeof this.props.validation === 'function' &&
			this.props.validation(this.state.value) === undefined &&
			this.state.value
		) {
			this.props.onSave(this.state.value);
		}

		if (!this.props.validation && this.state.value) {
			this.props.onSave(this.state.value);
		}
	}

	render() {
		return (
			<Row className="table-input">
				<Col md={12}>
					<InputGroup>
						<Input
							type="text"
							value={this.state.value}
							onChange={e => this.setState({ value: e.target.value })}
							disabled={this.props.disabled || (this.props.value && !this.state.edit)}
							onKeyPress={this.handleKeyPress}
						/>
						{!this.props.disabled ? (
							<InputGroupAddon addonType="append">
								{this.props.value && !this.state.edit && (
									<Button color="success" onClick={() => this.setState({ edit: true })}>
										<i className="fal fa-edit" />
									</Button>
								)}
								{(!this.props.value || this.state.edit) && (
									<Button
										color="info"
										disabled={
											!this.state.value ||
											(typeof this.props.validation === 'function'
												? this.props.validation(this.state.value)
												: null)
										}
										onClick={() => this.props.onSave(this.state.value)}
									>
										<i className="fal fa-check" />
									</Button>
								)}
							</InputGroupAddon>
						) : null}
					</InputGroup>
				</Col>
				<Col>
					<div className="validate-inline-edit-field">
						{typeof this.props.validation === 'function' ? this.props.validation(this.state.value) : null}
					</div>
				</Col>
			</Row>
		);
	}
}

TableInput.propTypes = {
	validation: PropTypes.func,
	onSave: PropTypes.func,
	disabled: PropTypes.bool,
};

export default TableInput;
