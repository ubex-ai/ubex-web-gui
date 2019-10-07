/**
 *
 * CampaignsRender
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'redux';
import { Alert, Collapse, Button, Spinner } from 'reactstrap';
import classNames from 'classnames';
import _ from 'lodash';
import Progress from 'reactstrap/es/Progress';
import { FormattedMessage, injectIntl } from 'react-intl';
import LinkButton from 'components/LinkButton';
import RemoveModal from 'components/RemoveModal';
import InlineEditField from 'components/InlineEditField';
import messages from 'containers/TradingDesk/messages';
import CampaignCreativeTable from 'containers/TradingDesk/components/CampaignCreativeTable/Loadable';
import CreativesStub from 'containers/TradingDesk/stubs/creatives.stub';
import TablesawControls from 'components/UbxTablesawControls';
import { campaingCollectionActions, creativeCollectionActions } from 'containers/TradingDesk/actions';
import { creativesSelectors, filteringGroups, selectGroupFilters } from 'containers/TradingDesk/selectors';
import formatDateToUTC from 'utils/formatDateToUTC';
import createToast from 'utils/toastHelper';
import validateInteger from 'utils/validateInteger';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import AddCreativeToCampaignModal from '../AddCreativeToCampaignModal';

const CamppaignWrapper = styled.div`
	display: flex;
	margin-top: -1rem !important;
	.alert {
		margin-top: 10px;
		border-radius: 5px;
	}
`;
let locked = false;
let lastCall = false;
/* eslint-disable react/prefer-stateless-function */
class CampaingsList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			collapse: [],
			activeInlineEditField: null,
			nextDisabled: false,
			prevDisabled: true,
			maxActiveColumns: 12,
			firstActiveColumnIndex: 0,
			creatives: CreativesStub,
			removeCampaign: null,
			removeCreative: null,
			addCreativeToCampaign: null,
			columns: [
				{ key: 'name', label: messages.name, preventHidden: true },
				{ key: 'details', label: messages.details },
				{ key: 'status', label: messages.status },
				{ key: 'creatives', label: messages.creatives },
				{ key: 'startEnd', label: messages.dateStartEnd },
				{ key: 'impressions', label: messages.impressions },
				{ key: 'clicks', label: messages.clicks },
				{ key: 'CTR', label: messages.CTR },
				{ key: 'CPC', label: messages.CPC },
				{ key: 'budget', label: messages.spentBudget },
				/* { key: 'daily_budget', label: messages.spentDailyCap }, */
				{ key: 'controls', preventHidden: true },
			],
			statuses: {
				draft: 'Draft',
				moderation: 'Moderation',
				moderation_error: 'Moderation error',
				ready: 'Ready',
				paused: 'Paused',
				activating: 'Activating',
				delayed: 'Delayed',
				running: 'Running',
				deactivating: 'Deactivating',
				stopped: 'Stopped',
				archive: 'Archive',
				insufficient_funds: 'Insufficient funds',
				no_creatives: 'No creatives',
				no_banners: 'No banners',
			},
		};

		this.state.activeColumns = this.state.columns
			.filter(c => !c.preventHidden)
			.slice(
				this.state.firstActiveColumnIndex,
				this.state.firstActiveColumnIndex + this.state.maxActiveColumns - this.getPreventedLength(),
			);
	}

	getPreventedLength() {
		return this.state.columns.filter(c => c.preventHidden).length;
	}

	setMaxActiveColumns(val) {
		if (this.state.maxActiveColumns !== val) {
			const newColumns = this.state.columns
				.filter(c => !c.preventHidden)
				.slice(
					this.state.firstActiveColumnIndex,
					this.state.firstActiveColumnIndex + val - this.getPreventedLength(),
				);
			this.setState({
				maxActiveColumns: val,
				activeColumns: newColumns,
			});
		}
	}

	setMaxColumnsDependOnWindowWidth() {
		let width;
		if (window.outerWidth - window.innerWidth > 100) {
			width = window.innerWidth;
		} else {
			width = window.outerWidth;
		}

		const resolutions = {
			1900: 11,
			1600: 10,
			1500: 9,
			1440: 8,
			1366: 7,
			1280: 6,
			1180: 5,
			990: 7,
			950: 6,
			905: 5,
			800: 4,
			560: 3,
			460: 2,
		};
		let colsNumber = 12;
		Object.keys(resolutions)
			.reverse()
			.forEach(key => (parseInt(key) > width ? (colsNumber = resolutions[key]) : null));
		this.setMaxActiveColumns(colsNumber);
	}

	runOnScroll(evt) {
		if (locked) return;

		if (lastCall) clearTimeout(lastCall);
		lastCall = setTimeout(() => {
			this.runOnScroll(evt);
			locked = false;
		}, 1000);
		this.setState({ forceHide: true });
		locked = true;
	}

	componentDidMount() {
		this.props.getCreatives();
		this.setMaxColumnsDependOnWindowWidth(window.innerWidth);
		window.addEventListener('resize', this.setMaxColumnsDependOnWindowWidth.bind(this));

		const a = document.getElementsByClassName('dx-g-bs4-table-container');
		Array.prototype.slice.call(a);

		[...a].forEach(e => {
			e.addEventListener('scroll', e => this.runOnScroll(e));
		});
	}

	componentWillUnmount() {
		if (lastCall) clearTimeout(lastCall);
		window.removeEventListener('resize', this.setMaxColumnsDependOnWindowWidth.bind(this));
		const a = document.getElementsByClassName('dx-g-bs4-table-container');
		Array.prototype.slice.call(a);

		[...a].forEach(e => {
			e.removeEventListener('scroll', e => this.runOnScroll(e));
		});
	}

	getColumn(key) {
		return this.state.columns.find(c => key === c.key);
	}

	isColumnVisible(key) {
		return !!this.state.activeColumns.find(c => key === c.key) || !!this.getColumn(key).preventHidden;
	}

	log() {
		this.state.columns.forEach(c => console.log(c.key, this.isColumnVisible(c.key)));
	}

	nextColumn() {
		if (this.state.firstActiveColumnIndex < this.state.columns.length - this.state.maxActiveColumns) {
			const newFirstIndex = this.state.firstActiveColumnIndex + 1;
			this.setState({
				firstActiveColumnIndex: newFirstIndex,
				activeColumns: this.state.columns
					.filter(c => !c.preventHidden)
					.slice(newFirstIndex, newFirstIndex + this.state.maxActiveColumns - this.getPreventedLength()),
			});
		}
	}

	prevColumn() {
		if (this.state.firstActiveColumnIndex > 0) {
			const newFirstIndex = this.state.firstActiveColumnIndex - 1;
			this.setState({
				firstActiveColumnIndex: newFirstIndex,
				activeColumns: this.state.columns
					.filter(c => !c.preventHidden)
					.slice(newFirstIndex, newFirstIndex + this.state.maxActiveColumns - this.getPreventedLength()),
			});
		}
	}

	toggle(index) {
		if (this.state.collapse === index) {
			this.setState({ collapse: null });
		} else {
			this.setState({ collapse: index });
		}
	}

	onCheckColumn(key) {
		const c = this.getColumn(key);
		if (c) {
			c.preventHidden = !c.preventHidden;
		}
	}

	remove(id, type) {
		if (type === 'campaign') {
			this.props.removeCampaign(id).then(() => {
				this.setState({ removeCampaign: null });
				createToast('success', 'Campaign successfully removed!');
			});
		}
		if (type === 'creative') {
			this.props.removeCreative(id).then(() => {
				this.setState({ removeCreative: null });
				createToast('success', 'Creative successfully removed!');
			});
		}
	}

	renderNameColumn(campaign, selected) {
		return (
			<div
				key="name"
				onClick={e => {
					e.preventDefault();
					this.toggle(campaign.id);
				}}
				className="campaign-table__cell campaign-table__cell--name"
			>
				<p
					style={{
						paddingLeft: '5px',
						width: '90%',
						marginBottom: 0,
						background: selected ? '#e4e407' : 'transparent',
					}}
					className="nameText"
				>
					{campaign.name}
					<br />
					<span> ID: {campaign.id}</span>
				</p>
			</div>
		);
	}

	renderCampaingsColumns(campaign) {
		const { filter, filterSelector, patchCampaign, permissions, campaignStats, campaignStatsLoading } = this.props;
		const spent = 0;
		const { campaigns } = filter;
		const { searchWord, request } = filterSelector;
		const warningStates = [
			'moderation',
			'pause',
			'activating',
			'stopped',
			'insufficient_funds',
			'no_creatives',
			'no_banners',
		];
		const successStates = ['ready', 'running'];
		const dangerStates = ['moderation_error', 'delayed'];
		const infoStates = ['draft'];
		const secondaryStates = ['deactivating', 'archive'];
		const colorClass = classNames({
			warning: warningStates.includes(campaign.state),
			danger: dangerStates.includes(campaign.state),
			success: successStates.includes(campaign.state),
			info: infoStates.includes(campaign.state),
			secondary: secondaryStates.includes(campaign.state),
		});
		const stats = _.find(campaignStats, ['id', campaign.id]);
		return this.state.columns
			.filter(c => this.isColumnVisible(c.key))
			.map(({ key }) => {
				// Name column layout
				// #e4e407
				if (key === 'name') {
					const isSelect = campaigns.some(camp => camp.id === campaign.id) && (searchWord || request);
					return this.renderNameColumn(campaign, isSelect);
				}
				// details column layout
				if (key === 'details') {
					return (
						<div key={key} className="campaign-table__cell campaign-table__cell--details">
							<div className={`badge badge-${colorClass}`} style={{ borderRadius: '5px' }}>
								{this.state.statuses[campaign.state]}
							</div>
						</div>
					);
				}
				if (key === 'impressions') {
					return (
						<div key={key} className={`campaign-table__cell campaign-table__cell--${key}`}>
							{stats ? `${stats.impressions}` : 0}{' '}
							{campaignStatsLoading && this.props.groupLoading ? (
								<Spinner size="sm" color="info" />
							) : null}
						</div>
					);
				}
				if (key === 'clicks') {
					return (
						<div key={key} className={`campaign-table__cell campaign-table__cell--${key}`}>
							{stats ? `${stats.clicks}` : 0}{' '}
							{campaignStatsLoading && this.props.groupLoading ? (
								<Spinner size="sm" color="info" />
							) : null}
						</div>
					);
				}
				if (key === 'CTR') {
					return (
						<div key={key} className={`campaign-table__cell campaign-table__cell--${key}`}>
							{stats ? `${stats.CTR}%` : 0}{' '}
							{campaignStatsLoading && this.props.groupLoading ? (
								<Spinner size="sm" color="info" />
							) : null}
						</div>
					);
				}

				if (key === 'CPC') {
					return (
						<div key={key} className={`campaign-table__cell campaign-table__cell--${key}`}>
							{stats ? `$${stats.CPC}` : 0}{' '}
							{campaignStatsLoading && this.props.groupLoading ? (
								<Spinner size="sm" color="info" />
							) : null}
						</div>
					);
				}
				// status column layout
				if (key === 'status') {
					return (
						<div key={key} className="campaign-table__cell campaign-table__cell--status">
							<div className="custom-control custom-switch">
								<input
									type="checkbox"
									className="custom-control-input"
									id={`customSwitch_${campaign.id}`}
									defaultChecked={!!(campaign && campaign.status === 'active')}
									onClick={() =>
										campaign && campaign.status === 'active'
											? patchCampaign(campaign.id, { status: 'disabled' }).then(() => {
													createToast('success', 'Campaign status successfully changed!');
											  })
											: patchCampaign(campaign.id, { status: 'active' }).then(() => {
													createToast('success', 'Campaign status successfully changed!');
											  })
									}
								/>
								<label className="custom-control-label" htmlFor={`customSwitch_${campaign.id}`} />
							</div>
						</div>
					);
				}
				// Name column layout
				if (key === 'startEnd') {
					return (
						<div key={key} className="campaign-table__cell campaign-table__cell--startEnd">
							<InlineEditField
								key={campaign.start_date + campaign.id}
								size="xs"
								type="date-range"
								forceHide={this.state.forceHide}
								value={{
									startDate: campaign && campaign.start_date ? campaign.start_date : '2019-01-01',
									endDate: campaign && campaign.end_date ? campaign.end_date : 'unlimited',
								}}
								onSave={val => {
									patchCampaign(campaign.id, {
										start_date: val.startDate
											? formatDateToUTC(val.startDate).format('YYYY-MM-DDTHH:mm')
											: null,
										end_date: val.endDate
											? formatDateToUTC(val.endDate).format('YYYY-MM-DDTHH:mm')
											: null,
									}).then(() => {
										createToast('success', 'Campaign dates successfully changed!');
									});
								}}
								permissions={permissions}
							/>
						</div>
					);
				}
				if (key === 'daily_budget') {
					return (
						<div
							key={key}
							className="campaign-table__cell campaign-table__cell--editable campaign-table__cell--daily_budget"
						>
							<div className="campaign-table__column-wrapper">
								<span
									style={
										campaign.daily_budget > 0 && (spent * 100) / campaign.daily_budget >= 90
											? { color: '#f4516c' }
											: null
									}
								>
									${spent}
								</span>
								/{' '}
								<InlineEditField
									key={campaign.daily_budget + campaign.id}
									size="xs"
									type="price"
									value={campaign && campaign.daily_budget ? campaign.daily_budget : 0}
									forceHide={this.state.forceHide}
									validation={val => validateInteger(val)}
									onSave={val => {
										patchCampaign(campaign.id, { daily_budget: val }).then(() => {
											createToast('success', 'Campaign daily budget successfully changed!');
										});
									}}
									permissions={permissions}
								/>
							</div>
							<Progress
								color={spent === campaign.daily_budget ? 'danger' : 'success'}
								className="campaign-table__cell--progress"
								value={campaign.daily_budget !== 0 ? (spent * 100) / campaign.daily_budget : 0}
							/>
						</div>
					);
				}
				if (key === 'budget') {
					return (
						<div
							key={key}
							className="campaign-table__cell campaign-table__cell--editable campaign-table__cell--budget"
						>
							<div className="campaign-table__column-wrapper">
								<span
									style={
										campaign.budget > 0 && (spent * 100) / campaign.budget >= 90
											? { color: '#f4516c' }
											: null
									}
								>
									{stats ? `$${stats.spent}` : 0}{' '}
									{campaignStatsLoading && this.props.groupLoading ? (
										<Spinner size="sm" color="info" />
									) : null}{' '}
									/
								</span>{' '}
								<InlineEditField
									key={campaign.budget + campaign.id}
									size="xs"
									type="price"
									value={campaign && campaign.budget ? campaign.budget : 0}
									forceHide={this.state.forceHide}
									validation={val => validateInteger(val)}
									onSave={val => {
										patchCampaign(campaign.id, { budget: val }).then(() => {
											createToast('success', 'Campaign budget successfully changed!');
										});
									}}
									permissions={permissions}
								/>
							</div>
							<Progress
								color={stats && stats.spent >= campaign.budget ? 'danger' : 'success'}
								className="campaign-table__cell--progress"
								value={((stats ? stats.spent : 0) * 100) / campaign.budget}
							/>
						</div>
					);
				}
				if (key === 'controls' && permissions) {
					return (
						<div key={key} className="campaign-table__cell campaign-table__cell--controls">
							{window.innerWidth < 576 ? (
								<div
									className="custom-control custom-switch"
									style={{
										position: 'relative',
										top: '3px',
									}}
								>
									<input
										type="checkbox"
										className="custom-control-input"
										id={`customSwitch_${campaign.id}`}
										defaultChecked={!!(campaign && campaign.status === 'active')}
										onClick={() =>
											campaign && campaign.status === 'active'
												? patchCampaign(campaign.id, { status: 'disabled' }).then(() => {
														createToast('success', 'Campaign status successfully changed!');
												  })
												: patchCampaign(campaign.id, { status: 'active' }).then(() => {
														createToast('success', 'Campaign status successfully changed!');
												  })
										}
									/>
									<label className="custom-control-label" htmlFor={`customSwitch_${campaign.id}`} />
								</div>
							) : null}

							{window.innerWidth > 576 ? (
								<LinkButton
									to={`/app/creatives/reportByCampaign/${campaign.id}`}
									size="xs"
									className="dots plus button-radius-5 float-right ml-1 background-transparent"
									title="Statistics"
								>
									<i className="fal fa-chart-bar" />
								</LinkButton>
							) : null}
							<LinkButton
								to={`/app/campaign/${campaign.id}/edit`}
								className="dots pull-right ml-1 background-transparent add_button"
								size="xs"
								title="Edit campaign"
							>
								<i className="fal fa-edit" />
							</LinkButton>
							{window.innerWidth > 576 ? (
								<Button
									onClick={() => this.setState({ removeCampaign: campaign.id })}
									className="dots pull-right ml-1 background-transparent add_button"
									size="xs"
									title="Remove campaign"
								>
									<i className="fal fa-trash" />
								</Button>
							) : null}
						</div>
					);
				}
				if (key === 'controls' && !permissions) {
					return (
						<div key={key} className="campaign-table__cell campaign-table__cell--controls">
							<LinkButton
								to={`/app/campaign/${campaign.id}/see`}
								className="dots pull-right ml-2 background-transparent add_button"
								size="xs"
								title="See campaign"
							>
								<i className="fal fa-eye" />
							</LinkButton>
						</div>
					);
				}
				if (key === 'creatives') {
					return (
						<div
							key={key}
							className="campaign-table__cell campaign-table__cell--editable campaign-table__cell--creatives"
						>
							<div className="d-inline-block">{campaign.creatives.length}</div>
							&nbsp;
							<div className="d-inline-block">
								<div className="d-inline-block">[</div>
								<div
									className="d-inline-block plus"
									onClick={() =>
										permissions ? this.setState({ addCreativeToCampaign: campaign.id }) : null
									}
								>
									+
								</div>
								<div className="d-inline-block">]</div>
							</div>
						</div>
					);
				}
				return (
					<div key={key} className={`campaign-table__cell campaign-table__cell--${key}`}>
						{this.getCampaingCellValue(campaign, key)}
						{key === 'CTR' ? '%' : ''}
					</div>
				);
			});
	}

	getCampaingCellValue(campaign, key) {
		if (campaign && !campaign[key]) {
			return 0;
		}
		if (typeof campaign[key] === 'object') {
			return campaign[key].length;
		}
		return campaign[key];
	}

	changeCreativeName(id, name) {
		this.props.patchCreative(id, { name }).then(() => {
			createToast('success', 'Creative name succefully changed!');
		});
	}

	changeCreativeCPM(id, cpm) {
		this.props.patchCreative(id, { data: { cpm } }).then(() => {
			createToast('success', 'Creative CPM succefully changed!');
		});
	}

	patchCampaignCreative({ campaignId, creativeId, data, callback, msg }) {
		const { campaigns, patchCampaign, getCreatives, patchCreative } = this.props;
		const campaign = _.find(campaigns, ['id', campaignId]);
		const creatives = campaign.creatives.map(c => (c.value !== creativeId ? c : { ...c, ...data }));
		patchCampaign(campaignId, { creatives })
			.then(() => {
				createToast('success', msg);
				callback();
			})
			.catch(e => console.error(e));
	}

	changeCreativeStartDate(campaignId, creativeId, date) {
		this.patchCampaignCreative({
			campaignId,
			creativeId,
			callback: this.props.getCampaigns,
			msg: 'Creative Start Date succefully changed!',
			data: {
				start_date: date ? formatDateToUTC(date).format('YYYY-MM-DDTHH:mm') : null,
			},
		});
	}

	changeCreativeStatus(campaignId, creativeId, status) {
		this.patchCampaignCreative({
			campaignId,
			creativeId,
			callback: this.props.getCreatives,
			msg: 'Creative status succefully changed!',
			data: {
				status,
			},
		});
	}

	changeCreativeEndDate(campaignId, creativeId, date) {
		this.patchCampaignCreative({
			campaignId,
			creativeId,
			callback: this.props.getCreatives,
			msg: 'Creative End Date succefully changed!',
			data: {
				end_date: date ? formatDateToUTC(date).format('YYYY-MM-DDTHH:mm') : null,
			},
		});
	}

	removeCreativeFromCampaign(campaignId, id) {
		const { campaigns, patchCampaign } = this.props;
		const campaign = _.find(campaigns, ['id', campaignId]);
		const creatives = campaign.creatives.filter(c => c.value !== id);
		patchCampaign(campaignId, { creatives }).then(() => {
			createToast('success', 'Creative successfully removed from campaign!');
			this.props.getCampaigns();
			this.props.getCreatives();
		});
	}

	renderCampaigns(campaign) {
		const { creatives, permissions, campaignStats } = this.props;
		const stats = _.find(campaignStats, ['id', campaign.id]);
		const creativesArray = creatives.filter(s => s.campaigns.includes(campaign.id));
		return (
			<div className="panel panel-default" key={campaign.id}>
				<div className="panel-heading" key={campaign.id + campaign.id}>
					<h4 className="panel-title" key={campaign.id}>
						<a
							className={`accordion-toggle${this.state.collapse === campaign.id ? ' collapsed' : ''}`}
							id={`accordion_${campaign.id + 1}`}
							key={`accordion_${campaign.id + 1}`}
						>
							<div className="campaign-table__content" key={campaign.id}>
								{this.renderCampaingsColumns(campaign)}
							</div>
						</a>
					</h4>
				</div>
				<Collapse isOpen={this.state.collapse === campaign.id} key={campaign.id}>
					<div className="panel-body" key={campaign.id}>
						<nav className="nav nav-pills nav-fill campaign-pills" style={{ width: '100%' }}>
							<div className="nav-item nav-link campaign-stats-pills">
								<span>
									<span>Impress.: </span>
								</span>{' '}
								<strong>
									<span>{stats && stats.impressions ? stats.impressions : 0}</span>
								</strong>
							</div>
							<div className="nav-item nav-link campaign-stats-pills">
								<span>
									<span>Clicks: </span>
								</span>{' '}
								<strong>
									<span>{stats && stats.clicks ? stats.clicks : 0}</span>
								</strong>
							</div>
							<div className="nav-item nav-link campaign-stats-pills">
								<span>
									<span>CTR: </span>
								</span>{' '}
								<strong>
									<span>{stats && stats.CTR ? stats.CTR : 0}</span>
								</strong>
							</div>
							<div className="nav-item nav-link campaign-stats-pills">
								<span>
									<span>Spent: </span>
								</span>{' '}
								<strong>
									<span>{stats && stats.spent ? stats.spent : 0}</span>
								</strong>
							</div>
						</nav>
						{creativesArray && creativesArray.length ? (
							<CampaignCreativeTable
								key={campaign.id}
								campaignId={campaign.id}
								data={creativesArray}
								creativesWithDates={campaign.creatives}
								changeCreativeName={(id, name) => this.changeCreativeName(id, name)}
								changeCreativeCPM={(id, cpm) => this.changeCreativeCPM(id, cpm)}
								changeCreativeStatus={(id, status) => {
									this.changeCreativeStatus(campaign.id, id, status);
								}}
								onClickRemoveEntry={id => this.removeCreativeFromCampaign(campaign.id, id)}
								changeCreativeStartDate={(id, dates) =>
									this.changeCreativeStartDate(campaign.id, id, dates)
								}
								changeCreativeEndDate={(id, dates) =>
									this.changeCreativeEndDate(campaign.id, id, dates)
								}
								permissions={permissions}
							/>
						) : (
							<div key={campaign.id}>
								<FormattedMessage {...messages.noCreatives} />
								<Button
									onClick={() => this.setState({ addCreativeToCampaign: campaign.id })}
									size="xs"
									color="info"
									className="ml-2"
									key={campaign.id}
								>
									Add
								</Button>
							</div>
						)}
					</div>
				</Collapse>
			</div>
		);
	}

	renderHeader() {
		return (
			<div className="campaign-table__header">
				{this.state.columns
					.filter(c => this.isColumnVisible(c.key))
					.map(c => (
						<div key={c.key} className={`campaign-table__cell campaign-table__cell--${c.key}`}>
							{c.label && <FormattedMessage {...c.label} />}
						</div>
					))}
			</div>
		);
	}

	attachCreativeToCampaing(idCampaign, creatives) {
		this.props
			.patchCampaign(idCampaign, {
				creatives,
			})
			.then(() => {
				createToast('success', 'Creatives succefully added to campaign');
				this.props.getCampaigns();
				this.props.getCreatives();
				this.setState({ addCreativeToCampaign: null });
			});
	}

	render() {
		const { campaigns, creatives, groupKey } = this.props;
		return [
			<CamppaignWrapper key={groupKey}>
				{campaigns && campaigns.length ? (
					<div className="campaign-table" key={groupKey}>
						{this.renderHeader()}
						<div className="campaign-table__campaigns">
							{campaigns.map((key, i) => this.renderCampaigns(key))}
						</div>
					</div>
				) : (
					<Alert color="primary">
						<FormattedMessage id="app.common.createYourFirstCampaign" />
					</Alert>
				)}
				<RemoveModal
					isOpen={this.state.removeCampaign || this.state.removeCreative}
					onSuccess={id => this.remove(id, this.state.removeCampaign ? 'campaign' : 'creative')}
					onCancel={() => this.setState({ removeCampaign: null, removeCreative: null })}
					title={messages.remove}
					msg={messages.remove}
				/>
				{creatives && this.state.addCreativeToCampaign ? (
					<AddCreativeToCampaignModal
						isOpen={this.state.addCreativeToCampaign}
						campaigns={campaigns}
						onSubmit={creativesIds =>
							this.attachCreativeToCampaing(this.state.addCreativeToCampaign, creativesIds)
						}
						onCancel={() => this.setState({ addCreativeToCampaign: null })}
						title={messages.addCreativeToCampaign}
						bodyText={messages.selectCreatives}
						creatives={creatives ? creatives.filter(filter => filter.banners.length > 0) : []}
					/>
				) : null}
			</CamppaignWrapper>,
			campaigns && campaigns.length ? (
				<TablesawControls
					columns={this.state.columns}
					activeColumns={this.state.activeColumns}
					nextColumn={() => this.nextColumn()}
					prevColumn={() => this.prevColumn()}
					onCheckColumn={key => this.onCheckColumn(key)}
				/>
			) : null,
		];
	}
}

CampaingsList.propTypes = {
	creatives: PropTypes.array,
	filter: PropTypes.object,
	filterSelector: PropTypes.object,
	getCreatives: PropTypes.func,
	removeCampaign: PropTypes.func,
	patchCampaign: PropTypes.func,
	patchCreative: PropTypes.func,
	permissions: PropTypes.bool,
};
const withConnect = connect(
	createStructuredSelector({
		creatives: creativesSelectors.collectionList(),
		filter: filteringGroups(),
		filterSelector: selectGroupFilters(),
	}),
	dispatch => ({
		dispatch,
		getCreatives: () => dispatch(creativeCollectionActions.getCollection()),
		getCampaigns: () => makePromiseAction(dispatch, campaingCollectionActions.getCollection()),
		removeCampaign: id => makePromiseAction(dispatch, campaingCollectionActions.removeEntry(id)),
		patchCampaign: (id, values) => makePromiseAction(dispatch, campaingCollectionActions.patchEntry(id, values)),
		patchCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.patchEntry(id, values)),
		removeCreative: id => makePromiseAction(dispatch, creativeCollectionActions.removeEntry(id)),
	}),
);
export default compose(withConnect)(injectIntl(CampaingsList));
