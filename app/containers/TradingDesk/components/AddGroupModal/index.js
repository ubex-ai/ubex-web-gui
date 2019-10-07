/**
 *
 * AddGroupModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Label from 'reactstrap/es/Label';
import AppAlertError from 'components/AppAlertError';
import messages from '../../messages';
import AddCreativeToCampaignModal from '../AddCreativeToCampaignModal';
import Spinner from 'reactstrap/es/Spinner';

/* eslint-disable react/prefer-stateless-function */
class AddGroupModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			name: '',
			loading: false,
		};
		this.toggle = this.toggle.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	componentDidMount() {
		this.setState({
			name: this.props.groupName ? this.props.groupName : '',
			loading: false,
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.groupName !== this.props.groupName) {
			this.setState({
				name: this.props.groupName ? this.props.groupName : '',
			});
		}

		if (prevProps.isOpen && !this.props.isOpen) {
			this.setState({
				loading: false,
				name: '',
			});
		}
	}

	handleChange(event) {
		this.setState({ name: event.target.value });
	}

	onCancel() {
		this.props.onCancel();
	}

	onCreate(name) {
		this.props.onCreate(name);
	}

	render() {
		const {
			isOpen,
			onCancel,
			onCreate,
			onCreateAndCreateCampaign,
			title,
			error,
			errorValidate,
			onPatch,
			loading,
		} = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={this.onCancel}>
					<FormattedMessage {...title} />
				</ModalHeader>
				<ModalBody>
					{errorValidate && <AppAlertError message={errorValidate} />}
					<Label>
						<FormattedMessage {...messages.groupName} /> <span style={{ color: '#f00' }}> *</span>
					</Label>
					<Input
						name="name"
						value={this.state.name}
						onChange={this.handleChange.bind(this)}
						onKeyDown={event =>
							event.keyCode === 13 && !this.props.editGroup && this.state.name
								? this.onCreate(this.state.name)
								: event.keyCode === 13 && this.props.editGroup && this.state.name
								? onPatch(this.state.name)
								: null
						}
					/>
				</ModalBody>
				<ModalFooter>
					{!this.props.editGroup ? (
						<Button color="info" onClick={() => this.onCreate(this.state.name)} disabled={!this.state.name}>
							{!loading ? <FormattedMessage id="app.common.create" /> : <Spinner size="sm" />}
						</Button>
					) : (
						<Button
							color="info"
							onClick={() => {
								this.setState({ loading: true });
								onPatch(this.state.name);
							}}
							disabled={!this.state.name}
						>
							{!this.state.loading ? <FormattedMessage id="app.common.save" /> : <Spinner size="sm" />}
						</Button>
					)}
				</ModalFooter>
			</Modal>
		);
	}
}

AddGroupModal.propTypes = {
	isOpen: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
	onCancel: PropTypes.func,
	onSumbit: PropTypes.func,
	onCreateAndCreateCampaign: PropTypes.func,
	title: PropTypes.object,
	error: PropTypes.string,
	errorValidate: PropTypes.string,
};

export default AddGroupModal;
