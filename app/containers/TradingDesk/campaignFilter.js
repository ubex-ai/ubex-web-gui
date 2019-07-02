import _ from 'lodash';
export const findIn = (field, name) => {
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
export function searchByWord(list, word) {
	return list.filter(item => findIn(item.name, word));
}

/**
 * return campaignList
 */
function filterCampaignsByCreatives(listCampains, listCreatives) {
	return listCampains.filter(campaign => listCreatives.some(creative => creative.campaignId === campaign.id));
}

/**
 * return groupsList
 */
export function filterGroupsByCampaigns(listGroups, listCampains) {
	return listGroups.filter(group => listCampains.some(campaign => campaign.campaign_group === group.id));
}

function searchByWordAnywere({ groups, creatives, campaigns }, word) {
	const creativesArray = searchByWord(creatives, word);
	let campaignsArray = searchByWord(campaigns, word);
	campaignsArray = _.unionBy(campaignsArray, filterCampaignsByCreatives(campaigns, creativesArray), 'id');
	let groupsArray = searchByWord(groups, word);
	groupsArray = _.unionBy(groupsArray, filterGroupsByCampaigns(groups, campaignsArray), 'id');
	return { groups: groupsArray, campaigns: campaignsArray, creatives: creativesArray };
}

export function searchByStatusGroup({ groups }, status) {
	return groups.filter(group => (status === 'all' ? group : group.status === status));
}

export function searchById(campaigns, request) {
	return campaigns.filter(campaign => campaign && campaign.id ? request.includes(campaign.id) : false);
}

export function searchByRequestArray({ groups, campaigns }, request) {
	const campaignsArray = searchById(campaigns, request);

	return { groups: filterGroupsByCampaigns(groups, campaignsArray), campaigns: campaignsArray };
}

export default function campaignFilter(data, { searchWord, statusFilter, request }) {
	if (request) {
		return searchByRequestArray(data, request);
	}

	if (!searchWord) {
		return {
			groups: searchByStatusGroup(data, statusFilter),
			creatives: data.creatives,
			campaigns: data.campaigns,
		};
	}
	return searchByWordAnywere(
		{ groups: searchByStatusGroup(data, statusFilter), creatives: data.creatives, campaigns: data.campaigns },
		searchWord,
	);
}
