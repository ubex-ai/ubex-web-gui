/**
 *
 * Dummy
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MainText = styled.span`
	font-size: 2em;
	color: ${props => props.color};
`;

const AdditionalText = styled.span`
	font-size: 1em;
	color: ${props => props.color};
`;

function CreativePreview({ mainTextColor, mainTextVal, additionalTextColor, additionalTextVal, bgImage }) {
	return (
		<div>
			<h2>CreativePreview</h2>
			<MainText color={mainTextColor}>{mainTextVal}</MainText>
			<AdditionalText color={additionalTextColor}>{additionalTextVal}</AdditionalText>
			<img src={bgImage} alt="preview" />
		</div>
	);
}

CreativePreview.propTypes = {
	mainTextColor: PropTypes.string.isRequired,
	mainTextVal: PropTypes.string.isRequired,
	additionalTextColor: PropTypes.string.isRequired,
	additionalTextVal: PropTypes.string.isRequired,
	bgImage: PropTypes.string.isRequired,
};

export default CreativePreview;
