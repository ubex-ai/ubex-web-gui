/**
 *
 * DataMinerDashboard
 *
 */

import React from 'react';
import Dashboard from 'containers/Dashboard';
import DataMinerRoutes from './routes';
import DataMinerHomePage from './components/HomePage';

/* eslint-disable react/prefer-stateless-function */
class DataMinerDashboard extends React.Component {
	render() {
		return (
			<Dashboard
				location={this.props.location}
				title="Ubex Data Miner"
				description="Ubex Data Miner"
				routes={DataMinerRoutes}
				homePage={DataMinerHomePage}
				{...this.props}
			/>
		);
	}
}

export default DataMinerDashboard;
