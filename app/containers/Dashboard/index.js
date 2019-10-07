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
import { ToastContainer } from 'react-toastify';
import FullScreenLoader from 'components/FullScreenLoader';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { selectUserData, selectUserLanguage } from 'containers/UserPage/selectors';
import {
	selectAppDidFetch,
	selectAppInitMessage,
	selectAppInitPercent,
	selectAppInitError,
	selectAppInitLoading,
	selectDashboardLoading,
	selectDashboardError,
	selectUbexPopover,
	selectLanguageLoading,
	selectPaymentModal,
	selectCountries,
} from 'containers/Dashboard/selectors';
import { selectBalance, selectPaymentVariants } from 'containers/TradingDesk/selectors';
import { Header, Sidebar, ChatSidebar } from '../../components';

import { updateData, updateProfile, fetchData } from 'containers/UserPage/actions';
import PaymentStatus from 'components/PaymentStatus';
import ProgressLoader from '../../components/ProgressLoader';
import AgreementModal from '../../components/AgreementModal';
import { makePromiseAction } from '../../utils/CollectionHelper/actions';
import { balanceCollectionActions, paymentCollectionActions } from '../TradingDesk/actions';
import { setPaymentModal, getCountries } from './actions';
import PaymentModal from '../../components/PaymentModal';
import WalletConnector from 'components/WalletConnector';

/* eslint-disable react/prefer-stateless-function */
export class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentSuccessModal: false,
			amount: '',
			status: '',
			openWalletConnector: false,
		};
		this.i = 0;
	}

	componentDidMount() {
		const ua = window.navigator.userAgent.toLowerCase();
		const isIe = /trident/gi.test(ua) || /msie/gi.test(ua) || /edge/gi.test(ua);
		if (!isIe) {
			const searchParams = new URLSearchParams(this.props.location.search);
			if (searchParams.get('pay_status')) {
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
		if (this.props.userLanguage) {
			this.props.changeLocale(this.props.userLanguage);
		} else if (this.props.currentLocale) {
			this.props.changeLocale(this.props.currentLocale);
		} else {
			this.props.changeLocale('en');
		}
		this.props.setPaymentModal({ display: false });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			this.props.userLanguage &&
			this.props.currentLocale &&
			prevProps.userLanguage !== this.props.userLanguage &&
			this.props.userLanguage !== this.props.currentLocale
		) {
			this.props.changeLocale(this.props.userLanguage);
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
		const {
			routes,
			homePage,
			title,
			description,
			paymentVariants,
			setPaymentModal,
			countries,
			getPaymentVariantsById,
			paymentModal: { display },
		} = this.props;
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
				<CookieConsent buttonText="I agree!" cookieName="UbexCookie" buttonClasses="button__cookie">
					Cookies help us deliver a better service, Ubex uses cookies to perform analytics and provide content
					and ads tailored to your interests.
					<br />
					By using our services our services or clicking I agree, you agree to our use of cookies. Learn more
					about use of cookies.{' '}
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
				{display && (
					<PaymentModal
						isOpen={display}
						onCancel={ubex => {
							setPaymentModal({ display: !display });
							this.setState({
								openWalletConnector: ubex === 'ubex' || false,
							});
						}}
						data={this.props.selectUbexHash}
						paymentVariants={paymentVariants}
						getMethods={id => getPaymentVariantsById(id)}
						countries={countries}
						getCountries={() => this.props.getCountries()}
					/>
				)}
				<WalletConnector
					isOpen={this.state.openWalletConnector}
					data={this.props.selectUbexHash}
					updateUbex={values => {
						this.setState({
							openWalletConnector: false,
						});
						this.props.updateUbex(values);
						this.props.getUserInfo();
					}}
					onCancel={() => this.setState({ openWalletConnector: false })}
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
	userLanguage: selectUserLanguage(),
	languageLoading: selectLanguageLoading(),
	paymentVariants: selectPaymentVariants.collectionList(),
	paymentModal: selectPaymentModal(),
	countries: selectCountries(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getUserInfo: () => dispatch(fetchData()),
		changeLocale: locale => dispatch(changeLocale(locale)),
		updateProfile: values => dispatch(updateProfile(values)),
		updateUbex: values => dispatch(updateProfile(values)),
		getPaymentVariants: makePromiseAction(dispatch, paymentCollectionActions.getCollection()),
		getPaymentVariantsById: id => dispatch(paymentCollectionActions.getEntry(id)),
		setPaymentModal: values => dispatch(setPaymentModal(values)),
		getCountries: () => makePromiseAction(dispatch, getCountries()),
		// getBalance: () => makePromiseAction(dispatch, balanceCollectionActions.getCollection()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(Dashboard);
