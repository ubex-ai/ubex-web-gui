/**
 *
 * ChannelSelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import IntlFieldGroup from 'components/IntlFieldGroup';
import Select from 'react-select';
import { CustomInput, FormGroup, Label, Input, Button } from 'reactstrap';
import { throttle } from 'throttle-debounce';
import { FormattedMessage } from 'react-intl';
import ChannelStub from '../../stubs/channel.stub';
import messages from '../../messages';
import request from '../../../../utils/request';
import getCookie from '../../../../utils/getCookie';
import createToast from '../../../../utils/toastHelper';
import classNames from 'classnames';

/* eslint-disable react/prefer-stateless-function */
class ChannelSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			channels: ChannelStub,
			openedChannel: [],
			globalModeration: false,
			openForce: null,
		};
		this.brandSearch = throttle(500, this.brandSearch);
	}

	componentDidMount() {
		const { data, creative } = this.props;
		data.map(channel => {
			if (creative && creative.data && creative.data.ssp && creative.data.ssp[channel.key]) {
				const zap = Object.keys(creative.data.ssp[channel.key]).filter(
					item => creative.data.ssp[channel.key][item].length,
				);
				if (zap.length === Object.keys(creative.data.ssp[channel.key]).length) {
					if (!this.state.openedChannel.includes(channel.key)) {
						this.openChannel(channel.key);
					}
				}
				Object.keys(creative.data.ssp[channel.key]).map(field => {
					this.setState(prevState => ({
						[channel.key.toLowerCase()]: {
							...prevState[channel.key.toLowerCase()],
							[field.toLowerCase()]: creative.data.ssp[channel.key][field],
						},
					}));
				});
			}
		});
		if (creative && creative.data && creative.banners) {
			creative.banners.map(banner => {
				if (banner.hasOwnProperty('moderation') && banner.moderation !== null) {
					Object.keys(banner.moderation).map(moder => {
						if (
							(banner.moderation[moder] !== null &&
								banner.moderation[moder].hasOwnProperty('moderation_status')) ||
							banner.moderation[moder] === null ||
							banner.moderation[moder] === 'denied'
						) {
							this.setState(prevState => ({
								[moder.toLowerCase()]: {
									...prevState[moder.toLowerCase()],
									moderation: [
										...(this.state[[moder.toLowerCase()]]
											? this.state[moder.toLowerCase()].moderation
											: []),
										banner.moderation[moder] ? banner.moderation[moder].moderation_status : null,
									],
								},
							}));
						}
					});
				} else {
					this.setState({
						globalModeration: true,
					});
				}
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { data, creative } = this.props;
		if (prevProps.creative.data.ssp !== this.props.creative.data.ssp) {
			data.map(channel => {
				if (creative && creative.data && creative.data.ssp && creative.data.ssp[channel.key]) {
					Object.keys(creative.data.ssp[channel.key]).map(field => {
						this.setState(prevState => ({
							[channel.key.toLowerCase()]: {
								...prevState[channel.key.toLowerCase()],
								[field.toLowerCase()]: creative.data.ssp[channel.key][field],
							},
						}));
					});
				}
			});
		}
	}

	openChannel(key) {
		if (this.state.openedChannel.includes(key)) {
			this.setState({
				openedChannel: this.state.openedChannel.filter(chan => chan !== key),
			});
		} else {
			this.setState({
				openedChannel: [...this.state.openedChannel, key],
			});
		}
	}

	openedChannelState(key) {
		return this.state.openedChannel.includes(key);
	}

	brandSearch(name, url, channelKey, fieldKey) {
		if (name) {
			request(`${API_URL}${url}`, {
				method: 'get',
				headers: {
					'X-CSRFToken': getCookie('csrftoken'),
					'Test-User': 'test@test.test',
				},
				params: {
					q: name,
				},
			})
				.then(p => {
					this.setState({
						[`${channelKey}${fieldKey}List`]: p.data.map(option => ({
							value: option.id,
							id: option.id,
							label: option.label,
						})),
					});
				})
				.catch(() => {});
		}
	}

	handleChangeSelect(option, channelKey, fieldKey) {
		this.setState(prevState => ({
			[channelKey.toLowerCase()]: {
				...prevState[channelKey.toLowerCase()],
				[fieldKey.toLowerCase()]: option,
			},
		}));
	}

	renderInput(channel, field) {
		const { data, creative } = this.props;
		if (field.type === 'text') {
			return (
				<FormGroup>
					<Label for={field.key}>{field.name}</Label>
					<Input type={field.type} name={field.key} id={field.key} />
				</FormGroup>
			);
		}
		if (field.type === 'select') {
			return (
				<FormGroup>
					<Label for={field.key}>{field.name}</Label>
					<Select
						className="brand-select-container"
						classNamePrefix="brand-select"
						options={field.options.map(option => ({
							value: option.id,
							id: option.id,
							label: option.label,
						}))}
						isSearchable
						isMulti={field.multiple}
						onChange={option => this.handleChangeSelect(option, channel.key, field.key)}
						placeholder={`Select ${field.name}`}
						captureMenuScroll
						menuPlacement="top"
						value={
							this.state[channel.key] && this.state[channel.key][field.key]
								? this.state[channel.key][field.key]
								: null
						}
					/>
				</FormGroup>
			);
		}
		if (field.type === 'dynamic') {
			return (
				<FormGroup>
					<Label for={field.key}>{field.name}</Label>
					<Select
						className="brand-select-container"
						classNamePrefix="brand-select"
						options={this.state[`${channel.key}${field.key}List`]}
						isSearchable
						isMulti={field.multiple}
						onChange={option => this.handleChangeSelect(option, channel.key, field.key)}
						placeholder={`Select ${field.name}`}
						captureMenuScroll
						menuPlacement="top"
						onInputChange={search => this.brandSearch(search, field.search_url, channel.key, field.key)}
						value={
							this.state[channel.key] && this.state[channel.key][field.key]
								? this.state[channel.key][field.key]
								: null
						}
					/>
				</FormGroup>
			);
		}
	}

	sendSSPFields(id, channel) {
		const dataObject = {};
		Object.keys(this.state[channel.key]).forEach(key =>
			key !== 'saved' && key !== 'moderation'
				? (dataObject[key] = this.state[channel.key][key].map(state => state.id))
				: null,
		);
		this.props
			.patchCreative({
				data: {
					ssp: {
						[channel.key]: dataObject,
					},
				},
			})
			.then(() => {
				this.setState(prevState => ({
					[channel.key.toLowerCase()]: {
						...prevState[channel.key.toLowerCase()],
						saved: true,
					},
				}));
				createToast('success', `${channel.name} info successfully saved!`);
			})
			.catch(() => {
				createToast('error', `${channel.name} info saving error!`);
			});
	}

	toModeation(id, channel) {
		request(`${API_URL}/api/creative/${id}/publish/${channel.key}/`, {
			method: 'post',
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
				'Test-User': 'test@test.test',
			},
		})
			.then(p => {
				createToast('warning', 'Banners successfully sent for moderation!');
				this.props.getCreatives();
			})
			.catch(e => {
				createToast('error', e.message);
			});
	}

	openChannelByKey(key) {
		this.setState({
			openForce: key === this.state.openForce ? false : key,
		});
	}
	render() {
		const { data, creative } = this.props;
		return (
			<div className="channel-select">
				<div className="channel-select__list">
					{data.map(channel => {
						const channelKey = channel.key === 'yandex' ? channel.key : 'ubex';
						return (
							<div
								key={channel.id}
								className={classNames({
									'channel-select__list-channel': true,
									opened: channel.fields && channel.fields.length,
									closed:
										(!channel.fields && !channel.fields.length) ||
										(this.state[channelKey] &&
											(this.state[channelKey].moderation.includes('ready') ||
												this.state[channelKey].moderation.includes('accepted'))),
								})}
							>
								<div className="channel-select__list-channel--checkbox-wrap" style={{ width: '100%' }}>
									<img
										className="channel-select__list-channel--checkbox-image"
										src={channel.logo}
										alt={channel.name}
									/>
									<span>{channel.name}</span>
									{this.state[channelKey] &&
									(this.state[channelKey].moderation.includes(null) ||
										this.state[channelKey].moderation.includes('pending') ||
										this.state[channelKey].moderation.includes('awaiting') ||
										this.state[channelKey].moderation.includes('moderation')) ? (
										<a
											className="text-primary ml-1"
											onClick={() => this.openChannelByKey(channelKey)}
										>
											(Specify)
										</a>
									) : null}
									<div
										style={{ marginLeft: 'auto' }}
										className={classNames({
											'channel-select__list-channel--check': true,
											'text-success':
												this.state[channelKey] &&
												(this.state[channelKey].moderation.includes('ready') ||
													this.state[channelKey].moderation.includes('accepted')),
											'text-warning':
												this.state[channelKey] &&
												(this.state[channelKey].moderation.includes(null) ||
													this.state[channelKey].moderation.includes('pending') ||
													this.state[channelKey].moderation.includes('awaiting') ||
													this.state[channelKey].moderation.includes('moderation')),
											'text-danger':
												this.state[channelKey] &&
												(this.state[channelKey].moderation.includes('moderation_error') ||
													this.state[channelKey].moderation.includes('denied')),
										})}
									>
										<i className="fas fa-check" />
									</div>
								</div>
								{this.state.openForce === channelKey ||
								(channel.fields &&
									channel.fields.length &&
									!(
										this.state[channelKey] &&
										(this.state[channelKey].moderation.includes(null) ||
											this.state[channelKey].moderation.includes('ready') ||
											this.state[channelKey].moderation.includes('accepted') ||
											this.state[channelKey].moderation.includes('pending') ||
											this.state[channelKey].moderation.includes('awaiting') ||
											this.state[channelKey].moderation.includes('moderation'))
									)) ? (
									<div className="channel-select__list-channel--body">
										{channel.fields.map(field => this.renderInput(channel, field))}
										{this.props.permissions ? (
											<div className="channel-select__buttons">
												<Button
													color="info"
													onClick={() => this.sendSSPFields(creative.id, channel)}
												>
													<FormattedMessage id="app.common.save" />
												</Button>
												{(this.state[channel.key] &&
													((this.state[channel.key].hasOwnProperty('saved') &&
														this.state[channel.key].saved) ||
														(this.state[channel.key].hasOwnProperty('moderation') &&
															(this.state[channel.key].moderation.includes('denied') ||
																this.state[channel.key].moderation.includes(null) ||
																this.state[channel.key].moderation.includes(
																	'pending',
																))))) ||
												this.state.globalModeration ? (
													<Button
														color="warning"
														className="ml-2"
														onClick={() => this.toModeation(creative.id, channel)}
													>
														<FormattedMessage {...messages.toModeration} />
													</Button>
												) : null}
											</div>
										) : null}
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

ChannelSelect.propTypes = {
	creative: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired,
};

export default ChannelSelect;
