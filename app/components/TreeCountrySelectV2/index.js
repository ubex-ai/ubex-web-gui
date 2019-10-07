/**
 *
 * TreeCountrySelectV2
 *
 */

import React from 'react';
import { Label } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import messages from 'containers/TradingDesk/components/CampaignForm/messages';
import request from 'utils/request';
import getCookie from 'utils/getCookie';
import TreeSelect from 'antd/es/tree-select';
import AppCard from '../AppCard';
import { isEqual, find } from 'lodash';
// only manual import
import 'antd/dist/antd.css';
const { SHOW_PARENT } = TreeSelect;
import PropTypes from 'prop-types';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class TreeCountrySelectV2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: [],
			treeData: [],
			selectedTree: [],
			selectedGEO: [],
			update: 0,
			openedSelector: false,
		};
		this.treeData = [];
	}

	componentDidMount() {
		this.createTreeData();
		this.setState({
			selected: this.props.selected,
		});
	}

	createTreeData() {
		const { countries } = this.props;
		console.log('create tree');
		this.setState({
			treeData:
				countries && countries.length
					? countries.map(country => {
							const findInPreview = find(this.props.previewTree, ['id', country.id]);
							return {
								id: country.id,
								value: country.id,
								key: country.id,
								title: country.label,
								status: 'country',
								children: findInPreview ? findInPreview.children : [],
							};
					  })
					: [],
		});
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { countries } = this.props;
		if (!isEqual(prevProps.countries, countries)) {
			console.log('create tree after update');
			this.createTreeData();
		}
		if (prevState.openedSelector !== this.state.openedSelector) {
			this.createTreeData();
		}
		if (!isEqual(prevProps.selected, this.props.selected)) {
			this.setState({
				selected: this.props.selected,
			});
		}
	}

	createTreeGeo(array, selected) {
		const countryIds = {};
		array.forEach(arr => {
			const { id, status, countryId, regionId, children } = arr.node && arr.node.props ? arr.node.props : arr.props;
			if (status === 'country') {
				if (children && children.length) {
					countryIds[id] = {};
				} else {
					countryIds[id] = selected[id] || {};
				}
			}
			if (status === 'region') {
				if (children && children.length) {
					countryIds[countryIds] = {
						[id]: [],
					};
				} else {
					countryIds[countryId] = {
						...countryIds[countryId],
						[id]: [],
					};
				}
			}
			if (status === 'city') {
				countryIds[countryId] = {
					...countryIds[countryId],
					[regionId]:
						countryIds[countryId] && countryIds[countryId][regionId]
							? [...countryIds[countryId][regionId], id]
							: [id],
				};
			}
		});
		return countryIds;
	}

	onChange = (value, label, extra) => {
		console.log(extra.allCheckedNodes);
		const nodes = this.createTreeGeo(extra.allCheckedNodes, this.props.selectedObject);
		this.setState(
			{
				selected: value,
				selectedGEO: nodes,
			},
			() => {
				this.props.onSelect(value, nodes);
			},
		);
	};

	getNewTreeDataRegion(treeData, countryId, data, treeNode) {
		const tempCountries = treeData.map(country => {
			return {
				...country,
				children:
					countryId === country.id
						? data.map(region => {
								const findInPreview = find(this.props.previewTree, ['id', country.id]);
								const findCitiesPreview = find(findInPreview ? findInPreview.children : [], [
									'id',
									region.id,
								]);
								return {
									id: region.id,
									value: region.id,
									key: region.iso,
									title: region.name,
									countryId: country.id,
									status: 'region',
									children:
										findCitiesPreview && findCitiesPreview.children.length
											? findCitiesPreview.children
											: [],
								};
						  })
						: country.children,
			};
		});
		this.setState({ treeData: tempCountries }, () => {
			this.setState({
				selected: [],
			});
		});
		return tempCountries;
	}

	getNewTreeDataCity(treeData, countryId, data, regionId) {
		const tempCountries = treeData.map(country => ({
			...country,
			children:
				countryId === country.id
					? country.children.map(region => ({
							...region,
							children:
								region.id === regionId
									? data.map(city => ({
											id: city.id,
											value: city.id,
											key: city.id,
											title: city.name,
											countryId: country.id,
											status: 'city',
											isLeaf: true,
											regionId,
									  }))
									: region.children,
					  }))
					: country.children,
		}));
		this.setState(
			{
				treeData: tempCountries,
			},
			() => {
				this.setState({
					selected: [],
				});
			},
		);
		return tempCountries;
	}

	onLoadData = treeNode => {
		const getRegionsLink = `${API_URL}/api/country/${treeNode.props.id}/region`;
		const getCitiesLink = `${API_URL}/api/country/${treeNode.props.countryId}/region/${treeNode.props.eventKey}/city`;
		return new Promise((resolve, reject) => {
			request(treeNode.props.status === 'country' ? getRegionsLink : getCitiesLink, {
				method: 'get',
				headers: {
					'X-CSRFToken': getCookie('csrftoken'),
					'Test-User': 'test@test.test',
				},
			})
				.then(response => {
					if (treeNode.props.status === 'country') {
						resolve(
							this.getNewTreeDataRegion(this.state.treeData, treeNode.props.id, response.data, treeNode),
							this.setState({
								selected: this.props.selected,
							}),
						);
					}

					if (treeNode.props.status === 'region') {
						resolve(
							this.getNewTreeDataCity(
								this.state.treeData,
								treeNode.props.countryId,
								response.data,
								treeNode.props.id,
							),
							this.setState({
								selected: this.props.selected,
							}),
						);
					}
				})
				.catch(e => {
					console.log(e);
					reject();
				});
		});
	};

	treeDataSelect() {
		if (this.props.previewTree && !this.state.openedSelector) {
			return this.props.previewTree;
		}

		if (!this.props.previewTree) {
			return this.state.treeData;
		}

		if (this.props.previewTree && this.state.openedSelector) {
			return this.state.treeData;
		}
	}
	renderCategoriesSelect() {
		const treeData = this.treeDataSelect();
		const tProps = {
			treeData,
			loadData: this.onLoadData,
			className: 'treeSelect-wrapper',
			dropdownClassName: 'treeSelect-wrapper__dropdown',
			dropdownStyle: { top: '200px' },
			value: this.state.selected,
			onChange: this.onChange,
			treeCheckable: true,
			searchPlaceholder: 'Select countries',
			style: {
				width: '100%',
			},
			treeNodeFilterProp: 'title',
			getPopupContainer: () => {
				if (!this.props.countries || !this.props.countries.length) {
					this.props.getCountries();
				}
				this.setState({
					openedSelector: !this.state.openedSelector,
				});
				return document.body;
			},
		};
		return (
			<div>
				<Label>
					<FormattedMessage {...messages.geo} />
				</Label>
				<br />
				<div>
					<TreeSelect {...tProps} />
				</div>
			</div>
		);
	}

	render() {
		return this.renderCategoriesSelect();
	}
}

TreeCountrySelectV2.propTypes = {
	countries: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			label: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
		}).isRequired,
	).isRequired,
};

export default TreeCountrySelectV2;
