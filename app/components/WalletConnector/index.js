/**
 *
 * WalletConnector
 *
 */

import React from 'react';
import { Button, Input, Modal, ModalBody, Alert, ModalHeader, Label, Spinner } from 'reactstrap';
import mtmsk from 'assets/img/pay/logo_metamask.png';
import ldger from 'assets/img/pay/ledger-logo.png';
import trzr from 'assets/img/pay/trezor-logo.png';
import { FormattedMessage } from 'react-intl';
import { fetchAccounts, getUBEXBalance } from 'utils/web3helper';
import AppAlertError from '../../containers/TradingDesk/components/AddGroupModal';
import messages from '../../containers/TradingDesk/messages';
import Link from 'react-router-dom/es/Link';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
const initialState = {
	accountMetamask: null,
	accountMetamaskBalanceUbex: null,
	addressError: null,
	activeMetamask: false,
	unlocked: false,
};
class WalletConnector extends React.Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	async fetchAccountMetamask() {
		this.setState({ activeMetamask: true });
		const { accounts, error } = await fetchAccounts();
		if (error) {
			this.setState({ addressError: error });
		}
		if (!accounts.length) {
			this.setState({ addressError: 'User denied account authorization!' });
		} else {
			this.setState({ accountMetamask: accounts[0] });
			const { balance, err } = await getUBEXBalance(accounts[0]);
			if (err) {
				this.setState({ addressError: err });
			} else {
				this.setState({ accountMetamaskBalanceUbex: balance });
			}
		}
	}

	async getBalance(hash) {
		console.log(hash);
		const { balance, err } = await getUBEXBalance(hash);
		if (err) {
			this.setState({ addressError: err });
		} else {
			this.setState({ accountMetamaskBalanceUbex: balance });
		}
	}

	componentWillUnmount() {
		this.setState(initialState);
	}

	componentDidMount() {
		this.setState(initialState);
	}

	render() {
		const { isOpen, onCancel, title, data } = this.props;
		const { wallet } = data;
		const { addressError, activeMetamask, unlocked } = this.state;
		return (
			<Modal isOpen={isOpen} centered size="lg">
				<ModalHeader
					toggle={() => {
						onCancel();
						this.setState(initialState);
					}}
				>
					<FormattedMessage {...messages.walletConnectorTitle} />
				</ModalHeader>
				<ModalBody>
					{this.state.addressError && <Alert color="danger">{this.state.addressError}</Alert>}
					{wallet && wallet.hash_code ? (
						<div>
							<FormattedMessage {...messages.hasWalletText} />
							<Link to="/app/campaigns/list" onClick={onCancel}>
								<FormattedMessage {...messages.listOfCampaigns} />
							</Link>
							.
						</div>
					) : (
						<FormattedMessage {...messages.walletConnectorText} />
					)}
					{!(wallet && wallet.hash_code) && (
						<ul className="login__list list-unstyled row justify-content-center">
							<li
								className="col"
								onClick={() =>
									!wallet || (wallet && !wallet.hash_code) ? this.fetchAccountMetamask() : null
								}
							>
								<a
									className={`login__list_a js_metamask_signin ${
										this.state.activeMetamask ? 'active' : ''
									}`}
								/>
								{!addressError && activeMetamask && !unlocked && wallet && !wallet.hash_code && (
									<Spinner className="crypto-spinner" style={{ width: '3rem', height: '3rem' }} />
								)}
								{wallet && wallet.hash_code && <i className="crypto-unlocked fas fa-check-circle" />}
								<p className="login__list_img">
									<img src={mtmsk} alt="" />
								</p>
								<p className="login__list_name">Metamask</p>
							</li>
							{wallet && wallet.hash_code ? null : (
								<li className="col">
									<a className="login__list_a js_metamask_signin" />
									<span className="login__list_more">coming soon</span>
									<p className="login__list_img ledger">
										<img src={ldger} alt="" />
									</p>
									<p className="login__list_name">Ledger</p>
								</li>
							)}
							{wallet && wallet.hash_code ? null : (
								<li className="col">
									<a className="login__list_a js_metamask_signin" />
									<span className="login__list_more">coming soon</span>
									<p className="login__list_img">
										<img src={trzr} alt="" />
									</p>
									<p className="login__list_name">Trezor</p>
								</li>
							)}
						</ul>
					)}
					{((this.state.accountMetamask && !unlocked) || (wallet && wallet.hash_code)) && (
						<div>
							<Label>
								<h4>
									<FormattedMessage {...messages.yourAddress} />
								</h4>
							</Label>{' '}
							<a
								href={`https://etherscan.io/address/${this.state.accountMetamask || wallet.hash_code}`}
								target="_blank"
							>
								{this.state.accountMetamask || wallet.hash_code}{' '}
								<i className="fas fa-external-link-alt" />
							</a>
						</div>
					)}
					{this.state.accountMetamask && this.state.accountMetamaskBalanceUbex >= 0 && !unlocked ? (
						<div className="mt-1">
							<Label>
								<FormattedMessage {...messages.yourBalance} />
							</Label>{' '}
							{this.state.accountMetamaskBalanceUbex} UBEX
						</div>
					) : null}
					{this.state.accountMetamask && this.state.accountMetamaskBalanceUbex >= 0 && !unlocked ? (
						<Button
							onClick={() => {
								this.setState({ unlocked: true });
								this.props.updateUbex({
									wallet: { id: 1, name: 'ETHEREUM', hash_code: this.state.accountMetamask },
								});
							}}
							color="success"
						>
							Unlock
						</Button>
					) : null}
				</ModalBody>
			</Modal>
		);
	}
}

WalletConnector.propTypes = {};

export default WalletConnector;
