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
import validateInteger from 'utils/validateInteger';
import messages from '../../messages';

/* eslint-disable react/prefer-stateless-function */
const initialState = {
	open: false,
	paymentValueUSD: 0,
	paymentValueUbex: 0,
	dropdownOpen: false,
	activeCurrency: 'USD',
	paymentError: false,
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
		};
		this.toggle = this.toggle.bind(this);
		this.toggleDropDown = this.toggleDropDown.bind(this);
		this.setValue = this.setValue.bind(this);
	}

	componentDidMount() {
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

	setValue(e, type) {
		const { ubexBalance, usdBalance } = this.props;
		if (!validateInteger(e.target.value)) {
			if (type === 'USD') {
				if (usdBalance > 0 && e.target.value <= usdBalance) {
					this.setState({ paymentValueUSD: e.target.value, paymentError: false });
				} else {
					this.setState({ paymentError: 'No enough USD', paymentValueUSD: e.target.value });
				}
			} else if (ubexBalance > 0 && e.target.value <= ubexBalance) {
				this.setState({ paymentValueUbex: e.target.value, paymentError: false });
			} else {
				this.setState({ paymentError: 'No enough UBEX', paymentValueUbex: e.target.value });
			}
		} else if (type === 'USD') {
			this.setState({ paymentError: validateInteger(e.target.value), paymentValueUSD: e.target.value });
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
							{!transactionHash ? <FormattedMessage {...messages.topUpCampaign} /> : <FormattedMessage {...messages.transactionCompleted} />}
						</ModalHeader>
						{!transactionHash && (
							<ModalBody className="topUp-modal__content">
								<h5 className="text-center mb-4">
									<FormattedMessage {...messages.selectTopUpAccount} />
								</h5>
								<InputGroup className="mt-2">
									<InputGroupButtonDropdown
										addonType="append"
										isOpen={this.state.dropdownOpen}
										toggle={this.toggleDropDown}
									>
										<DropdownToggle
											caret
											color={this.state.activeCurrency === 'USD' ? 'success' : 'purple'}
										>
											{this.state.activeCurrency}
										</DropdownToggle>
										<DropdownMenu>
											{this.state.activeCurrency === 'USD' && (
												<DropdownItem onClick={() => this.setState({ activeCurrency: 'UBEX' })}>
													UBEX
												</DropdownItem>
											)}
											{this.state.activeCurrency === 'UBEX' && (
												<DropdownItem onClick={() => this.setState({ activeCurrency: 'USD' })}>
													USD
												</DropdownItem>
											)}
										</DropdownMenu>
									</InputGroupButtonDropdown>
									<Input
										type="text"
										pattern="\d*"
										onChange={e => this.setValue(e, this.state.activeCurrency)}
										value={
											this.state.activeCurrency === 'USD'
												? this.state.paymentValueUSD
												: this.state.paymentValueUbex
										}
										disabled={(this.state.activeCurrency === 'USD' && !usdBalance) || (this.state.activeCurrency === 'UBEX' && !ubexHash)}
									/>
								</InputGroup>

								<FormFeedback>{this.state.paymentError}</FormFeedback>

								{this.state.activeCurrency === 'UBEX' &&
									!ubexHash && (
										<Link onClick={attachWallet} className="mt-3 pointer text-underline" color="danger">
											<FormattedMessage {...messages.attachYourWallet} />
										</Link>
									)}

								{this.state.activeCurrency === 'USD' &&
									!usdBalance && (
										<Link to="/app/payments/pay" className="mt-3 pointer text-underline" color="danger">
											<FormattedMessage {...messages.topUpAccountBalance} />
										</Link>
									)}

								{(this.state.activeCurrency === 'UBEX' && ubexHash) ||
								(this.state.activeCurrency === 'USD' && usdBalance) ? (
									<FormText color="muted">
										<FormattedMessage {...messages.available} />: {this.state.activeCurrency === 'USD' ? usdBalance : ubexBalance}{' '}
										{this.state.activeCurrency}
									</FormText>
								) : null}
							</ModalBody>
						)}
						{transactionHash &&
							this.state.activeCurrency === 'UBEX' && (
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
									</div>
								</ModalBody>
							)}
						{!transactionHash && (
							<ModalFooter className="topUp-modal__footer">
								{(this.state.activeCurrency === 'UBEX' && ubexHash) ||
								(this.state.activeCurrency === 'USD' && usdBalance) ? (
									<Button
										color={this.state.activeCurrency === 'USD' ? 'success' : 'purple'}
										onClick={() =>
											this.state.activeCurrency === 'USD'
												? sendUSD(this.state.paymentValueUSD)
												: sendUBEX(this.state.paymentValueUbex)
										}
										disabled={this.state.activeCurrency === 'USD' ? !usdBalance || !this.state.paymentValueUSD || this.state.paymentValueUSD === '0' || this.state.paymentError : !ubexBalance || !this.state.paymentValueUbex || this.state.paymentValueUbex === '0' || this.state.paymentError}
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
}

TopUpGroupModal.propTypes = {
	isOpen: PropTypes.number,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	title: PropTypes.object,
	bodyText: PropTypes.object,
	userInfo: PropTypes.object,
	ubexBalance: PropTypes.number,
	usdBalance: PropTypes.number,
	ubexHash: PropTypes.string,
	attachWallet: PropTypes.func,
};

export default TopUpGroupModal;
