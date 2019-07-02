/**
 *
 * CampaignsRender
 *
 */

import React from 'react';
import { Alert, Collapse, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LinkButton from 'components/LinkButton';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import RemoveModal from 'components/RemoveModal';
import InlineEditField from 'components/InlineEditField';
import messages from 'containers/TradingDesk/messages';
import CampaignCreativeTable from 'containers/TradingDesk/components/CampaignCreativeTable/Loadable';
import CreativesStub from 'containers/TradingDesk/stubs/creatives.stub';
import TablesawControls from 'components/UbxTablesawControls';
import { campaingCollectionActions, creativeCollectionActions } from 'containers/TradingDesk/actions';
import { creativesSelectors, filteringGroups, selectGroupFilters } from 'containers/TradingDesk/selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import formatDateToUTC from 'utils/formatDateToUTC';
import createToast from 'utils/toastHelper';
import validateInteger from 'utils/validateInteger';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import AddCreativeToCampaignModal from '../AddCreativeToCampaignModal';
const CamppaignWrapper = styled.div`
	display: flex;
`;
let locked = false;
let lastCall = false;
/* eslint-disable react/prefer-stateless-function */
class CampaingsList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			collapse: [],
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
				{ key: 'startEnd', label: messages.dateStartEnd },
				{ key: 'impressions', label: messages.impressions },
				{ key: 'clicks', label: messages.clicks },
				{ key: 'CTR', label: messages.CTR },
				{ key: 'budget', label: messages.spentBudget },
				{ key: 'daily_budget', label: messages.spentDailyCap },
				{ key: 'creatives', label: messages.creatives },
				{ key: 'controls', preventHidden: true },
			],
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
		if (window.innerWidth >= 1900) {
			this.setMaxActiveColumns(12);
		} else if (window.innerWidth >= 1800) {
			this.setMaxActiveColumns(11);
		} else if (window.innerWidth >= 1700) {
			this.setMaxActiveColumns(10);
		} else if (window.innerWidth >= 1500) {
			this.setMaxActiveColumns(9);
		} else if (window.innerWidth >= 1280) {
			this.setMaxActiveColumns(8);
		} else if (window.innerWidth >= 1180) {
			this.setMaxActiveColumns(7);
		} else if (window.innerWidth >= 1060) {
			this.setMaxActiveColumns(6);
		} else if (window.innerWidth >= 990) {
			this.setMaxActiveColumns(5);
		} else if (window.innerWidth >= 950) {
			this.setMaxActiveColumns(8);
		} else if (window.innerWidth >= 880) {
			this.setMaxActiveColumns(7);
		} else if (window.innerWidth >= 760) {
			this.setMaxActiveColumns(6);
		} else if (window.innerWidth >= 560) {
			this.setMaxActiveColumns(4);
		} else if (window.innerWidth >= 460) {
			this.setMaxActiveColumns(3);
		} else {
			this.setMaxActiveColumns(2);
		}
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
		console.log(`
			firstActiveColumnIndex: ${this.state.firstActiveColumnIndex},
			activeColumns: ${this.state.activeColumns.map(c => c.key).join(',')}
		`);
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
		console.log(id, type);
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
				>
					{campaign.name}
					<span> #{campaign.id}</span>
				</p>
			</div>
		);
	}

	renderCampaingsColumns(campaign) {
		const { filter, filterSelector, patchCampaign } = this.props;
		const { campaigns } = filter;
		const { searchWord, request } = filterSelector;
		const colorClass = classNames({
			running: campaign.details === 'running',
			stopped: campaign.details === 'stopped',
			waiting: campaign.details === 'waiting',
		});
		return this.state.columns.filter(c => this.isColumnVisible(c.key)).map(({ key }) => {
			// Name column layout
			// #e4e407
			if (key === 'name') {
				const isSelect = campaigns.some(camp => camp.id === campaign.id) && (searchWord || request);
				return this.renderNameColumn(campaign, isSelect);
			}
			// details column layout
			if (key === 'details') {
				return (
					<div
						key={key}
						className={`campaign-table__cell campaign-table__cell--details campaign-table__cell--${colorClass}`}
					>
						{/* <FormattedMessage {...messages[campaign.details]} /> */}
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
								checked={!!(campaign && campaign.status === 'active')}
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
							<label className="custom-control-label" htmlFor={`customSwitch_${campaign.id}`}>
								{campaign.status ? 'On' : 'Off'}
							</label>
						</div>
					</div>
				);
			}
			// Name column layout
			if (key === 'startEnd') {
				return (
					<div key={key} className="campaign-table__cell campaign-table__cell--startEnd">
						<InlineEditField
							size="xs"
							type="date-range"
							forceHide={this.state.forceHide}
							value={{
								startDate: campaign && campaign.start_date ? campaign.start_date : '2019-01-01',
								endDate: campaign && campaign.end_date ? campaign.end_date : 'unlimited',
							}}
							onSave={val => {
								patchCampaign(campaign.id, {
									start_date: formatDateToUTC(val.startDate).format('YYYY-MM-DDTHH:mm'),
									end_date: formatDateToUTC(val.endDate).format('YYYY-MM-DDTHH:mm'),
								}).then(() => {
									createToast('success', 'Campaign dates successfully changed!');
								});
							}}
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
						<span>$0 /</span>{' '}
						<InlineEditField
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
						<span>$0 /</span>{' '}
						<InlineEditField
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
						/>
					</div>
				);
			}
			if (key === 'controls') {
				return (
					<div key={key} className="campaign-table__cell campaign-table__cell--controls">
						<LinkButton
							to={`/app/campaign/${campaign.id}/edit`}
							className="dots pull-right ml-2 background-transparent add_button"
							size="xs"
							title="Edit campaign"
						>
							<i className="fas fa-edit size-11" />
						</LinkButton>
						<Button
							onClick={() => this.setState({ addCreativeToCampaign: campaign.id })}
							className="dots plus pull-right ml-1 background-transparent add_button"
							size="xs"
							title="Add creatives to group"
						>
							<i className="fas fa-plus-circle size-11" />
						</Button>
						<Button
							onClick={() => this.setState({ removeCampaign: campaign.id })}
							className="dots pull-right ml-1 background-transparent add_button"
							size="xs"
							title="Remove campaign"
						>
							<i className="fas fa-remove size-11" />
						</Button>
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

	removeCreativeFromCampaign(campaignId, id) {
		const { campaigns, creatives } = this.props;
		const campaign = campaigns.filter(c => c.id === campaignId);
		const campaignCreatives = campaign[0].creatives;
		if(campaignCreatives.includes(id)){
			const creatives = campaignCreatives.filter(c => c !== id);
			this.props.patchCampaign(campaignId, { creatives }).then(() => {
				createToast('success', 'Creative succefully removed from campaign!');
			})

		}
	}

	renderCampaigns(campaign) {
		const { creatives } = this.props;
		const creativesArray = creatives.filter(s => campaign.creatives.some(camp => camp === s.id));
		return (
			<div className="panel panel-default" key={campaign.id}>
				<div className="panel-heading">
					<h4 className="panel-title">
						<a
							className={`accordion-toggle${this.state.collapse === campaign.id ? ' collapsed' : ''}`}
							id={`accordion_${campaign.id + 1}`}
						>
							<div className="campaign-table__content">{this.renderCampaingsColumns(campaign)}</div>
						</a>
					</h4>
				</div>
				<Collapse isOpen={this.state.collapse === campaign.id}>
					<div className="panel-body">
						{creativesArray && creativesArray.length ? (
							<CampaignCreativeTable
								data={creativesArray}
								changeCreativeName={(id, name) => this.changeCreativeName(id, name)}
								changeCreativeCPM={(id, cpm) => this.changeCreativeCPM(id, cpm)}
								onClickRemoveEntry={id => this.removeCreativeFromCampaign(campaign.id, id)}
							/>
						) : (
							<FormattedMessage {...messages.noCreatives} />
						)}
					</div>
				</Collapse>
			</div>
		);
	}

	renderHeader() {
		return (
			<div className="campaign-table__header">
				{this.state.columns.filter(c => this.isColumnVisible(c.key)).map(c => (
					<div key={c.key} className={`campaign-table__cell campaign-table__cell--${c.key}`}>
						{c.label && <FormattedMessage {...c.label} />}
					</div>
				))}
			</div>
		);
	}

	attachCreativeToCampaing(idCampaign, creatives) {
		console.log('attachCreativeToCampaing', creatives);
		this.props
			.patchCampaign(idCampaign, {
				creatives,
			})
			.then(() => {
				createToast('success', 'Creatives succefully added to campaign');
				this.setState({ addCreativeToCampaign: null });
			});
	}

	render() {
		const { campaigns, creatives } = this.props;
		return [
			<CamppaignWrapper>
				{campaigns && campaigns.length ? (
					<div className="campaign-table">
						{this.renderHeader()}
						{campaigns.map((key, i) => this.renderCampaigns(key))}
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
				{this.props.creatives && this.state.addCreativeToCampaign ? (
					<AddCreativeToCampaignModal
						isOpen={this.state.addCreativeToCampaign}
						campaigns={campaigns}
						onSubmit={creativesIds =>
							this.attachCreativeToCampaing(this.state.addCreativeToCampaign, creativesIds)
						}
						onCancel={() => this.setState({ addCreativeToCampaign: null })}
						title={messages.addCreativeToCampaign}
						bodyText={messages.selectCreatives}
						creatives={this.props.creatives}
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
	filter: PropTypes.array,
	filterSelector: PropTypes.array,
	getCreatives: PropTypes.func,
	removeCampaign: PropTypes.func,
	patchCampaign: PropTypes.func,
	patchCreative: PropTypes.func,
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
		removeCampaign: id => makePromiseAction(dispatch, campaingCollectionActions.removeEntry(id)),
		patchCampaign: (id, values) => makePromiseAction(dispatch, campaingCollectionActions.patchEntry(id, values)),
		patchCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.patchEntry(id, values)),
		removeCreative: id => makePromiseAction(dispatch, creativeCollectionActions.removeEntry(id)),
	}),
);
export default compose(withConnect)(injectIntl(CampaingsList));
