/**
 *
 * TreeCountrySelect
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CustomInput, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import RenderRegions from './RenderRegions';
import { makePromiseAction } from '../../../../utils/CollectionHelper/actions';
import { getCities, getRegions } from '../../actions';
import { selectRegions } from '../../selectors';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */

class TreeCountrySelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openedSelector: true,
			openedCountries: [],
			openedRegions: [],
			data: [],
			fixData: [],
			regions: [],
			countries: [],
			searchText: '',
			selectedCountries: [],
			selectedRegions: [],
			selectedCities: [],
			finalSelected: [],
			init: false,
			tempRegions: [],
			tempSelectedRegions: [],
		};
		this.data = [];
		this._isMounted = false;
		this.toggleSelector = this.toggleSelector.bind(this);
		this.stopPropagation = this.stopPropagation.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
		this.clearSelected = this.clearSelected.bind(this);
	}

	componentDidMount() {
		const { countries } = this.props;
		const tempCountries = countries.map(country => ({
			id: country.id,
			label: country.label,
			regions: [],
		}));
		this.setState({
			data: tempCountries,
			selectedCountries: countries.filter(cnt =>
				Object.keys(this.props.selected)
					.map(geo => parseInt(geo, 10))
					.some(selCnt => selCnt === cnt.id),
			),
			finalSelected: countries.filter(cnt =>
				Object.keys(this.props.selected)
					.map(geo => parseInt(geo, 10))
					.some(selCnt => selCnt === cnt.id),
			),
			tempRegions: Object.keys(this.props.selected).map(geo => ({
				[parseInt(geo, 10)]: this.props.selected[parseInt(geo, 10)],
			})),
		});
		this.props.select(this.state.finalSelected);
		this.data = tempCountries;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { countries } = this.props;

		if (!Object.keys(prevProps.selected).length && !Object.keys(this.props.selected)) {
			this.setState(
				{
					selectedCountries: [],
					finalSelected: [],
				},
				() => {
					this.props.select(this.state.finalSelected);
				},
			);
		}
		if (Object.keys(this.props.selected).length && !_.isEqual(prevProps.selected, this.props.selected)) {
			this.setState(
				{
					tempRegions: [],
					tempSelectedRegions: [],
				},
				() => {
					Object.keys(this.props.selected).forEach(geo => {
						this.getRegions(parseInt(geo, 10));
					});
				},
			);

			this.setState(
				{
					finalSelected: countries.filter(cnt =>
						Object.keys(this.props.selected)
							.map(geo => parseInt(geo, 10))
							.some(selCnt => selCnt === cnt.id),
					),
					tempRegions: Object.keys(this.props.selected).map(geo => ({
						[parseInt(geo, 10)]: this.props.selected[parseInt(geo, 10)],
					})),
				},
				() => {
					this.setState(
						{
							selectedCountries: countries.filter(cnt =>
								Object.keys(this.props.selected)
									.map(geo => parseInt(geo, 10))
									.some(selCnt => selCnt === cnt.id && this.getCountryRegions(selCnt) === null),
							),
						},
						() => {
							this.props.select(this.state.finalSelected);
						},
					);
				},
			);
		}
	}

	countryState(id) {
		return this.state.openedCountries.includes(id);
	}

	toggleSelector() {
		this.setState({ openedSelector: !this.state.openedSelector });
	}

	toggleCountry(id) {
		if (this.countryState(id)) {
			this.setState({
				openedCountries: this.state.openedCountries.filter(country => country !== id),
				[id]: null,
			});
		} else {
			this.setState({ openedCountries: [...this.state.openedCountries, id] });
			const regionsByCountry = _.find(this.state.data, ['id', id]);
			const { regions } = regionsByCountry;
			if (!regions.length) {
				this.getRegions(id);
			}
		}
	}

	searchCountry(e) {
		const searchText = e.target.value;

		this.setState({ searchText });

		const findIn = (field, name) => {
			const searchQuery = name
				.toString()
				.trim()
				.toLowerCase();
			return typeof field === 'string'
				? field
						.trim()
						.toLowerCase()
						.indexOf(searchQuery) !== -1
				: null;
		};

		if (searchText) {
			this.setState({ data: this.data.filter(country => findIn(country.label, searchText)) });
		} else {
			this.setState({ data: this.data });
		}
	}

	clearSearch() {
		this.setState({ searchText: '', data: this.data });
	}

	stopPropagation(e) {
		if (this.state.openedSelector) {
			e.stopPropagation();
		}
	}

	clearSelected() {
		this.setState(
			{
				selectedCountries: [],
				selectedRegions: [],
				selectedCities: [],
				finalSelected: [],
				tempRegions: [],
				tempSelectedRegions: [],
			},
			() => {
				this.props.select(this.state.finalSelected);
			},
		);
	}

	getRegions(countryId) {
		this.props.getRegions(countryId).then(response => {
			this.setRegions(countryId, response);
		});
	}

	getCities(countryId, regionCode) {
		this.props.getCities(countryId, regionCode).then(response => {
			this.setCities(countryId, regionCode, response);
		});
	}

	setRegions(countryId, regions) {
		const { data } = this.state;
		const tempCountries = data.map(country => ({
			id: country.id,
			label: country.label,
			regions: countryId === country.id && !country.regions.length ? regions : country.regions,
		}));
		const selectedCountry = _.find(this.state.selectedCountries, ['id', countryId]);
		if (selectedCountry) {
			this.setState({
				selectedRegions: [
					...this.state.selectedRegions,
					...regions
						.filter(
							reg =>
								this.state.selectedRegions.length
									? this.state.selectedRegions.some(selReg => selReg.id !== reg.id)
									: true,
						)
						.map(reg => reg),
				],
			});
		} else {
			this.setState({
				selectedRegions: [
					...this.state.selectedRegions,
					...regions
						.filter(
							reg =>
								this.state.tempSelectedRegions.length
									? this.state.tempSelectedRegions.some(selReg => selReg === reg.id)
									: false,
						)
						.map(reg => reg),
				],
				finalSelected: [
					...this.state.finalSelected.filter(selCountry => selCountry.id !== countryId),
					...regions
						.filter(
							reg =>
								this.state.tempSelectedRegions.length
									? this.state.tempSelectedRegions.some(selReg => selReg === reg.id)
									: false,
						)
						.map(reg => reg),
				],
				tempRegions: this.state.tempRegions.filter(finSel => !finSel[countryId]),
			});
			this.props.select(this.state.finalSelected);
		}
		this.setState({ data: tempCountries });
	}

	setCities(countryId, regionCode, cities) {
		const { data } = this.state;
		const { regions } = _.find(data, ['id', countryId]);
		const tempRegions = regions.map(region => ({
			...region,
			cities: region.iso === regionCode ? cities : region.cities,
		}));
		const tempCountries = data.map(country => ({
			id: country.id,
			label: country.label,
			regions: countryId === country.id ? tempRegions : country.regions,
		}));
		const selectedRegion = _.find(this.state.selectedRegions, ['iso', regionCode]);
		if (selectedRegion) {
			this.setState({ selectedCities: [...this.state.selectedCities, ...cities.map(city => city)] });
		}
		this.setState({ data: tempCountries });
	}

	toggleRegion(countryId, id) {
		if (this.regionState(id)) {
			this.setState({
				openedRegions: this.state.openedRegions.filter(region => region !== id),
				[id]: null,
			});
		} else {
			this.setState({ openedRegions: [...this.state.openedRegions, id] });
			this.getCities(countryId, id);
		}
	}

	regionState(id) {
		return this.state.openedRegions.includes(id);
	}

	renderCountry(countries) {
		return (
			<ul style={{ margin: '0', padding: '0' }}>
				{countries.map(country => [
					<li className="country-select__select--body-checkbox" key={country.id}>
						<i
							className={`fal fa-${this.countryState(country.id) ? 'minus' : 'plus'}`}
							onClick={() => this.toggleCountry(country.id)}
						/>
						<CustomInput
							id={country.id}
							type="checkbox"
							label={<span>{country.label}</span>}
							onClick={() => this.selectCountry(country)}
							key={country.id}
							checked={this.selectedCountryState(country)}
						/>
					</li>,
					this.countryState(country.id) ? this.renderRegions(country.id, country.regions) : null,
				])}
			</ul>
		);
	}

	renderRegions(countryId, countryRegions) {
		return (
			<ul>
				{countryRegions
					? countryRegions.map(region => [
							<li className="country-select__select--body-checkbox" key={region.id}>
								{region.iso && (
									<i
										className={`fal fa-${this.regionState(region.iso) ? 'minus' : 'plus'}`}
										onClick={() => this.toggleRegion(countryId, region.iso)}
									/>
								)}
								<CustomInput
									id={region.id}
									type="checkbox"
									label={region.name}
									onClick={() => this.selectRegion(countryId, region)}
									key={region.id}
									checked={this.selectedRegionState(region)}
								/>
							</li>,
							this.regionState(region.iso)
								? this.renderCities(region.iso, region.cities, countryId)
								: null,
					  ])
					: 'No regions!'}
			</ul>
		);
	}

	renderCities(regionCode, cities, countryId) {
		return (
			<ul key={regionCode}>
				{cities && cities.length ? (
					cities.map(city => (
						<li className="country-select__select--body-checkbox">
							<CustomInput
								id={city.city_code}
								type="checkbox"
								label={city.name}
								onClick={() => this.selectCity(city, countryId, regionCode)}
								key={city.city_code}
								checked={this.selectedCityState(city, regionCode, countryId)}
							/>
						</li>
					))
				) : (
					<div>No city target!</div>
				)}
			</ul>
		);
	}

	selectedCountryState(country) {
		const selectedCountriesCount = this.state.selectedCountries.filter(selCnt => selCnt.id === country.id).length;
		if (
			this.state.selectedRegions.length &&
			country.regions &&
			!!country.regions.length &&
			country.regions.length ===
				this.state.selectedRegions.filter(selReg => selReg.country_id === country.id).length
		) {
			return true;
		}
		return !!selectedCountriesCount;
	}

	selectCountry(country) {
		if (this.selectedCountryState(country)) {
			this.setState(
				{
					selectedCountries: this.state.selectedCountries.filter(cntry => cntry.id !== country.id),
					selectedRegions: this.state.selectedRegions.filter(reg => reg.country_id !== country.id),
					finalSelected: this.state.finalSelected.filter(sel => sel.id !== country.id),
				},
				() => {
					this.setState({
						finalSelected: this.state.finalSelected.filter(
							sel => (sel.hasOwnProperty('country_id') ? sel.country_id !== country.id : true),
						),
					});
					this.props.select(this.state.finalSelected);
				},
			);
		} else {
			this.getRegions(country.id);
			if (_.find(this.state.finalSelected, ['id', country.id])) {
				this.setState(
					{
						finalSelected: this.state.finalSelected.filter(finSel => finSel.id !== country.id),
						tempRegions: this.state.tempRegions.filter(finSel => !finSel[country.id]),
					},
					() => {
						this.setState(
							{
								selectedCountries: [...this.state.selectedCountries, country],
								finalSelected: [
									...this.state.finalSelected.filter(
										finSel =>
											finSel.hasOwnProperty('country_id')
												? finSel.country_id !== country.id
												: true,
									),
									country,
								],
							},
							() => {
								this.props.select(this.state.finalSelected);
							},
						);
					},
				);
			} else {
				this.setState(
					{
						selectedCountries: [...this.state.selectedCountries, country],
						finalSelected: [
							...this.state.finalSelected.filter(
								finSel =>
									finSel.hasOwnProperty('country_id') ? finSel.country_id !== country.id : true,
							),
							country,
						],
					},
					() => {
						this.props.select(this.state.finalSelected);
					},
				);
			}
		}
	}

	removeCountry(id) {
		this.setState(
			{
				selectedCountries: this.state.selectedCountries.filter(cntry => cntry.id !== id),
				selectedRegions: this.state.selectedRegions.filter(reg => reg.id !== id),
				selectedCities: this.state.selectedCities.filter(city => city.id !== id),
				finalSelected: this.state.finalSelected.filter(sel => sel.id !== id),
			},
			() => {
				this.setState(
					{
						selectedRegions: this.state.selectedRegions.filter(reg => reg.country_id !== id),
					},
					() => {
						this.props.select(this.state.finalSelected);
					},
				);
			},
		);
	}

	selectedRegionState(region) {
		const selectedRegionsCount = this.state.selectedRegions.filter(selReg => selReg.id === region.id).length;
		return !!selectedRegionsCount;
	}

	selectRegion(countryId, region) {
		const country = _.find(this.state.data, ['id', countryId]);
		const regionCountByCountry = _.result(_.find(this.state.data, ['id', region.country_id]), 'regions');
		const selectedRegionsByCountry = this.state.selectedRegions.filter(selReg => selReg.country_id === countryId);
		if (regionCountByCountry.length === selectedRegionsByCountry.length) {
			this.setState({
				selectedCountries: [...this.state.selectedCountries, country],
			});
		}
		if (this.selectedRegionState(region)) {
			this.setState(
				{
					selectedCountries: this.state.selectedCountries.filter(country => country.id !== region.country_id),
					selectedRegions: this.state.selectedRegions.filter(c => c.id !== region.id),
					selectedCities: this.state.selectedCities.filter(selCity => selCity.region_code !== region.iso),
					finalSelected: this.state.finalSelected.filter(sel => sel.id !== countryId),
				},
				() => {
					const filterSelRegions = this.state.selectedRegions.filter(sel => sel.country_id === countryId);
					this.setState(
						{
							finalSelected: [
								...this.state.finalSelected.filter(sel => sel.country_id !== region.country_id),
								...filterSelRegions,
							],
						},
						() => {
							this.props.select(this.state.finalSelected);
						},
					);
				},
			);
		} else {
			this.setState(
				{
					//selectedCountries: this.state.selectedCountries.filter(country => country.id === region.country_id),
					selectedRegions: [...this.state.selectedRegions, region],
				},
				() => {
					this.setState(
						{
							finalSelected: [
								...this.state.finalSelected.filter(finSel => finSel.id !== region.id),
								region,
							],
						},
						() => {
							this.props.select(this.state.finalSelected);
						},
					);
				},
			);
		}
	}

	selectedCityState(city, regionCode, countryId) {
		return this.state.selectedCities.filter(selCity => selCity.city_code === city.city_code).length;
	}

	selectCity(city, countryId, regionCode) {
		if (this.selectedCityState(city)) {
			this.setState(
				{
					selectedCities: this.state.selectedCities.filter(c => c.city_code !== city.city_code),
					selectedRegions: this.state.selectedRegions.filter(c => c.iso !== city.region_code),
					selectedCountries: this.state.selectedCountries.filter(
						selCountry =>
							selCountry.id !==
							_.result(_.find(this.state.selectedRegions, ['iso', city.region_code]), 'country_id'),
					),
					finalSelected: this.state.finalSelected.filter(sel => sel.city_code !== city.city_code),
				},
				() => {
					this.props.select(this.state.finalSelected);
				},
			);
		} else {
			const country = _.find(this.state.data, ['id', countryId]);
			const { regions } = country;
			const region = _.find(regions, ['iso', regionCode]);
			this.setState(
				{
					selectedCities: [...this.state.selectedCities, city],
					finalSelected: [...this.state.finalSelected, city],
				},
				() => {
					const selectedCitiesCount = this.state.selectedCities.filter(
						selCity => selCity.region_code === regionCode,
					);
					if (region.cities.length === selectedCitiesCount.length) {
						this.setState({ selectedRegions: [...this.state.selectedRegions, region] });
					}
					this.props.select(this.state.finalSelected);
				},
			);
		}
	}

	getCountryName(countryId) {
		return _.find(this.props.countries, ['id', countryId]);
	}

	getCountryRegions(id) {
		const country = this.state.tempRegions.filter(reg => _.get(reg, `${id}`));
		if (country.length) {
			const findCountry = country[0];
			if (Object.keys(findCountry[id]).length) {
				const found = Object.keys(findCountry[id])
					.map(tempReg => parseInt(tempReg, 10))
					.some(r => this.state.tempSelectedRegions.includes(r));
				if (!found) {
					this.setState({
						tempSelectedRegions: [
							...this.state.tempSelectedRegions,
							...Object.keys(findCountry[id]).map(tempReg => parseInt(tempReg, 10)),
						],
					});
				}
				return <span>({Object.keys(findCountry[id]).length})</span>;
			}
		}
		return null;
	}

	renderSelected() {
		const { finalSelected } = this.state;
		finalSelected.map(sel => {
			this.getCountryRegions(sel.id);
		});
	}

	totalSelected() {
		return {
			countSelectedCountries: this.state.selectedCountries.length,
			countSelectedRegions: this.state.selectedRegions.length,
			countSelectedCities: this.state.selectedCities.length,
		};
	}

	render() {
		const { openedSelector, searchText, data } = this.state;
		const { countSelectedCountries, countSelectedRegions, countSelectedCities } = this.totalSelected();
		this.renderSelected();
		return (
			<div className="country-select">
				<div className="country-select__select">
					<div className="country-select__select--clear" onClick={this.toggleSelector}>
						<div className="country-select__select--clear-placeholder">
							<Input
								type="text"
								placeholder="Search..."
								onClick={this.stopPropagation}
								onChange={e => this.searchCountry(e)}
								value={searchText}
							/>
						</div>
						<div className="country-select__select--clear-quad">
							<i className="fas fa-search" />
						</div>
					</div>
					{openedSelector && <div className="country-select__select--body">{this.renderCountry(data)}</div>}
				</div>
			</div>
		);
	}
}

TreeCountrySelect.propTypes = {
	countries: PropTypes.array,
	regions: PropTypes.array,
	getRegions: PropTypes.func,
	select: PropTypes.func,
	selected: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
	regions: selectRegions(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getRegions: id => makePromiseAction(dispatch, getRegions(`${id}/region`)),
		getCities: (countryId, regionCode) =>
			makePromiseAction(dispatch, getCities(`${countryId}/region/${regionCode}/city`)),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(TreeCountrySelect);
