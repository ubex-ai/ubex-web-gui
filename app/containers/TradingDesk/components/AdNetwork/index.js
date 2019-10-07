/**
 *
 * TrafficSources
 *
 */

import React from 'react';
import { Col, Row } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateSelect from 'components/DateSelect';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import { campaingGroupSelectors, selectChartsDates, selectGroupsIds } from '../../selectors';
import messages from '../../messages';
import TrafficTable from '../TrafficTable';
import moment from 'moment';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class AdNetwork extends React.Component {
	columns = [
		{ name: 'blockedDomain', title: ' ' },
		{ name: 'campaign', title: 'Campaign' },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'impressions', title: this.props.intl.formatMessage(messages.impressions) },
		{ name: 'clicks', title: this.props.intl.formatMessage(messages.clicks) },
		{ name: 'CTR', title: 'CTR' },
		{ name: 'cost', title: 'Cost per click' },
		{ name: 'total', title: 'Total' },
	];

	data = [
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 1,
		},
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 6,
		},
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 2,
		},
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 3,
		},
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 4,
		},
		{
			blockedDomain: false,
			campaign: 'Ubex Ad Network',
			date: moment().format('DD-MM-YYYY'),
			impressions: '1512',
			clicks: '151',
			CTR: '0.15',
			total: '15',
			cost: '11',
			id: 5,
		},
	];

	updateChart() {}

	render() {
		const { dates, groups } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={12} sm={12} xl={4} lg={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage id="app.sidebar.reports.ad-networks" /> (soon)
										</h1>
									</div>
								</div>
							</Col>
							<DateSelect
								onChange={(params, dates) => this.updateChart(params, dates)}
								startDate={startDate}
								endDate={endDate}
								period={period}
								tradingDesk={groups}
							/>
						</Row>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-md-12">
						<AppCard>
							<TrafficTable
								data={this.data}
								pagination
								columns={this.columns}
								network
								grouping="campaign"
								exportTable
							/>
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}

AdNetwork.propTypes = {};

const mapStateToProps = createStructuredSelector({
	groupsIds: selectGroupsIds(),
	dates: selectChartsDates(),
	groups: campaingGroupSelectors.collectionList(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(injectIntl(AdNetwork));
