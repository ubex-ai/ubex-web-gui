/**
 *
 * Passport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectPassport from './selectors';
import reducer from './reducer';
import saga from './saga';
import { HeaderLogin } from '../../components';
import LoginForm from './components/LoginForm/Loadable';
import SignupForm from './components/SignupForm/Loadable';
import RestorePasswordForm from './components/RestorePasswordForm/Loadable';
import OpenIdBlock from './components/OpenIdBlock';

import * as passportActions from './actions';

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-no-bind */
export class Passport extends React.Component {
	/*
	 https://github.com/ReactTraining/react-router/blob/v3/examples/passing-props-to-children/app.js
	 */
	render() {
		return (
			<div className="wrapper login_page">
				<div className="main-panel__login">
					<div className="body_wrap-auth">
						<Helmet>
							<title>Passport</title>
							<meta name="description" content="Description of Passport" />
						</Helmet>
						<HeaderLogin />
						<div className="body_wrap-auth">
							<div className="container-fluid content">
								<Switch>
									<Route
										exact
										path="/passport"
										component={() => <LoginForm submit={this.props.login} />}
									/>
									<Route
										exact
										path="/passport/login"
										component={() => <LoginForm submit={this.props.login.bind(this)} />}
									/>
									<Route
										path="/passport/signup"
										component={() => <SignupForm submit={this.props.signup.bind(this)} />}
									/>
									<Route
										path="/passport/restore"
										component={() => (
											<RestorePasswordForm submit={this.props.restorePassword.bind(this)} />
										)}
									/>
								</Switch>
								<OpenIdBlock {...this.props} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Passport.propTypes = {
	dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	passport: makeSelectPassport(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		login: (login, password) => dispatch(passportActions.login(login, password)),
		signup: (login, password) => dispatch(passportActions.signup(login, password)),
		restorePassword: (login, password) => dispatch(passportActions.restorePassword(login)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'passport', reducer });
const withSaga = injectSaga({ key: 'passport', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Passport);
