/**
 *
 * DashboardInner
 *
 */

import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import CookieConsent from 'react-cookie-consent';
import FullScreenLoader from 'components/FullScreenLoader';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { selectUserData } from 'containers/UserPage/selectors';
import {
	selectAppDidFetch,
	selectAppInitMessage,
	selectAppInitPercent,
	selectAppInitError,
	selectAppInitLoading,
	selectDashboardLoading,
	selectDashboardError,
	selectUbexPopover,
} from 'containers/Dashboard/selectors';
import { selectBalance } from 'containers/TradingDesk/selectors';
import { Header, Sidebar, ChatSidebar } from '../../components';
import { setUbexPopover } from 'containers/Dashboard/actions';
import ProgressLoader from '../../components/ProgressLoader';
import AgreementModal from '../../components/AgreementModal';
import { ToastContainer } from 'react-toastify';
import { updateData } from 'containers/UserPage/actions';
import { Button } from 'reactstrap';
import PaymentStatus from 'components/PaymentStatus';

/* eslint-disable react/prefer-stateless-function */
export class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentSuccessModal: false,
			amount: '',
			status: '',
		};
	}

	componentDidMount() {
		const ua = window.navigator.userAgent.toLowerCase();
		const is_ie = /trident/gi.test(ua) || /msie/gi.test(ua)
		if(!is_ie) {
			const searchParams = new URLSearchParams(this.props.location.search);
			if(searchParams.get('pay_status')){
				this.props.history.push({
					pathname: '/',
					search: '',
				});
			}
			if (searchParams.get('pay_status') === 'error' || searchParams.get('pay_status') === 'success') {
				this.setState({
					paymentSuccessModal: true,
					amount: searchParams.get('amount'),
					status: searchParams.get('pay_status'),
				});
			}
		}
	}

	closePaymentModal() {
		this.setState({ paymentSuccessModal: false, amount: '', status: '' });
	}

	/* eslint-disable react/no-string-refs */
	render() {
		if (this.props.appInitLoading && !this.props.appDidFetch) {
			return (
				<FullScreenLoader
					className="FullScreenLoader__container"
					/* message={
						this.props.appInitPercent > 0
							? `${this.props.appInitMessage}: ${this.props.appInitPercent}%`
							: `Loading: ${this.props.appInitPercent}%`
					} */
				/>
			);
		}
		const { routes, homePage, title, description } = this.props;
		return (
			<div className="wrapper">
				<Helmet>
					<title>{title}</title>
					<meta name="description" content={description} />
				</Helmet>
				<Sidebar {...this.props} routes={routes} />
				<div className="main-panel" ref="mainPanel">
					<Header {...this.props} />
					<div>
						<div className="content">
							{this.props.dashboardLoading && <ProgressLoader className="progressLoader" />}
							<Switch>
								{routes.map((prop, key) => {
									if (prop.child) {
										return prop.child.map((prop2, key2) => (
											<Route path={prop2.path} component={prop2.component} key={key2} />
										));
									}
									if (prop.redirect) return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
									return <Route path={prop.path} component={prop.component} key={key} />;
								})}
								<Route path="/" component={homePage} key="default" />
							</Switch>
						</div>
					</div>
				</div>
				<ChatSidebar {...this.props} routes={routes} />
				<CookieConsent buttonText="Got it!" cookieName="UbexCookie" buttonClasses="button__cookie">
					This website uses cookies to enhance the user experience.{' '}
					<a href="https://static.ubex.io/legal/policy.pdf" target="_blank">
						Learn more
					</a>
				</CookieConsent>
				<AgreementModal />
				<ToastContainer />
				<PaymentStatus
					isOpen={this.state.paymentSuccessModal}
					amount={this.state.amount}
					status={this.state.status}
					onCancel={() => this.closePaymentModal()}
				/>
			</div>
		);
	}
}

Dashboard.propTypes = {
	dispatch: PropTypes.func.isRequired,
	routes: PropTypes.array.isRequired,
	homePage: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
	location: PropTypes.object.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
};

Dashboard.defaultValue = {
	title: 'Ubex Dashboard',
	description: 'Ubex Dashboard',
};

const mapStateToProps = createStructuredSelector({
	appInitLoading: selectAppInitLoading(),
	currentLocale: makeSelectLocale(),
	userData: selectUserData(),
	appDidFetch: selectAppDidFetch(),
	dashboardError: selectDashboardError(),
	dashboardLoading: selectDashboardLoading(),
	appInitMessage: selectAppInitMessage(),
	appInitPercent: selectAppInitPercent(),
	appInitError: selectAppInitError(),
	selectUbexPopover: selectUbexPopover(),
	selectUbexHash: selectUserData(),
	selectAmount: selectBalance(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		changeLocale: locale => dispatch(changeLocale(locale)),
		setUbexPopover: values => dispatch(setUbexPopover(values)),
		updateUbex: values => dispatch(updateData(values)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(Dashboard);
