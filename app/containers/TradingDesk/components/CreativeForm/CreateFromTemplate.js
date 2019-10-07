/**
 *
 * CreativeCreator
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import CreativeCreator from 'components/CreativeCreator';

/* eslint-disable react/prefer-stateless-function */
class CreateFromTemplate extends React.Component {
	render() {
		return (
			<AppCard>
				<CreativeCreator />
			</AppCard>
		);
	}
}

CreateFromTemplate.propTypes = {};

const withConnect = connect(null, dispatch => ({}));

export default compose(withConnect)(CreateFromTemplate);
