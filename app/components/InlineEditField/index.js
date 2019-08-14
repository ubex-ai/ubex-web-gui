/**
 *
 * InlineEditField
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, InputGroup, InputGroupAddon, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import makeid from 'utils/makeid';
import formatDateFromUTC from 'utils/formatDateFromUTC';

const InlineWrapper = styled.span`
	cursor: pointer;
	border: 1px solid transparent;
	max-width: 450px;
	display: flex;
	align-items: center;
	p {
		 white-space: nowrap;
		 text-overflow: ellipsis;
		 overflow: hidden;
		 margin-bottom: 0;
	}
	& > .fa {
		opacity: 0.85;
		margin-left: 5px;
	}
	&:hover {
		& > .fa {
			opacity: 1;
		}
		background: #fff;
		border: 1px solid #ced4da;
	}
`;

const InputWrapper = styled.div`
	z-index: 1000;
	border-top-right-radius: 6px;
	border-bottom-right-radius: 6px;
	display: inline-block;
	${({ x, y, pos }) =>
		`   position: ${pos};
			top: ${y}px;
			left: ${x}px;
			box-shadow: ${pos === 'fixed' ? '0 1px 3px rgba(33, 33, 33, 0.2)' : 'none'};
			.input-group {
				max-width: ${pos === 'fixed' ? '160px' : 'none'};
			}
		`};
`;

const InheritInput = styled.input`
	background-color: transparent;
	border: 1px solid rgba(0, 0, 0, 0.2);
	border-radius: 0;
	box-shadow: none;
	font-size: inherit;
`;

const DateWrapper = styled.div`
	display: flex;
	flex-direction: row;
	min-width: 18rem;
	.react-datepicker-popper {
		width: 375px;
	}
`;

/* eslint-disable react/prefer-stateless-function */
class InlineEditField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editMode: false,
			value: props.value,
			minTime: moment(),
		};
		this.onClickSave = this.onClickSave.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleKeyPress(target) {
		if (target.charCode === 13) {
			if (
				typeof this.props.validation === 'function' &&
				this.props.validation(this.state.value) === undefined &&
				this.state.value
			) {
				this.onClickSave();
			}
			if (!this.props.validation && this.state.value) {
				this.onClickSave();
			}
		}
	}

	onClickSave(e) {
		if (typeof this.props.onSave === 'function') {
			if (
				typeof this.props.validation === 'function' &&
				this.props.validation(this.state.value) === undefined &&
				this.state.value &&
				this.props.type === 'price'
			) {
				this.props.onSave(this.state.value);
			}
			if (this.state.value && (this.props.type === 'date-range' || this.props.type === 'date')) {
				this.props.onSave(this.state.value);
			}
			if (this.state.value && this.props.type === 'text') {
				this.props.onSave(this.state.value);
			}
		}
		this.setState({
			editMode: false,
		});
	}

	renderPriceInput() {
		return [
			<InputGroupAddon addonType="prepend" size={this.props.size}>
				$
			</InputGroupAddon>,
			<Input
				value={this.state.value}
				size={this.props.size}
				onChange={e => this.setState({ value: e.target.value })}
				onKeyPress={this.handleKeyPress}
			/>,
		];
	}

	renderDateInput() {
		return (
			<DatePicker
				selected={this.state.value !== 'unlimited' ? formatDateFromUTC(this.state.value) : formatDateFromUTC(this.props.startDate ? moment(this.props.startDate).format('MM-DD-YYYY') : moment().format('MM-DD-YYYY'))}
				onChange={date => this.setState({ value: date })}
				placeholderText="Select date"
				dateFormat="DD.MM.YYYY HH:mm"
				showTimeSelect
				timeFormat="HH:mm"
				timeIntervals={15}
				timeCaption="time"
				minDate={this.props.startDate ? moment(this.props.startDate) : moment()}
			/>
		);
	}

	renderDateRangeInput() {
		return (
			<DateWrapper>
				<DatePicker
					selected={formatDateFromUTC(this.state.value.startDate)}
					selectsStart
					popperPlacement="top-start"
					startDate={formatDateFromUTC(this.state.value.startDate)}
					endDate={formatDateFromUTC(this.state.value.endDate)}
					onChange={date => this.setState({ value: { startDate: date, endDate: this.state.value.endDate } })}
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={15}
					dateFormat="DD.MM.YYYY HH:mm"
					timeCaption="time"
					minDate={moment()}
					minTime={this.state.minTime}
					maxTime={moment()
						.hours(23)
						.minutes(45)}
				/>
				<DatePicker
					selected={
						this.state.value.endDate !== 'unlimited' ? formatDateFromUTC(this.state.value.endDate) : null
					}
					selectsEnd
					startDate={formatDateFromUTC(this.state.value.startDate)}
					endDate={formatDateFromUTC(this.state.value.endDate)}
					onChange={date =>
						this.setState({ value: { startDate: this.state.value.startDate, endDate: date } })
					}
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={15}
					dateFormat="DD.MM.YYYY HH:mm"
					timeCaption="time"
					minDate={this.state.startDate}
					minTime={
						formatDateFromUTC(this.state.startDate).format('DD-MM-YYYY') ===
						moment(this.state.endDate ? this.state.endDate : moment()).format('DD-MM-YYYY')
							? this.state.minTime
							: moment().startOf('day')
					}
					maxTime={moment()
						.hours(23)
						.minutes(45)}
				/>
			</DateWrapper>
		);
	}

	renderDefaultInput() {
		return (
			<Input
				size={this.props.size}
				value={this.state.value}
				onChange={e => this.setState({ value: e.target.value })}
				onKeyPress={this.handleKeyPress}
			/>
		);
	}

	renderInheritInput() {
		return (
			<InheritInput
				value={this.state.value}
				onChange={e => this.setState({ value: e.target.value })}
				onKeyPress={this.handleKeyPress}
			/>
		);
	}

	renderInput() {
		if (this.props.inline) {
			return this.renderInheritInput();
		}
		switch (this.props.type) {
			case 'price':
				return this.renderPriceInput();
			case 'date':
				return this.renderDateInput();
			case 'date-range':
				return this.renderDateRangeInput();
			default:
				return this.renderDefaultInput();
		}
	}

	onClickEdit(e) {
		const { target } = e;
		const { top, left } = target.getBoundingClientRect();
		this.setState({ editMode: true, x: left - 20, y: top - 5 });
		this.props.onClick(null);
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.forceHide && this.props.forceHide && this.state.editMode) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState({
				editMode: false,
			});
		}
	}

	renderSource() {
		switch (this.props.type) {
			case 'date-range':
				return (
					<InlineWrapper onClick={e => this.onClickEdit(e)}>
						{`${formatDateFromUTC(this.props.value.startDate).format('DD-MM-YYYY')} / ${
							this.props.value.endDate !== 'unlimited'
								? formatDateFromUTC(this.props.value.endDate).format('DD-MM-YYYY')
								: 'unlimited'
						}`}{' '}
						<i className="fa fa-edit" />
					</InlineWrapper>
				);
			case 'date':
				return (
					<InlineWrapper onClick={e => this.onClickEdit(e)}>
						{this.props.value !== 'unlimited'
							? formatDateFromUTC(this.props.value).format('DD-MM-YYYY')
							: 'unlimited'}
						<i className="fa fa-edit" />
					</InlineWrapper>
				);
			default:
				return (
					<InlineWrapper onClick={e => this.onClickEdit(e)}>
						<p>{this.props.value}</p> <i className="fa fa-edit" />
					</InlineWrapper>
				);
		}
	}

	renderEditable() {
		const wrapperProps = {
			pos: this.props.inline ? 'relative' : 'fixed',
			x: this.props.inline ? 0 : this.state.x,
			y: this.props.inline ? 0 : this.state.y,
		};

		return (
			<InputWrapper {...wrapperProps}>
				<InputGroup size={this.props.size}>
					{this.renderInput()}
					{this.renderEditControls()}
				</InputGroup>
				<div className="validate-inline-edit-field">
					{typeof this.props.validation === 'function' ? this.props.validation(this.state.value) : null}
				</div>
			</InputWrapper>
		);
	}

	renderEditControls() {
		return (
			<InputGroupAddon addonType="append">
				<Button color="info" onClick={this.onClickSave} size={this.props.size} disabled={!this.state.value}>
					<i className="fas fa-save" />
				</Button>
				<Button
					color="danger"
					onClick={() => {
						this.setState({ editMode: false });
						this.props.onCancel();
					}}
					size={this.props.size}
				>
					<i className="fas fa-times" />
				</Button>
			</InputGroupAddon>
		);
	}

	render() {
		if (this.props.inline) {
			return !this.state.editMode ? this.renderSource() : this.renderEditable();
		}

		return [this.renderSource(), !this.state.editMode ? null : this.renderEditable()];
	}
}

InlineEditField.propTypes = {
	id: PropTypes.string,
	validation: PropTypes.func,
	forceHide: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	onClick: PropTypes.func,
	format: PropTypes.string,
	inline: PropTypes.bool,
	type: PropTypes.oneOf(['text', 'date', 'date-range', 'price']),
	size: PropTypes.oneOf(['xs', 'md', 'lg', 'xl']),
};

InlineEditField.defaultProps = {
	id: makeid(5),
	forceHide: false,
	size: 'md',
	type: 'text',
	inline: false,
	format: 'DD-MM-YYYY',
};

export default InlineEditField;
