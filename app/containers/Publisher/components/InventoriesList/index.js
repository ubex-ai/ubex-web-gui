/**
 *
 * SlotsListDesktop
 *
 */

import React from 'react';
import Link from 'components/Link';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col, Alert, Input, Button, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from 'reactstrap';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import AppCard from 'components/AppCard';
import LinkButton from 'components/LinkButton';
import RemoveModal from 'components/RemoveModal';
import CodeModal from 'components/CodeModal';
import { INVENTORY_STATUSES } from 'containers/Publisher/constants';
import { inventoriesSelectors, selectSlotsTableFormat } from 'containers/Publisher/selectors';
import { inventoryCollectionActions, slotCollectionActions, toggleSlotStatus } from 'containers/Publisher/actions';
import InventoryShape from 'containers/Publisher/shapes/Inventory';
import SlotsTable from 'containers/Publisher/components/SlotsTable';
import messages from './messages';
import createToast from 'utils/toastHelper';
import { makePromiseAction } from 'utils/CollectionHelper/actions';

const withConnect = connect(
	createStructuredSelector({
		inventories: inventoriesSelectors.collectionList(),
		slots: selectSlotsTableFormat(),
	}),
	dispatch => ({
		dispatch,
		getInventories: () => makePromiseAction(dispatch, inventoryCollectionActions.getCollection()),
		removeInventory: id => makePromiseAction(dispatch, inventoryCollectionActions.removeEntry(id)),
		getSlots: () => dispatch(slotCollectionActions.getCollection()),
		removeSlot: id => makePromiseAction(dispatch, slotCollectionActions.removeEntry(id)),
		patchSlot: (id, values) => makePromiseAction(dispatch, slotCollectionActions.patchEntry(id, values)),
		toggleSlotStatus: (id, status) => dispatch(toggleSlotStatus(id, status)),
	}),
);

/* eslint-disable react/prefer-stateless-function */
class InventoriesList extends React.Component {
	propTypes = {
		slots: PropTypes.array.isRequired,
		inventories: PropTypes.arrayOf(PropTypes.shape(InventoryShape)).isRequired,
		getInventories: PropTypes.func.isRequired,
		getSlots: PropTypes.func.isRequired,
		removeSlot: PropTypes.func.isRequired,
		removeInventory: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		const { inventories, slots } = props;
		this.state = {
			inventories,
			slots,
			deletedInventory: 0,
			deletedSlot: 0,
			dropdownOpen: false,
		};
		this.searchInventory = this.searchInventory.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
	}

	componentDidMount() {
		this.props.getInventories().then(inventories => {
			const lastInventory = Math.max(...inventories.map(inv => inv.id));
			if (!this.state[lastInventory]) {
				this.setState({ [lastInventory]: true });
			}
		});
		this.props.getSlots();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.inventories !== this.props.inventories) {
			this.setState({
				inventories: this.props.inventories,
			});
		}
		if (prevProps.slots !== this.props.slots) {
			this.setState({
				slots: this.props.slots,
			});
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

	searchInventory(e) {
		const { inventories } = this.props;
		const searchQuery = e.target.value
			.toString()
			.trim()
			.toLowerCase();
		const findIn = field =>
			typeof field === 'string'
				? field
						.trim()
						.toLowerCase()
						.indexOf(searchQuery) !== -1
				: null;
		if (searchQuery) {
			const inventoriesTemp = inventories.filter(item => findIn(item.name));
			this.setState({ inventories: inventoriesTemp });
		} else {
			this.setState({ inventories });
		}
	}

	removeEntry() {
		const { deletedInventory, deletedSlot } = this.state;
		if (deletedInventory > 0) {
			this.props.removeInventory(deletedInventory).then(() => {
				this.setState({ deletedInventory: 0 });
				createToast('success', 'Inventory successfully removed!');
			});
		}
		if (deletedSlot > 0) {
			this.props.removeSlot(deletedSlot).then(() => {
				createToast('success', 'Slot successfully removed!');
				this.setState({ deletedSlot: 0 });
			});
		}
	}

	codeModal() {
		if (!this.state.showCode) {
			return null;
		}
		const slot = this.props.slots.find(s => s.id === this.state.showCode);
		if (!slot.embedding_code) {
			return null;
		}

		return (
			<CodeModal
				title={messages.code}
				msg={slot.embedding_code}
				isOpen={this.state.showCode}
				onCancel={() => this.setState({ showCode: null })}
			/>
		);
	}

	render() {
		const { inventories, slots, deletedInventory, deletedSlot, showCode } = this.state;
		const {
			match: {
				params: { type },
			},
		} = this.props;
		const sdk = ['android', 'ios'];
		const invRender = inventories.filter(i => (type === 'web' ? i.type === type : sdk.includes(i.type)));

		return (
			<div>
				{this.renderHeader()}
				{!invRender.length ? (
					<Row className="margin-0">
						<Col>
							<Alert color="primary">
								<FormattedMessage {...messages.createFirstInventory} />
							</Alert>
						</Col>
					</Row>
				) : (
					invRender.map(inventory =>
						this.renderInventory(inventory, slots.filter(s => s.inventory === inventory.id)),
					)
				)}
				<RemoveModal
					title={messages.confirm}
					msg={messages.remove}
					isOpen={deletedInventory || deletedSlot}
					onCancel={() => this.setState({ deletedInventory: 0, deletedSlot: 0 })}
					onSuccess={this.removeEntry}
				/>
				{this.codeModal()}
			</div>
		);
	}

	toggleCard(id) {
		if (this.editField !== id) {
			this.setState({ [id]: !this.state[id] });
		}
	}

	patchSlot(id, values) {
		this.props
			.patchSlot(id, values)
			.then(() => {
				createToast('success', 'Slot status successfully changed!');
				this.props.getSlots();
			})
			.catch(() => {
				createToast('error', 'Error changing slot status!');
			});
	}

	renderInventoryHeader(inventory) {
		const iconClass = classNames({
			'fas fa-desktop': inventory.type === 'web',
			'fab fa-apple': inventory.type === 'ios',
			'fab fa-android': inventory.type === 'android',
		});
		return {
			header: (
				<Col md={6} xs={6} sm={6}>
					<h3 className="invetory-title">
						<i className={iconClass} />{' '}
						{inventory.name && inventory.name.length ? inventory.name : `Unnamed`}
					</h3>
					<span>ID: {` ${inventory.code || inventory.id}`}</span>
				</Col>
			),
			buttons: (
				<Col md={12} sm={12} xs={12} className="top10 bottom10 buttons__inventory">
					<Dropdown
						isOpen={this.state.dropdownOpen === inventory.id}
						toggle={() => this.toggle(inventory.id)}
						size="xs"
						title="Other actions"
						key={inventory.id}
						className="float-right"
					>
						<DropdownToggle className="dots background-transparent button-margin-left-10">
							<i className="fas fa-ellipsis-h" />
						</DropdownToggle>
						<DropdownMenu className="normal-transform">
							<DropdownItem>
								<Link to={`/app/inventory/${inventory.type}/edit/${inventory.id}`}>
									<FormattedMessage {...messages.editInventory} />
								</Link>
							</DropdownItem>
							<DropdownItem onClick={() => this.setState({ deletedInventory: inventory.id })}>
								<FormattedMessage {...messages.removeInventory} />
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<LinkButton
						className="dots plus button-radius-5 float-right button-margin-left-10 background-transparent"
						title="Add slot to inventory"
						size="xs"
						to={`/app/inventory/${inventory.type}/${inventory.id}/slot/add`}
					>
						<i className="fas fa-plus-circle size-11" />
					</LinkButton>
				</Col>
			),
		};
	}

	renderInventory(inventory, slots) {
		const {
			match: {
				params: { type },
			},
		} = this.props;
		return (
			<Row className="margin-0" key={inventory.id}>
				<Col>
					<AppCard
						arrow
						arrowForceOpen={this.state[inventory.id]}
						arrowHead={this.renderInventoryHeader(inventory)}
						onToggle={() => this.toggleCard(inventory.id)}
					>
						{inventory.status === INVENTORY_STATUSES.moderation ? (
							<Alert color="warning">
								<FormattedMessage {...messages.onModeration} />
							</Alert>
						) : null}
						{slots ? (
							<SlotsTable
								data={slots}
								inventoryType={type}
								keyField="site"
								onClickGetCode={id => this.setState({ showCode: id })}
								onClickRemoveEntry={id => this.setState({ deletedSlot: id })}
								patchSlot={(id, values) => this.patchSlot(id, values)}
								toggleEntryStatus={this.props.toggleSlotStatus}
							/>
						) : (
							<Alert color="primary">
								<FormattedMessage id="app.common.noEntries" defaultMessage="No entries" />
							</Alert>
						)}
					</AppCard>
				</Col>
			</Row>
		);
	}

	renderHeader() {
		const {
			match: {
				params: { type },
			},
		} = this.props;
		return (
			<Row className="margin-0">
				<Col md={12} className="title-with-select__other">
					<Row>
						<Col md={6} lg={6}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage
											{...messages[type === 'web' ? 'webInventoriesList' : 'sdkInventoriesList']}
										/>
									</h1>
								</div>
							</div>
						</Col>
						<Col md={4} xs={12} lg={4} className="padding-0">
							<LinkButton
								to={`/app/inventory/${type}/add`}
								color="success"
								className="add-inventory button-radius-5 button-margin-left-10"
								style={{ float: 'right' }}
							>
								<FormattedMessage
									{...messages[type === 'web' ? 'addWebInventory' : 'addSdkInventory']}
								/>
							</LinkButton>
						</Col>
						<Col md={2} xs={12}>
							<Input
								type="search"
								placeholder="Search"
								aria-label="Search"
								className="form-control border-5"
								onChange={this.searchInventory}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
		);
	}
}

export default compose(withConnect)(InventoriesList);
