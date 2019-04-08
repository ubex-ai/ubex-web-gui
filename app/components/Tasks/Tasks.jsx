import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';

import Checkbox from 'components/CustomCheckbox/SimpleCheckbox';
import Button from 'components/CustomButton/CustomButton';

class Task extends React.Component {
	render() {
		const tasksList = [];
		let number;
		let edit;
		let remove;
		for (let i = 0; i < this.props.tasks.length; i++) {
			number = `checkbox${i}`;
			edit = `edit${i}`;
			remove = `remove${i}`;
			tasksList.push(
				<tr key={i}>
					<td>
						<Checkbox inputProps={{ value: number, defaultChecked: this.props.tasks[i].checked }} />
					</td>
					<td className="text-left">{this.props.tasks[i].text}</td>
					<td className="td-actions text-right">
						<Button id={edit} round icon iconMini neutral color="info">
							<i className="fa fa-cog" />
						</Button>
						<UncontrolledTooltip placement="top" target={edit} delay={0}>
							Edit Task
						</UncontrolledTooltip>
						<Button id={remove} round icon iconMini neutral color="danger">
							<i className="fa fa-times" />
						</Button>
						<UncontrolledTooltip placement="top" target={remove} delay={0}>
							Remove
						</UncontrolledTooltip>
					</td>
				</tr>,
			);
		}
		return (
			<div className="table-full-width table-responsive">
				<table className="table">
					<tbody>{tasksList}</tbody>
				</table>
			</div>
		);
	}
}

Task.propTypes = {
	tasks: PropTypes.arrayOf(PropTypes.object),
};

export default Task;
