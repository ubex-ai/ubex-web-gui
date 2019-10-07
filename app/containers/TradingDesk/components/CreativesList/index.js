/**
 *
 * CreativesList
 *
 */

import React from 'react';
import _ from 'lodash';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Alert, Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import getPaginatedItems from 'utils/pagination';
import { other, image, native, video, feed, template } from 'containers/TradingDesk/variables/creative-pics';
import RemoveModal from 'components/RemoveModal';
import PreviewModal from 'components/PreviewModal';
import AppCard from 'components/AppCard';
import LinkButton from 'components/LinkButton';
import LinkDropdown from 'components/LinkDropdown';
import Pagination from 'components/Pagination';
import CreativeTypeModal from '../CreativeTypeModal';
import CreativesTable from '../CreativesTable';
import messages from '../../messages';
import {
	filteringCreatives,
	selectAdSize,
	selectCreativeFilters,
	selectFavoriteCreatives,
	selectPaginationCounts,
} from '../../selectors';
import {
	bannersCollectionActions,
	creativeCollectionActions,
	creativeSharingCollectionActions,
	getAdSize,
	setFilterCreatives,
	setPaginationItemsCount,
	setFavoriteCreative,
} from '../../actions';
import ShareModal from '../ShareModal';
import ModerationModal from 'components/ModerationModal';

/* eslint-disable react/prefer-stateless-function */
class CreativeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
			creatives: [],
			removeCreative: null,
			openCreativeModal: false,
			createCreativeModal: false,
			removeBanner: null,
			previewModal: false,
			previewType: null,
			previewSize: null,
			previewAdditionalType: null,
			removeCreativeType: null,
			typeInventory: 'all',
			search: '',
			page: 1,
			items: props.paginationCounts.creativesCount,
			shareCreative: null,
			previewName: null,
			moderationText: null,
		};
		this.editField = null;
		this.clearSearch = this.clearSearch.bind(this);

		this.typeCreative = this.typeCreative.bind(this);
		this.searchEntries = this.searchEntries.bind(this);
	}

	componentDidMount() {
		if (!(this.props.adSize && this.props.adSize.length)) {
			this.props.getAdSize();
		}
		this.props.getCreatives();
		const { creatives } = this.props;
		const lastCreative = Math.max(...creatives.filter(c => c.data).map(creative => creative.id));
		this.setState({ [lastCreative]: true });
		if (this.props.match.params.add === 'add') {
			this.setState({
				openCreativeModal: true,
			});
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.paginationCounts.creativesCount !== this.props.paginationCounts.creativesCount) {
			this.setState({ items: this.props.paginationCounts.creativesCount });
		}
	}

	toggleCard(id) {
		if (this.editField !== id) {
			this.setState({ [id]: !this.state[id] });
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

	clearSearch() {
		this.setState({ search: '' });
		this.props.setFilter({ searchWord: '' });
	}

	removeCreative(id) {
		this.props.removeCreative(id).then(() => {
			this.setState({ removeCreative: null });
			createToast('success', 'Creative successfully removed!');
		});
	}

	searchEntries(e) {
		const typeQuery = e.target.value.toString().toLowerCase();
		this.setState({ search: typeQuery });
		this.props.setFilter({ searchWord: typeQuery });
	}

	typeCreative(e) {
		const typeQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
		this.props.setFilter({ typeFilter: typeQuery });
	}

	render() {
		const { creatives, setPaginationItemsCount } = this.props;
		// const sharedOwners = this.state.shareCreative ? _.find(creatives, ['id', this.state.shareCreative]) : [];

		return (
			<div>
				{this.renderHeader()}
				{!creatives.length ? (
					<Row className="margin-0">
						<Col>
							<Alert color="primary">
								<FormattedMessage {...messages.createFirstCreative} />
							</Alert>
						</Col>
					</Row>
				) : (
					<div>
						{getPaginatedItems(creatives, this.state.page, this.state.items).data.map(creative =>
							this.renderCreative(creative),
						)}
						{
							<Pagination
								data={getPaginatedItems(creatives, this.state.page, this.state.items)}
								changePage={page => this.setState({ page })}
								changeItemsCount={items => setPaginationItemsCount({ creativesCount: items })}
							/>
						}
					</div>
				)}
				<CreativeTypeModal
					isOpen={this.state.openCreativeModal}
					closeModal={() => this.setState({ openCreativeModal: false })}
					links={[
						{ link: '/app/creative/display/add', pic: image, name: 'Display' },
						{ link: '/app/creative/video/add', pic: video, name: 'Video' },
						{ link: '/app/creative/native/add', pic: native, name: 'Native', disable: false },
						{ link: '/app/creative/other/add', pic: other, name: 'Other', disable: false },
					]}
				/>
				<CreativeTypeModal
					isOpen={this.state.createCreativeModal}
					closeModal={() => this.setState({ createCreativeModal: false })}
					links={[
						{
							link: '/app/creative/create/feed',
							pic: feed,
							name: 'Feed',
							span: '(XML,CSV,JSON)',
						},
						{
							link: '/app/creative/create/template',
							pic: template,
							name: 'Сreate',
							span: '(from template)',
						},
					]}
				/>
				<RemoveModal
					isOpen={this.state.removeCreative || this.state.removeBanner}
					onSuccess={id => (this.state.removeCreative ? this.removeCreative(id) : this.removeBanner(id))}
					onCancel={() => this.setState({ removeCreative: null, removeBanner: null })}
					title={messages.remove}
					msg={messages.remove}
				/>
				<PreviewModal
					type={this.state.previewType}
					additionalType={this.state.previewAdditionalType}
					title={messages.preview}
					size={this.state.previewSize}
					msg={this.state.previewModal}
					bannerName={this.state.previewName}
					isOpen={this.state.previewModal}
					clickUrl={this.state.previewClickUrl}
					onCancel={() => this.setState({ previewModal: '', previewType: null, previewAdditionalType: null })}
				/>
				<ModerationModal
					isOpen={this.state.moderationText}
					title={messages.moderationTitle}
					onCancel={() => this.setState({ moderationText: null })}
				/>
			</div>
		);
	}

	removeShareUser(id) {
		this.props
			.removeSharingUser(id)
			.then(() => {
				createToast('success', 'Share user successfully removed!');
				this.props.getCreatives();
			})
			.catch(() => {
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
				this.props.getCreatives();
			})
			.catch(() => {
				createToast('error', 'Share user added error!');
			});
	}

	renderCreativeHead(creative) {
		if (!creative || !creative.data) {
			return null;
		}
		const iconClass = classNames({
			'creative-icons display icon-title fal fa-image': creative.data.type === 'image',
			'creative-icons video icon-title fab fa-html5': creative.data.type === 'html5',
			'creative-icons native icon-title fal fa-ad': creative.creative_type === 'native',
			'creative-icons video icon-title fal fa-video': creative.creative_type === 'video',
			'creative-icons other icon-title fal fa-code': creative.creative_type === 'other',
		});
		const bannerCount = creative && creative.banners ? creative.banners.length : '-';
		return {
			header: (
				<Col md={6} xs={12} style={{ height: '35px' }}>
					<h3 className="creative-title">
						<i className={iconClass} />{' '}
						<p className="title-dots">
							{creative && creative.data && creative.data.name.length ? creative.data.name : `Unnamed`}
						</p>
						{creative.status && (
							<i className="icon-status fas fa-exclamation icon-xs icon-rounded icon-warning" />
						)}
					</h3>
				</Col>
			),
			buttons: (
				<Col md={12} className="top10 bottom10 buttons__creative">
					{(creative.sharing && !creative.sharing.shared) ||
					(creative.sharing && creative.sharing.shared && creative.sharing.perm === 'write') ? (
						<LinkButton
							to={`/app/creative/${creative.creative_type}/${creative.id}/add`}
							size="xs"
							className="dots plus button-radius-5 float-right ml-1 background-transparent"
							title="Add banner"
						>
							<i className="fal fa-plus-circle" />
						</LinkButton>
					) : null}
					<LinkButton
						to={`/app/creative-banners/${creative.id}`}
						size="xs"
						className="dots button-radius-5 float-right ml-1 background-transparent"
						title="Banners list"
					>
						<i className="fal fa-search-plus" />
					</LinkButton>
					{creative.sharing && creative.sharing.shared && creative.sharing.perm === 'read' ? (
						<LinkButton
							to={`/app/creative/${creative.creative_type}/${creative.id}/`}
							size="xs"
							className="dots button-radius-5 float-right ml-1 background-transparent"
							title="See creative"
						>
							<i className="fal fa-eye" />
						</LinkButton>
					) : null}
					{(creative.sharing && !creative.sharing.shared) ||
					(creative.sharing && creative.sharing.shared && creative.sharing.perm === 'write') ? (
						<Dropdown
							isOpen={this.state.dropdownOpen === creative.id}
							toggle={() => this.toggle(creative.id)}
							size="xs"
							title="Other actions"
						>
							<DropdownToggle className="dots background-transparent ml-1">
								<i className="fal fa-ellipsis-h" />
							</DropdownToggle>
							<DropdownMenu className="normal-transform">
								{(creative.sharing && !creative.sharing.shared) ||
								(creative.sharing && creative.sharing.shared && creative.sharing.perm === 'write') ? (
									<LinkDropdown to={`/app/creative/${creative.creative_type}/${creative.id}/`}>
										<FormattedMessage {...messages.editCreative} />
									</LinkDropdown>
								) : null}
								{creative.sharing && !creative.sharing.shared ? (
									<DropdownItem onClick={() => this.setState({ shareCreative: creative.id })}>
										<FormattedMessage {...messages.shareCreative} />
									</DropdownItem>
								) : null}
								{creative.sharing && !creative.sharing.shared ? (
									<DropdownItem
										onClick={() =>
											!creative.campaigns.length
												? this.setState({
														removeCreative: creative.id,
														removeCreativeType: creative.creative_type,
												  })
												: createToast(
														'error',
														'Cannot delete if the creative is attached to the campaign!',
												  )
										}
									>
										<FormattedMessage {...messages.removeCreative} />
									</DropdownItem>
								) : null}
							</DropdownMenu>
						</Dropdown>
					) : null}
				</Col>
			),
			span: (
				<span className="span-campaign">
					{creative.sharing && creative.sharing.shared ? (
						<div className="badge badge-info" style={{ borderRadius: '5px', minWidth: '65px' }}>
							Share
						</div>
					) : null}
					<div className="badge badge-success mr-2" style={{ borderRadius: '5px' }}>
						CPM: ${creative.data.cpm}
					</div>
					<div
						style={{
							display: 'inline-block',
						}}
					>
						<span>ID: {` ${creative.code || creative.id}`}</span>
						<span> &nbsp; | &nbsp;</span>
						<FormattedMessage {...messages.type} />
						<span>: </span>
						<span style={{ textTransform: 'capitalize' }}>{creative.creative_type}</span>{' '}
						<span className="hidden-sm">
							<span>&nbsp; | &nbsp;</span>
							{creative.creative_type !== 'other' && creative.creative_type !== 'native' ? (
								<span>
									<FormattedMessage {...messages.banners} />
									<span>: {bannerCount}</span>
									<span> &nbsp; | &nbsp;</span>{' '}
								</span>
							) : null}
							<span>
								Created:{' '}
								{moment(creative && creative.data ? creative.data.created : null).format(
									'DD.MM.YY HH:mm',
								)}
							</span>{' '}
							<span>&nbsp; | &nbsp;</span>
							{creative && creative.campaigns && creative.campaigns.length ? (
								<Link to={`/app/campaigns/request/${creative.campaigns}`} className="campaigns-link">
									<FormattedMessage {...messages.addedTo} />{' '}
									<span>{creative && creative.campaigns ? creative.campaigns.length : 0} </span>
									<FormattedMessage {...messages.toCampaigns} />
								</Link>
							) : (
								<span>
									<FormattedMessage {...messages.addedTo} />{' '}
									{creative && creative.campaigns ? creative.campaigns.length : 0}{' '}
									<FormattedMessage {...messages.toCampaigns} />
								</span>
							)}
						</span>
					</div>
				</span>
			),
		};
	}

	changeURL(bannerId, values, type) {
		this.props.changeBannerURL(bannerId, values, type).then(() => {
			createToast('success', `${type} for Banner #${bannerId} successfully changed!`);
			this.props.getCreatives();
		});
	}

	removeBanner(bannerId) {
		this.props.removeBanner(bannerId).then(() => {
			createToast('success', `Banner #${bannerId} successfully removed!`);
			this.props.getCreatives();
			this.setState({ removeBanner: false });
		});
	}

	changeAdSize(bannerId, value) {
		const {
			match: {
				params: { id },
			},
		} = this.props;
		this.props.changeBannerURL(bannerId, { ad_size: parseInt(value, 10) }).then(() => {
			createToast('success', 'Banner Ad size successfully changed!');
			this.props.getCreatives();
		});
	}

	setFavoriteCreative(creativeId) {
		if (this.props.favoriteCreatives.includes(creativeId)) {
			this.props.setFavoriteCreative(this.props.favoriteCreatives.filter(creative => creative !== creativeId));
		} else {
			this.props.setFavoriteCreative([...this.props.favoriteCreatives, creativeId]);
		}
	}

	renderCreative(creative) {
		const { filter, creatives } = this.props;
		if (!creative || !creative.banners) {
			return null;
		}
		const { searchWord, request } = filter;
		const otherData = [];
		if (creative.creative_type === 'other') {
			otherData.push(creative.data);
		}

		const sharedOwners = this.state.shareCreative ? _.find(creatives, ['id', this.state.shareCreative]) : [];

		// console.log(creative);
		return (
			<Row className="margin-0" key={creative.id}>
				<Col>
					<AppCard
						arrow
						arrowForceOpen={searchWord || request || this.state[creative.id]}
						arrowHead={this.renderCreativeHead(creative)}
						onToggle={() => this.toggleCard(creative.id)}
						star={{
							selectedList:
								this.props.favoriteCreatives && this.props.favoriteCreatives.length
									? this.props.favoriteCreatives.includes(creative.id)
									: false,
							select: () => this.setFavoriteCreative(creative.id),
						}}
					>
						{!creative ? null : (
							<CreativesTable
								data={
									creative.creative_type === 'other'
										? otherData
										: creative.banners
										? creative.banners.filter(banner => banner.aws_s3_location)
										: []
								}
								inventoryType={creative.creative_type}
								adSize={this.props.adSize}
								adSizeChange={(id, value) => this.changeAdSize(id, value)}
								keyField="site"
								onClickGetCode={(linkOrFiles, size, clickUrl, bannerName) =>
									this.setState({
										previewModal: creative.creative_type === 'native' ? creative : linkOrFiles,
										previewType: creative.creative_type,
										previewSize: size,
										previewName: bannerName,
										previewClickUrl: clickUrl,
										previewAdditionalType:
											creative.data && creative.data.type ? creative.data.type : null,
									})
								}
								changeBannerURL={(id, values, type) => this.changeURL(id, values, type)}
								removeBanner={id => this.setState({ removeBanner: id })}
								toggleEntryStatus={this.props.toggleSlotStatus}
								creativeId={creative.id}
								permissions={
									(creative.sharing && !creative.sharing.shared) ||
									(creative.sharing && creative.sharing.shared && creative.sharing.perm === 'write')
								}
								moderationError={moderationText => this.setState({ moderationText })}
							/>
						)}
					</AppCard>
				</Col>
				{this.state.shareCreative === creative.id && (
					<ShareModal
						isOpen={this.state.shareCreative}
						sharedOwners={sharedOwners ? sharedOwners.shared_owners : []}
						title={messages.shareCreative}
						removeSharedOwner={id => this.removeShareUser(id)}
						onCancel={() => this.setState({ shareCreative: null })}
						addShareUser={values => this.addShareUser(this.state.shareCreative, values)}
						permissions={creative.sharing && !creative.sharing.shared}
					/>
				)}
			</Row>
		);
	}

	renderHeader() {
		const { filter } = this.props;
		const { typeFilter } = filter;
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row style={{justifyContent: 'space-between'}}>
						<Col md={5}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.listCreativesHeader} />
									</h1>
								</div>
							</div>
						</Col>
						<Col className="button" style={{ paddingRight: '4px', marginRight: '10px' }}>
							<LinkButton
								color="success"
								className="button-radius-5 button-margin-left-10"
								onClick={() => this.setState({ openCreativeModal: true })}
								title="Add creative"
							>
								<FormattedMessage {...messages.addCreative} />
							</LinkButton>
							<LinkButton
								color="success"
								className="button-radius-5 button-margin-left-10"
								onClick={() => this.setState({ createCreativeModal: true })}
								title="Create new creative"
							>
								<FormattedMessage {...messages.createCreative} />
							</LinkButton>
						</Col>

						<Col md={1} sm={5} xs={6} className="select">
							<Input type="select" className="radius-5" onChange={this.typeCreative}>
								<FormattedMessage {...messages.allTypes}>
									{txt => (
										<option value="all" selected={typeFilter === 'all' ? 'selected' : false}>
											{txt}
										</option>
									)}
								</FormattedMessage>
								<option value="display" selected={typeFilter === 'display' ? 'selected' : false}>
									Display
								</option>
								<option value="native" selected={typeFilter === 'native' ? 'selected' : false}>
									Native
								</option>
								<option value="video" selected={typeFilter === 'video' ? 'selected' : false}>
									Video
								</option>
								<option value="other" selected={typeFilter === 'other' ? 'selected' : false}>
									Other
								</option>
								<option value="feed" selected={typeFilter === 'feed' ? 'selected' : false}>
									Feed
								</option>
								<option value="template" selected={typeFilter === 'template' ? 'selected' : false}>
									Template
								</option>
							</Input>
						</Col>
						<Col md={2} className="creative_search">
							<div className="search">
								<Input
									type="search"
									placeholder={this.props.intl.formatMessage(messages.search)}
									aria-label="Search"
									className="form-control border-5"
									onChange={this.searchEntries}
									value={this.state.search}
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
}

CreativeList.propTypes = {
	intl: intlShape.isRequired,
};

const withConnect = connect(
	createStructuredSelector({
		creatives: filteringCreatives(),
		filter: selectCreativeFilters(),
		adSize: selectAdSize(),
		paginationCounts: selectPaginationCounts(),
		favoriteCreatives: selectFavoriteCreatives(),
	}),
	dispatch => ({
		dispatch,
		getCreatives: () => dispatch(creativeCollectionActions.getCollection()),
		removeCreative: id => makePromiseAction(dispatch, creativeCollectionActions.removeEntry(id)),
		patchCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.patchEntry(id, values)),
		setFilter: values => dispatch(setFilterCreatives(values)),
		changeBannerURL: (id, values) => makePromiseAction(dispatch, bannersCollectionActions.patchEntry(id, values)),
		removeBanner: id => makePromiseAction(dispatch, bannersCollectionActions.removeEntry(id)),
		setPaginationItemsCount: values => dispatch(setPaginationItemsCount(values)),
		addSharingUser: values => makePromiseAction(dispatch, creativeSharingCollectionActions.addEntry(values)),
		removeSharingUser: values => makePromiseAction(dispatch, creativeSharingCollectionActions.removeEntry(values)),
		getAdSize: () => dispatch(getAdSize()),
		setFavoriteCreative: values => dispatch(setFavoriteCreative(values)),
	}),
);

export default compose(withConnect)(injectIntl(CreativeList));
