/**
 *
 * DataMiner
 *
 */

import React from 'react';
import { compose } from 'redux';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Dashboard from 'containers/Dashboard';
import saga from './saga';
import reducer from './reducer';
import DataMinerRoutes from './routes';
import DataMinerHomePage from './components/HomePage';

/* eslint-disable react/prefer-stateless-function */
export class DataMiner extends React.Component {
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

const withReducer = injectReducer({ key: 'dataMiner', reducer });
const withSaga = injectSaga({ key: 'dataMiner', saga }, 'index');
export default compose(
	withReducer,
	withSaga,
)(DataMiner);
