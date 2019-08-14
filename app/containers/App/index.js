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
	logout(e) {
		const { persistor } = this.props;
		const url = e.currentTarget.href;
		clearHydrated(persistor).then(() => {
			openUrl(url, false);
		});
		e.preventDefault();
	}

	render() {
		return (
			<div>
				<Switch>
					{indexRoutes.map((prop, key) => (
						<Route
							path={prop.path}
							key={key}
							render={routeProps => (
								<prop.component {...routeProps} onClickLogout={e => this.logout(e)} />
							)}
						/>
					))}
				</Switch>
			</div>
		);
	}
}
export default App;
