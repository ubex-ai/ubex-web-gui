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
import CreativeTypeModal from '../CreativeTypeModal';
import CreativesTable from '../CreativesTable';
import messages from '../../messages';
import { creativesSelectors, filteringCreatives, selectCreativeFilters } from '../../selectors';
import { creativeCollectionActions, setFilterCreatives } from '../../actions';
import validateStringAndNumber from 'utils/validateStringAndNumber';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';

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
			removeCreativeType: null,
			typeInventory: 'all',
			search: '',
		};
		this.editField = null;
		this.clearSearch = this.clearSearch.bind(this);
		this.typeCreative = this.typeCreative.bind(this);
		this.searchEntries = this.searchEntries.bind(this);
	}

	componentDidMount() {
		const { creatives } = this.props;
		this.setState({ openCard: Math.max(...creatives.filter(c => c.data).map(creative => creative.id)) });
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { creatives } = this.props;
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
		const { creatives } = this.props;
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
					creatives.map(creative => this.renderCreative(creative))
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
					title={messages.preview}
					msg={this.state.previewModal}
					isOpen={this.state.previewModal}
					onCancel={() => this.setState({ previewModal: '' })}
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
			'icon-title fas fa-image': creative.creative_type === 'display',
			'icon-title fab fa-html5': creative.creative_type === 'native',
		});
		return [
			<Col md={6} xs={12}>
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
					ID: {` ${creative.code || creative.id}`} &nbsp; | &nbsp; <FormattedMessage {...messages.banners} />:
					5 &nbsp; | &nbsp; <FormattedMessage {...messages.type} />:{' '}
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
			<Col md={6} xs={12} className="top10 bottom10 buttons__creative">
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

	renderCreative(creative) {
		const { filter } = this.props;
		if (!creative || !creative.banners) {
			return null;
		}
		const { searchWord, request } = filter;
		console.log(creative)
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
								data={creative.banners ? creative.banners : []}
								inventoryType={creative.creative_type}
								keyField="site"
								onClickGetCode={link => this.setState({ previewModal: link })}
								onClickRemoveEntry={id => this.setState({ removeBanner: id })}
								toggleEntryStatus={this.props.toggleSlotStatus}
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
	}),
	dispatch => ({
		dispatch,
		getCreatives: dispatch(creativeCollectionActions.getCollection()),
		removeCreative: id => makePromiseAction(dispatch, creativeCollectionActions.removeEntry(id)),
		patchCreative: (id, values) => makePromiseAction(dispatch, creativeCollectionActions.patchEntry(id, values)),
		setFilter: values => dispatch(setFilterCreatives(values)),
	}),
);

export default compose(withConnect)(injectIntl(CreativeList));
