/**
 *
 * TradingDesk
 *
 */
import React from 'react';
import { compose } from 'redux';
import 'chartjs-plugin-annotation';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import TradingDeskRoutes from 'containers/TradingDesk/routes';
import TradingDeskHomePage from 'containers/TradingDesk/components/TradingDeskHomePage';
import saga from './saga';
import reducer from './reducer';
import Dashboard from '../Dashboard';

/* eslint-disable react/prefer-stateless-function */
export class TradingDesk extends React.Component {
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

const withReducer = injectReducer({ key: 'tradingDesk', reducer });
const withSaga = injectSaga({ key: 'tradingDesk', saga }, 'index');
export default compose(
	withReducer,
	withSaga,
)(TradingDesk);
