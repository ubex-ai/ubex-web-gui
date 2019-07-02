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
} from 'containers/TradingDesk/selectors';
import {
	campaingCollectionActions,
	groupCollectionActions,
	setFilterCampaigns,
	transferMoneyGroup,
} from 'containers/TradingDesk/actions';
import InlineEditField from 'components/InlineEditField';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import 'react-toastify/dist/ReactToastify.css';
import { selectUserData } from 'containers/UserPage/selectors';
import { getUBEXBalance, transferUbex } from 'utils/web3helper';
import WalletConnector from 'components/WalletConnector';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
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
			openCard: null,
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

	transferToken(ubex) {
		transferUbex(ubex)
			.then(result => {
				this.setState({ hashTransaction: result });
				console.log(result);
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
		const typeQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
		this.setState({ search: typeQuery });
		this.props.setFilter({ searchWord: typeQuery });
	}

	clearSearch() {
		this.setState({ search: '' });
		this.props.setFilter({ searchWord: '' });
	}

	componentWillMount() {
		this.props.getCampaignsGroup();
	}

	componentDidMount() {
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
	}

	componentWillUnmount() {
		this.props.setFilter({ searchWord: '', request: null });
	}

	componentDidUpdate(prevProps, prevState) {
		const { filter } = this.props;
		const { groups } = filter;
		if (
			this.addCampaign &&
			JSON.stringify(prevProps.activeCampaignGroup) !== JSON.stringify(this.props.activeCampaignGroup)
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.props.history.push(`/app/campaign/${this.props.activeCampaignGroup.id}/add`);
		}
		if (!this.state.openCard && groups) {
			this.setState({ openCard: Math.max(...groups.map(group => group.id)) });
		}
	}

	toggleCard(groupId) {
		if (this.editField !== groupId) {
			if (groupId === this.state.openCard) {
				this.setState({ openCard: null });
			} else {
				this.setState({ openCard: groupId });
			}
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
				this.setState({ addGroupModal: false, errorValidate: null });
				createToast('success', 'Group successfully added!');
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
						<Col md={2} xs={5} className="button">
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
							<Input type="select" className="radius-5" disabled={request} onChange={this.typeCampaigns}>
								<FormattedMessage {...messages.all}>
									{txt => (
										<option value="all" selected={statusFilter === 'all' ? 'selected' : false}>
											{txt}
										</option>
									)}
								</FormattedMessage>
								<FormattedMessage {...messages.active}>
									{txt => (
										<option
											value="active"
											selected={statusFilter === 'active' ? 'selected' : false}
										>
											{txt}
										</option>
									)}
								</FormattedMessage>
								<FormattedMessage {...messages.archive}>
									{txt => (
										<option
											value="archive"
											selected={statusFilter === 'archive' ? 'selected' : false}
										>
											{txt}
										</option>
									)}
								</FormattedMessage>
							</Input>
						</Col>
						<Col md={2}>
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
			green: group.budget > 1,
			red: group.budget < 1,
		});

		const campaignsCount = campaigns.filter(s => s.campaign_group === group.id).length;

		return [
			<Col md={6} xs={12} sm={6}>
				<h3 className="group-title">
					<InlineEditField
						inline
						type="text"
						size="sm"
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
					/>
				</h3>
				<span>
					ID: {group.id} &nbsp; | &nbsp; Status:{' '}
					<span
						style={{ textTransform: 'capitalize' }}
						className={classNames(
							{ 'text-success': group.status === 'active' },
							{ 'text-danger': group.status === 'archive' },
						)}
					>
						{group.status}
					</span>{' '}
					&nbsp; | &nbsp; <FormattedMessage {...messages.campaigns} />: {campaignsCount}
				</span>
			</Col>,
			<Col md={6} xs={12} sm={6} className="top10 bottom10 buttons__campaign">
				<div className="nav-item nav-pay" onClick={() => this.setState({ topUpBalanceGroupModal: group.id })}>
					<a className="nav-link button-margin-left-5" title="Top Up Group Budget">
						<span className={colorClass}>${group.balance ? group.balance : '0'}</span>
					</a>
				</div>
				<LinkButton
					to={`/app/campaign/${group.id}/add`}
					size="xs"
					className="dots plus button-radius-5 float-right button-margin-left-10 background-transparent"
					title="Add campaign to group"
				>
					<i className="fas fa-plus-circle size-11" />
				</LinkButton>
				<Dropdown
					isOpen={this.state.dropdownOpen === group.id}
					toggle={() => this.toggle(group.id)}
					size="xs"
					title="Other actions"
				>
					<DropdownToggle className="dots background-transparent button-margin-left-10">
						<i className="fas fa-ellipsis-h" />
					</DropdownToggle>
					<DropdownMenu className="normal-transform">
						<DropdownItem>
							<FormattedMessage {...messages.shareGroup} />
						</DropdownItem>
						<DropdownItem>
							<FormattedMessage {...messages.exportCSV} />
						</DropdownItem>
						<DropdownItem>
							<FormattedMessage {...messages.statistics} />
						</DropdownItem>
						<DropdownItem
							onClick={() =>
								this.props.setStatus(group.id, {
									name: group.name,
									status: group.status === 'active' ? 'archive' : 'active',
								})
							}
						>
							{group.status === 'active' ? (
								<FormattedMessage {...messages.archiveGroup} />
							) : (
								<FormattedMessage {...messages.activeGroup} />
							)}
						</DropdownItem>
						<DropdownItem onClick={() => this.setState({ removeGroup: group.id })}>
							<FormattedMessage {...messages.removeGroup} />
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</Col>,
		];
	}

	renderCampaignsList(group, campaigns) {
		const { filterSelector } = this.props;
		const { searchWord, request } = filterSelector;
		return (
			<Row className="margin-0" key={group.id}>
				<Col>
					<AppCard
						arrow
						arrowForceOpen={searchWord || request || this.state.openCard === group.id}
						arrowHead={this.renderCampaingGroupHeader(group)}
						onToggle={() => this.setState({ openCard: group.id })}
					>
						{!campaigns ? null : <CampaignsList campaigns={campaigns} />}
					</AppCard>
				</Col>
			</Row>
		);
	}

	render() {
		const { filter, campaigns, userInfo } = this.props;
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
					groups
						.sort((a, b) => b.id - a.id)
						.map(group =>
							this.renderCampaignsList(group, campaigns.filter(s => s.campaign_group === group.id)),
						)
				)}
				<AddGroupModal
					isOpen={this.state.addGroupModal}
					title={messages.addGroup}
					onCreate={name => this.addGroup(name, false)}
					onCreateAndCreateCampaign={name => this.addGroup(name, true)}
					onCancel={() => this.setState({ addGroupModal: false })}
					error={this.props.addGroupError}
					errorValidate={this.state.errorValidate}
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
					sendUSD={usd => this.transferUSD(usd, this.state.topUpBalanceGroupModal)}
					sendUBEX={ubex => this.transferToken(ubex)}
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
}

CampaignGroupsList.propTypes = {
	intl: intlShape.isRequired,
	campaignGroups: PropTypes.array,
	activeCampaignGroup: PropTypes.object,
	campaigns: PropTypes.array,
	filter: PropTypes.array,
	filterSelector: PropTypes.array,
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
		addGroupError: campaingGroupSelectors.addEntryError(),
		userInfo: selectUserData(),
		selectAmount: selectBalance(),
	}),
	dispatch => ({
		dispatch,
		getCampaignsGroup: () => dispatch(groupCollectionActions.getCollection()),
		addCampaignsGroup: values => makePromiseAction(dispatch, groupCollectionActions.addEntry(values)),
		removeCampaignsGroup: values => makePromiseAction(dispatch, groupCollectionActions.removeEntry(values)),
		setStatus: (id, values) => dispatch(groupCollectionActions.updateEntry(id, values)),
		getCampaigns: dispatch(campaingCollectionActions.getCollection()),
		setFilter: values => dispatch(setFilterCampaigns(values)),
		patchCampaignGroup: (id, values) => makePromiseAction(dispatch, groupCollectionActions.patchEntry(id, values)),
		transferUSD: values => makePromiseAction(dispatch, transferMoneyGroup.addEntry(values)),
	}),
);

export default compose(withConnect)(injectIntl(CampaignGroupsList));
