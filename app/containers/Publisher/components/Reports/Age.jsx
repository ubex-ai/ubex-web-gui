import React from 'react';
import { Row, Col } from 'reactstrap';

import { DateRangePicker } from 'react-dates';
import Bar from 'components/Charts/Bar';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import AppTable from 'components/Tables/AppTable';
import AppCard from 'components/AppCard';
import messages from '../../messages';
import { data1, data9, options1, options9 } from '../../Variables/graphics';
import DateSelect from '../../../../components/DateSelect';
class Age extends React.Component {
	constructor(props) {
		super(props);

		const today = moment();

		this.state = {
			startDate: moment(),
			endDate: moment(),
			width: 0,
			height: 0,
			dataChart: [[], []],
		};
		this.onSelectDate = this.onSelectDate.bind(this);
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
											<h1 className="title">Age</h1>
										</div>
									</div>
								</Col>
								<DateSelect onChange={null} />
							</Row>
						</Col>
					</Row>
					<div className="row margin-0">
						<div className="col-md-12">
							<AppCard chart>
								<Bar data={this.state.dataChart} height={window.innerWidth > 600 ? 100 : 200} />
							</AppCard>
						</div>
					</div>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard chart>
								<AppTable data={[]} columns={[{ name: '123', title: 'Age' }]} />
							</AppCard>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Age;
