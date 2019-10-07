/**
 *
 * CampaignDetails
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import messages, { scope as messageScope } from '../../messages';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class CampaignDetails extends React.Component {
	createTreeGeo(array) {
		const countryIds = {};
		array.forEach(arr => {
			if (arr.hasOwnProperty('country_id')) {
				if (!Object.keys(countryIds).includes(arr.country_id)) {
					countryIds[arr.country_id] = {};
				}
			}
			if (arr.hasOwnProperty('label') || arr.hasOwnProperty('regions')) {
				if (!Object.keys(countryIds).includes(arr.id)) {
					countryIds[arr.id] = {};
				}
			}
		});
		Object.keys(countryIds).forEach(item => {
			const tempRegions = {};
			array
				.filter(arr => arr.country_id === parseInt(item, 10))
				.forEach(arr => {
					tempRegions[arr.id] = [];
				});
			countryIds[item] = tempRegions;
		});
		return countryIds;
	}
	render() {
		const {
			selectedCategoriesV1,
			deviceTypeSelected,
			languageSelected,
			osTypeSelected,
			browserTypeSelected,
			ageGroupSelected,
			SSPSelected,
			blacklistSelected,
			whitelistSelected,
			placementSelected,
			genderMale,
			genderFemale,
			geoSelected,
			clearTimeTable,
		} = this.props.states;
		const {
			geo,
			ageGroup,
			language,
			placement,
			categoriesV1,
			deviceType,
			osType,
			browserType,
			blacklist,
			SSP,
			preview,
		} = this.props;
		const geoSelectedArray = geo && geo.length ? geo : preview;
		return (
			<div>
				<div className="border-bottom">
					<h6>
						<FormattedHTMLMessage {...messages.details} />
					</h6>
				</div>
				{this.props.states &&
				!(
					selectedCategoriesV1.length ||
					deviceTypeSelected.length ||
					languageSelected.length ||
					osTypeSelected.length ||
					browserTypeSelected.length ||
					ageGroupSelected.length ||
					SSPSelected.length ||
					blacklistSelected.length ||
					whitelistSelected.length ||
					placementSelected.length ||
					genderMale.length ||
					genderFemale.length ||
					geoSelected.length ||
					genderMale ||
					genderFemale ||
					clearTimeTable
				) ? (
					<div style={{ marginTop: '15px' }}>No target</div>
				) : null}
				<div className="campaignDetails" style={{ marginTop: '15px', marginBottom: '15px' }}>
					{genderMale || genderFemale ? (
						<div>
							<FormattedMessage {...this.props.messages.gender} />
							<ul>
								{genderMale ? (
									<li>
										<FormattedMessage {...this.props.messages.man} />
									</li>
								) : null}
								{genderFemale ? (
									<li>
										<FormattedMessage {...this.props.messages.woman} />
									</li>
								) : null}
							</ul>
						</div>
					) : null}
					{Object.keys(geoSelected).length ? (
						<div>
							<FormattedMessage {...this.props.messages.geo} />:
							<ul>
								{geoSelectedArray
									.filter(d => Object.keys(geoSelected).indexOf(d.value.toString()) >= 0)
									.map((d, i) => (
										<li>{d.label || d.title}</li>
									))}
							</ul>
						</div>
					) : null}
					{ageGroupSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.ageGroup} />:
							<ul>
								{ageGroup
									.filter(d => ageGroupSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{languageSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.language} />:
							<ul>
								{language
									.filter(d => languageSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{placementSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.placement} />:
							<ul>
								{placement
									.filter(d => placementSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{selectedCategoriesV1.length ? (
						<div>
							<FormattedMessage {...this.props.messages.categories} />:
							<ul>
								{categoriesV1
									.filter(
										category =>
											selectedCategoriesV1.indexOf(category.key) >= 0 ||
											category.sub_category.some(
												subcategory => selectedCategoriesV1.indexOf(subcategory.key) >= 0,
											),
									)
									.map((d, i) => {
										return (
											<li>
												{d.name}
												{d.sub_category && d.sub_category.length ? (
													<ul>
														{d.sub_category
															.filter(
																subcategory =>
																	selectedCategoriesV1.indexOf(subcategory.key) >= 0,
															)
															.map(sub => (
																<li>{sub.name}</li>
															))}
													</ul>
												) : null}
											</li>
										);
									})}
							</ul>
						</div>
					) : null}
					{deviceTypeSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.deviceType} />:
							<ul>
								{deviceType
									.filter(d => deviceTypeSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{osTypeSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.osType} />:
							<ul>
								{osType
									.filter(d => osTypeSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{browserTypeSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.browserType} />:
							<ul>
								{browserType
									.filter(d => browserTypeSelected.indexOf(d.value) >= 0)
									.map((d, i) => (
										<li>{d.label}</li>
									))}
							</ul>
						</div>
					) : null}
					{blacklistSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.blacklist} />:
							<ul>
								{blacklist
									.filter(d => blacklistSelected.indexOf(d.id) >= 0)
									.map((d, i) => (
										<li>{d.name}</li>
									))}
							</ul>
						</div>
					) : null}
					{whitelistSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.whitelist} />:
							<ul>
								{blacklist
									.filter(d => whitelistSelected.indexOf(d.id) >= 0)
									.map((d, i) => (
										<li>{d.name}</li>
									))}
							</ul>
						</div>
					) : null}
					{SSPSelected.length ? (
						<div>
							<FormattedMessage {...this.props.messages.SSP} />:
							<ul>
								{SSP.filter(d => SSPSelected.indexOf(d.value) >= 0).map((d, i) => (
									<li>{d.label}</li>
								))}
							</ul>
						</div>
					) : null}
					{clearTimeTable ? (
						<div>
							<FormattedMessage {...this.props.messages.timeTargeting} />: active
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

CampaignDetails.propTypes = {
	states: PropTypes.object,
};

export default CampaignDetails;
