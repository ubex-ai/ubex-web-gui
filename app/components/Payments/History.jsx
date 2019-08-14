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
import TablePaymentHistory from 'containers/DataMiner/components/Tables/TablePaymentHistory';
import messages from 'containers/DataMiner/messages';
import DashboardCard from 'components/DashboardCard';
import { getUBEXBalance } from 'utils/web3helper';
import { selectUserData } from 'containers/UserPage/selectors';
import { getPaymentHistory, updateHistory } from 'containers/TradingDesk/actions';
import { selectBalance, selectChartsDates, selectPaymentHistory } from 'containers/TradingDesk/selectors';
import OrderPaymentForm from 'containers/DataMiner/components/DashboardCards/NextPayoutDashboardCard';

class History extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			rows: [],
			ubexBalance: 0,
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		const { dates } = this.props;
		const { startDate, endDate } = dates;

		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		const { selectUbexHash } = this.props;
		const { wallet } = selectUbexHash;
		if (wallet && wallet.hash_code) {
			this.getBalance(wallet.hash_code);
		}
		this.props.getHistory({ start_date: startDate, end_date: endDate });
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight });
	}

	async getBalance(hash) {
		const { balance, err } = await getUBEXBalance(hash);
		if (err) {
			console.log(err);
		} else {
			this.setState({ ubexBalance: balance });
		}
	}

	render() {
		const { dates, paymentHistory } = this.props;
		const { startDate, endDate, period } = dates;
		const { amount } = this.props.selectAmount && this.props.selectAmount.length ? this.props.selectAmount[0] : '0';
		return (
			<Row>
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={5}>
									<div className="page-title">
										<div className="float-left">
											<h1 className="title">
												<FormattedMessage {...messages.paymentsHistory} />
											</h1>
										</div>
									</div>
								</Col>
								<DateSelect
									onChange={(params, dates) => this.props.updateHistory(params, dates)}
									startDate={startDate}
									endDate={endDate}
									period={period}
								/>
							</Row>
						</Col>
					</Row>
					{CRYPTO_MODE && (
						<div className="row margin-0">
							<div className="col-xl-3 col-md-12 col-12">
								{document.location.origin !== MINING_URL &&
								document.location.origin !== 'http://10.100.0.232:3000' ? (
									<CardPopover
										popoverHeader={messages.paymentsHistory}
										popoverBody={messages.paymentsHistory}
									>
										<i className="float-left fas fa-dollar-sign icon-md icon-rounded icon-success" />
										<div className="stats dashboardCard__container">
											<div className="dashboardCard__text">
												<h4 className="dashboardCard__title">
													<strong className="green">{amount || '0'}</strong>
												</h4>
												<span className="dashboardCard__description">Balance Dollar USA</span>
											</div>
										</div>
									</CardPopover>
								) : (
									<CardPopover>
										<i className="float-left fas fa-dollar-sign icon-md icon-rounded icon-success" />
										<div className="stats dashboardCard__container">
											<div className="dashboardCard__text">
												<h4 className="dashboardCard__title">
													<strong>Sat, 31 Aug 2019</strong>
												</h4>
												<div className="dashboardCard__description">
													<FormattedMessage {...messages.nextPayout} />
												</div>
											</div>
										</div>
									</CardPopover>
								)}
							</div>

							<div className="col-xl-3 col-md-12 col-12">
								<CardPopover
									popoverHeader={messages.paymentsHistory}
									popoverBody={messages.paymentsHistory}
								>
									<i className="float-left fas fa-coins icon-md icon-rounded icon-purple" />
									<div className="stats dashboardCard__container">
										<div className="dashboardCard__text">
											<h4 className="dashboardCard__title">
												<strong>{this.state.ubexBalance} UBEX</strong>
											</h4>
											<div className="dashboardCard__description">
												<span>Available UBEX tokens</span>
											</div>
										</div>
									</div>
								</CardPopover>
							</div>
							<div className="col-xl-3 col-md-12 col-12">
								<CardPopover
									popoverHeader={messages.paymentsHistory}
									popoverBody={messages.paymentsHistory}
								>
									<i className="float-left fab fa-github icon-md icon-rounded icon-github" />
									<div className="stats dashboardCard__container">
										<div className="dashboardCard__text">
											<h4 className="dashboardCard__title">
												<strong>GITHUB</strong>
											</h4>
											<a
												className="dashboardCard__description"
												href="https://github.com/ubex-ai/miner-smart-contract"
												target="_blank"
											>
												<span>See our contract code</span>
											</a>
										</div>
									</div>
								</CardPopover>
							</div>
							<div className="col-xl-3 col-md-12 col-12">
								<AppCard>
									<i className="float-left fab fa-ethereum icon-md icon-rounded icon-etherscan" />
									<div className="stats dashboardCard__container">
										<div className="dashboardCard__text">
											<h4 className="dashboardCard__title">
												<strong>ETHERSCAN</strong>
											</h4>
											<a
												href="https://etherscan.io/address/0x47382d68c05037f29fc523df5282791ae61a6699"
												target="_blank"
												className="dashboardCard__description"
											>
												<span>Your payments</span>
											</a>
										</div>
									</div>
								</AppCard>
							</div>
						</div>
					)}
					{document.location.origin !== MINING_URL && (
						<div className="row margin-0">
							<div className="col-12 col-lg-12 col-xl-12">
								<AppCard>
									<header className="panel_header">
										<h2 className="panel_header--title float-left">Deposit</h2>
									</header>
									<div className="content-body">
										<TablePaymentHistory data={paymentHistory} />
									</div>
								</AppCard>
							</div>
						</div>
					)}
					{document.location.origin !== TRADING_DESK_URL && (
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
					)}
				</Col>
			</Row>
		);
	}
}

History.propTypes = {
	dispatch: PropTypes.func.isRequired,
	updateHistory: PropTypes.func.isRequired,
	dates: PropTypes.shape({
		startDate: PropTypes.string.isRequired,
		endDate: PropTypes.string.isRequired,
		period: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = createStructuredSelector({
	dates: selectChartsDates(),
	selectUbexHash: selectUserData(),
	selectAmount: selectBalance(),
	paymentHistory: selectPaymentHistory(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		updateHistory: (params, dates) => dispatch(updateHistory(params, dates)),
		getHistory: dates => dispatch(getPaymentHistory(dates)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(History);
