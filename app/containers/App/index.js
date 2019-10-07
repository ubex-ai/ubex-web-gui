/* eslint-disable react/prefer-stateless-function */
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import openUrl from 'utils/openUrl';
import BlankPage from 'containers/NotFoundPage/Loadable';
import activeContainerRig from 'containers/ContainerManager';
import '!!style-loader!css-loader!font-awesome/css/font-awesome.min.css';
import '!!style-loader!css-loader!@icon/open-iconic/open-iconic.css';
import '!!style-loader!css-loader!@kenshooui/react-multi-select/dist/style.css';
import 'assets/scss/complete-admin.scss';
import history from 'utils/history';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { appInit } from 'containers/Dashboard/actions';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import userReducer from 'containers/UserPage/reducer';
import FullScreenLoader from 'components/FullScreenLoader';
import saga from 'containers/Dashboard/saga';
import reducer from 'containers/Dashboard/reducer';
import { ConnectedRouter } from 'connected-react-router/immutable';
// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import ScrollToTop from '../../components/ScrollToTop';

const indexRoutes = [
	{ path: '/403', name: '403', component: BlankPage },
	{ path: '/404', name: '404', component: BlankPage },
	{ path: '/405', name: '405', component: BlankPage },
	{ path: '/408', name: '408', component: BlankPage },
	{ path: '/500', name: '500', component: BlankPage },
	{ path: '/503', name: '503', component: BlankPage },
	{ path: '/offline', name: 'Offline', component: BlankPage },
	{ path: '/', name: 'Home', component: activeContainerRig.dashboard },
];

async function clearHydrated(persistor) {
	if (!persistor) {
		throw Error('no persist');
	}
	await persistor.purge();
}

class App extends React.Component {
	persistor = null;

	state = {
		storeLoaded: false,
	};

	componentDidMount() {
		// fetch needed data from server on app mount
		this.persistor = this.props.loadStore(() => {
			this.setState(
				{
					storeLoaded: true,
				},
				() => this.props.dispatch(appInit()),
			);
		});
		const persistAppVersion = localStorage.getItem('appVersion');
		if (persistAppVersion !== VERSION) {
			clearHydrated(this.persistor);
			localStorage.setItem('appVersion', VERSION);
		}
	}

	logout(e) {
		const url = e.currentTarget.href;
		clearHydrated(this.persistor).then(() => {
			openUrl(url, false);
		});
		e.preventDefault();
	}

	renderRoutes() {
		return (
			<Switch>
				<ScrollToTop>
					{indexRoutes.map((prop, key) => (
						<Route
							path={prop.path}
							key={key}
							exact={prop.hasOwnProperty('exact') ? prop.exact : false}
							render={routeProps => (
								<prop.component {...routeProps} onClickLogout={e => this.logout(e)} />
							)}
						/>
					))}
				</ScrollToTop>
			</Switch>
		);
	}

	render() {
		if (!this.state.storeLoaded) {
			return <FullScreenLoader />;
		}
		const { messages } = this.props;
		return (
			<LanguageProvider messages={messages}>
				<ConnectedRouter history={history}>{this.renderRoutes()}</ConnectedRouter>
			</LanguageProvider>
		);
	}
}
function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	() => ({}),
	mapDispatchToProps,
);
const withUserReducer = injectReducer({ key: 'user', reducer: userReducer });
const withDashboardReducer = injectReducer({ key: 'dashboard', reducer });
const withSaga = injectSaga({ key: 'dashboard', saga }, 'Dashboard');
const withContainerReducer = injectReducer({ key: activeContainerRig.storeName, reducer: activeContainerRig.reducer });
const withContainerSaga = injectSaga({ key: activeContainerRig.storeName, saga: activeContainerRig.saga });

App.propTypes = {
	dispatch: PropTypes.func.isRequired,
	loadStore: PropTypes.func.isRequired,
	messages: PropTypes.object.isRequired,
};

export default compose(
	withConnect,
	withUserReducer,
	withDashboardReducer,
	withContainerReducer,
	withContainerSaga,
	withSaga,
)(App);
