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
			rows: [],
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
									onChange={(params, dates) => this.props.updateCharts(params, dates)}
									startDate={startDate}
									endDate={endDate}
									period={period}
								/>
							</Row>
						</Col>
					</Row>
					<div className="row margin-0">
						<div className="col-xl-3 col-md-12 col-12">
							<CardPopover
								popoverHeader={messages.paymentsHistory}
								popoverBody={messages.paymentsHistory}
							>
								<div className="stats">
									<Row>
										<i className="float-left fas fa-dollar-sign icon-md icon-rounded icon-success" />
										<Col md={9} className="stats__card">
											<h4>
												<strong className="green">$0</strong>
											</h4>
											<span>Balance Dollar USA</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-3 col-md-12 col-12">
							<CardPopover
								popoverHeader={messages.paymentsHistory}
								popoverBody={messages.paymentsHistory}
							>
								<div className="stats">
									<Row>
										<i className="float-left fas fa-coins icon-md icon-rounded icon-purple" />
										<Col md={9} className="stats__card">
											<h4>
												<strong>0 UBEX</strong>
											</h4>
											<span>Available UBEX tokens</span>
										</Col>
									</Row>
								</div>
							</CardPopover>
						</div>
						<div className="col-xl-3 col-md-12 col-12">
							<AppCard>
								<div className="stats">
									<Row>
										<i className="float-left fab fa-github icon-md icon-rounded icon-github" />
										<Col md={9} className="stats__card">
											<h4>
												<strong>GITHUB</strong>
											</h4>
											<a href="https://github.com/ubex-ai/miner-smart-contract" target="_blank">
												<span>See our contract code</span>
											</a>
										</Col>
									</Row>
								</div>
							</AppCard>
						</div>
						<div className="col-xl-3 col-md-12 col-12">
							<AppCard>
								<div className="stats">
									<Row>
										<i className="float-left fab fa-ethereum icon-md icon-rounded icon-etherscan" />
										<Col md={9} className="stats__card">
											<h4>
												<strong>ETHERSCAN</strong>
											</h4>
											<a
												href="https://etherscan.io/address/0x47382d68c05037f29fc523df5282791ae61a6699"
												target="_blank"
											>
												<span>Your payments in contract</span>
											</a>
										</Col>
									</Row>
								</div>
							</AppCard>
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
