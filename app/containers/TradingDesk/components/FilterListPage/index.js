/**
 *
 * FilterListPage
 *
 */

import React from 'react';
import { Alert, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import createToast from 'utils/toastHelper';
import FilterListFields from 'components/FilterListFields/Loadable';
import moment from 'moment';
import LinkButton from 'components/LinkButton';
import RemoveModal from 'components/RemoveModal';
import ShareModal from 'containers/TradingDesk/components/ShareModal';
import _ from 'lodash';
import messages from '../../messages';
import { filtersCollectionActions, filterSharingCollectionActions, setFavoriteFilter } from '../../actions';
import {filteringFilters, filtersSelectors, selectFavoriteFilters} from '../../selectors';
import AddFilterModal from '../AddFilterModal';
import { makePromiseAction } from '../../../../utils/CollectionHelper/actions';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class BlackListPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
			addFilter: false,
			editFilter: false,
			filterName: '',
		};
	}

	componentDidMount() {
		this.props.getFilters();
	}

	toggleCard(id) {
		if (!this.state[id]) {
			this.props.getFilter(id);
		}
		this.setState({ [id]: !this.state[id] });
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

	renderHeader() {
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={7}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.filterList} />
									</h1>
								</div>
							</div>
						</Col>
						<Col md={5} sm={5} xs={6} className="button margin-0">
							<LinkButton
								color="success"
								className="button-radius-5 button-margin-left-10"
								onClick={() => this.setState({ addFilter: true })}
								title="Add creative"
							>
								<FormattedMessage {...messages.addBlackList} />
							</LinkButton>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}

	renderBlackListHead(blackList) {
		return {
			header: (
				<Col md={6} xs={12}>
					<h3 className="creative-title">
						<p className="title-dots">
							{blackList && blackList.name && blackList.name.length ? blackList.name : `Unnamed`}
						</p>
					</h3>
				</Col>
			),
			buttons: (
				<Col md={12} className="top10 bottom10 buttons__creative">
					{(blackList.sharing && !blackList.sharing.shared) ||
					(blackList.sharing && blackList.sharing.shared && blackList.sharing.perm === 'write') ? (
						<Dropdown
							isOpen={this.state.dropdownOpen === blackList.id}
							toggle={() => this.toggle(blackList.id)}
							size="xs"
							title="Other actions"
						>
							<DropdownToggle className="dots background-transparent ml-1">
								<i className="fal fa-ellipsis-h" />
							</DropdownToggle>

							<DropdownMenu className="normal-transform">
								<DropdownItem
									onClick={() =>
										this.setState({ editFilter: blackList.id, filterName: blackList.name })
									}
								>
									<FormattedMessage {...messages.editBlackList} />
								</DropdownItem>
								<DropdownItem onClick={() => this.setState({ shareFilter: blackList.id })}>
									<FormattedMessage {...messages.shareBlackList} />
								</DropdownItem>
								<DropdownItem
									onClick={() =>
										this.setState({
											removeFilter: blackList.id,
										})
									}
								>
									<FormattedMessage {...messages.removeBlackList} />
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					) : null}
				</Col>
			),
			span: (
				<span className="span-campaign">
					{blackList.sharing && blackList.sharing.shared ? (
						<div className="badge badge-info" style={{ borderRadius: '5px', minWidth: '65px' }}>
							Share
						</div>
					) : null}
					<div
						style={{
							display: 'inline-block',
						}}
					>
						<span>ID: {` ${blackList.id}`}</span>
						<span> &nbsp; | &nbsp;</span>
						<span>Date</span>
						<span>: </span>
						<span>{moment(blackList.created, 'DD-MM-YYYY').format('DD.MM.YY')}</span>
						<span> &nbsp; | &nbsp;</span>
						{blackList && blackList.campaigns && blackList.campaigns.length ? (
							<Link to={`/app/campaigns/request/${blackList.campaigns}`} className="campaigns-link">
								<FormattedMessage {...messages.addedTo} />{' '}
								<span>{blackList && blackList.campaigns ? blackList.campaigns.length : 0} </span>
								<FormattedMessage {...messages.toCampaigns} />
							</Link>
						) : (
							<span>
								<FormattedMessage {...messages.addedTo} />{' '}
								{blackList && blackList.campaigns ? blackList.campaigns.length : 0}{' '}
								<FormattedMessage {...messages.toCampaigns} />
							</span>
						)}
					</div>
				</span>
			),
		};
	}

	getFields(filter) {
		if (
			filter &&
			Object.prototype.hasOwnProperty.call(filter, 'domains') &&
			Object.prototype.hasOwnProperty.call(filter, 'urls') &&
			Object.prototype.hasOwnProperty.call(filter, 'publishers') &&
			Object.prototype.hasOwnProperty.call(filter, 'sites_id') &&
			Object.prototype.hasOwnProperty.call(filter, 'apps') &&
			Object.prototype.hasOwnProperty.call(filter, 'devices') &&
			Object.prototype.hasOwnProperty.call(filter, 'bundles') &&
			Object.prototype.hasOwnProperty.call(filter, 'ips')
		) {
			return {
				domains: filter.domains,
				urls: filter.urls,
				publishers: filter.publishers,
				sites_id: filter.sites_id,
				apps: filter.apps,
				devices: filter.devices,
				bundles: filter.bundles,
				ips: filter.ips,
			};
		}
		return {};
	}

	setFavoriteFitler(filterId) {
		if (this.props.favoriteFilters.includes(filterId)) {
			this.props.setFavoriteFilter(this.props.favoriteFilters.filter(filter => filter !== filterId));
		} else {
			this.props.setFavoriteFilter([...this.props.favoriteFilters, filterId]);
		}
	}

	renderBlackList(blackList) {
		const sharedOwners = this.state.shareFilter ? _.find(this.props.blackList, ['id', this.state.shareFilter]) : [];
		const fields = this.getFields(blackList);
		return (
			<Row className="margin-0" key={blackList.id}>
				<Col>
					<AppCard
						key={blackList.id}
						arrow
						arrowForceOpen={this.state[blackList.id]}
						arrowHead={this.renderBlackListHead(blackList)}
						onToggle={() => this.toggleCard(blackList.id)}
						star={{
							selectedList:
								this.props.favoriteFilters && this.props.favoriteFilters.length
									? this.props.favoriteFilters.includes(blackList.id)
									: false,
							select: () => this.setFavoriteFitler(blackList.id),
						}}
					>
						{fields && Object.keys(fields).length ? (
							<FilterListFields
								id={blackList.id}
								fields={fields}
								patchFilter={(id, fields) => this.editFilter(id, fields)}
							/>
						) : null}
					</AppCard>
				</Col>
				{this.state.shareFilter === blackList.id && (
					<ShareModal
						isOpen={this.state.shareFilter}
						title={messages.shareFilter}
						sharedOwners={sharedOwners ? sharedOwners.shared_owners : []}
						removeSharedOwner={id => this.removeShareUser(id)}
						onCancel={() => this.setState({ shareFilter: null })}
						addShareUser={values => this.addShareUser(this.state.shareFilter, values)}
						permissions={
							(blackList.sharing && !blackList.sharing.shared) ||
							(blackList.sharing && blackList.sharing.shared && blackList.sharing.perm === 'write')
						}
					/>
				)}
			</Row>
		);
	}

	render() {
		const { blackList } = this.props;
		const sharedOwners = this.state.shareFilter ? _.find(blackList, ['id', this.state.shareFilter]) : [];
		return (
			<div>
				{this.renderHeader()}
				{blackList && blackList.length ? (
					<div>{blackList.map(filter => this.renderBlackList(filter))}</div>
				) : (
					<Row className="margin-0">
						<Col>
							<Alert color="primary">
								<FormattedMessage {...messages.createBlackList} />
							</Alert>
						</Col>
					</Row>
				)}
				<AddFilterModal
					isOpen={this.state.addFilter || this.state.editFilter}
					editFilter={this.state.editFilter}
					title={this.state.editFilter ? messages.editFilter : messages.addFilter}
					filterName={this.state.filterName}
					onCreate={name => this.addFilter(name)}
					loading={this.props.blackListAddLoading}
					onCancel={() =>
						this.setState({
							addFilter: false,
							editFilter: false,
							filterName: false,
						})
					}
					onPatch={name => this.editFilter(this.state.editFilter, { name })}
				/>
				<RemoveModal
					isOpen={this.state.removeFilter}
					loading={!!this.state.removeFilter}
					onSuccess={id => this.removeFilter(id)}
					onCancel={() => this.setState({ removeFilter: null })}
					title={messages.removeBlackList}
					msg={messages.removeBlackList}
				/>
			</div>
		);
	}

	addFilter(name) {
		this.props
			.addFilter({ name })
			.then(() => {
				this.setState({
					addFilter: false,
					editFilter: false,
					filterName: false,
				});
				createToast('success', 'Filter successfully added!');
			})
			.catch(() => {
				createToast('error', 'Filter add error!');
			});
	}

	editFilter(id, values) {
		this.props
			.patchFilter(id, values)
			.then(() => {
				this.setState({
					addFilter: false,
					editFilter: false,
					filterName: false,
				});
				createToast('success', 'Filter successfully updated!');
			})
			.catch(() => {
				createToast('error', 'Filter save error!');
			});
	}

	removeFilter(id) {
		this.props
			.removeFilter(id)
			.then(() => {
				this.setState({
					addFilter: false,
					editFilter: false,
					filterName: false,
					removeFilter: false,
				});
				createToast('success', 'Filter successfully removed!');
			})
			.catch(() => {
				createToast('error', 'Filter delete error!');
			});
	}

	removeShareUser(id) {
		this.props
			.removeSharingUser(id)
			.then(() => {
				createToast('success', 'Share user successfully removed!');
				this.props.getFilters();
			})
			.catch(errors => {
				console.log(errors);
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
				this.props.getFilters();
			})
			.catch(e => {
				console.log(e);
				createToast('error', 'Share user added error!');
			});
	}
}

BlackListPage.propTypes = {};

const withConnect = connect(
	createStructuredSelector({
		blackList: filteringFilters(),
		blackListAddLoading: filtersSelectors.addEntryLoading(),
		favoriteFilters: selectFavoriteFilters(),
	}),
	dispatch => ({
		dispatch,
		getFilters: () => dispatch(filtersCollectionActions.getCollection()),
		getFilter: id => dispatch(filtersCollectionActions.getEntry(id)),
		addFilter: values => makePromiseAction(dispatch, filtersCollectionActions.addEntry(values)),
		patchFilter: (id, values) => makePromiseAction(dispatch, filtersCollectionActions.patchEntry(id, values)),
		removeFilter: id => makePromiseAction(dispatch, filtersCollectionActions.removeEntry(id)),
		addSharingUser: values => makePromiseAction(dispatch, filterSharingCollectionActions.addEntry(values)),
		removeSharingUser: values => makePromiseAction(dispatch, filterSharingCollectionActions.removeEntry(values)),
		setFavoriteFilter: values => dispatch(setFavoriteFilter(values)),
	}),
);
export default compose(withConnect)(injectIntl(BlackListPage));
