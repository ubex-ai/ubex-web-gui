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
import '!!style-loader!css-loader!font-awesome/css/font-awesome.min.css';
import '!!style-loader!css-loader!@icon/open-iconic/open-iconic.css';
import '!!style-loader!css-loader!@kenshooui/react-multi-select/dist/style.css';
import 'assets/scss/complete-admin.scss';
import indexRoutes from 'routes';
class App extends React.Component {
	render() {
		return (
			<div>
				<Switch>
					{indexRoutes.map((prop, key) => (
						<Route path={prop.path} key={key} component={prop.component} />
					))}
				</Switch>
			</div>
		);
	}
}
export default App;
