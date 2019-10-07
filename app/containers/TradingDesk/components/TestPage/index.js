/**
 *
 * TestPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import TreeCountrySelect from 'components/TreeCountrySelectV2';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { selectCountries } from '../../../Dashboard/selectors';
import { selectRegions } from '../../selectors';
import { getRegions } from '../../actions';
import { makePromiseAction } from '../../../../utils/CollectionHelper/actions';
import { getCountries } from '../../../Dashboard/actions';

const previewTree = [
	{
		children: [
			{
				children: [
					{
						countryId: 1149361,
						id: 100167,
						isLeaf: true,
						key: 100167,
						regionId: 1147707,
						status: 'city',
						title: "Qal'Eh-Ye Now",
						value: 100167,
					},
				],
				countryId: 1149361,
				id: 1147707,
				key: 'BDG',
				status: 'region',
				title: 'Badghis',
				value: 1147707,
			},
		],
		id: 1149361,
		key: '1149361',
		status: 'country',
		title: 'Afghanistan',
		value: 1149361,
	},
];
/* eslint-disable react/prefer-stateless-function */
class TestPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			regionId: null,
			regions: null,
			selectedArray: [1147707],
			selectedObject: {
				1149361: {
					1147707: [],
				},
			},
		};
	}

	render() {
		const { countries } = this.props;
		return (
			<TreeCountrySelect
				countries={countries}
				getCountries={this.props.getCountries}
				previewTree={previewTree}
				selected={this.state.selectedArray}
				selectedObject={this.state.selectedObject}
				onSelect={(selectedArray, selectedObject) =>
					this.setState({
						selectedArray,
						selectedObject,
					})
				}
			/>
		);
	}
}

TestPage.propTypes = {
	countries: PropTypes.array,
	getCountries: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
	countries: selectCountries(),
	regions: selectRegions(),
});
function mapDispatchToProps(dispatch) {
	return {
		dispatch,
		getCountries: () => dispatch(getCountries()),
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(TestPage);
