/**
 *
 * DateSelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import RenderDatamap from 'components/Maps/RenderDatamaps';
const colors = ['#716aca', '#22b9ff', '#f4516c', '#34bfa3', '#03a9f4', 'rgb(255, 184, 34)', '#f44336'];
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
class Datamap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.countries = {};
	}

	render() {
		const { countriesColors, countriesCounts } = this.props.data;
		return (
			<div className="row">
				<div
					className={
						countriesColors
							? 'col-xs-12 col-md-12 col-lg-12 col-xl-11'
							: 'col-xs-12 col-md-12 col-lg-12 col-xl-12'
					}
				>
					<RenderDatamap
						data={countriesColors}
						geographyConfig={{
							highlightOnHover: true,
							highlightFillColor: 'rgb(255, 184, 34)',
						}}
						fills={{
							defaultFill: 'rgba(52, 191, 163, 0.3)',
							authorHasTraveledTo: '#fa0fa0',
						}}
						height={500}
						projection="mercator"
						className="datamap"
						updateChoroplethOptions={{ reset: false }}
					/>
				</div>
				<div className="map_progress col-12 col-md-12 col-lg-12 col-xl-1">
					{countriesCounts
						? Object.keys(countriesCounts).map((item, i) => (
								<div key={i}>
									<span className="text-muted">
										<small>
											{item}: {countriesCounts[item]}
										</small>
									</span>
									<div className="progress" style={{ height: '10px'}}>
										<div
											className="progress-bar progress-bar-primary"
											role="progressbar"
											aria-valuenow="100"
											aria-valuemin="0"
											aria-valuemax="100"
											style={{
												width: `${100}%`,
												background: colors[i],
											}}
										/>
									</div>
								</div>
						  ))
						: null}
				</div>
			</div>
		);
	}
}

Datamap.defaultProps = {};

Datamap.propTypes = {
	data: PropTypes.shape({
		countriesColors: PropTypes.object,
		countriesCounts: PropTypes.object,
	}),
};
export default Datamap;
