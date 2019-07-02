import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { compose } from 'redux';
import { Row, Col } from 'reactstrap';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';

import AppCard from 'components/AppCard';
import { updateCharts } from 'containers/DataMiner/actions';
import LineChart from 'components/Charts/Line';
import AppTable from 'components/Tables/AppTable';
import messages from 'containers/DataMiner/messages';
import { selectChartsDates, selectMetricByName } from 'containers/DataMiner/selectors';
import reducer from 'containers/DataMiner/reducer';
import DateSelect from 'components/DateSelect';

class ProfitabilityWorkers extends React.Component {
	columns =[
		{ name: 'name', title: this.props.intl.formatMessage(messages.counter) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidUBEX', title: 'UBEX' },
	];

	render() {
		const { toTableProfitability, topProfitability, dates, updateCharts } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row>
					<Col xs={12} md={12}>
						<Row className="margin-0">
							<Col md={12} className="title_with_select">
								<Row>
									<Col md={5}>
										<div className="page-title">
											<div className="float-left">
												<h1 className="title">
													<FormattedMessage {...messages.profitCounters} />
												</h1>
											</div>
										</div>
									</Col>
									<DateSelect
										onChange={(params, dates) => updateCharts(params, dates)}
										startDate={startDate}
										endDate={endDate}
										period={period}
									/>
								</Row>
							</Col>
						</Row>

						<div className="row margin-0">
							<div className="col-md-12">
								<AppCard chart>
									<LineChart data={topProfitability} height={window.innerWidth > 600 ? 100 : 300} />
								</AppCard>
							</div>
						</div>
						<div className="row margin-0">
							<div className="col-12 col-lg-12 col-xl-12">
								<AppCard>
									<AppTable data={toTableProfitability} pagination columns={this.columns} grouping />
								</AppCard>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

ProfitabilityWorkers.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableProfitability: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidUBEX: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
			txid: PropTypes.string.isRequired,
		}).isRequired,
	).isRequired,
	topProfitability: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number.isRequired).isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
		average: PropTypes.string,
	}).isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
	toTableProfitability: selectMetricByName('toTableProfitability'),
	topProfitability: selectMetricByName('topProfitability'),
	dates: selectChartsDates(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateCharts: (params, dates) => dispatch(updateCharts(params, dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'dataMiner', reducer });
export default compose(
	withReducer,
	withConnect,
)(injectIntl(ProfitabilityWorkers));
