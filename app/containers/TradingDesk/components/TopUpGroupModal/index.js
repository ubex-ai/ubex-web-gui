/**
 *
 * TopUpGroupModal
 *
 */

import React from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	InputGroup,
	InputGroupAddon,
	Row,
	Col,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	InputGroupButtonDropdown,
	FormText,
	FormFeedback,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Slider from 'rc-slider';
import { FormattedMessage } from 'react-intl';
import IntlFieldGroup from 'components/IntlFieldGroup';
import validateFloat from 'utils/validateFloat';
import validateInteger from 'utils/validateInteger';
import messages from '../../messages';
import request from '../../../../utils/request';
import getCookie from '../../../../utils/getCookie';

/* eslint-disable react/prefer-stateless-function */
const initialState = {
	open: false,
	paymentValueUSD: 0,
	paymentValueUbex: 0,
	dropdownOpen: false,
	activeCurrency: 'USD',
	paymentError: false,
	ubexCurrency: 0,
};

class TopUpGroupModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			paymentValueUSD: 0,
			paymentValueUbex: 0,
			dropdownOpen: false,
			activeCurrency: 'USD',
			paymentError: false,
			ubexCurrency: 0,
		};
		this.toggle = this.toggle.bind(this);
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.setValue = this.setValue.bind(this);
	}

	componentDidMount() {
		this.setState(initialState);
		this.getUbexCurrency();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!prevProps.hashTransaction && this.props.hashTransaction) {
			this.setState(initialState);
		}
	}

	componentWillUnmount() {
		this.setState(initialState);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	handle = value => {
		const val = value * 1000;
		this.setState({ paymentValue: val });
	};

	toggleDropDown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
			paymentValueUSD: 0,
			paymentValueUbex: 0,
			paymentError: false,
		});
	}

	getUbexCurrency() {
		request(
			'https://min-api.cryptocompare.com/data/price?fsym=UBEX&tsyms=USD&api_key=6ba15d8d8c1496f2bd0aadfa4a5666cceb2c7648036268c472980841b9165f82',
			{
				method: 'get',
			},
		)
			.then(response => {
				this.setState({
					ubexCurrency: response.data.USD,
				});
			})
			.catch(() => {
				this.setState({
					ubexCurrency: 30000000,
				});
			});
	}

	setValue(e, type) {
		const { ubexBalance, usdBalance } = this.props;
		if (!validateFloat(e.target.value)) {
			if (type === 'USD') {
				if (usdBalance > 0 && parseFloat(e.target.value) > 0 && parseFloat(e.target.value) <= usdBalance) {
					this.setState({ paymentValueUSD: e.target.value, paymentError: false });
				} else if (!parseFloat(e.target.value)) {
					this.setState({
						paymentError: 'Enter valid number (ex.: 512.00)',
						paymentValueUSD: e.target.value,
					});
				} else {
					this.setState({ paymentError: 'No enough USD', paymentValueUSD: e.target.value });
				}
			} else if (ubexBalance > 0 && e.target.value <= ubexBalance) {
				this.setState({ paymentValueUbex: e.target.value, paymentError: false });
			} else {
				this.setState({ paymentError: 'No enough UBEX', paymentValueUbex: e.target.value });
			}
		} else if (type === 'USD') {
			this.setState({ paymentError: validateFloat(e.target.value), paymentValueUSD: e.target.value });
		} else {
			this.setState({ paymentError: validateInteger(e.target.value), paymentValueUbex: e.target.value });
		}
	}

	render() {
		const {
			isOpen,
			onCancel,
			onSubmit,
			ubexBalance,
			usdBalance,
			ubexHash,
			attachWallet,
			openPaymentMethods,
			sendUSD,
			sendUBEX,
			transactionHash,
		} = this.props;
		return (
			<Modal isOpen={!!isOpen} size="md" className="topUp-modal">
				<Row>
					<Col md={12}>
						<ModalHeader
							className="topUp-modal__header"
							toggle={() => {
								onCancel();
								this.setState(initialState);
							}}
						>
							{!transactionHash ? (
								<FormattedMessage {...messages.topUpCampaign} />
							) : (
								<FormattedMessage {...messages.transactionCompleted} />
							)}
						</ModalHeader>
						{!transactionHash && (
							<ModalBody className="topUp-modal__content">
								<h5 className="text-center mb-4">
									<FormattedMessage {...messages.selectTopUpAccount} />
								</h5>
								<div className="navbar-wrap">
									<div
										className="navbar-nav users__header"
										style={{
											width: '100%',
											flexDirection: 'row',
											marginRight: 0,
											justifyContent: 'center',
										}}
									>
										<li
											className="nav-item nav-pay"
											style={{ display: 'inline-block', minWidth: '100px' }}
											onClick={() => this.setState({ activeCurrency: 'USD' })}
										>
											<div
												className="nav-link"
												style={{
													paddingLeft: '10px',
													minWidth: '100px',
													display: 'inline-block',
													textAlign: 'center',
													paddingTop: '6px',
													borderColor:
														this.state.activeCurrency === 'USD' ? '#34bfa3' : '#ebedf2',
												}}
											>
												<span className="tab-label">USD</span>
												<span className="badge badge-success">
													<span>{usdBalance}</span>
												</span>
											</div>
										</li>
										<li
											className="nav-item nav-pay"
											id="pay-popover"
											style={{ display: 'inline-block', minWidth: '100px' }}
											onClick={() => this.setState({ activeCurrency: 'UBEX' })}
										>
											<a
												className="nav-link pointer"
												style={{
													paddingLeft: '10px',
													minWidth: '100px',
													display: 'inline-block',
													textAlign: 'center',
													paddingTop: '6px',
													borderColor:
														this.state.activeCurrency === 'UBEX' ? '#716aca' : '#ebedf2',
												}}
											>
												<span className="tab-label">UBEX</span>
												<span className="badge badge-purple">
													<span>{ubexBalance}</span>
												</span>
											</a>
										</li>
									</div>
								</div>
								<InputGroup className="mt-2">
									<Input
										type="text"
										pattern="\d*"
										onChange={e => this.setValue(e, this.state.activeCurrency)}
										value={
											this.state.activeCurrency === 'USD'
												? this.state.paymentValueUSD
												: this.state.paymentValueUbex
										}
										disabled={
											(this.state.activeCurrency === 'USD' && !usdBalance) ||
											(this.state.activeCurrency === 'UBEX' && !ubexHash)
										}
									/>
								</InputGroup>

								<FormFeedback>{this.state.paymentError}</FormFeedback>

								{this.state.activeCurrency === 'UBEX' && !ubexHash && (
									<Link onClick={attachWallet} className="mt-3 pointer text-underline" color="danger">
										<FormattedMessage {...messages.attachYourWallet} />
									</Link>
								)}

								{this.state.activeCurrency === 'USD' && !usdBalance && (
									<div
										className="mt-3 pointer text-underline text-danger pointer"
										onClick={openPaymentMethods}
									>
										<FormattedMessage {...messages.topUpAccountBalance} />
									</div>
								)}

								{(this.state.activeCurrency === 'UBEX' && ubexHash) ||
								(this.state.activeCurrency === 'USD' && usdBalance) ? (
									<FormText color="muted" className="mutedWrapper">
										<div>
											<FormattedMessage {...messages.available} />:{' '}
											{this.state.activeCurrency === 'USD' ? usdBalance : ubexBalance}{' '}
											{this.state.activeCurrency}
										</div>
										<ul className="amountPercent">
											<li
												className="amountPercent__percent"
												onClick={() => this.percentValue(25)}
											>
												25%
											</li>
											<li
												className="amountPercent__percent"
												onClick={() => this.percentValue(50)}
											>
												50%
											</li>
											<li
												className="amountPercent__percent"
												onClick={() => this.percentValue(75)}
											>
												75%
											</li>
											<li
												className="amountPercent__percent"
												onClick={() => this.percentValue(100)}
											>
												100%
											</li>
										</ul>
									</FormText>
								) : null}
							</ModalBody>
						)}
						{transactionHash && (
							<ModalBody className="topUp-modal__transaction-success">
								<i className="fas fa-check-circle topUp-modal__transaction-success--icon" />
								<div>
									<span>Transaction Hash: </span>
									<a
										href={`https://etherscan.io/tx/${transactionHash}`}
										style={{ fontSize: '12px' }}
										target="_blank"
									>
										{transactionHash}
										<i className="fas fa-external-link-alt topUp-modal__transaction-success--icon-link" />
									</a>
									<br />
									<span>The balance will be replenished within ~30 minutes</span>
								</div>
							</ModalBody>
						)}
						{!transactionHash && (
							<ModalFooter className="topUp-modal__footer">
								{(this.state.activeCurrency === 'UBEX' && ubexHash) ||
								(this.state.activeCurrency === 'USD' && usdBalance) ? (
									<Button
										color={this.state.activeCurrency === 'USD' ? 'success' : 'purple'}
										onClick={() => {
											this.state.activeCurrency === 'USD'
												? sendUSD(parseFloat(this.state.paymentValueUSD))
												: sendUBEX(parseFloat(this.state.paymentValueUbex));
										}}
										disabled={
											this.state.activeCurrency === 'USD'
												? !usdBalance ||
												  !this.state.paymentValueUSD ||
												  this.state.paymentValueUSD === '0' ||
												  this.state.paymentError
												: !ubexBalance ||
												  !this.state.paymentValueUbex ||
												  parseInt(this.state.paymentValueUbex, 10) < 10000 ||
												  parseInt(this.state.paymentValueUbex, 10) * this.state.ubexCurrency >
														3000 ||
												  this.state.paymentError
										}
									>
										<FormattedMessage id="app.common.topUp" />
									</Button>
								) : null}
							</ModalFooter>
						)}
					</Col>
				</Row>
			</Modal>
		);
	}

	percentValue(value) {
		const { ubexBalance, usdBalance } = this.props;
		if (this.state.activeCurrency === 'USD') {
			this.setState({ paymentValueUSD: (usdBalance * value) / 100 });
		} else {
			this.setState({ paymentValueUbex: (ubexBalance * value) / 100 });
		}
	}
}

TopUpGroupModal.propTypes = {
	isOpen: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	title: PropTypes.object,
	bodyText: PropTypes.object,
	userInfo: PropTypes.object,
	ubexBalance: PropTypes.number,
	usdBalance: PropTypes.number,
	ubexHash: PropTypes.string,
	attachWallet: PropTypes.func,
	openPaymentMethods: PropTypes.func,
};

export default TopUpGroupModal;
