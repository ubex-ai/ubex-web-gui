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
class AddFilterModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			name: '',
		};
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			open: !this.state.open,
		});
	}

	componentDidMount() {
		this.setState({
			name: this.props.filterName ? this.props.filterName : '',
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.filterName !== this.props.filterName) {
			this.setState({
				name: this.props.filterName ? this.props.filterName : '',
			});
		}
	}

	handleChange(event) {
		this.setState({ name: event.target.value });
	}

	render() {
		const { isOpen, onCancel, onCreate, title, errorValidate, onPatch, loading } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
				</ModalHeader>
				<ModalBody>
					{errorValidate && <AppAlertError message={errorValidate} />}
					<Label>
						<FormattedMessage {...messages.filterName} /> <span style={{ color: '#f00' }}> *</span>
					</Label>
					<Input
						name="name"
						value={this.state.name}
						onChange={this.handleChange.bind(this)}
						onKeyDown={event =>
							event.keyCode === 13 && !this.props.editFilter && this.state.name
								? onCreate(this.state.name)
								: event.keyCode === 13 && this.props.editFilter && this.state.name
								? onPatch(this.state.name)
								: null
						}
					/>
				</ModalBody>
				<ModalFooter>
					{!this.props.editFilter ? (
						<Button color="info" onClick={() => onCreate(this.state.name)} disabled={!this.state.name}>
							{!loading ? <FormattedMessage id="app.common.create" /> : <Spinner size="sm" />}
						</Button>
					) : (
						<Button color="info" onClick={() => onPatch(this.state.name)} disabled={!this.state.name}>
							<FormattedMessage id="app.common.save" />
						</Button>
					)}
				</ModalFooter>
			</Modal>
		);
	}
}

AddFilterModal.propTypes = {
	editFilter: PropTypes.bool.isRequired,
	filterName: PropTypes.oneOfType(['bool', 'string']),
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.shape({
		defaultMessage: PropTypes.string.isRequired,
		id: PropTypes.string.isRequired,
	}).isRequired,
	onCreate: PropTypes.func,
	onPatch: PropTypes.func,
	loading: PropTypes.bool,
};

export default AddFilterModal;
