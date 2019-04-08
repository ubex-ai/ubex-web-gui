/**
 *
 * ProgressLoader
 *
 */

import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class ProgressLoader extends React.Component {
	render() {
		const { show, percent, className } = this.props;
		return <LinearProgress className={className} value={percent || 0} />;
	}
}

ProgressLoader.defaultProps = {
	className: '',
};
ProgressLoader.propTypes = {
	percent: PropTypes.number,
	show: PropTypes.bool,
	className: PropTypes.string,
};

export default ProgressLoader;
