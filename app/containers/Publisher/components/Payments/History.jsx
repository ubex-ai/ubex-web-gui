/**
 *
 * History
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import CardPopover from 'components/CardPopover';
import AppCard from 'components/AppCard';
import DateSelect from 'components/DateSelect';
import reducer from 'containers/Publisher/reducer';
import TablePaymentHistory from 'containers/DataMiner/components/Tables/TablePaymentHistory';
import messages from 'containers/DataMiner/messages';
import { selectChartsDates } from 'containers/Publisher/selectors';
import { updateCharts } from 'containers/DataMiner/actions';

class History extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			rows: [
				{
					status: 'DEMO',
					time: '23.12.18 10:17',
					method: 'ETH Deposit',
					amount: '0.1 ETH',
					txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
				},
				{
					status: 'DEMO',
					time: '23.12.18 10:17',
					method: 'ETH Deposit',
					amount: '0.1 ETH',
					txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
				},
				{
					status: 'DEMO',
					time: '23.12.18 10:17',
					method: 'ETH Deposit',
					amount: '0.1 ETH',
					txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
				},
				{
					status: 'DEMO',
					time: '23.12.18 10:17',
					method: 'ETH Deposit',
					amount: '0.1 ETH',
					txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
				},
				{
					status: 'DEMO',
					time: '23.12.18 10:17',
					method: 'ETH Deposit',
					amount: '0.1 ETH',
					txid: 'https://etherscan.io/tx/0x3b078e7215a86ff795f041fdee5e47bfb0fe0272044c8d4f833ec71e4dec2de5',
				},
			],
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	render() {
		const { dates } = this.props;
		const { startDate, endDate, period } = dates;
		return (
			<Row>
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={6}>
									<div className="page-title">
										<div className="float-left">
											<h1 className="title">
												<FormattedMessage {...messages.paymentsHistory} /> (Coming soon)
											</h1>
										</div>
									</div>
								</Col>
								<DateSelect
									onChange={(params, dates) => this.props.updateCharts(params, dates)}
									startDate={startDate}
									endDate={endDate}
									period={period}
								/>
							</Row>
						</Col>
					</Row>
					<div className="row margin-0">
						<div className="col-xl-6 col-md-12 col-12">
							<CardPopover
								popoverHeader={messages.paymentsHistory}
								popoverBody={messages.paymentsHistory}
							>
								<div className="stats">
									<Row>
										<i className="float-left fa fa-dollar-sign icon-md icon-rounded icon-purple" />
										<Col md={9}>
											<h4>
												<strong className="green">$0</strong>
											</h4>
											<span>Balance Dollar USA</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-6 col-md-12 col-12">
							<CardPopover
								popoverHeader={messages.paymentsHistory}
								popoverBody={messages.paymentsHistory}
							>
								<div className="stats">
									<Row>
										<i className="float-left fas fa-coins icon-md icon-rounded icon-f0ad4e" />
										<Col md={9}>
											<h4>
												<strong>0 UBEX</strong>
											</h4>
											<span>Balance Crypto</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</div>
					</div>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard>
								<header className="panel_header">
									<h2 className="panel_header--title float-left">Deposit</h2>
								</header>
								<div className="content-body">
									<TablePaymentHistory data={this.state.rows} />
								</div>
							</AppCard>
						</div>
					</div>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard>
								<header className="panel_header">
									<h2 className="panel_header--title float-left">Withdraw</h2>
								</header>
								<div className="content-body">
									<TablePaymentHistory data={this.state.rows} />
								</div>
							</AppCard>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

History.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateCharts: PropTypes.func.isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
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

export default compose(withConnect)(History);
