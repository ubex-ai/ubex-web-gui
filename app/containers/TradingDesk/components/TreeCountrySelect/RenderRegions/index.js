/**
 *
 * RenderRegions
 *
 */

import React from 'react';
import CustomInput from 'reactstrap/es/CustomInput';
import { makePromiseAction } from '../../../../../utils/CollectionHelper/actions';
import { getRegions } from '../../../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { selectCountries } from '../../../../Dashboard/selectors';
import { selectRegions } from '../../../selectors';
import RenderCity from '../RenderCity';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class RenderRegions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openedRegion: [],
		};
		this.toggleRegion = this.toggleRegion.bind(this);
	}

	componentDidMount() {
		const { countryId } = this.props;
		this.getRegions(countryId);
	}

	regionState(id) {
		return this.state.openedRegion.includes(id);
	}

	toggleRegion(id) {
		if (this.regionState(id)) {
			this.setState({
				openedRegion: this.state.openedRegion.filter(region => region !== id),
				[id]: null,
			});
		} else {
			this.setState({ openedRegion: [...this.state.openedRegion, id] });
		}
	}

	getRegions(countryId) {
		this.props.getRegions(countryId).then(response => {
			this.props.setRegions(countryId, response);
		});
	}

	selectedRegionsState(id) {
		return this.props.selectedRegions.filter(selReg => selReg.id === id).length;
	}

	selectedCountriesState(id) {
		return this.props.selectedCountries.includes(id);
	}

	renderRegions(countryId, countryRegions) {
		const { regions } = countryRegions.filter(country => country.id === countryId);
		return (
			<ul>
				{regions ? regions.map(region => [
					<li className="country-select__select--body-checkbox" key={region.id}>
						{region.iso && (
							<i
								className={`fal fa-${this.regionState(region.id) ? 'minus' : 'plus'}`}
								onClick={() => this.toggleRegion(region.id)}
							/>
						)}
						<CustomInput
							id={region.id}
							type="checkbox"
							label={region.name}
							onClick={() =>
								this.props.selectRegion({
									id: region.id,
									label: region.name,
									country_id: countryId,
									region_code: region.iso,
								})
							}
							key={region.id}
						/>
					</li>,
					this.regionState(region.id) ? (
						<RenderCity
							countryId={countryId}
							regionCode={region.iso}
							selectedCities={this.props.selectedCities}
							selectCity={id => this.props.selectCity(id)}
						/>
					) : null,
				]): 'No regions!'}
			</ul>
		);
	}
	render() {
		const { countryId, regions } = this.props;
		return this.renderRegions(countryId, regions);
	}
}

RenderRegions.propTypes = {};

const mapStateToProps = createStructuredSelector({
	regions: selectRegions(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getRegions: id => makePromiseAction(dispatch, getRegions(`${id}/region`)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(RenderRegions);
