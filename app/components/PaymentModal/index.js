/**
 *
 * PaymentModal
 *
 */

import React from 'react';
import {
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	InputGroup,
	Spinner,
	Col,
	Row,
	FormFeedback,
	InputGroupAddon,
} from 'reactstrap';
import Select from 'react-select';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import AppCard from 'components/AppCard';
import request from 'utils/request';
import messages from './messages';
import { transfer, ubex, eth, btc } from '../../containers/Publisher/Variables/PayLogo';
import getCookie from '../../utils/getCookie';
import BankTransferModal from '../BankTransferModal';
import createToast from '../../utils/toastHelper';

/* eslint-disable react/prefer-stateless-function */
class PaymentModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activePayment: {},
			amount: '',
			error: '',
			loading: false,
			selectedOptionCountry: {},
			bankTransfer: false,
			amountBankInput: false,
			amountBank: null,
		};
		this.defaultState = {
			activePayment: {},
			amount: '',
			error: '',
			loading: false,
			selectedOptionCountry: {},
		};
		this.closeModal = this.closeModal.bind(this);
		this.openUbex = this.openUbex.bind(this);
		this.handleChangeCountry = this.handleChangeCountry.bind(this);
	}

	createPostAction(payment, amount) {
		this.setState({
			loading: true,
			error: '',
		});
		request(`${API_URL}${payment.url}`, {
			method: 'post',
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
			},
			data: {
				amount: parseFloat(amount),
			},
		})
			.then(p => {
				this.setState(
					{
						loading: false,
					},
					() => {
						if (p && p.data && p.data.public_key && p.data.session_id) {
							const apiKey = p.data.public_key;
							const { Stripe } = window;

							const stripe = Stripe(apiKey);
							stripe
								.redirectToCheckout({
									sessionId: p.data.session_id,
								})
								.then(result => {
									console.log('Error: ', result.error.message);
								});
						} else {
							window.location.replace(p.data.url);
						}
					},
				);
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: 'Request error!',
				});
			});
	}

	componentDidMount() {
		const { paymentVariants, countries } = this.props;
		if (paymentVariants.length) {
			this.setState({
				selectedOptionCountry: countries
					? countries
							.filter(country => country.id === paymentVariants[0].id)
							.map(country => ({ value: country.id, label: country.label }))[0]
					: {},
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { paymentVariants, countries } = this.props;
		if (!countries.length && this.props.isOpen) {
			this.props.getCountries().then(response => {
				if (paymentVariants.length) {
					this.setState({
						selectedOptionCountry: response
							.filter(country => country.id === paymentVariants[0].id)
							.map(country => ({ value: country.id, label: country.label }))[0],
					});
				}
			});
		}
	}

	closeModal() {
		this.props.onCancel();
		this.setState(this.defaultState);
	}

	openUbex() {
		this.props.onCancel('ubex');
		this.setState(this.defaultState);
	}

	getPaymentVariants(variants) {
		if (this.state.selectedOptionCountry && Object.keys(this.state.selectedOptionCountry).length) {
			return _.find(variants, ['id', this.state.selectedOptionCountry.value]);
		}
		return {};
	}

	handleChangeCountry(selectedOptionCountry) {
		const { getMethods } = this.props;
		getMethods(selectedOptionCountry.value);
		this.setState({ selectedOptionCountry, activePayment: {} });
	}

	sendTxHash(txHash, currency) {
		const urls = {
			ubex: `${API_URL}/billing/ethereum/ubex_token/payment/`,
			ethereum: `${API_URL}/billing/ethereum/ethereum/payment/`,
			bitcoin: `${API_URL}/billing/bitcoin/bitcoin/payment/`,
		};
		request(urls[currency], {
			method: 'post',
			data: {
				hash: txHash,
			},
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
				'Test-User': 'test@test.test',
			},
		})
			.then(response => {
				createToast('success', response.data);
			})
			.catch(error => {
				createToast('error', error.message);
			});
	}

	render() {
		const { isOpen, onCancel, paymentVariants, countries } = this.props;
		const paymentMethods = this.getPaymentVariants(paymentVariants);
		return (
			<Modal isOpen={!!isOpen} size="lg">
				<ModalHeader toggle={this.closeModal}>
					<FormattedMessage {...messages.selectPayment} />
				</ModalHeader>
				<ModalBody className="pt-2">
					<Row>
						{countries.length ? (
							<Col md={12} className="padding-0">
								<Select
									className="campaign-select-container pay-card__country-select"
									classNamePrefix="campaign-select"
									options={countries.map(country => ({
										value: country.id,
										label: country.label,
									}))}
									onChange={this.handleChangeCountry}
									value={this.state.selectedOptionCountry}
									placeholder="Select coutnry"
								/>
							</Col>
						) : null}
						<Col md={12}>
							<Row className="pay-card">
								<Col md={5}>
									<h2 className="title">
										<i className="fal fa-credit-card-front" />{' '}
										<FormattedMessage {...messages.cards} />
									</h2>
								</Col>
								<Col md={7}>
									<div className="pay-card__image">
										{paymentMethods &&
										paymentMethods.payment_methods &&
										paymentMethods.payment_methods.length ? (
											paymentMethods.payment_methods
												.filter(variant => variant.type === 'cards')
												.map(variant => (
													<div
														key={variant.name}
														className={`pay-card__image-wrapper ${_.isEqual(
															this.state.activePayment,
															variant,
														)}`}
														onClick={() => {
															this.setState({
																activePayment: variant,
																amount: '',
																amountBankInput: false,
																amountBank: '',
															});
														}}
													>
														<img
															src={variant.image_path}
															alt={variant.name}
															title={`Payment via ${variant.name}`}
														/>
													</div>
												))
										) : paymentMethods && paymentMethods.loading ? (
											<Spinner />
										) : (
											'No payment methods available in your country'
										)}
									</div>
								</Col>
							</Row>
							{Object.keys(this.state.activePayment).length ? (
								<Row className="pay-card__form">
									<Col md={12} className="pay-card__form--wrap">
										<InputGroup>
											<FormattedMessage {...messages.amount}>
												{msg => [
													<InputGroupAddon addonType="prepend">$</InputGroupAddon>,
													<Input
														autoFocus
														type="number"
														pattern="\d*"
														placeholder={msg}
														value={this.state.amount}
														onChange={e => {
															this.setState({ amount: e.target.value });
														}}
														onKeyDown={event =>
															event.keyCode === 13 &&
															(this.state.amount && this.state.amount >= 10)
																? this.createPostAction(
																		this.state.activePayment,
																		this.state.amount,
																  )
																: null
														}
													/>,
												]}
											</FormattedMessage>
											<button
												className="btn btn-success button-center"
												onClick={() =>
													this.createPostAction(this.state.activePayment, this.state.amount)
												}
												disabled={!this.state.amount || this.state.amount < 10}
											>
												{!this.state.loading ? (
													<FormattedMessage {...messages.pay} />
												) : (
													<Spinner size="sm" color="light" />
												)}
											</button>
											{this.state.error && (
												<FormFeedback invalid="true">{this.state.error}</FormFeedback>
											)}
										</InputGroup>
									</Col>
								</Row>
							) : null}
						</Col>
						<Col md={12}>
							<Row className="pay-card">
								<Col md={5}>
									<h2 className="title">
										<i className="fal fa-coins" /> <FormattedMessage {...messages.crypto} />
									</h2>
								</Col>
								<Col md={7}>
									<div className="pay-card__image">
										<div
											className={`pay-card__image-wrap ${_.isEqual(
												this.state.amountCryptoInput,
												'ubex',
											)}`}
											onClick={() => {
												this.setState({
													activePayment: {},
													amount: '',
													amountBankInput: false,
													amountBank: '',
													amountCryptoInput: 'ubex',
												});
											}}
										>
											<img src={ubex} alt="ubex" className="ubex" />
										</div>
										<div
											className={`pay-card__image-wrap ${_.isEqual(
												this.state.amountCryptoInput,
												'ethereum',
											)}`}
											onClick={() => {
												this.setState({
													activePayment: {},
													amount: '',
													amountBankInput: false,
													amountBank: '',
													amountCryptoInput: 'ethereum',
												});
											}}
										>
											<i className="fab fa-ethereum" />
										</div>
										<div
											className={`pay-card__image-wrap ${_.isEqual(
												this.state.amountCryptoInput,
												'bitcoin',
											)}`}
											onClick={() => {
												this.setState({
													activePayment: {},
													amount: '',
													amountBankInput: false,
													amountBank: '',
													amountCryptoInput: 'bitcoin',
												});
											}}
										>
											<i className="fab fa-bitcoin" />
										</div>
									</div>
								</Col>
							</Row>
							{this.state.amountCryptoInput && (
								<Row className="pay-card__form">
									<Col md={12} className="pay-card__form--wrap">
										<div
											style={{
												textAlign: 'center',
												marginBottom: '10px',
											}}
										>
											{(this.state.amountCryptoInput === 'ubex' ||
												this.state.amountCryptoInput === 'ethereum') && (
												<div>
													Send any amount to the address{' '}
													<a
														href="https://etherscan.io/address/0x5B6A61ED8b87f42A83F4C3bb62E56028339a615F"
														target="_blank"
													>
														0x5B6A61ED8b87f42A83F4C3bb62E56028339a615F
													</a>
													<br />
													and specify the transaction ID to verify and replenish your account.
													Check lasts 30 minutes
												</div>
											)}
											{this.state.amountCryptoInput === 'bitcoin' && (
												<div>
													Send any amount to the address{' '}
													<a
														href="https://www.blockchain.com/ru/btc/address/3PvqLxF3ByMDfRw8jrnvYyrCwNACC2XwgT"
														target="_blank"
													>
														3PvqLxF3ByMDfRw8jrnvYyrCwNACC2XwgT
													</a>
													<br />
													and specify the transaction ID to verify and replenish your account.
													Check lasts 30 minutes
												</div>
											)}
										</div>
										<InputGroup>
											<FormattedMessage {...messages.txHash}>
												{msg => [
													<InputGroupAddon addonType="prepend">Tx</InputGroupAddon>,
													<Input
														autoFocus
														type="text"
														disabled={this.state.amountCryptoInput !== 'ubex'}
														placeholder={msg}
														value={this.state.amountCrypto}
														onChange={e => {
															this.setState({ amountCrypto: e.target.value });
														}}
														onKeyDown={event =>
															event.keyCode === 13 &&
															(this.state.amountCrypto && this.state.amountCrypto !== '')
																? this.sendTxHash(
																		this.state.amountCrypto,
																		this.state.amountCryptoInput,
																  )
																: null
														}
													/>,
												]}
											</FormattedMessage>
											<button
												className="btn btn-success button-center"
												onClick={() =>
													this.sendTxHash(
														this.state.amountCrypto,
														this.state.amountCryptoInput,
													)
												}
												disabled={!this.state.amountCrypto || this.state.amountCrypto < 10}
											>
												{!this.state.loading ? (
													<FormattedMessage {...messages.pay} />
												) : (
													<Spinner size="sm" color="light" />
												)}
											</button>
											{this.state.error && (
												<FormFeedback invalid="true">{this.state.error}</FormFeedback>
											)}
										</InputGroup>
									</Col>
								</Row>
							)}
						</Col>
						<Col md={12}>
							<Row className="pay-card">
								<Col md={5}>
									<h2 className="title">
										<i className="fal fa-university" />{' '}
										<FormattedMessage {...messages.bankTransfer} />
									</h2>
								</Col>
								<Col md={7}>
									<div className="pay-card__image">
										<div
											className={`pay-card__image-wrap ${this.state.amountBankInput}`}
											onClick={() =>
												this.setState({
													amountBankInput: true,
													activePayment: {},
													amount: '',
													amountCryptoInput: '',
												})
											}
										>
											<img src={transfer} alt="transfer" />
										</div>
									</div>
								</Col>
							</Row>
							{this.state.amountBankInput && (
								<Row className="pay-card__form">
									<Col md={12} className="pay-card__form--wrap">
										<InputGroup>
											<FormattedMessage {...messages.amount}>
												{msg => [
													<InputGroupAddon addonType="prepend">$</InputGroupAddon>,
													<Input
														autoFocus
														type="number"
														pattern="\d*"
														placeholder={msg}
														value={this.state.amountBank}
														onChange={e => {
															this.setState({ amountBank: e.target.value });
														}}
														onKeyDown={event =>
															event.keyCode === 13 &&
															(this.state.amountBank && this.state.amountBank >= 10)
																? this.setState({ bankTransfer: this.state.amountBank })
																: null
														}
													/>,
												]}
											</FormattedMessage>
											<button
												className="btn btn-success button-center"
												onClick={() =>
													this.setState({
														bankTransfer: this.state.amountBank,
													})
												}
												disabled={!this.state.amountBank || this.state.amountBank < 10}
											>
												{!this.state.loading ? (
													<FormattedMessage {...messages.pay} />
												) : (
													<Spinner size="sm" color="light" />
												)}
											</button>
											{this.state.error && (
												<FormFeedback invalid="true">{this.state.error}</FormFeedback>
											)}
										</InputGroup>
									</Col>
								</Row>
							)}
						</Col>
						<Col className="pay-card__form--annotation">
							<p>
								<b>
									<b style={{ color: '#f00' }}>*</b> <FormattedMessage {...messages.payattention} />
								</b>
							</p>
						</Col>
					</Row>
				</ModalBody>
				<BankTransferModal
					isOpen={this.state.bankTransfer}
					countries={countries}
					onCancel={() =>
						this.setState({
							bankTransfer: false,
						})
					}
				/>
			</Modal>
		);
	}
}

PaymentModal.propTypes = {};

export default PaymentModal;
