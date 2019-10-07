/**
 *
 * ListCampaign
 *
 */

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
	Alert,
	Button,
	Col,
	Input,
	Row,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Navbar,
} from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import LinkButton from 'components/LinkButton';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import AppCard from 'components/AppCard';
import RemoveModal from 'components/RemoveModal';
import CampainGroupsStub from 'containers/TradingDesk/stubs/campainGroups.stub';
import CampaignsStub from 'containers/TradingDesk/stubs/campaings.stub';
import CreativesStub from 'containers/TradingDesk/stubs/creatives.stub';
import messages from 'containers/TradingDesk/messages';
import CampaignsList from 'containers/TradingDesk/components/CampaignsList/Loadable';
import AddGroupModal from 'containers/TradingDesk/components/AddGroupModal';
import TopUpGroupModal from 'containers/TradingDesk/components/TopUpGroupModal';
import {
	campaingsSelectors,
	campaingGroupSelectors,
	selectCampaignGroups,
	filteringGroups,
	selectGroupFilters,
	selectBalance,
	selectPaginationCounts,
	selectOpenedGroup,
	selectGroupStats,
	selectGroupStatsLoading,
	selectFavoriteGroups,
} from 'containers/TradingDesk/selectors';
import {
	balanceCollectionActions,
	campaingCollectionActions,
	groupCollectionActions,
	setFilterCampaigns,
	transferMoneyGroup,
	setPaginationItemsCount,
	setOpenedGroup,
	groupSharingCollectionActions,
	getGroupStats,
	setFavoriteGroup,
} from 'containers/TradingDesk/actions';
import InlineEditField from 'components/InlineEditField';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import 'react-toastify/dist/ReactToastify.css';
import { selectUserData } from 'containers/UserPage/selectors';
import { getUBEXBalance, transferUbex } from 'utils/web3helper';
import WalletConnector from 'components/WalletConnector';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import getPaginatedItems from 'utils/pagination';
import Pagination from 'components/Pagination';
import ShareModal from '../ShareModal';
import { setPaymentModal } from '../../../Dashboard/actions';
import _ from 'lodash';
import moment from 'moment';
import request from '../../../../utils/request';
import getCookie from '../../../../utils/getCookie';
/* eslint-disable react/prefer-stateless-function */
class CampaignGroupsList extends React.Component {
	constructor(props) {
		super(props);
		const { filter } = props;
		const { groups } = filter;
		this.state = {
			removeGroup: null,
			dropdownOpen: false,
			search: '',
			groups: [],
			typeGroup: 'active',
			openCreativeModal: false,
			createCreativeModal: false,
			addGroupModal: false,
			topUpBalanceGroupModal: false,
			campaigns: CampaignsStub,
			creatives: CreativesStub,
			errorValidate: null,
			ubexBalance: 0,
			usdBalance: 0,
			openWalletConnector: false,
			hashTransaction: null,
			page: 1,
			items: props.paginationCounts.campaignGroupsCount,
			shareGroup: null,
			editGroup: false,
			groupName: '',
			sharedOwners: null,
			groupLoading: null,
		};
		this.addCampaign = null;
		this.editField = null;
		this.groups = CampainGroupsStub;
		this.typeCampaigns = this.typeCampaigns.bind(this);
		this.toggle = this.toggle.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
		this.searchEntries = this.searchEntries.bind(this);
		this.transferToken = this.transferToken.bind(this);
	}

	transferToken(ubex, groupId) {
		transferUbex(ubex)
			.then(result => {
				this.setState({ hashTransaction: result });
				console.log(result);
				request(`${API_URL}/billing/ethereum/ethereum_global/payment/`, {
					method: 'post',
					data: {
						hash: result,
						group_id: groupId,
					},
					headers: {
						'X-CSRFToken': getCookie('csrftoken'),
						'Test-User': 'test@test.test',
					},
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	transferUSD(usd, groupId) {
		this.props
			.transferUSD({ amount: usd, group_id: groupId })
			.then(result => {
				this.setState({ topUpBalanceGroupModal: false, hashTransaction: null });
				this.props.getCampaignsGroup();
				this.props.getCampaigns();
				this.props.getBalance();
				console.log(result);
			})
			.catch(err => {
				console.log(err);
			});
	}

	typeCampaigns(e) {
		const typeQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
		this.props.setFilter({ statusFilter: typeQuery });
	}

	searchEntries(e) {
		const typeQuery = e.target.value.toString().toLowerCase();
		this.setState({ search: typeQuery });
		this.props.setFilter({ searchWord: typeQuery });
	}

	clearSearch() {
		this.setState({ search: '' });
		this.props.setFilter({ searchWord: '' });
	}

	componentDidMount() {
		this.props.getCampaignsGroup();
		this.props.getCampaigns();
		const {
			match: {
				params: { request },
			},
		} = this.props;
		if (request) {
			this.props.setFilter({
				request: request.split(',').map(item => parseInt(item, 10)),
				searchWord: null,
				statusFilter: 'all',
			});
		} else {
			this.props.setFilter({ request: null });
		}
		if (this.props.location.state && this.props.location.state.success) {
			this.props.location.state.success = null;
		}
		const { userInfo } = this.props;
		const { wallet } = userInfo;
		if (wallet && wallet.hash_code) {
			this.getBalance(wallet.hash_code);
		}
		if (this.props.openedGroup) {
			this.props.openedGroup.forEach(groupId => {
				this.campaignGroupStats(groupId);
			});
		}
	}

	campaignGroupStats(id) {
		const group = _.find(this.props.campaignGroups, ['id', id]);
		const campaigns = this.props.campaigns
			.filter(s => s.campaign_group === id)
			.map(campaign => campaign.id)
			.slice(0, 19)
			.join();
		if (group && campaigns) {
			this.setState({
				groupLoading: group.id,
			});
			this.props.getGroupStats({
				campaign_group: group.id,
				campaign: campaigns,
				start_date: moment(group.created).format('YYYY-MM-DD'),
				end_date: moment().format('YYYY-MM-DD'),
			});
		}
	}

	componentWillUnmount() {
		this.props.setFilter({ searchWord: '', request: null });
	}

	componentDidUpdate(prevProps, prevState) {
		const { filter } = this.props;

		if (prevProps.paginationCounts.campaignGroupsCount !== this.props.paginationCounts.campaignGroupsCount) {
			this.setState({ items: this.props.paginationCounts.campaignGroupsCount });
		}
		if (
			this.addCampaign &&
			JSON.stringify(prevProps.activeCampaignGroup) !== JSON.stringify(this.props.activeCampaignGroup)
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/campaign/${this.props.activeCampaignGroup.id}/add`);
		}
	}

	toggle(id) {
		if (this.state.dropdownOpen === id) {
			this.setState({
				dropdownOpen: null,
			});
		} else {
			this.setState({
				dropdownOpen: id,
			});
		}
	}

	addGroup(name, addCampaign) {
		this.addCampaign = addCampaign;
		if (validateStringAndNumber(name) === undefined && !this.props.addGroupError) {
			this.props.addCampaignsGroup({ name }).then(() => {
				this.setState({ addGroupModal: false, errorValidate: null, editGroup: false, groupName: '' });
				createToast('success', 'Group successfully added!');
				this.props.getCampaignsGroup();
			});
		} else {
			this.setState({ errorValidate: validateStringAndNumber(name) });
		}
	}

	patchGroup(id, name) {
		if (validateStringAndNumber(name) === undefined && !this.props.addGroupError) {
			this.props.patchCampaignsGroup(id, { name }).then(() => {
				this.setState({ addGroupModal: false, errorValidate: null, editGroup: false, groupName: '' });
				createToast('success', 'Group successfully changed!');
			});
		} else {
			this.setState({ errorValidate: validateStringAndNumber(name) });
		}
	}

	removeGroup(id) {
		this.props.removeCampaignsGroup(id).then(() => {
			this.setState({ removeGroup: null });
			createToast('success', 'Group successfully removed!');
		});
	}

	async getBalance(hash) {
		const { balance, err } = await getUBEXBalance(hash);
		if (err) {
			console.log(err);
		} else {
			this.setState({ ubexBalance: parseInt(balance, 10) });
		}
	}

	renderHeader() {
		const {
			filterSelector,
			match: {
				params: { request },
			},
		} = this.props;
		const { statusFilter } = filterSelector;
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={7}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.listCampaignsHeader} />
									</h1>
								</div>
							</div>
						</Col>
						<Col md={2} xs={5} className="button" style={{ paddingRight: '4px' }}>
							<Button
								color="success"
								className="button-radius-5 float-right button-margin-left-10"
								onClick={() => this.setState({ addGroupModal: true })}
								title="Add campaign group"
							>
								<FormattedMessage {...messages.addGroup} />
							</Button>
						</Col>
						<Col md={1} xs={7} className="select">
							<Input
								type="select"
								className="radius-5"
								defaultValue={statusFilter}
								disabled={request}
								onChange={this.typeCampaigns}
							>
								<FormattedMessage {...messages.all}>
									{txt => <option value="all">{txt}</option>}
								</FormattedMessage>
								<FormattedMessage {...messages.active}>
									{txt => <option value="active">{txt}</option>}
								</FormattedMessage>
								<FormattedMessage {...messages.archive}>
									{txt => <option value="archive">{txt}</option>}
								</FormattedMessage>
							</Input>
						</Col>
						<Col md={2} className="campaign_search">
							<div className="search input">
								<Input
									type="search"
									placeholder={this.props.intl.formatMessage(messages.search)}
									aria-label="Search"
									className="search__input form-control border-5"
									onChange={this.searchEntries}
									value={this.state.search}
									disabled={request}
								/>
								{this.state.search && (
									<Button
										size="xs"
										className="search__button background-transparent"
										onClick={this.clearSearch}
									>
										<i className="far fa-times-circle" />
									</Button>
								)}
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}

	renderCampaingGroupHeader(group) {
		const { campaigns } = this.props;
		const colorClass = classNames({
			'tab-label': group,
			green: group.balance > 1,
			red: group.balance < 1,
		});

		const campaignsCount = campaigns.filter(s => s.campaign_group === group.id).length;

		return {
			header: (
				<Col md={6} xs={12} sm={6} key={group.id}>
					<h3 className="group-title" key={group.id}>
						{/* <InlineEditField
						inline
						type="text"
						size="sm"
						key={group.id}
						value={group.name && group.name.length ? group.name : `Unnamed`}
						forceHide={this.state.forceHide}
						onClick={() => (this.editField = group.id)}
						validation={val => validateStringAndNumber(val)}
						onSave={val => {
							this.props.patchCampaignGroup(group.id, { name: val }).then(() => {
								createToast('success', 'Group name successfully changed!');
							});
						}}
						onCancel={() => {
							this.editField = null;
						}}
					/> */}
						<p className="title-dots">{group.name && group.name.length ? group.name : `Unnamed`}</p>
					</h3>
				</Col>
			),
			buttons: (
				<Col md={12} className="top10 bottom10 buttons__campaign" key={group.id + group.id}>
					<div
						className="nav-item nav-pay"
						onClick={() => this.setState({ topUpBalanceGroupModal: group.id })}
					>
						<a className="nav-link button-margin-left-5" title="Top Up Group Budget">
							<span className={colorClass}>${group.balance ? group.balance : '0'}</span>
						</a>
					</div>
					{(group.sharing && !group.sharing.shared) ||
					(group.sharing && group.sharing.shared && group.sharing.perm === 'write') ? (
						<LinkButton
							to={`/app/campaign/${group.id}/add`}
							size="xs"
							className="dots plus button-radius-5 float-right ml-1 background-transparent"
							title="Add campaign to group"
						>
							<i className="fal fa-plus-circle" />
						</LinkButton>
					) : null}
					<LinkButton
						to={`/app/campaigns/reportByGroup/${group.id}`}
						size="xs"
						className="dots plus button-radius-5 float-right ml-1 background-transparent"
						title="Statistics"
					>
						<i className="fal fa-chart-bar" />
					</LinkButton>
					{(group.sharing && !group.sharing.shared) ||
					(group.sharing && group.sharing.shared && group.sharing.perm === 'write') ? (
						<Dropdown
							isOpen={this.state.dropdownOpen === group.id}
							toggle={() => this.toggle(group.id)}
							size="xs"
							title="Other actions"
						>
							<DropdownToggle className="dots background-transparent ml-1">
								<i className="fal fa-ellipsis-h" />
							</DropdownToggle>
							<DropdownMenu className="normal-transform">
								{(group.sharing && !group.sharing.shared) ||
								(group.sharing && group.sharing.shared && group.sharing.perm === 'write') ? (
									<DropdownItem
										onClick={() => this.setState({ editGroup: group.id, groupName: group.name })}
									>
										<FormattedMessage {...messages.patchGroup} />
									</DropdownItem>
								) : null}
								{(group.sharing && !group.sharing.shared) ||
								(group.sharing && group.sharing.shared && group.sharing.perm === 'write') ? (
									<DropdownItem
										onClick={() =>
											this.setState({
												shareGroup: group.id,
												sharedOwners: group.shared_owners,
											})
										}
									>
										<FormattedMessage {...messages.shareGroup} />
									</DropdownItem>
								) : null}
								{(group.sharing && !group.sharing.shared) ||
								(group.sharing && group.sharing.shared && group.sharing.perm === 'write') ? (
									<DropdownItem
										onClick={() => {
											if (parseInt(group.balance, 10) > 0) {
												createToast(
													'error',
													'Cannot archive group if balance is greater than 0',
												);
											} else {
												this.props
													.setStatus(group.id, {
														name: group.name,
														status: group.status === 'active' ? 'archive' : 'active',
													})
													.then(() => {
														createToast('success', 'Group successfully archived!');
													})
													.catch(() => {
														createToast('success', 'Group archived error!');
													});
											}
										}}
									>
										{group.status === 'active' ? (
											<FormattedMessage {...messages.archiveGroup} />
										) : (
											<FormattedMessage {...messages.activeGroup} />
										)}
									</DropdownItem>
								) : null}
								{group.sharing && !group.sharing.shared ? (
									<DropdownItem
										onClick={() => {
											if (parseInt(group.balance, 10) > 0) {
												createToast(
													'error',
													'Cannot delete group if balance is greater than $0',
												);
											} else {
												this.setState({ removeGroup: group.id });
											}
										}}
									>
										<FormattedMessage {...messages.removeGroup} />
									</DropdownItem>
								) : null}
							</DropdownMenu>
						</Dropdown>
					) : null}
				</Col>
			),
			span: [
				<span className="span-campaign">
					{group.sharing && group.sharing.shared ? (
						<div className="badge badge-info" style={{ borderRadius: '5px', minWidth: '65px' }}>
							Share
						</div>
					) : null}
					<div
						className={classNames(
							{ badge: true },
							{ 'badge-success': group.status === 'active' },
							{ 'badge-danger': group.status === 'archive' },
							{ 'mr-3': true },
						)}
						style={{ textTransform: 'capitalize', borderRadius: '5px', minWidth: '65px' }}
					>
						{group.status}
					</div>
					<span>ID: {group.id}</span>
					<span>&nbsp; | &nbsp; </span>
					<FormattedMessage {...messages.campaigns} />
					<span>: {campaignsCount}</span>
				</span>,
			],
		};
	}

	toggleCard(id) {
		if (!this.props.openedGroup.includes(id)) {
			this.props.setOpenedGroup([...this.props.openedGroup, id]);
			const group = _.find(this.props.campaignGroups, ['id', id]);
			const campaigns = this.props.campaigns
				.filter(s => s.campaign_group === id)
				.map(campaign => campaign.id)
				.slice(0, 19)
				.join();
			this.setState({
				groupLoading: group.id,
			});
			this.props.getGroupStats({
				campaign_group: group.id,
				campaign: campaigns,
				start_date: moment(group.created).format('YYYY-MM-DD'),
				end_date: moment().format('YYYY-MM-DD'),
			});
		} else {
			this.props.setOpenedGroup(this.props.openedGroup.filter(l => l !== id));
		}

		if (this.editField !== id) {
			this.setState({ [id]: !this.state[id] });
		}
	}

	openCard(openedGroup, searchWord, request, id) {
		if (openedGroup.includes(id)) {
			return true;
		}
		if (searchWord) {
			return true;
		}
		if (request) {
			return true;
		}
		return false;
	}

	setFavoriteGroup(groupId) {
		if (this.props.favoriteGroups.includes(groupId)) {
			this.props.setFavoriteGroup(this.props.favoriteGroups.filter(group => group !== groupId));
		} else {
			this.props.setFavoriteGroup([...this.props.favoriteGroups, groupId]);
		}
	}
	renderCampaignsList(group, campaigns) {
		const { filterSelector, openedGroup, getGroupStats, filter } = this.props;
		const { groups } = filter;
		const { searchWord, request } = filterSelector;
		const sharedOwners = this.state.shareGroup ? _.find(groups, ['id', this.state.shareGroup]) : [];
		return (
			<Row className="margin-0 " key={group.id}>
				<Col key={group.id}>
					<AppCard
						keys={group.id}
						arrow
						arrowForceOpen={this.openCard(openedGroup, searchWord, request, group.id)}
						arrowHead={this.renderCampaingGroupHeader(group)}
						onToggle={() => this.toggleCard(group.id)}
						star={{
							selectedList:
								this.props.favoriteGroups && this.props.favoriteGroups.length
									? this.props.favoriteGroups.includes(group.id)
									: false,
							select: () => this.setFavoriteGroup(group.id),
						}}
					>
						{!campaigns ? null : (
							<CampaignsList
								key={group.id}
								groupKey={group.id}
								campaigns={campaigns}
								campaignStats={this.props.groupStats}
								campaignStatsLoading={this.props.groupStatsLoading}
								groupLoading={this.state.groupLoading === group.id}
								permissions={
									(group.sharing && !group.sharing.shared) ||
									(group.sharing && group.sharing.shared && group.sharing.perm === 'write')
								}
							/>
						)}
					</AppCard>
				</Col>
				{this.state.shareGroup === group.id && (
					<ShareModal
						isOpen={this.state.shareGroup}
						title={messages.shareGroup}
						sharedOwners={sharedOwners ? sharedOwners.shared_owners : []}
						removeSharedOwner={id => this.removeShareUser(id)}
						onCancel={() => this.setState({ shareGroup: null })}
						addShareUser={values => this.addShareUser(this.state.shareGroup, values)}
						permissions={group.sharing && !group.sharing.shared}
					/>
				)}
			</Row>
		);
	}

	render() {
		const { filter, campaigns, userInfo, setPaginationItemsCount } = this.props;
		const { wallet } = userInfo;
		const { groups } = filter;
		const { amount } = this.props.selectAmount && this.props.selectAmount.length ? this.props.selectAmount[0] : '0';
		return (
			<div>
				{this.renderHeader()}
				{!groups.length ? (
					<Row className="margin-0">
						<Col>
							<Alert color="primary">
								<FormattedMessage {...messages.groupsNotFound} />
							</Alert>
						</Col>
					</Row>
				) : (
					/* groups
						.sort((a, b) => b.id - a.id)
						.map(group =>
							this.renderCampaignsList(group, campaigns.filter(s => s.campaign_group === group.id)),
						) */
					<div>
						{getPaginatedItems(groups, this.state.page, this.state.items)
							.data
							.map(group =>
								this.renderCampaignsList(group, campaigns.filter(s => s.campaign_group === group.id)),
							)}
						{
							<Pagination
								data={getPaginatedItems(groups, this.state.page, this.state.items)}
								changePage={page => this.setState({ page })}
								changeItemsCount={items => setPaginationItemsCount({ campaignGroupsCount: items })}
							/>
						}
					</div>
				)}
				<AddGroupModal
					isOpen={this.state.addGroupModal || this.state.editGroup}
					editGroup={this.state.editGroup}
					title={this.state.editGroup ? messages.patchGroup : messages.addGroup}
					onCreate={name => this.addGroup(name, false)}
					onCreateAndCreateCampaign={name => this.addGroup(name, true)}
					groupName={this.state.groupName}
					onPatch={name => this.patchGroup(this.state.editGroup, name)}
					onCancel={() => this.setState({ addGroupModal: false, editGroup: false, groupName: '' })}
					error={this.props.addGroupError}
					errorValidate={this.state.errorValidate}
					loading={this.props.addGroupLoading}
				/>
				<TopUpGroupModal
					ubexHash={wallet ? wallet.hash_code : null}
					ubexBalance={this.state.ubexBalance}
					usdBalance={parseInt(amount, 10)}
					isOpen={this.state.topUpBalanceGroupModal}
					title={messages.topUp}
					bodyText={messages.topUpText}
					onCreate={name => this.setState({ topUpBalanceGroupModal: false })}
					onCancel={() => this.setState({ topUpBalanceGroupModal: false, hashTransaction: null })}
					attachWallet={() => this.setState({ topUpBalanceGroupModal: false, openWalletConnector: true })}
					openPaymentMethods={() => {
						this.setState({ topUpBalanceGroupModal: false });
						this.props.setPaymentModal({ display: true });
					}}
					sendUSD={usd => this.transferUSD(usd, this.state.topUpBalanceGroupModal)}
					sendUBEX={ubex => this.transferToken(ubex, this.state.topUpBalanceGroupModal)}
					transactionHash={this.state.hashTransaction}
				/>
				<RemoveModal
					isOpen={this.state.removeGroup}
					onSuccess={id => this.removeGroup(id)}
					onCancel={() => this.setState({ removeGroup: null })}
					title={messages.remove}
					msg={messages.remove}
				/>
				<WalletConnector
					isOpen={this.state.openWalletConnector}
					data={userInfo}
					updateUbex={values => this.props.updateUbex(values)}
					onCancel={() => this.setState({ openWalletConnector: false })}
				/>
			</div>
		);
	}

	removeShareUser(id) {
		this.props
			.removeSharingUser(id)
			.then(() => {
				createToast('success', 'Share user successfully removed!');
				this.props.getCampaignsGroup();
			})
			.catch(errors => {
				this.getErrors(errors);
				createToast('error', 'Share user remove error!');
			});
	}
	addShareUser(groupId, values) {
		this.props
			.addSharingUser({
				group: groupId,
				...values,
			})
			.then(() => {
				createToast('success', 'Share user successfully added!');
				this.props.getCampaignsGroup();
			})
			.catch(() => {
				createToast('error', 'Share user added error!');
			});
	}
}

CampaignGroupsList.propTypes = {
	intl: intlShape.isRequired,
	campaignGroups: PropTypes.array,
	activeCampaignGroup: PropTypes.object,
	campaigns: PropTypes.array,
	filter: PropTypes.object,
	filterSelector: PropTypes.object,
	addGroupError: PropTypes.string,
	getCampaignsGroup: PropTypes.func,
	addCampaignsGroup: PropTypes.func,
	removeCampaignsGroup: PropTypes.func,
	setStatus: PropTypes.func,
	getCampaigns: PropTypes.func,
	setFilter: PropTypes.func,
	patchCampaignGroup: PropTypes.func,
};
const withConnect = connect(
	createStructuredSelector({
		campaignGroups: campaingGroupSelectors.collectionList(), // filteringGroups(),
		activeCampaignGroup: campaingGroupSelectors.activeEntry(),
		campaigns: campaingsSelectors.collectionList(),
		filter: filteringGroups(),
		filterSelector: selectGroupFilters(),
		addGroupLoading: campaingGroupSelectors.addEntryLoading(),
		addGroupError: campaingGroupSelectors.addEntryError(),
		userInfo: selectUserData(),
		selectAmount: selectBalance(),
		paginationCounts: selectPaginationCounts(),
		openedGroup: selectOpenedGroup(),
		groupStats: selectGroupStats(),
		groupStatsLoading: selectGroupStatsLoading(),
		favoriteGroups: selectFavoriteGroups(),
	}),
	dispatch => ({
		dispatch,
		getCampaignsGroup: () => dispatch(groupCollectionActions.getCollection()),
		addCampaignsGroup: values => makePromiseAction(dispatch, groupCollectionActions.addEntry(values)),
		patchCampaignsGroup: (id, values) => makePromiseAction(dispatch, groupCollectionActions.patchEntry(id, values)),
		removeCampaignsGroup: values => makePromiseAction(dispatch, groupCollectionActions.removeEntry(values)),
		setStatus: (id, values) => makePromiseAction(dispatch, groupCollectionActions.updateEntry(id, values)),
		getCampaigns: () => dispatch(campaingCollectionActions.getCollection()),
		setFilter: values => dispatch(setFilterCampaigns(values)),
		patchCampaignGroup: (id, values) => makePromiseAction(dispatch, groupCollectionActions.patchEntry(id, values)),
		transferUSD: values => makePromiseAction(dispatch, transferMoneyGroup.addEntry(values)),
		getBalance: () => makePromiseAction(dispatch, balanceCollectionActions.getCollection()),
		setPaginationItemsCount: values => dispatch(setPaginationItemsCount(values)),
		setOpenedGroup: values => dispatch(setOpenedGroup(values)),
		setPaymentModal: values => dispatch(setPaymentModal(values)),
		addSharingUser: values => makePromiseAction(dispatch, groupSharingCollectionActions.addEntry(values)),
		removeSharingUser: values => makePromiseAction(dispatch, groupSharingCollectionActions.removeEntry(values)),
		getGroupStats: values => makePromiseAction(dispatch, getGroupStats(values)),
		setFavoriteGroup: values => dispatch(setFavoriteGroup(values)),
	}),
);

export default compose(withConnect)(injectIntl(CampaignGroupsList));
