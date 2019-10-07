/**
 *
 * PublisherDashboard
 *
 */

import React from 'react';
import 'chartjs-plugin-annotation';
import PublisherRoutes from 'containers/Publisher/routes';
import PublisherHomePage from 'containers/Publisher/components/PublisherHomePage';
import Dashboard from '../Dashboard';

/* eslint-disable react/prefer-stateless-function */
class PublisherDashboard extends React.Component {
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

export default PublisherDashboard;
