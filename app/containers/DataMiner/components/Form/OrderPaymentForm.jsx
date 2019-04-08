import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import { Button, ModalHeader, ModalBody, ModalFooter, Row, Col, Modal } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class OrderPaymentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentValue: null,
			modal: false,
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.notify = this.notify.bind(this);
	}

	handle = value => {
		const val = `${value}000`;
		this.setState({ paymentValue: val });
	};

	toggleModal() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	notify() {
		toast.info('Withdrawal request accepted. Your tokens on the way and will land in your wallet very soon!', {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
		});
		this.toggleModal();
	}

	render() {
		return (
			<div>
				<Button onClick={this.toggleModal} className="button_payout" color="success">
					<FormattedMessage id="app.common.orderPayment" />
				</Button>
				<Modal className="width-400" isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
					<ModalHeader toggle={this.toggleModal}>
						<FormattedMessage id="app.common.orderPayment" />
					</ModalHeader>
					<ModalBody>
						<Row>
							<Col md={12}>
								<h4 className="text-center"><FormattedMessage id="app.common.nextPaymentDate" /></h4>
							</Col>
							<Col md={12}>
								<h2 className="text-center date-payment rem-4"><FormattedMessage id="app.common.datePayment" /></h2>
							</Col>
							<Col md={12} className="howmuch">
								<h4 className="text-center"><FormattedMessage id="app.common.howMuchWithdraw" /></h4>
							</Col>
						</Row>
						<Slider
							className="modal-90"
							min={20}
							defaultValue={20}
							marks={{ 20: 20000, 100: 100000 }}
							step={1}
							onChange={this.handle}
						/>
					</ModalBody>
					<ModalFooter>
						<h4 className="amount-ubex">{this.state.paymentValue ? this.state.paymentValue : '20000'} UBEX</h4>
						<Button color="primary" onClick={this.notify}>
							<FormattedMessage id="app.common.order" />
						</Button>{' '}
						<Button color="secondary" onClick={this.toggleModal}>
							<FormattedMessage id="app.common.cancel" />
						</Button>
					</ModalFooter>
				</Modal>
				<ToastContainer />
			</div>
		);
	}
}

export default OrderPaymentForm;
