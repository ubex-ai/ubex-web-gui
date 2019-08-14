/**
 *
 * Pay
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink, Row, Col, Input, InputGroup, InputGroupAddon, Spinner, FormFeedback } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';
import CrossfadeImage from 'react-crossfade-image';
import messages from './messages';
import { getPayLink } from 'containers/TradingDesk/actions';
import { selectPayLink } from 'containers/TradingDesk/selectors';
import { selectUserGUID, selectUserEmail } from 'containers/UserPage/selectors';
import { btc, eth, ubex, paypal, transfer, visa } from 'containers/Publisher/Variables/PayLogo';
import AppCard from 'components/AppCard';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import validateFloat from 'utils/validateFloat';
import { makePromiseAction } from 'utils/CollectionHelper/actions';

class Pay extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '2',
			disabled: ['3', '5', '6'],
			logo: paypal,
			amount: 0,
			loading: false,
			error: '',
		};
		this.deposit = this.deposit.bind(this);
	}

	toggle(tab, logo) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab,
				logo,
			});
		}
	}

	deposit() {
		const { userGUID, userEmail } = this.props;
		const { amount, activeTab } = this.state;
		if (validateFloat(amount)) {
			this.setState({ error: validateFloat(amount) });
			return;
		}

		if (amount < 500) {
			this.setState({ error: 'Amount must be more than $500' });
			return;
		}

		if (activeTab === '2') {
			this.setState({ loading: true, error: '' });
			this.props
				.getPayLink({
					guid: userGUID,
					email: userEmail,
					amount,
				})
				.then(p => window.location.replace(p.url))
				.catch(() => {
					this.setState({ loading: false, error: 'Request error!' });
				});
		}
	}

	/* componentDidUpdate(prevProps) {
		if (JSON.stringify(prevProps.payLink) !== JSON.stringify(this.props.payLink)) {
			window.location.replace(this.props.payLink[this.props.payLink.length - 1].url);
		}
	} */

	render() {
		return (
			<Row className="margin-0">
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col xs={12} md={12}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.accountbalance} />
									</h1>
								</div>
							</div>
							{CRYPTO_MODE && (
								<Row>
									<Col md={12} style={{ paddingLeft: '5px', paddingRight: '5px' }}>
										<AppCard>
											<h2 className="title" style={{ textAlign: 'center' }}>
												<FormattedMessage {...messages.getBenefit} />
											</h2>
											<Row className="pay-benefits">
												<Col md={3} sm={6} xs={6} className="mt-5">
													<div className="number">1</div>
													<span>
														<FormattedMessage {...messages.bonus5} />
													</span>
												</Col>
												<Col md={3} sm={6} xs={6} className="mt-5">
													<div className="number">2</div>
													<span>
														<FormattedMessage {...messages.noCommission} />
													</span>
												</Col>
												<Col md={3} sm={6} xs={6} className="mt-5">
													<div className="number">3</div>
													<span>
														<FormattedMessage {...messages.crossBorderPayments} />
													</span>
												</Col>
												<Col md={3} sm={6} xs={6} className="mt-5">
													<div className="number">4</div>
													<span>
														<FormattedMessage {...messages.deferredPayment} />
													</span>
												</Col>
											</Row>
										</AppCard>
									</Col>
								</Row>
							)}
							<div className="row card-pay">
								<div className="col-12 col-lg-12 col-xl-12">
									<Row className="">
										<Col md={{ size: 3 }} xs={3}>
											<article className="card center-flex">
												<div className="card-body center-flex">
													<Nav tabs className="nav-pills center-flex" vertical>
														{/* <NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '1',
																})}
																onClick={() => {
																	this.toggle('1', visa);
																}}
															>
																<img src={visa} alt="visa" />
															</NavLink>
														</NavItem> */}
														<NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '2',
																})}
																onClick={() => {
																	this.toggle('2', paypal);
																}}
															>
																<img src={paypal} alt="paypal" />
															</NavLink>
														</NavItem>
														<NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '3',
																	disabled: this.state.disabled.includes('3'),
																})}
																onClick={() => {
																	this.toggle('3', transfer);
																}}
															>
																<img src={transfer} alt="transfer" />
															</NavLink>
														</NavItem>
														{/* <NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '4',
																})}
																onClick={() => {
																	this.toggle('4', ubex);
																}}
															>
																<img src={ubex} alt="ubex" />
															</NavLink>
														</NavItem> */}
														{CRYPTO_MODE && (
															<NavItem>
																<NavLink
																	className={classnames({
																		active: this.state.activeTab === '5',
																		disabled: this.state.disabled.includes('5'),
																	})}
																	onClick={() => {
																		this.toggle('5', eth);
																	}}
																>
																	<img src={eth} alt="ubex" />
																</NavLink>
															</NavItem>
														)}
														{CRYPTO_MODE && (
															<NavItem>
																<NavLink
																	className={classnames({
																		active: this.state.activeTab === '6',
																		disabled: this.state.disabled.includes('6'),
																	})}
																	onClick={() => {
																		this.toggle('6', btc);
																	}}
																>
																	<img src={btc} alt="btc" />
																</NavLink>
															</NavItem>
														)}
													</Nav>
												</div>
											</article>
										</Col>
										<Col md={9} xs={9} xl={6}>
											<article className="card center-flex" id="card_pay">
												<div className="card-body pay-card center-flex">
													<Col md={12} className="image_payment">
														<CrossfadeImage src={this.state.logo} />
													</Col>
													<Col md={12} className="top20 pay-card__title text-center">
														<h3>
															<FormattedMessage {...messages.depositamount} />
														</h3>
													</Col>
													<Col md={9} className="top10">
														<InputGroup>
															<InputGroupAddon addonType="prepend">$</InputGroupAddon>
															<FormattedMessage {...messages.amount}>
																{msg => (
																	<Input
																		type="number"
																		pattern="\d*"
																		placeholder={msg}
																		onChange={e =>
																			this.setState({ amount: e.target.value })
																		}
																	/>
																)}
															</FormattedMessage>
														</InputGroup>
														{this.state.error && (
															<FormFeedback invalid="true">
																{this.state.error}
															</FormFeedback>
														)}
													</Col>
													<Col md={12} className="top20">
														<button
															className="btn btn-primary button-center"
															onClick={this.deposit}
														>
															{!this.state.loading ? (
																<FormattedMessage {...messages.pay} />
															) : (
																<Spinner size="sm" color="light" />
															)}
														</button>
													</Col>
													<Col md={12} className="annotation top40">
														<p>
															<b>
																<FormattedMessage {...messages.payattention} />
															</b>
														</p>
													</Col>
												</div>
											</article>
										</Col>
										<Col xl={3} xs={12}>
											<article className="card card__annotation center-flex">
												<div className="center-flex pay_annotation p-5">
													<h5>
														<FormattedMessage {...messages.payannotation} />
													</h5>
													<ul>
														<li>
															<FormattedMessage {...messages.payannotation1} />
														</li>
														<li>
															<FormattedMessage {...messages.payannotation2} />
														</li>
														<li>
															<FormattedMessage {...messages.payannotation3} />
														</li>
													</ul>
												</div>
											</article>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}
const withConnect = connect(
	createStructuredSelector({
		payLink: selectPayLink(),
		userGUID: selectUserGUID(),
		userEmail: selectUserEmail(),
	}),
	dispatch => ({
		dispatch,
		getPayLink: values => makePromiseAction(dispatch, getPayLink.addEntry(values)),
	}),
);
export default compose(withConnect)(injectIntl(Pay));
