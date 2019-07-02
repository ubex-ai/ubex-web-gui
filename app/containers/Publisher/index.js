/**
 *
 * Publisher
 *
 */

import React from 'react';
import { compose } from 'redux';
import 'chartjs-plugin-annotation';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import PublisherRoutes from 'containers/Publisher/routes';
import PublisherHomePage from 'containers/Publisher/components/PublisherHomePage';
import saga from './saga';
import reducer from './reducer';
import Dashboard from '../Dashboard';

/* eslint-disable react/prefer-stateless-function */
export class Publisher extends React.Component {
	render() {
		return (
			<Dashboard
				location={this.props.location}
				title="Ubex Ad Network"
				description="Ubex Ad Network"
				routes={PublisherRoutes}
				homePage={PublisherHomePage}
				{...this.props}
			/>
		);
	}
}

const withReducer = injectReducer({ key: 'publisher', reducer });
const withSaga = injectSaga({ key: 'publisher', saga }, 'index');
export default compose(
	withReducer,
	withSaga,
)(Publisher);
