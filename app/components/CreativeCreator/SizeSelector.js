/**
 *
 * Dummy
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function SizeSelector() {
	return <div>SizeSelector</div>;
}

SizeSelector.propTypes = {
	sizes: PropTypes.array.isRequired,
	onChangeSize: PropTypes.func.isRequired,
};

export default SizeSelector;
