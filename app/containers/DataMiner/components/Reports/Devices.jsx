import React from 'react';
import { Row, Col } from 'reactstrap';
import BarChart from 'components/Charts/Bar';
import { FormattedMessage } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import messages from 'containers/DataMiner/messages';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import reducer from 'containers/DataMiner/reducer';
import { compose } from 'redux';
import AppCard from 'components/AppCard';
import DateSelect from 'components/DateSelect';
import { updateCharts } from 'containers/DataMiner/actions';
import { selectChartsDates, selectMetricByName } from 'containers/DataMiner/selectors';

class Devices extends React.Component {
	columns = [
		{ name: 'name', title: 'Devices' },
		{ name: 'date', title: 'Date' },
		{ name: 'count', title: 'Visitors' },
		{ name: 'paidusers', title: 'Reward visitors' },
		{ name: 'paidpercent', title: 'Paid %' },
	];

	render() {
		const { topDevices, toTableDevices, dates, updateCharts } = this.props;
		const { startDate, endDate, period } = dates;

		return (
			<div>
				<Row className="margin-0">
					<Col md={12} className="title_with_select">
						<Row>
							<Col md={6}>
								<div className="page-title">
									<div className="float-left">
										<h1 className="title">
											<FormattedMessage {...messages.devices} /> (reward)
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
							<BarChart data={topDevices} height={window.innerWidth > 600 ? 100 : 300} />
						</AppCard>
					</Col>
				</Row>
				<Row className="margin-0">
					<Col className="col-12 col-lg-12 col-xl-12">
						<AppCard>
							<AppTable data={toTableDevices} pagination columns={this.columns} grouping />
						</AppCard>
					</Col>
				</Row>
			</div>
		);
	}
}
Devices.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	toTableDevices: PropTypes.arrayOf(
		PropTypes.shape({
			count: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			paidpercent: PropTypes.number.isRequired,
			paidusers: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
	topDevices: PropTypes.shape({
		arrayChart: PropTypes.arrayOf(PropTypes.number.isRequired),
		arrayLabels: PropTypes.arrayOf(PropTypes.string.isRequired),
	}).isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
	topDevices: selectMetricByName('topDevices'),
	toTableDevices: selectMetricByName('toTableDevices'),
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
)(Devices);
