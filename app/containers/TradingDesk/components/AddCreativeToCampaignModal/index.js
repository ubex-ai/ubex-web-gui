/**
 *
 * AddCreativeToCampaignModal
 *
 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, CustomInput } from 'reactstrap';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import { FormattedMessage } from 'react-intl';
import IntlFieldGroup from 'components/IntlFieldGroup';
import CreativeShape from '../../shapes/Creative';
import _ from 'lodash';
import messages from '../../messages';
import Alert from 'reactstrap/es/Alert';

/* eslint-disable react/prefer-stateless-function */
class AddCreativeToCampaignModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		props.creatives.map(v => {
			this.state[v.id] = false;
		});
		if (props.isOpen) {
			const selectedCampaign = props.campaigns.filter(camp => camp.id === props.isOpen);
			if (selectedCampaign && selectedCampaign.length && selectedCampaign[0] && selectedCampaign[0].creatives) {
				selectedCampaign[0].creatives.forEach(c => (this.state[c] = true));
			}
		}
	}

	onChange(key, value) {
		this.setState({ [key]: value });
	}

	getSelected() {
		return _.keys(this.state).filter(v => this.state[v]);
	}

	renderEntry(params) {
		const { id, data, banners } = params;

		if (!data || !banners) {
			return null;
		}
		return (
			<div>
				<CustomInput
					type="checkbox"
					id={`customCheckbox_${id}`}
					name="creative_id"
					value={this.state[id]}
					onChange={e => this.onChange(id, e.target.checked)}
					label={`${data.name} (${banners.length} ad banner)`}
					checked={this.state[id]}
				/>
			</div>
		);
	}

	render() {
		const { isOpen, onCancel, onSubmit, title, bodyText, campaigns, creatives } = this.props;
		return (
			<Modal isOpen={!!isOpen}>
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
				</ModalHeader>
				<ModalBody className="creative-to-campaign">
					{creatives && creatives.length ? (
						<div>
							<p>Select creatives to connect it with your campaing:</p>
							<fieldset>{creatives.map(creative => this.renderEntry(creative))}</fieldset>
						</div>
					) : (
						<Alert color="danger">
							<FormattedMessage {...messages.noCreatives} />
						</Alert>
					)}
				</ModalBody>
				<ModalFooter>
					{creatives && creatives.length ? (
						<Button color="success" onClick={() => onSubmit(this.getSelected())}>
							<FormattedMessage id="app.common.submit" />
						</Button>
					) : null}
					<Button color="primary" onClick={() => onCancel()}>
						<FormattedMessage id="app.common.cancel" />
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

AddCreativeToCampaignModal.propTypes = {
	isOpen: PropTypes.number,
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	title: PropTypes.object,
	bodyText: PropTypes.object,
	creatives: PropTypes.arrayOf(PropTypes.shape(CreativeShape)).isRequired,
};

export default AddCreativeToCampaignModal;
