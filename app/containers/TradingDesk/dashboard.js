/**
 *
 * TradingDeskDashboard
 *
 */
import React from 'react';
import 'chartjs-plugin-annotation';
import TradingDeskRoutes from 'containers/TradingDesk/routes';
import TradingDeskHomePage from 'containers/TradingDesk/components/TradingDeskHomePage';
import Dashboard from 'containers/Dashboard';

/* eslint-disable react/prefer-stateless-function */
class TradingDeskDashboard extends React.Component {
	render() {
		return (
			<Dashboard
				location={this.props.location}
				title="Ubex Trading Desk"
				description="Ubex Trading Desk"
				routes={TradingDeskRoutes}
				homePage={TradingDeskHomePage}
				{...this.props}
			/>
		);
	}
}

export default TradingDeskDashboard;
