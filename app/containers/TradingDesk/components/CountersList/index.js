/**
 *
 * CountersList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Alert, Col, Row } from 'reactstrap';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import AppCard from 'components/AppCard';
import AppAlertError from 'components/AppAlertError';
import TableCounter from 'containers/TradingDesk/components/TableCounter';
import CountersOnlineDashboardCard from 'containers/DataMiner/components/DashboardCards/CountersOnlineDashboardCard';
import AverageRevenueDashboardCard from 'containers/DataMiner/components/DashboardCards/AverageRevenueDashboardCard';
import CodeModal from 'components/CodeModal';
import messages from 'containers/DataMiner/messages';
import {
	getCounters,
	setActiveCounter,
	removeCounter,
	getCounter,
	getOnlineCounter,
	counterSharingCollectionActions,
} from '../../actions';
import { countersSelectors, selectAverage, selectCounterOnline } from '../../selectors';
import RemoveModal from 'components/RemoveModal';
import createToast from '../../../../utils/toastHelper';
import { makePromiseAction } from '../../../../utils/CollectionHelper/actions';
import ShareModal from '../ShareModal';
import _ from 'lodash';

/* eslint-disable react/prefer-stateless-function */
class CountersList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showCode: null,
			removeCounter: null,
			shareCounter: null,
		};
		this.codeModal = this.codeModal.bind(this);
	}

	componentDidMount() {
		if (!this.props.getCountersIsLoading) {
			this.props.getCounters().then(() => {
				this.props.counters.map(counter => {
					this.props.getOnlineCounter(counter.counter);
				});
			});
		}
	}

	codeModal() {
		if (!this.state.showCode) {
			return null;
		}

		const counter = this.props.counters.find(s => s.id === this.state.showCode);
		if (!counter.embedded_script) {
			return null;
		}

		return (
			<CodeModal
				title={messages.code}
				msg={counter.embedded_script}
				isOpen={this.state.showCode}
				onCancel={() => this.setState({ showCode: null })}
			/>
		);
	}

	removeCounter(id) {
		this.props.removeCounter(id);
		this.setState({ removeCounter: null });
		createToast('success', 'Counter successfully removed!');
	}

	isOnline(id) {
		const { onlineCounters } = this.props;
		return _.find(onlineCounters, ['id', id]);
	}

	render() {
		const { onlineCounters, average, counters } = this.props;
		const onlineAllCounters = {
			online: onlineCounters.filter(
				counter => counter.is_online && _.some(counters, count => count.counter === counter.id),
			).length,
			all: counters.length,
		};
		const sharedOwners = this.state.shareCounter
			? _.find(counters, ['id', this.state.shareCounter]).shared_owners
			: [];
		return (
			<Row className="margin-0">
				<Col xs={12} md={12}>
					<div className="page-title">
						<div className="float-left">
							<h1 className="title">
								<FormattedMessage {...messages.countersListHeader} />
							</h1>
						</div>
					</div>
					<Row>
						<Col xl={6} md={12} xs={12} className="col-12">
							<CountersOnlineDashboardCard {...onlineAllCounters} />
						</Col>
						<div className="col-xl-6 col-md-12 col-12" />
					</Row>
					<AppCard className="mt-2">
						<div className="content-body">
							{this.props.counters && this.props.counters.length ? (
								// TODO: переделать на AppTable
								<TableCounter
									data={this.props.counters}
									onClickGetCode={id => {
										this.props.getCounter(id);
										this.setState({ showCode: id });
									}}
									isOnline={id => this.isOnline(id)}
									onClickRemoveEntry={id => this.setState({ removeCounter: id })}
									shareCounter={id => this.setState({ shareCounter: id })}
								/>
							) : (
								<Alert color="primary">
									<FormattedMessage {...messages.makeFirstCounter} />
								</Alert>
							)}
						</div>
					</AppCard>
					{this.codeModal(this.state.showCode)}
					<RemoveModal
						isOpen={this.state.removeCounter}
						onSuccess={id => this.removeCounter(id)}
						onCancel={() => this.setState({ removeCounter: null })}
						title={messages.remove}
						msg={messages.remove}
					/>
					<ShareModal
						isOpen={this.state.shareCounter}
						sharedOwners={sharedOwners}
						title={messages.shareCounter}
						removeSharedOwner={id => this.removeShareUser(id)}
						onCancel={() => this.setState({ shareCounter: null })}
						addShareUser={values => this.addShareUser(this.state.shareCounter, values)}
						permissions={this.getPermissions(this.state.shareCounter)}
					/>
				</Col>
			</Row>
		);
	}

	getPermissions(counterId) {
		if (counterId) {
			const counter = _.find(this.props.counters, ['id', counterId]);
			return counter.sharing && !counter.sharing.shared;
		}
	}

	removeShareUser(id) {
		this.props
			.removeSharingUser(id)
			.then(() => {
				createToast('success', 'Share user successfully removed!');
				this.props.getCounters();
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
				this.props.getCounters();
			})
			.catch(() => {
				createToast('error', 'Share user added error!');
			});
	}
}

CountersList.propTypes = {
	dispatch: PropTypes.func.isRequired,
	counters: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number,
			is_online: PropTypes.bool,
			name: PropTypes.string,
			counter: PropTypes.string,
			created: PropTypes.string,
			paid_visitors: PropTypes.number,
			paid_percent: PropTypes.number,
		}),
	).isRequired,
	getCountersIsLoading: PropTypes.bool,
	getCountersError: PropTypes.object,
	getCounter: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	counters: countersSelectors.collectionList(),
	getCountersIsLoading: countersSelectors.collectionLoading(),
	getCountersError: countersSelectors.collectionError(),
	activeCounter: countersSelectors.activeEntry(),
	onlineCounters: selectCounterOnline(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCounters: () => makePromiseAction(dispatch, getCounters()),
		setActiveCounter: id => dispatch(setActiveCounter(id)),
		removeCounter: id => dispatch(removeCounter(id)),
		getCounter: id => dispatch(getCounter(id)),
		getOnlineCounter: id => dispatch(getOnlineCounter(id)),
		addSharingUser: values => makePromiseAction(dispatch, counterSharingCollectionActions.addEntry(values)),
		removeSharingUser: values => makePromiseAction(dispatch, counterSharingCollectionActions.removeEntry(values)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CountersList);
