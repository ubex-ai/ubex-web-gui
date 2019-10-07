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
import classNames from 'classnames';

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

function fixDate(values, type) {
	let dates = values;
	if (type === 'date-range') {
		if (dates.startDate === 'unlimited' || dates.startDate === null) {
			dates.startDate = moment().toDate();
		}
		if (dates.endDate === 'unlimited' || dates.endDate === null) {
			dates.endDate = moment().toDate();
		}
	}

	if (type === 'date') {
		if (dates === 'unlimited' || dates === null) {
			dates = moment().toDate();
		}
	}

	return dates;
}
class InlineEditField extends React.Component {
	constructor(props) {
		super(props);
		this.values = props.values;
		this.state = {
			editMode: false,
			value: fixDate(props.value, props.type),
			minTime: moment().toDate(),
		};
		this.onClickSave = this.onClickSave.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
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
				this.setState({ value: fixDate(this.state.value, this.props.type) });
			}
			if (this.props.type === 'date') {
				this.props.onSave(this.state.value);
				this.setState({ value: fixDate(this.state.value, this.props.type) });
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
			<InputGroupAddon addonType="prepend" size={this.props.size} key={this.props.id}>
				$
			</InputGroupAddon>,
			<Input
				key={this.props.id}
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
				key={this.props.id}
				selected={formatDateFromUTC(this.state.value).toDate()}
				onChange={date => this.setState({ value: date || null })}
				placeholderText="Select date"
				dateFormat="dd.MM.yyyy HH:mm"
				showTimeSelect
				timeFormat="HH:mm"
				timeIntervals={15}
				timeCaption="time"
				minDate={this.props.startDate ? moment(this.props.startDate).toDate() : moment().toDate()}
			/>
		);
	}

	renderDateRangeInput() {
		return (
			<DateWrapper key={this.props.id}>
				<DatePicker
					key={this.props.id}
					selected={formatDateFromUTC(this.state.value.startDate).toDate()}
					selectsStart
					popperPlacement="top-start"
					startDate={
						this.state.value.startDate !== null
							? formatDateFromUTC(this.state.value.startDate).toDate()
							: moment().toDate()
					}
					endDate={
						this.state.value.endDate !== null
							? formatDateFromUTC(this.state.value.endDate).toDate()
							: moment().toDate()
					}
					onChange={date =>
						date
							? this.setState({ value: { startDate: date, endDate: this.state.value.endDate } })
							: this.setState({ value: { startDate: null, endDate: this.state.value.endDate } })
					}
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={15}
					dateFormat="dd.MM.yyyy HH:mm"
					timeCaption="time"
					minDate={moment().toDate()}
					minTime={this.state.minTime}
					maxTime={moment()
						.hours(23)
						.minutes(45)}
				/>
				<DatePicker
					key={this.props.id + 1}
					selected={
						this.state.value.endDate !== null
							? formatDateFromUTC(this.state.value.endDate).toDate()
							: moment().toDate()
					}
					selectsEnd
					startDate={
						this.state.value.startDate !== null
							? formatDateFromUTC(this.state.value.startDate).toDate()
							: moment().toDate()
					}
					endDate={
						this.state.value.endDate !== null
							? formatDateFromUTC(this.state.value.endDate).toDate()
							: moment().toDate()
					}
					onChange={date =>
						date
							? this.setState({
									value: { startDate: this.state.value.startDate, endDate: date },
							  })
							: this.setState({ value: { startDate: this.state.value.startDate, endDate: null } })
					}
					showTimeSelect
					timeFormat="HH:mm"
					timeIntervals={15}
					dateFormat="dd.MM.yyyy HH:mm"
					timeCaption="time"
					minDate={this.state.startDate}
					minTime={
						formatDateFromUTC(this.state.startDate).format('DD-MM-YYYY') ===
						moment(this.state.endDate ? this.state.endDate : moment()).format('DD-MM-YYYY')
							? this.state.minTime
							: moment()
									.startOf('day')
									.toDate()
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
				key={this.props.id}
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
				key={this.props.id}
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
		if (typeof this.props.onClick === 'function') {
			this.props.onClick(null);
		}
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside, false);
	}

	componentWillMount() {
		document.addEventListener('mousedown', this.handleClickOutside, false);
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ editMode: false });
		}
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
					<InlineWrapper
						onClick={e =>
							this.props.hasOwnProperty('permissions') && this.props.permissions
								? this.onClickEdit(e)
								: null
						}
						key={this.props.id}
					>
						<div
							className={classNames({
								'mr-1': true,
								'text-warning':
									this.props.value.startDate !== 'unlimited' &&
									moment(this.props.value.startDate) > moment(),
							})}
						>
							{formatDateFromUTC(this.props.value.startDate).format('DD.MM.YY')}
						</div>
						/
						<div
							className={classNames({
								'ml-1': true,
								'text-danger':
									this.props.value.endDate !== 'unlimited' &&
									moment(this.props.value.endDate) < moment(),
							})}
						>
							{this.props.value.endDate !== 'unlimited'
								? formatDateFromUTC(this.props.value.endDate).format('DD.MM.YY')
								: 'no limit'}
						</div>
						<i className="fa fa-edit" key={this.props.id} />
					</InlineWrapper>
				);
			case 'date':
				return (
					<InlineWrapper
						onClick={e =>
							this.props.hasOwnProperty('permissions') && this.props.permissions
								? this.onClickEdit(e)
								: null
						}
						key={this.props.id}
					>
						{this.props.value !== 'unlimited'
							? formatDateFromUTC(this.props.value).format('DD.MM.YY')
							: 'no limit'}
						<i className="fa fa-edit" key={this.props.id} />
					</InlineWrapper>
				);
			case 'price':
				return (
					<InlineWrapper
						onClick={e =>
							this.props.hasOwnProperty('permissions') && this.props.permissions
								? this.onClickEdit(e)
								: null
						}
						key={this.props.id}
					>
						<p style={{ marginBottom: 0 }}>{this.props.value === 0 ? 'no limit' : this.props.value}</p>{' '}
						<i className="fa fa-edit" />
					</InlineWrapper>
				);
			default:
				return (
					<InlineWrapper
						onClick={e =>
							this.props.hasOwnProperty('permissions') && this.props.permissions
								? this.onClickEdit(e)
								: null
						}
						key={this.props.id}
					>
						<p style={{ marginBottom: 0 }}>{this.props.value}</p> <i className="fa fa-edit" />
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
			<InputWrapper {...wrapperProps} key={this.props.id}>
				<InputGroup size={this.props.size} key={this.props.id}>
					{this.renderInput()}
					{this.renderEditControls()}
				</InputGroup>
				<div className="validate-inline-edit-field" key={this.props.id}>
					{typeof this.props.validation === 'function' ? this.props.validation(this.state.value) : null}
				</div>
			</InputWrapper>
		);
	}

	renderEditControls() {
		return (
			<InputGroupAddon addonType="append" key={this.props.id}>
				<Button
					color="info"
					onClick={this.onClickSave}
					size={this.props.size}
					disabled={!this.state.value && this.props.type !== 'date'}
					key={this.props.id}
				>
					<i className="fas fa-save" />
				</Button>
				<Button
					key={this.props.id}
					color="danger"
					onClick={() => {
						this.setState({ editMode: false, value: fixDate(this.state.value, this.props.type) });
						if (typeof this.props.onCancel === 'function') {
							this.props.onCancel();
						}
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
			return !this.state.editMode ? (
				<div key={this.props.id}>{this.renderSource()}</div>
			) : (
				<div key={this.props.id}>{this.renderEditable()}</div>
			);
		}

		return (
			<div key={this.props.id} ref={this.setWrapperRef}>
				{[this.renderSource(), !this.state.editMode ? null : this.renderEditable()]}
			</div>
		);
	}
}

InlineEditField.propTypes = {
	id: PropTypes.string,
	validation: PropTypes.func,
	forceHide: PropTypes.bool,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number]),
	onSave: PropTypes.func,
	onCancel: PropTypes.func,
	onClick: PropTypes.func,
	format: PropTypes.string,
	inline: PropTypes.bool,
	type: PropTypes.oneOf(['text', 'date', 'date-range', 'price']),
	size: PropTypes.oneOf(['sm', 'xs', 'md', 'lg', 'xl']),
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
