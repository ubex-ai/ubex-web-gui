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
import { getCounters, setActiveCounter, removeCounter, getCounter } from '../../actions';
import { countersSelectors, selectAverage } from '../../selectors';
import RemoveModal from 'components/RemoveModal';
import createToast from '../../../../utils/toastHelper';

/* eslint-disable react/prefer-stateless-function */
class CountersList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showCode: null,
			removeCounter: null,
		};
		this.codeModal = this.codeModal.bind(this);
	}

	componentDidMount() {
		if (!this.props.getCountersIsLoading) {
			this.props.getCounters();
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

	render() {
		const { onlineCounters, average } = this.props;
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
							<CountersOnlineDashboardCard {...onlineCounters} />
						</Col>
						<div className="col-xl-6 col-md-12 col-12">

						</div>
					</Row>
					<AppCard>
						<div className="content-body">
							{this.props.getCountersError ? (
								<AppAlertError>{this.props.getCountersError.message}</AppAlertError>
							) : null}
							{this.props.counters && this.props.counters.length ? (
								// TODO: переделать на AppTable
								<TableCounter
									data={this.props.counters}
									onClickGetCode={id => {
										this.props.getCounter(id);
										this.setState({ showCode: id });
									}}
									onClickRemoveEntry={id => this.setState({ removeCounter: id })}
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
				</Col>
			</Row>
		);
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
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCounters: () => dispatch(getCounters()),
		setActiveCounter: id => dispatch(setActiveCounter(id)),
		removeCounter: id => dispatch(removeCounter(id)),
		getCounter: id => dispatch(getCounter(id)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(CountersList);
