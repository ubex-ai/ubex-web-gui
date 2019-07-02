import React from 'react';
import { Row, Col } from 'reactstrap';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import Datamap from 'components/Maps/Datamaps';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import AppCard from 'components/AppCard';
import { updateCharts } from 'containers/DataMiner/actions';
import messages from 'containers/DataMiner/messages';
import { selectChartsDates, selectMetricByName } from 'containers/DataMiner/selectors';
import injectReducer from 'utils/injectReducer';
import reducer from 'containers/DataMiner/reducer';
import DateSelect from 'components/DateSelect';

class Regions extends React.Component {
	columns = [
		{ name: 'name', title: this.props.intl.formatMessage(messages.counter) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidpercent', title: this.props.intl.formatMessage(messages.paidPercent) },
	];

	render() {
		const { topRegions, toTableTopCounters, dates, updateCharts } = this.props;
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
													<FormattedMessage {...messages.regions} />
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
						<Row className="margin-0">
							<Col className="col-md-12">
								<AppCard chart>
									<Datamap data={topRegions} />
								</AppCard>
							</Col>
						</Row>
						<Row className="margin-0">
							<Col className="col-12 col-lg-12 col-xl-12">
								<AppCard>
									<AppTable data={toTableTopCounters} pagination columns={this.columns} grouping />
								</AppCard>
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}

Regions.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableTopCounters: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topRegions: PropTypes.shape({
		countriesColors: PropTypes.object,
		countriesCounts: PropTypes.object,
	}).isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
	topRegions: selectMetricByName('topRegions'),
	toTableTopCounters: selectMetricByName('toTableTopCounters'),
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
)(injectIntl(Regions));
