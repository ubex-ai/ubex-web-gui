/**
 *
 * Pay
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, NavLink, Row, Col, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import CrossfadeImage from 'react-crossfade-image';
import messages from 'containers/DataMiner/messages';

import { btc, eth, ubex, paypal, transfer, visa } from 'containers/Publisher/Variables/PayLogo';

class Pay extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			logo: visa,
		};
	}

	toggle(tab, logo) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab,
				logo,
			});
		}
	}

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
							<div className="row card-pay">
								<div className="col-12 col-lg-12 col-xl-12">
									<Row className="">
										<Col md={{ size: 3 }} xs={3}>
											<article className="card center-flex">
												<div className="card-body center-flex">
													<Nav tabs className="nav-pills center-flex" vertical>
														<NavItem>
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
														</NavItem>
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
																})}
																onClick={() => {
																	this.toggle('3', transfer);
																}}
															>
																<img src={transfer} alt="transfer" />
															</NavLink>
														</NavItem>
														<NavItem>
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
														</NavItem>
														<NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '5',
																})}
																onClick={() => {
																	this.toggle('5', eth);
																}}
															>
																<img src={eth} alt="ubex" />
															</NavLink>
														</NavItem>
														<NavItem>
															<NavLink
																className={classnames({
																	active: this.state.activeTab === '6',
																})}
																onClick={() => {
																	this.toggle('6', btc);
																}}
															>
																<img src={btc} alt="btc" />
															</NavLink>
														</NavItem>
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
																{msg => <Input placeholder={msg} type="number" step="1" />}
															</FormattedMessage>
															<InputGroupAddon addonType="append">.00</InputGroupAddon>
														</InputGroup>
													</Col>
													<Col md={12} className="top20">
														<button className="btn btn-primary button-center">
															<FormattedMessage {...messages.pay} />
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

export default Pay;
