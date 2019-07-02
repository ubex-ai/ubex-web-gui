/**
 *
 * TimeTable
 *
 */

import React from 'react';
import { Row, Col, CustomInput } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import AppCard from '../AppCard';
import messages from './messages';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class TimeTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			matrix: [],
			selectedAll: false,
			selectedWorkingTime: false,
			selectedWeekends: false,
			selectedWeekdays: false,
		};
		this.matrix = [];
		this.mouseLeave = [];
		this.mouseEnter = [];
		this.mouseUp = false;
		this.control = null;
		this.dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		this.selectAll = this.selectAll.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.selectWorkingTime = this.selectWorkingTime.bind(this);
		this.selectWeekdays = this.selectWeekdays.bind(this);
		this.selectWeekends = this.selectWeekends.bind(this);
	}

	componentWillMount() {
		this.generateMatrix();
	}

	generateMatrix() {
		for (let i = 0; i <= 7; i++) {
			this.matrix[i] = [];
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = !!this.props.selectAll;
			}
		}
		if (this.props.initialValues && this.props.initialValues.length) {
			this.setState({ matrix: this.props.initialValues });
		} else {
			this.selectWorkingTime();
			this.setState({ matrix: this.matrix, selectedAll: !!this.props.selectAll });
		}
		this.props.onUpdate(this.matrix);
	}

	selectTime(i, p) {
		this.matrix[i][p] = !this.matrix[i][p];
		this.setState({ matrix: this.matrix });
		this.props.onUpdate(this.matrix);
	}

	toggleDate(i, p) {
		this.matrix[i][p] = !this.checkDaySelected(i);
		for (let j = 1; j <= 24; j++) {
			this.matrix[i][j] = this.matrix[i][p];
		}
		this.setState({ matrix: this.matrix });
		this.props.onUpdate(this.matrix);
	}

	toggleHour(i, p) {
		this.matrix[i][p] = !this.checkHourSelected(p);
		for (let j = 0; j < 7; j++) {
			this.matrix[j][p] = this.matrix[i][p];
		}
		this.setState({ matrix: this.matrix });
		this.props.onUpdate(this.matrix);
	}

	onMouseDown(i, p) {
		this.mouseLeave = [i, p];
	}

	onMouseUp(i, p) {
		this.mouseEnter = [i, p];
		this.selectMouse();
	}

	selectMouse() {
		if (this.mouseLeave[0] > this.mouseEnter[0]) {
			for (let j = this.mouseLeave[0]; j >= this.mouseEnter[0]; j--) {
				for (let g = this.mouseLeave[1]; g <= this.mouseEnter[1]; g++) {
					this.matrix[j][g] = true;
				}
			}
		} else if (this.mouseLeave[1] < this.mouseEnter[1]) {
			for (let j = this.mouseLeave[0]; j <= this.mouseEnter[0]; j++) {
				for (let g = this.mouseLeave[1]; g <= this.mouseEnter[1]; g++) {
					this.matrix[j][g] = true;
				}
			}
		} else {
			for (let j = this.mouseLeave[0]; j <= this.mouseEnter[0]; j++) {
				for (let g = this.mouseLeave[1]; g >= this.mouseEnter[1]; g--) {
					this.matrix[j][g] = true;
				}
			}
		}

		this.setState({ matrix: this.matrix });
		this.props.onUpdate(this.matrix);
	}

	checkHourSelected(p) {
		for (let i = 0; i < 7; i++) {
			if (!this.matrix[i][p]) {
				return false;
			}
		}
		return true;
	}

	checkDaySelected(i) {
		for (let p = 1; p <= 24; p++) {
			if (!this.matrix[i][p]) {
				return false;
			}
		}
		return true;
	}

	selectAll(e) {
		e.preventDefault();
		for (let i = 0; i <= 7; i++) {
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = true;
			}
		}
		this.setState({
			matrix: this.matrix,
			selectedAll: true,
			selectedWeekends: false,
			selectedWeekdays: false,
			selectedWorkingTime: false,
		});
		this.props.onUpdate(this.matrix);
	}

	checkSelectedWorkingTime() {
		for (let i = 0; i <= 4; i++) {
			for (let j = 9; j <= 20; j++) {
				if (!this.matrix[i][j]) {
					return false;
				}
			}
		}
		return true;
	}

	clearTable() {
		for (let i = 0; i <= 7; i++) {
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = false;
			}
		}
	}

	selectWorkingTime(e) {
		if (e) {
			e.preventDefault();
		}
		this.clearTable();
		for (let i = 0; i <= 4; i++) {
			for (let j = 9; j <= 20; j++) {
				this.matrix[i][j] = true;
			}
		}
		this.setState({
			matrix: this.matrix,
			selectedAll: false,
			selectedWeekends: false,
			selectedWeekdays: false,
			selectedWorkingTime: true,
		});
		this.props.onUpdate(this.matrix);
	}

	selectWeekends(e) {
		e.preventDefault();
		this.clearTable();
		for (let i = 5; i <= 7; i++) {
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = true;
			}
		}
		this.setState({
			matrix: this.matrix,
			selectedAll: false,
			selectedWeekends: true,
			selectedWeekdays: false,
			selectedWorkingTime: false,
		});
		this.props.onUpdate(this.matrix);
	}

	selectWeekdays(e) {
		e.preventDefault();
		this.clearTable();
		for (let i = 0; i <= 4; i++) {
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = true;
			}
		}
		this.setState({
			matrix: this.matrix,
			selectedAll: false,
			selectedWeekends: false,
			selectedWeekdays: true,
			selectedWorkingTime: false,
		});
		this.props.onUpdate(this.matrix);
	}

	unselectAll(e) {
		e.preventDefault();
		for (let i = 0; i <= 7; i++) {
			for (let j = 0; j <= 24; j++) {
				this.matrix[i][j] = false;
			}
		}
		this.setState({
			matrix: this.matrix,
			selectedAll: false,
			selectedWeekends: false,
			selectedWeekdays: false,
			selectedWorkingTime: false,
		});
		this.props.onUpdate(this.matrix);
	}

	renderDayCell(i, p) {
		if (p > 0) {
			return <i className={`fas fa-${this.state.matrix[i][p] ? 'plus' : 'minus'}`} />;
		}
		return [
			<CustomInput
				type="checkbox"
				id={`day${i}`}
				onChange={() => this.toggleDate(i, p)}
				checked={this.checkDaySelected(i)}
			/>,
			this.dayOfWeek[i],
		];
	}

	renderHourCell(i, p) {
		return [
			<CustomInput
				type="checkbox"
				id={`hour${p}`}
				onChange={() => this.toggleHour(i, p)}
				checked={this.checkHourSelected(p)}
			/>,
			<span>
				{moment(p - 1, 'h').format('HH')}
				<br />
				{moment(p, 'h').format('HH')}
			</span>,
		];
	}

	generateTable() {
		return (
			<table className="table dx-g-bs4-table targeting-table">
				<tbody>
					{this.state.matrix.map((item, i) => (
						<tr key={i} id={`tr${i}`}>
							{this.state.matrix[i].map((prop, p) => (
								<td
									id={`td${p}`}
									className={!this.state.matrix[i][p] ? 'unselected' : 'selected'}
									onClick={() => (p > 0 && i < 7 ? this.selectTime(i, p) : null)}
									onMouseDown={e => {
										if (e.nativeEvent.which) {
											this.onMouseDown(i, p);
											this.mouseUp = false;
										}
									}}
									onMouseEnter={e => {
										if (e.nativeEvent.which && !this.mouseUp) {
											this.onMouseUp(i, p);
										}
									}}
									onMouseUp={e => {
										if (e.nativeEvent.which) {
											this.mouseUp = true;
										}
									}}
								>
									{i !== 7 ? this.renderDayCell(i, p) : this.renderHourCell(i, p)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		);
	}

	render() {
		return (
			<div className="timetable-wrapper">
				<div className="timetable-wrapper__buttons">
					<button onClick={!this.state.selectedAll ? this.selectAll : this.unselectAll}>
						{!this.state.selectedAll ? (
							<FormattedMessage {...messages.selectAll} />
						) : (
							<FormattedMessage {...messages.unselectAll} />
						)}
					</button>
					<button
						className="button-margin-left-10"
						style={this.state.selectedWorkingTime ? { color: '#000' } : null}
						onClick={!this.selectedWorkingTime ? this.selectWorkingTime : null}
					>
						<FormattedMessage {...messages.selectWorkingTime} />
					</button>
					<button
						className="button-margin-left-10"
						onClick={!this.state.selectedWeekends ? this.selectWeekends : null}
						style={this.state.selectedWeekends ? { color: '#000' } : null}
					>
						<FormattedMessage {...messages.selectWeekends} />
					</button>
					<button
						className="button-margin-left-10"
						onClick={!this.state.selectedWeekdays ? this.selectWeekdays : null}
						style={this.state.selectedWeekdays ? { color: '#000' } : null}
					>
						<FormattedMessage {...messages.selectWeekedays} />
					</button>
				</div>
				<div className="timetable-wrapper__table">{this.generateTable()}</div>
			</div>
		);
	}
}

TimeTable.propTypes = {};

export default TimeTable;
