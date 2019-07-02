/**
 *
 * Channel
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import AppCard from 'components/AppCard';
import BarChart from 'components/Charts/Bar';
import AppTable from 'components/Tables/AppTable';
import DateSelect from 'components/DateSelect';
import { updateCharts } from 'containers/DataMiner/actions';
import reducer from 'containers/DataMiner/reducer';
import { selectChartsDates, selectMetricByName } from 'containers/DataMiner/selectors';
import { injectIntl, intlShape } from 'react-intl';
import messages from 'containers/DataMiner/messages';

class Channel extends React.Component {
	columns = [
		{ name: 'name', title: this.props.intl.formatMessage(messages.channels) },
		{ name: 'date', title: this.props.intl.formatMessage(messages.date) },
		{ name: 'count', title: this.props.intl.formatMessage(messages.visitorsTable) },
		{ name: 'paidusers', title: this.props.intl.formatMessage(messages.rewardVisitors) },
		{ name: 'paidpercent', title: this.props.intl.formatMessage(messages.paidPercent) },
	];

	render() {
		const { topChannel, toTableChannels, dates, updateCharts } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={12} sm={6} xl={5} lg={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.channel} /> (reward)
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
				<Row className="row margin-0">
					<Col className="col-md-12">
						<AppCard chart>
							<BarChart data={topChannel} height={window.innerWidth > 600 ? 100 : 300} channel />
						</AppCard>
					</Col>
				</Row>
				<Row className="row margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable pagination grouping data={toTableChannels} columns={this.columns} />
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}
Channel.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableChannels: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topChannel: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.number.isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}).isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
	intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
	topChannel: selectMetricByName('topChannel'),
	toTableChannels: selectMetricByName('toTableChannels'),
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
)(injectIntl(Channel));
