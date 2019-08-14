/**
 *
 * CreativesList
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppCard from 'components/AppCard';
import LinkButton from 'components/LinkButton';
import LinkDropdown from 'components/LinkDropdown';
import classNames from 'classnames';
import { other, image, native, video, feed, template } from 'containers/TradingDesk/variables/creative-pics';
import RemoveModal from 'components/RemoveModal';
import PreviewModal from 'components/PreviewModal';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import InlineEditField from 'components/InlineEditField';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';
import moment from 'moment';
import getPaginatedItems from 'utils/pagination';
import Pagination from 'components/Pagination';
import CreativeTypeModal from '../CreativeTypeModal';
import CreativesTable from '../CreativesTable';
import messages from '../../messages';
import {
	creativesSelectors,
	filteringCreatives,
	selectAdSize,
	selectCreativeFilters,
	selectPaginationCounts,
} from '../../selectors';
import {
	bannersCollectionActions,
	creativeCollectionActions,
	setFilterCreatives,
	setPaginationItemsCount,
} from '../../actions';
import CreativeFileTable from '../CreativeForm';

/* eslint-disable react/prefer-stateless-function */
class CreativeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dropdownOpen: false,
			creatives: [],
			removeCreative: null,
			openCard: null,
			openCreativeModal: false,
			createCreativeModal: false,
			removeBanner: null,
			previewModal: false,
			previewType: null,
			previewAdditionalType: null,
			removeCreativeType: null,
			typeInventory: 'all',
			search: '',
			page: 1,
			items: props.paginationCounts.creativesCount,
		};
		this.editField = null;
		this.clearSearch = this.clearSearch.bind(this);
		this.typeCreative = this.typeCreative.bind(this);
		this.searchEntries = this.searchEntries.bind(this);
	}

	componentDidMount() {
		this.props.getCreatives();
		const { creatives } = this.props;
		this.setState({ openCard: Math.max(...creatives.filter(c => c.data).map(creative => creative.id)) });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { creatives } = this.props;

		if (prevProps.paginationCounts.creativesCount !== this.props.paginationCounts.creativesCount) {
			this.setState({ items: this.props.paginationCounts.creativesCount });
		}

		if (!this.state.openCard && creatives) {
			this.setState({ openCard: Math.max(...creatives.filter(c => c.data).map(creative => creative.id)) });
		}
	}

	toggleCard(creativeId) {
		if (this.editField !== creativeId) {
			if (creativeId === this.state.cardIsOpen) {
				this.setState({ cardIsOpen: null });
			} else {
				this.setState({ cardIsOpen: creativeId });
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
		const typeQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
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
							link: '/app/creative/feed/create',
							pic: feed,
							name: 'Feed',
							span: '(XML,CSV,JSON)',
						},
						{
							link: '/app/creative/template/create',
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
					adSize={this.props.adSize}
					type={this.state.previewType}
					additionalType={this.state.previewAdditionalType}
					title={messages.preview}
					msg={this.state.previewModal}
					isOpen={this.state.previewModal}
					onCancel={() => this.setState({ previewModal: '', previewType: null, previewAdditionalType: null })}
				/>
			</div>
		);
	}

	renderCreativeHead(creative) {
		const { patchCreative } = this.props;
		if (!creative || !creative.data) {
			return null;
		}
		const iconClass = classNames({
			'creative-icons display icon-title fas fa-image': creative.data.type === 'image',
			'creative-icons video icon-title fab fa-html5': creative.data.type === 'html5',
			'creative-icons native icon-title fas fa-ad': creative.creative_type === 'native',
			'creative-icons video icon-title fas fa-video': creative.creative_type === 'video',
			'creative-icons other icon-title fas fa-code': creative.creative_type === 'other',
		});
		const bannerCount = creative && creative.banners ? creative.banners.length : '-';
		return [
			<Col md={9} xs={12}>
				<h3 className="creative-title">
					<i className={iconClass} />{' '}
					<InlineEditField
						inline
						size="sm"
						type="text"
						value={creative && creative.data && creative.data.name.length ? creative.data.name : `Unnamed`}
						forceHide={this.state.forceHide}
						validation={val => validateStringAndNumber(val)}
						onClick={() => (this.editField = creative.id)}
						onSave={val => {
							patchCreative(creative.id, { data: { name: val } }).then(() => {
								createToast('success', 'Creative name successfully updated!');
							});
							this.editField = null;
						}}
						onCancel={() => {
							this.editField = null;
						}}
					/>
					{creative.status && (
						<i className="icon-status fas fa-exclamation icon-xs icon-rounded icon-warning" />
					)}
				</h3>
				<span>
					ID: {` ${creative.code || creative.id}`} &nbsp; | &nbsp; Created:{' '}
					{moment(creative && creative.data ? creative.data.created : null).format('DD-MM-YYYY HH:mm')} &nbsp;
					| &nbsp; <FormattedMessage {...messages.banners} />: {bannerCount} &nbsp; | &nbsp;{' '}
					<FormattedMessage {...messages.type} />:{' '}
					<span style={{ textTransform: 'capitalize' }}>{creative.creative_type}</span> &nbsp; | &nbsp; CPM: $
					{creative.data.cpm} &nbsp; | &nbsp;{' '}
					{creative && creative.campaigns && creative.campaigns.length ? (
						<Link to={`/app/campaigns/request/${creative.campaigns}`}>
							<FormattedMessage {...messages.addedTo} />{' '}
							{creative && creative.campaigns ? creative.campaigns.length : 0}{' '}
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
			</Col>,
			<Col md={3} xs={12} className="top10 bottom10 buttons__creative">
				<LinkButton
					to={`/app/creative/${creative.creative_type}/${creative.id}/add`}
					size="xs"
					className="dots plus button-radius-5 float-right button-margin-left-10 background-transparent"
					title="Add banner"
				>
					<i className="fas fa-plus-circle size-11" />
				</LinkButton>
				<LinkButton
					to={`/app/creative-banners/${creative.id}`}
					size="xs"
					className="list button-radius-5 float-right button-margin-left-10 background-transparent"
					title="Banners list"
				>
					<i className="fas fa-search" />
				</LinkButton>
				<Dropdown
					isOpen={this.state.dropdownOpen === creative.id}
					toggle={() => this.toggle(creative.id)}
					size="xs"
					title="Other actions"
				>
					<DropdownToggle className="dots background-transparent button-margin-left-10">
						<i className="fas fa-ellipsis-h" />
					</DropdownToggle>
					<DropdownMenu className="normal-transform">
						<LinkDropdown to={`/app/creative/${creative.creative_type}/${creative.id}/`}>
							<FormattedMessage {...messages.editCreative} />
						</LinkDropdown>
						<DropdownItem>
							<FormattedMessage {...messages.shareCreative} />
						</DropdownItem>
						<DropdownItem
							onClick={() =>
								this.setState({
									removeCreative: creative.id,
									removeCreativeType: creative.creative_type,
								})
							}
						>
							<FormattedMessage {...messages.removeCreative} />
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</Col>,
		];
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

	renderCreative(creative) {
		const { filter } = this.props;
		if (!creative || !creative.banners) {
			return null;
		}
		const { searchWord, request } = filter;
		const otherData = [];
		if (creative.creative_type === 'other') {
			otherData.push(creative.data);
		}
		return (
			<Row className="margin-0" key={creative.id}>
				<Col>
					<AppCard
						arrow
						arrowForceOpen={searchWord || request || this.state.openCard === creative.id}
						arrowHead={this.renderCreativeHead(creative)}
						onToggle={() => this.setState({ openCard: creative.id })}
					>
						{!creative ? null : (
							<CreativesTable
								data={
									creative.creative_type === 'other'
										? otherData
										: creative.banners
											? creative.banners
											: []
								}
								inventoryType={creative.creative_type}
								adSize={this.props.adSize}
								adSizeChange={(id, value) => this.changeAdSize(id, value)}
								keyField="site"
								onClickGetCode={link =>
									this.setState({
										previewModal: creative.creative_type === 'native' ? creative : link,
										previewType: creative.creative_type,
										previewAdditionalType:
											creative.data && creative.data.type ? creative.data.type : null,
									})
								}
								changeBannerURL={(id, values, type) => this.changeURL(id, values, type)}
								removeBanner={id => this.setState({ removeBanner: id })}
								toggleEntryStatus={this.props.toggleSlotStatus}
								creativeId={creative.id}
							/>
						)}
					</AppCard>
				</Col>
			</Row>
		);
	}

	renderHeader() {
		const { filter } = this.props;
		const { typeFilter } = filter;
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={7}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage {...messages.listCreativesHeader} />
									</h1>
								</div>
							</div>
						</Col>
						<Col md={2} sm={5} xs={6} className="button">
							<LinkButton
								color="success"
								className="button-radius-5 button-margin-left-10"
								onClick={() => this.setState({ openCreativeModal: true })}
								title="Add creative"
							>
								<FormattedMessage {...messages.addCreative} />
							</LinkButton>
							<LinkButton
								onClick={() => this.setState({ createCreativeModal: true })}
								color="primary"
								className="button-radius-5 button-margin-left-10"
								title="Create creative"
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
						<Col md={2}>
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
	}),
);

export default compose(withConnect)(injectIntl(CreativeList));
