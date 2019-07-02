/**
 *
 * UbxTablesawControls
 *
 */

import React from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class UbxTablesawControls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tablesawDropdown: false,
		};
	}

	render() {
		const { columns, activeColumns } = this.props;

		const dots = (
			<div className="ubx-tablesaw__navs">
				<Button onClick={() => this.props.prevColumn()}>
					<i className="fa fa-chevron-left" />
				</Button>
				<div className="ubx-tablesaw__dots">
					{columns.map(c => (
						<div
							key={c.key}
							className={`ubx-tablesaw__dot${
								activeColumns.find(d => d.key === c.key) ? ' ubx-tablesaw__dot--active' : ''
							}${c.preventHidden ? ' ubx-tablesaw__dot--prevent' : ''}`}
						>
							<div className="dot" />
						</div>
					))}
				</div>
				<Button onClick={() => this.props.nextColumn()}>
					<i className="fa fa-chevron-right" />
				</Button>
			</div>
		);

		return (
			<div className="ubx-tablesaw__wrapper">
				<div className="ubx-tablesaw__controls">{dots}</div>
			</div>
		);
	}
}
UbxTablesawControls.propTypes = {
	columns: PropTypes.array.isRequired,
	activeColumns: PropTypes.array.isRequired,
	prevColumn: PropTypes.func.isRequired,
	nextColumn: PropTypes.func.isRequired,
	onCheckColumn: PropTypes.func.isRequired,
};

export default UbxTablesawControls;
