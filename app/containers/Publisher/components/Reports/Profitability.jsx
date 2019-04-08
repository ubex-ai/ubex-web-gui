import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Row, Col, Popover, PopoverHeader, PopoverBody, Button } from 'reactstrap';

import { DateRangePicker } from 'react-dates';
import Line from 'components/Charts/Line';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import AppCard from 'components/AppCard';
import { data, data8, options3, options8 } from '../../Variables/graphics';
import AppTable from '../../../../components/Tables/AppTable';
import messages from '../../messages';
import DateSelect from '../../../../components/DateSelect';

class Profitability extends React.Component {
	constructor(props, context) {
		super(props);

		const today = moment();

		this.state = {
			startDate: moment(),
			endDate: moment(),
			width: 0,
			height: 0,
			dataChart: [[], []],
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
		return (
			<Row>
				<Col xs={12} md={12}>
					<Row className="margin-0">
						<Col md={12} className="title_with_select">
							<Row>
								<Col md={6}>
									<div className="page-title">
										<div className="float-left">
											<h1 className="title">Profitability</h1>
										</div>
									</div>
								</Col>
								<DateSelect onChange={null} />
							</Row>
						</Col>
					</Row>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard chart>
								<Line data={this.state.dataChart} height={window.innerWidth > 600 ? 100 : 200} />
							</AppCard>
						</div>
					</div>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard chart>
								<AppTable data={[]} columns={[{ name: '123', title: 'Profitability' }]} />
							</AppCard>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Profitability;
