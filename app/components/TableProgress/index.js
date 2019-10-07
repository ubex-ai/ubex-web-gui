/**
 *
 * TableProgress
 *
 */

import React from 'react';
import { Progress } from 'reactstrap';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function TableProgress(props) {
	return (
		<div>
			{props.uploaded} / {props.total}
			<Progress animated value={props.value} className="mb-3 height-30">
				<div className="text-right mr-1">{props.value ? parseFloat(props.value).toFixed(2) : 0}%</div>
			</Progress>
		</div>
	);
}

TableProgress.propTypes = {
	value: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	uploaded: PropTypes.number.isRequired,
};

export default TableProgress;
