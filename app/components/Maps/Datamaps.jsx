/**
 *
 * DateSelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import RenderDatamap from 'components/Maps/RenderDatamaps';
const colors = ['#f00', '#9467bd', '#ff7f0e', '#2ca02c', 'rgb(230,25,75)', 'rgba(70,240,24)', 'rgb(245,130,49)'];
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
							? 'col-xs-12 col-md-12 col-lg-12 col-xl-9'
							: 'col-xs-12 col-md-12 col-lg-12 col-xl-12'
					}
				>
					<RenderDatamap
						data={countriesColors}
						fills={{
							defaultFill: 'rgba(171, 221, 164, 0.5)',
							authorHasTraveledTo: '#fa0fa0',
						}}
						height={329}
						projection="mercator"
						className="datamap"
						updateChoroplethOptions={{ reset: false }}
					/>
				</div>
				<div className="map_progress col-12 col-md-12 col-lg-12 col-xl-3">
					{countriesCounts
						? Object.keys(countriesCounts).map((item, i) => (
								<div key={i}>
									<span className="text-muted">
										<small>
											{item}: {countriesCounts[item]}
										</small>
									</span>
									<div className="progress">
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
