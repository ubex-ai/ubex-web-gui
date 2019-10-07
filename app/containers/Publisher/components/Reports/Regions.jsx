import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Row, Col, Popover, PopoverHeader, PopoverBody, Button } from 'reactstrap';

import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import world from 'world-atlas/world/110m.json';
import { FormattedMessage } from 'react-intl';
import AppTable from 'components/Tables/AppTable';
import Datamap from 'components/Maps/Datamaps';
import AppCard from 'components/AppCard';
import messages from '../../messages';
import DateSelect from '../../../../components/DateSelect';
const colors = ['#f00', '#9467bd', '#ff7f0e', '#2ca02c', 'rgb(230,25,75)', 'rgba(70,240,24)', 'rgb(9, 108, 247)'];

class Regions extends React.Component {
	constructor(props, context) {
		super(props);

		const today = moment();

		this.state = {
			data: {
				CHN: colors[0],
				KOR: colors[1],
				USA: colors[2],
				RUS: colors[3],
				IND: colors[4],
				DEU: colors[5],
				FRA: colors[6],
			},
			startDate: moment(),
			endDate: moment(),
			width: 0,
			height: 0,
			worldData: [],
			open: false,
			dataChart: [[], []],
		};
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}

	componentDidMount() {
		this.updateWindowDimensions();
		window.addEventListener('resize', this.updateWindowDimensions);
		this.setState({
			worldData: feature(world, world.objects.countries).features,
		});
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
											<h1 className="title">Regions</h1>
										</div>
									</div>
								</Col>
								<DateSelect onChange={null} />
							</Row>
						</Col>
					</Row>
					<div className="row margin-0">
						<div className="col-md-12">
							<section className="box ">
								<header className="panel_header">
									<Link to="/app/visitors/geography">
										<h2 className="title float-left">Regions</h2>
									</Link>
								</header>
								<Datamap data={this.state.data} />
							</section>
						</div>
					</div>
					<div className="row margin-0">
						<div className="col-12 col-lg-12 col-xl-12">
							<AppCard chart>
								<AppTable data={[]} columns={[{ name: '123', title: 'Regions' }]} />
							</AppCard>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Regions;
