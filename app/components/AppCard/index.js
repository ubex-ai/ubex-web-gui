/**
 *
 * AppCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import styled from 'styled-components';

function AppCard(props) {
	const classNames = classnames({ r4_counter: true }, { db_box: true }, { 'r4_counter-chart': props.chart });
	return <div className={classNames}>{props.children}</div>;
}

AppCard.propTypes = {
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
	chart: PropTypes.bool,
};

export default AppCard;
