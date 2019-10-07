/**
 *
 * RenderCity
 *
 */

import React from 'react';
import CustomInput from 'reactstrap/es/CustomInput';
import { makePromiseAction } from '../../../../../utils/CollectionHelper/actions';
import { getCities } from '../../../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectCountries } from '../../../../Dashboard/selectors';
import { selectRegions } from '../../../selectors';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class RenderCity extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openedRegion: [],
		};
	}

	componentDidMount() {
		const { countryId, regionCode } = this.props;
		this.getCities(countryId, regionCode);
	}

	getCities(countryId, regionCode) {
		this.props.getCities(countryId, regionCode).then(response => {
			this.setState({ [regionCode]: response });
		});
	}

	selectedCitiesState(code) {
		return this.props.selectedCities.filter(selReg => selReg.id === code).length;
	}

	renderCities(regionCode, cities) {
		return (
			<ul key={regionCode}>
				{cities && cities.length ? (
					cities.map(city => (
						<li className="country-select__select--body-checkbox">
							<CustomInput
								id={city.city_code}
								type="checkbox"
								label={city.name}
								onClick={() =>
									this.props.selectCity({
										id: city.city_code,
										label: city.name,
										region_code: regionCode,
									})
								}
								key={city.city_code}
								checked={this.selectedCitiesState(city.city_code)}
							/>
						</li>
					))
				) : (
					<div>No cities!</div>
				)}
			</ul>
		);
	}
	render() {
		const { regionCode } = this.props;
		return this.state[regionCode] ? this.renderCities(regionCode, this.state[regionCode]) : null;
	}
}

RenderCity.propTypes = {};

const mapStateToProps = createStructuredSelector({
	regions: selectRegions(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCities: (countryId, regionCode) =>
			makePromiseAction(dispatch, getCities(`${countryId}/region/${regionCode}/city`)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(RenderCity);
