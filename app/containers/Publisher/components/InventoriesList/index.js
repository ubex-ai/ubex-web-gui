/**
 *
 * SlotsListDesktop
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col, Alert, Input, Button } from 'reactstrap';
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

const withConnect = connect(
	createStructuredSelector({
		inventories: inventoriesSelectors.collectionList(),
		slots: selectSlotsTableFormat(),
	}),
	dispatch => ({
		dispatch,
		getInventories: () => dispatch(inventoryCollectionActions.getCollection()),
		removeInventory: id => dispatch(inventoryCollectionActions.removeEntry(id)),
		getSlots: () => dispatch(slotCollectionActions.getCollection()),
		removeSlot: id => dispatch(slotCollectionActions.removeEntry(id)),
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
		};
		this.searchInventory = this.searchInventory.bind(this);
		this.removeEntry = this.removeEntry.bind(this);
	}

	componentDidMount() {
		this.props.getInventories();
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
			this.props.removeInventory(deletedInventory);
			this.setState({ deletedInventory: 0 });
		}
		if (deletedSlot > 0) {
			this.props.removeSlot(deletedSlot);
			this.setState({ deletedSlot: 0 });
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
		return (
			<div>
				{this.renderHeader()}
				{inventories
					.filter(i => (type === 'web' ? i.type === type : sdk.includes(i.type)))
					.map(inventory => this.renderInventory(inventory, slots.filter(s => s.inventory === inventory.id)))}
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

	renderInventory(inventory, slots) {
		const iconClass = classNames({
			'fas fa-desktop': inventory.type === 'web',
			'fab fa-apple': inventory.type === 'ios',
			'fab fa-android': inventory.type === 'android',
		});
		const {
			match: {
				params: { type },
			},
		} = this.props;
		return (
			<Row className="margin-0" key={inventory.id}>
				<Col>
					<AppCard>
						<Row>
							<Col md={6} xs={12}>
								<h3 className="invetory-title">
									<i className={iconClass} />{' '}
									{inventory.name && inventory.name.length ? inventory.name : `Unnamed`}
								</h3>
								<span>ID: {` ${inventory.code || inventory.id}`}</span>
							</Col>
							<Col md={6} xs={12} className="top10 bottom10">
								<div className="control-buttons">
									<Button
										disabled={inventory.loading}
										color="danger"
										onClick={() => this.setState({ deletedInventory: inventory.id })}
										className="pull-right button-margin-left-10"
									>
										{!inventory.loading ? <i className="fas fa-trash-alt" /> : 'Loading'}
									</Button>
									<LinkButton
										to={`/app/inventory/${inventory.type}/edit/${inventory.id}`}
										color="info"
										className="pull-right button-margin-left-10"
									>
										<i className="fas fa-edit" />
									</LinkButton>

									<LinkButton
										to={`/app/inventory/${inventory.type}/${inventory.id}/slot/add`}
										color="success"
										className="pull-right"
									>
										<i className="fas fa-plus-circle" />
									</LinkButton>
								</div>
							</Col>
						</Row>
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
						<Col md={10}>
							<div className="page-title">
								<div className="float-left">
									<h1 className="title">
										<FormattedMessage
											{...messages[type === 'web' ? 'webInventoriesList' : 'sdkInventoriesList']}
										/>
										<LinkButton
											to={`/app/inventory/${type}/add`}
											color="success"
											className="button-radius-5 button-margin-left-10"
										>
											<FormattedMessage
												{...messages[type === 'web' ? 'addWebInventory' : 'addSdkInventory']}
											/>
										</LinkButton>
									</h1>
								</div>
							</div>
						</Col>
						<Col md={2}>
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
