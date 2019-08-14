/**
 *
 * AddCreativeToCampaignModal
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
	FormGroup,
	Label,
	CustomInput,
	Row,
	Col,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import { FormattedMessage } from 'react-intl';
import IntlFieldGroup from 'components/IntlFieldGroup';
import _ from 'lodash';
import Alert from 'reactstrap/es/Alert';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import CreativeShape from '../../shapes/Creative';
import messages from '../../messages';

/* eslint-disable react/prefer-stateless-function */
class AddCreativeToCampaignModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		props.creatives.map(v => {
			this.state[v.id] = { value: v.id, start_date: null, end_date: null, selected: false, selectedDates: false };
		});
		if (props.isOpen) {
			const selectedCampaign = props.campaigns.filter(camp => camp.id === props.isOpen);
			if (selectedCampaign && selectedCampaign.length && selectedCampaign[0] && selectedCampaign[0].creatives) {
				selectedCampaign[0].creatives.forEach(c => {
					this.state[c.value] = {
						value: c.value,
						start_date: c.start_date ? moment(c.start_date) : moment(),
						end_date: c.end_date ? moment(c.end_date) : moment(),
						selected: true,
						selectedDates: false,
					};
				});
			}
		}
		this.minTime = moment();
		this.creativeTypes = ['display', 'native', 'other', 'video'];
		this.startDatepicker = null;
		this.endDatepicker = null;
		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
	}

	onChange(key, value) {
		const creative = {
			value: key,
			start_date: this.state[key].start_date,
			end_date: this.state[key].end_date,
			selected: value,
			selectedDates: value,
		};
		this.setState({ [key]: creative });
	}

	getSelected() {
		return _.keys(this.state)
			.filter(v => this.state[v].selected)
			.map(v => ({
				value: this.state[v].value,
				start_date: this.state[v].start_date,
				end_date: this.state[v].end_date,
			}));
	}

	handleChangeStart(id, date) {
		const creative = {
			value: id,
			start_date: date,
			end_date: date,
			selected: this.state[id].selected,
			selectedDates: this.state[id].selectedDates,
		};
		this.setState({ [id]: creative });
	}

	handleChangeEnd(id, date) {
		const creative = {
			value: id,
			start_date: this.state[id].start_date,
			end_date: date,
			selected: this.state[id].selected,
			selectedDates: this.state[id].selectedDates,
		};
		this.setState({ [id]: creative });
	}

	changeDates(e, id) {
		e.preventDefault();
		const creative = {
			value: id,
			start_date: this.state[id].start_date,
			end_date: this.state[id].end_date,
			selected: this.state[id].selected,
			selectedDates: !this.state[id].selectedDates,
		};
		this.setState({ [id]: creative });
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
					value={this.state[id].selected}
					onChange={e => this.onChange(id, e.target.checked)}
					label={`${data.name} (${banners.length} ad banner)`}
					checked={this.state[id].selected}
					className="d-inline-block mr-2"
				/>
				{this.state[id].selected && (
					<a href="#" onClick={e => this.changeDates(e, id)} style={{ display: 'inline-block' }}>
						Change dates
					</a>
				)}
				{this.state[id].selected &&
					this.state[id].selectedDates && (
						<Row className="creative-to-campaign__select-dates mt-2 mb-3">
							<Col md={6}>
								<Label className="mb-0">
									<FormattedMessage {...messages.startDate} />
								</Label>
								<DatePicker
									selected={this.state[id].start_date}
									selectsStart
									startDate={this.state[id].start_date}
									endDate={this.state[id].end_date}
									onChange={e => this.handleChangeStart(id, e)}
									showTimeSelect
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="DD.MM.YYYY HH:mm"
									timeCaption="time"
									minDate={moment()}
									minTime={
										moment().format('DD-MM-YYYY') ===
										moment(this.state[id].start_date ? this.state[id].start_date : moment()).format(
											'DD-MM-YYYY',
										)
											? moment().hours(this.minTime.hour()).minutes(this.minTime.minutes())
											: moment().hours(0).minutes(0)
									}
									maxTime={moment()
										.hours(23)
										.minutes(45)}
									ref={datepicker => {
										this.startDatepicker = datepicker;
									}}
								/>
							</Col>
							<Col md={6}>
								<Label className="mb-0">
									<FormattedMessage {...messages.endDate} />
								</Label>
								<DatePicker
									popperClassName="endDatePopper"
									selected={this.state[id].end_date}
									selectsEnd
									startDate={this.state[id].start_date}
									endDate={this.state[id].end_date}
									onChange={e => this.handleChangeEnd(id, e)}
									showTimeSelect
									popperPlacement="bottom-end"
									timeFormat="HH:mm"
									timeIntervals={15}
									dateFormat="DD.MM.YYYY HH:mm"
									timeCaption="time"
									minDate={this.state[id].start_date ? this.state[id].start_date : moment()}
									minTime={
										moment(this.state[id].start_date).format('DD-MM-YYYY') ===
										moment(this.state[id].end_date ? this.state[id].end_date : moment()).format(
											'DD-MM-YYYY',
										)
											? this.minTime.hours(this.minTime.hour()).minutes(this.minTime.minutes())
											: moment()
													.hours(0)
													.minutes(0)
									}
									maxTime={moment()
										.hours(23)
										.minutes(45)}
									ref={datepicker => {
										this.endDatepicker = datepicker;
									}}
								/>
							</Col>
						</Row>
					)}
			</div>
		);
	}

	renderType(type) {
		return <h5 style={{ textTransform: 'capitalize' }}>{type}</h5>;
	}

	render() {
		const { isOpen, onCancel, onSubmit, title, bodyText, campaigns, creatives } = this.props;
		return (
			<Modal isOpen={!!isOpen} className="creative-to-campaign">
				<ModalHeader toggle={onCancel}>
					<FormattedMessage {...title} />
					<p className="creative-to-campaign__header">Select creatives to connect it with your campaing:</p>
				</ModalHeader>
				<ModalBody className="creative-to-campaign__content">
					{creatives && creatives.length ? (
						<div>
							<fieldset>
								{this.creativeTypes.map(type => [
									this.renderType(type),
									creatives
										.filter(f => f.creative_type === type)
										.map(creative => this.renderEntry(creative)),
								])}
							</fieldset>
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
